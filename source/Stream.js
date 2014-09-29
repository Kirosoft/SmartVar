/**
* Created by user on 10/09/2014.
*/
///<reference path='../typescript-node-definitions/node.d.ts'/>
var Stream = (function () {
    function Stream() {
        this.subscribers = [];
        this.processFunc = null;
        return this;
    }
    Stream.prototype.subscribe = function (stream, filter) {
        var handle = this.subscribers.length;

        this.subscribers.push({ 'stream': stream, 'callback': null, 'filter': filter, 'active': true });

        return handle;
    };

    Stream.prototype.subscribeCallback = function (callback, filter) {
        var handle = this.subscribers.length;

        this.subscribers.push({ 'callback': callback, 'stream': null, 'filter': filter, 'active': true });

        return handle;
    };

    Stream.prototype.unSubscribe = function (handle) {
        this.subscribers[handle].active = false;
    };

    Stream.prototype.update = function (newObj, parentElement, changedAttr, newValue, oldValue) {
        this.processAttributeEvent(newObj, parentElement, changedAttr, newValue, oldValue);

        //console.log('Update: Attr: '+changedAttr+ " , value: "+newValue);
        this.notifySubscribers(newObj, parentElement, changedAttr, newValue, oldValue);
    };

    Stream.prototype.processAttributeEvent = function (newObj, parentElement, changedAttr, newValue, oldValue) {
    };

    // An element on this object changed in value notify all subscribers
    Stream.prototype.notifySubscribers = function (obj, parentElement, attr, value, oldValue, msg) {
        var _self = this;

        for (var f = 0; f < _self.subscribers.length; f++) {
            if (_self.subscribers[f].filter) {
                if (_self.subscribers[f].filter === attr) {
                    if (_self.subscribers[f].active) {
                        if (_self.subscribers[f].callback) {
                            _self.subscribers[f].callback(attr, value, oldValue);
                        } else if (_self.subscribers[f].stream.processFunc) {
                            _self.subscribers[f].stream.processFunc(attr, value, oldValue);
                        }
                        if (_self.subscribers[f].stream) {
                            _self.subscribers[f].stream.update(attr, value, oldValue);
                        }
                    }
                } else {
                    // ignore messaging subscribers if the filter does not match
                }
            } else {
                if (_self.subscribers[f].active) {
                    if (_self.subscribers[f].callback) {
                        _self.subscribers[f].callback(attr, value, oldValue);
                    } else if (_self.subscribers[f].stream.processFunc) {
                        _self.subscribers[f].stream.processFunc(obj, parentElement, attr, value, oldValue);
                    }
                    if (_self.subscribers[f].stream) {
                        _self.subscribers[f].stream.update(obj, parentElement, attr, value, oldValue);
                    }
                }
            }
        }
    };

    Stream.prototype.changes = function (processFunc) {
        var newStream = new Stream();
        newStream.processFunc = processFunc;
        this.subscribe(newStream);

        return newStream;
    };
    return Stream;
})();

module.exports = {
    Stream: Stream
};
//# sourceMappingURL=stream.js.map
