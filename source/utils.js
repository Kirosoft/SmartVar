/**
* Created by marknorman on 19/06/2014.
*/
// ts class import helper
function requireClass(moduleName, className) {

    if (!className) {
        className = moduleName;
    }
    eval(className + " = require(\"./" + moduleName + ".js\")." + className + ";");
}

function requireAll() {

    var cns = { };
    for (var i = 0; i < arguments.length; i++) {
        var ns = require(arguments[i]);
        for (var o in ns) {
            cns[o] = ns[o];
        }
    }

    return cns;
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {

    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
}

function nodeCallback(error, result, completeCallback, errorCallback) {
    var callback = null;

    if (error) {
        if (errorCallback) {
            errorCallback(error);
        }
    }
    else if (completeCallback) {
        completeCallback(result);
    }
}

function existy(x) {
    if (typeof x === 'undefined') {
        return false;
    }
    else {
        return x !== null;
    }
}
function truthy(x) { return (x !== false) && existy(x); }

var compareStringsWithWildCard = function(s1, s2) {
    if ((s1 === s2) || (s1 === '*') || (s2 === '*')) {
        return true;
    } else {
        return false;
    }
};

// recursively compare two paths zipped into arrays of strings
// wildcards match all strings, terminating wildcards
// in the last position match all subsequent segments
// wildcards only in the first array
// e.g. [[0,*,2,3,*,undefined],[0,1,2,3,4,5]] === true
function compareArrays(tail,wildcard) {

    if (tail.length === 0) {
        // reached the end - match
        return true;
    } else {
        // propogate wildcard if previous segment has wildcard
        if (!existy(tail[0][0]) && truthy(wildcard)) {
            tail[0][0] = '*';
        }
        if (compareStringsWithWildCard(tail[0][0], tail[0][1])) {
            // recurse onto next segment
            return compareArrays(_.rest(tail), tail[0][0] === '*');
        } else {
            // strings do not match terminates
            //console.log('s0: '+tail[0][0]);
            //console.log('s1: '+tail[0][1]);

            return false;
        }
    }
}


//TODO: requires that the filter function is available on the supplied object (ob)
// obj: eventStream object (e.g. Bacon.bus)
// messagePath: the spec for the path we would like to filter on. Can include widlcards
//              a1.b2.*.d2.* - terminal * matches all subsequent segments
function filterBy(obj, messagePath) {
    var messagePathArray = messagePath.split('.');

    return obj.filter(function (message) {
        var messageArray = message.message.split('.');
        var joinedArrays = _.zip.apply(_,[messagePathArray, messageArray]);
        return compareArrays(joinedArrays,false);
    });
}

function isObjLiteral(_obj) {
    var _test  = _obj;
    return (  typeof _obj !== 'object' || _obj === null ?
        false :
        (
            (function () {
                while (!false) {
                    if (  Object.getPrototypeOf( _test = Object.getPrototypeOf(_test)  ) === null) {
                        break;
                    }
                }
                return Object.getPrototypeOf(_obj) === _test;
            })()
            )
        );
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function isArray(obj) {
    return obj instanceof Array;
}
function isSmartVar(obj) {
    return obj instanceof SmartVar;
}

function removeFromArrayByValue(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

module.exports = {
    requireClass: requireClass,
    requireAll: requireAll,
    nodeCallback: nodeCallback,
    existy: existy,
    truthy: truthy,
    compareArrays: compareArrays,
    isFunction: isFunction,
    isArray: isArray,
    isSmartVar: isSmartVar,
    isObjLiteral: isObjLiteral,
    removeFromArrayByValue: removeFromArrayByValue

};
