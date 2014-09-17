/**
* Created by user on 10/09/2014.
*/
///<reference path='../typescript-node-definitions/node.d.ts'/>
var SmartUtils = (function () {
    function SmartUtils() {
    }
    SmartUtils.prototype.isObjLiteral = function (_obj) {
        var _test = _obj;
        return (typeof _obj !== 'object' || _obj === null ? false : ((function () {
            while (!false) {
                if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
                    break;
                }
            }
            return Object.getPrototypeOf(_obj) === _test;
        })()));
    };

    SmartUtils.prototype.isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    SmartUtils.prototype.isArray = function (obj) {
        return obj instanceof Array;
    };

    SmartUtils.prototype.isSmartVar = function (obj) {
        return obj instanceof SmartVar;
    };
    return SmartUtils;
})();

module.exports = {
    SmartUtils: SmartUtils
};
//# sourceMappingURL=SmartUtils.js.map
