/**
 * Created by user on 10/09/2014.
 */
///<reference path='../typescript-node-definitions/node.d.ts'/>
///<reference path="SmartVar.ts"/>

//
class SmartUtils {
    isObjLiteral(_obj) {
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

    isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    isArray(obj) {
        return obj instanceof Array;
    }

    isSmartVar(obj) {
        return obj instanceof SmartVar;
    }
}


module.exports = {
    SmartUtils: SmartUtils
};