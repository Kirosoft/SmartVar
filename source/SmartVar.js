/**
* Created by user on 10/09/2014.
*/
///<reference path='../typescript-node-definitions/node.d.ts'/>
///<reference path="stream.ts"/>
///<reference path="SmartUtils.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require('./utils');
var smartUtils = require('./SmartUtils.js');

utils.requireClass('SmartUtils', 'SmartUtils');
utils.requireClass('Stream', 'Stream');

var SmartVar = (function (_super) {
    __extends(SmartVar, _super);
    function SmartVar(objModel) {
        _super.call(this);
        this._self = this;
        this.dependantProperties = {};
        this.dependencies = {};
        this.debug = true;

        // Merge the supplied object literal into this object
        this.updateFunction(null, objModel, this);

        return this;
    }
    // this function builds a function that is used in place of attributes
    // to update subscribers on change
    SmartVar.prototype.updateFunction = function (attr, value, parentElement) {
        var currentAttr = attr;
        var currentValue = utils.isFunction(value) ? value(this) : value;
        var computedFunc = utils.isFunction(value) ? value : null;
        var smartVar = null;
        var smartAttr = null;
        var _self = this;

        if (utils.isSmartVar(value)) {
            smartVar = value;
            smartAttr = attr;
            if (this.debug) {
                console.log('we need to subscribe to the object with a property filter of type: ' + attr);
            }

            value.subscribeCallback(function (attr, newValue, oldValue) {
                if (this.debug) {
                    console.log(attr + ' derived property has changed to: ' + newValue);
                }
                if (this.debug) {
                    console.debug(newValue);
                }
                currentValue = newValue; // variable resides in the local closure

                _self.notifySubscribers(_self, parentElement, currentAttr, newValue, oldValue);
            }, attr);

            // this function will either return the current SmartVar value when no parameter is supplied
            // or will overwrite the current SmartVar with the supplied parameter
            return function (value) {
                // if it is a function run the function to update before returning
                if (value) {
                    // overwrite the previous function or smart var with a value
                    computedFunc = null;
                    smartVar = null;
                    smartAttr = null;
                    var res = _self.updateFunction(attr, value, this);
                    currentValue = utils.isFunction(res) ? res() : res;
                    if (utils.isSmartVar(res)) {
                        smartVar = res;
                    }
                }
                if (computedFunc) {
                    currentValue = computedFunc(value);
                } else if (smartVar) {
                    currentValue = smartVar[smartAttr]();
                }
                return currentValue;
            };
        } else if (utils.isObjLiteral(value)) {
            // it's an object we are going to have to recurse :-)
            // we need to return a function with 'this' set to the object
            // so we can dereference(child) elements to return normal setter function
            if (this.debug) {
                console.log("recursing for object literal");
            }

            for (var attr in value) {
                if (value.hasOwnProperty(attr)) {
                    parentElement[attr] = utils.isArray(value[attr]) ? [] : {};
                    parentElement[attr] = _self.updateFunction(attr, value[attr], parentElement[attr]);
                } else {
                    if (this.debug) {
                        console.log('Not an attr on the object: ' + attr);
                    }
                }
            }

            // Function to overwrite the whole object
            parentElement.update = function (newObject) {
                _self.updateFunction(null, newObject, parentElement);

                _self.notifySubscribers(_self, parentElement, attr, newObject, null, 'object update');
            };

            return parentElement;
        } else if (utils.isArray(value)) {
            for (var f = 0; f < value.length; f++) {
                parentElement[f] = utils.isArray(value[f]) ? [] : {};
                parentElement[f] = _self.updateFunction(f, value[f], parentElement[f]);
            }

            // Overrides for the standard Array functionality
            parentElement.push = function () {
                console.log("Custom push");

                // Call the default implementation
                var res = Array.prototype.push.apply(this, arguments);

                // Replace the result with a function
                // TODO: support multiple args?
                this[res - 1] = _self.updateFunction(res - 1, arguments[0], this);

                _self.notifySubscribers(_self, this, res - 1, arguments[0], '<new>');
            };
            parentElement.pop = function () {
                console.log("Custom pop");

                // Call the default implementation
                var res = Array.prototype.pop.apply(this);

                // Replace the result with a function
                _self.notifySubscribers(_self, this, this.length, res, '<pop>');
                return res;
            };
            parentElement.shift = function () {
                console.log("Custom shift");

                // Call the default implementation
                var res = Array.prototype.shift.apply(this);

                // Replace the result with a function
                _self.notifySubscribers(_self, this, 0, res, '<shift>');
                return res;
            };
            parentElement.reverse = function () {
                console.log("Custom reverse");

                // Call the default implementation
                var res = Array.prototype.reverse.apply(this);

                // Replace the result with a function
                _self.notifySubscribers(_self, this, 0, res, '<reverse>');
                return res;
            };
            parentElement.slice = function () {
                console.log("Custom reverse");

                // Call the default implementation
                var res = Array.prototype.slice.apply(this, arguments);

                // Replace the result with a function
                _self.notifySubscribers(_self, this, 0, res, '<slice>');
                return res;
            };
            parentElement.splice = function () {
                console.log("Custom reverse");

                // Call the default implementation
                var res = Array.prototype.splice.apply(this, arguments);

                // Replace the result with a function
                _self.notifySubscribers(_self, this, 0, res, '<splice>');
                return res;
            };

            return parentElement;
        } else {
            // this function is invoked for a set e.g. a.b.c(newvalue)
            //       otherwise we would need to call updateFunction()   :-)
            return function (newValue) {
                var oldValue = currentValue || null;
                if (computedFunc) {
                    // this property is a function. Execute the function to set the current value
                    currentValue = computedFunc(_self);

                    _self.notifySubscribers(_self, parentElement, currentAttr, currentValue, oldValue);
                } else if (newValue) {
                    // This variable is a function - execute the function with the supplied arg(s)
                    if (oldValue && oldValue != newValue) {
                        computedFunc = null;
                        smartVar = null;
                        smartAttr = null;
                        var res = _self.updateFunction(attr, newValue, this);
                        currentValue = utils.isFunction(res) ? res() : res;
                        if (utils.isSmartVar(res)) {
                            smartVar = res;
                        }
                        _self.notifySubscribers(_self, parentElement, currentAttr, currentValue, oldValue);
                    }
                }

                return currentValue;
            };
        }
    };

    // Map relationship dependency between properties on the same object
    SmartVar.prototype.registerDependency = function (dependantProperty, dependantOn) {
        if (!this.dependencies[dependantProperty]) {
            this.dependencies[dependantProperty] = dependantOn;

            for (var f = 0; f < dependantOn.length; f++) {
                var dependantProps = this.dependantProperties[dependantOn[f]];
                if (!dependantProps) {
                    dependantProps = [];
                }
                dependantProps.push(dependantProperty);

                // TODO: remove duplicates
                this.dependantProperties[dependantOn[f]] = dependantProps;
            }
        } else {
            if (this.debug) {
                console.log('call deregisterDependency first');
            }
        }
    };

    SmartVar.prototype.unRegisterDependency = function (dependantProperty) {
        var dependantOn = this.dependencies[dependantProperty];

        for (var f = 0; f < dependantOn.length; f++) {
            var dependantProps = this.dependantProperties[dependantOn[f]];

            utils.removeFromArrayByValue(dependantProps, dependantProperty);
        }

        delete this.dependencies[dependantProperty];
    };

    SmartVar.prototype.runDependencies = function (attr) {
        var targetProps = this.dependantProperties[attr];

        if (targetProps) {
            for (var f = 0; f < targetProps.length; f++) {
                var targetProp = targetProps[f];
                var targetFunc = this[targetProp];
                if (utils.isFunction(targetFunc)) {
                    // re-run the calculation
                    console.log('re-running function due to dependant property change');
                    targetFunc(this);
                }
            }
        }
    };

    // An element on this object changed in value notify all subscribers
    SmartVar.prototype.notifySubscribers = function (obj, parentElement, attr, value, oldValue, msg) {
        _super.prototype.notifySubscribers.call(this, obj, parentElement, attr, value, oldValue, msg);

        this.runDependencies(attr);
    };
    return SmartVar;
})(Stream);

module.exports = {
    SmartVar: SmartVar
};
//# sourceMappingURL=SmartVar.js.map
