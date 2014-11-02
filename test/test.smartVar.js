/**
 * Created by user on 11/09/2014.
 */
///<reference path="stream.ts"/>
///<reference path="../source/SmartVar.ts"/>

var stream = require('../source/Stream');
var utils = require('../source/utils');
var smartUtils = require('../source/SmartUtils');
var smartVar = require('../source/SmartVar');

utils.requireClass('SmartUtils', 'SmartUtils');
utils.requireClass('Stream', 'Stream');
utils.requireClass('SmartVar', 'SmartVar');


module.exports = {
    setUp: function (callback) {
        this.foo = 'bar';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testNumber: function (test) {
        test.expect(2);
        var value1 = new SmartVar({ arg1: 2 });

        test.ok(value1.arg1() === 2, "check reading the number is o.k.");

        value1.arg1(4);

        test.ok(value1.arg1() === 4, "check reading the number is o.k. after set");

        test.done();
    },
    testString: function (test) {
        test.expect(2);
        var value1 = new SmartVar({ arg1: 'hello' });

        test.ok(value1.arg1() === 'hello', "check reading the string is o.k.");

        value1.arg1('world');

        test.ok(value1.arg1() === 'world', "check reading the string is o.k. after set");

        test.done();
    },
    testObject: function (test) {
        test.expect(6);
        var value1 = new SmartVar({ arg1: {name: 'mark',address: 'address'} });

        test.ok(value1.arg1.name() === 'mark', "check reading object attribute o.k.");
        test.ok(value1.arg1.address() === 'address', "check reading object attribute o.k.");

        value1.arg1.name('fred');
        value1.arg1.address('another address');

        test.ok(value1.arg1.name() === 'fred', "check reading object attribute o.k. after set");
        test.ok(value1.arg1.address() === 'another address', "check reading object attribute o.k. after set");

        // Set the whole object in one go
        value1.arg1.update({ name: 'bill', address: 'bills address'});

        test.ok(value1.arg1.name() === 'bill', "check reading object attribute o.k. after obj set");
        test.ok(value1.arg1.address() === 'bills address', "check reading object attribute o.k. after obj set");

        test.done();
    },
    testArray: function (test) {
        test.expect(23);
        var value1 = new SmartVar({ arg1: ['a', 'b', 'c', 'd'] });
        test.ok(value1.arg1[0]() === 'a', "check reading array attribute o.k.");
        test.ok(value1.arg1[1]() === 'b', "check reading array attribute o.k.");
        test.ok(value1.arg1[2]() === 'c', "check reading array attribute o.k.");
        test.ok(value1.arg1[3]() === 'd', "check reading array attribute o.k.");


        value1.arg1.push('e');
        test.ok(value1.arg1[4]() === 'e', "check reading array attribute o.k.");
        value1.arg1.push('f');
        test.ok(value1.arg1[5]() === 'f', "check reading array attribute o.k.");

        test.ok(value1.arg1[0]() === 'a', "check reading array attribute o.k.");
        test.ok(value1.arg1[1]() === 'b', "check reading array attribute o.k.");
        test.ok(value1.arg1[2]() === 'c', "check reading array attribute o.k.");
        test.ok(value1.arg1[3]() === 'd', "check reading array attribute o.k.");

        value1.arg1[0]('x');
        test.ok(value1.arg1[0]() === 'x', "check reading array attribute o.k.");

        // TODO: slice, pop, shift etc....
        var popped = value1.arg1.pop();
        test.ok(popped() === 'f', "check reading array attribute o.k.");
        var popped = value1.arg1.pop();
        test.ok(popped() === 'e', "check reading array attribute o.k.");
        test.ok(value1.arg1[0]() === 'x', "check reading array attribute o.k.");
        test.ok(value1.arg1[1]() === 'b', "check reading array attribute o.k.");
        test.ok(value1.arg1[2]() === 'c', "check reading array attribute o.k.");
        test.ok(value1.arg1[3]() === 'd', "check reading array attribute o.k.");

        var shifted = value1.arg1.shift();
        test.ok(shifted() === 'x', "check reading array attribute o.k.");

        var shifted = value1.arg1.shift();
        test.ok(shifted() === 'b', "check reading array attribute o.k.");

        test.ok(value1.arg1[0]() === 'c', "check reading array attribute o.k.");
        test.ok(value1.arg1[1]() === 'd', "check reading array attribute o.k.");

        value1.arg1.reverse();
        test.ok(value1.arg1[0]() === 'd', "check reading array attribute o.k.");
        test.ok(value1.arg1[1]() === 'c', "check reading array attribute o.k.");

        test.done();
    },
    testSmartVar1: function (test) {
        test.expect(7);

        var value1 = new SmartVar({ arg1: 21 });
        var value2 = new SmartVar({ arg1: value1});

        test.ok(value2.arg1() === 21, "check reading SmartVar attribute o.k.");

        value1.arg1(50);

        test.ok(value2.arg1() === 50, 'check linked smartvar is set from base smartvar');

        // overwrite with a number
        value2.arg1(20);
        var res = value2.arg1();
        test.ok(res == 20, 'check re-written smartvar returns the correct value');
        test.ok(value2.arg1() === 20, 'check re-written smartvar returns the correct value');

        // reset it back to a smartvar
        value2.arg1(value1);
        test.ok(value2.arg1() === 50, 'check linked smartvar is set from base smartvar');

        // Check it still works
        value1.arg1(100);
        test.ok(value2.arg1() === 100, 'check linked smartvar is set from base smartvar');

        value1.arg1('hello');
        test.ok(value1.arg1() === 'hello', 'check linked smartvar is set from base smartvar');


        test.done();
    },
    testComputed: function (test) {

        test.expect(7);

        // smart variable which is computed from two other smart variables on the object (dependent properties)
        var computed = new SmartVar({arg1: 5, arg2:10, age: function(parent) {
            parent.registerDependency('age', ['arg1','arg2']);
            console.log("running computed function: ");
            console.log('arg1 is: '+parent.arg1());
            console.log('arg2 is: '+parent.arg2());
            console.log("-------------------");
            return parent.arg1()*parent.arg2();
        }});

        test.ok(computed.arg1() === 5, 'check computed arg is set correctly');
        test.ok(computed.arg2() === 10, 'check computed arg is set correctly');
        test.ok(computed.age() === 50, 'check computed property is set from args');

        computed.arg1(10);
        test.ok(computed.arg1() === 10, 'check arg1 is updated');
        test.ok(computed.age() === 100, 'check computed is updated');

        var simpleSmartVar = new SmartVar({arg1: 1});
        // overwrite arg1 with a smart var link
        computed.arg1(simpleSmartVar);
        var arg1 = computed.arg1();
        // check  age property is calculated from the smartvar link
        test.ok(computed.arg1() === 1, 'check linked smartvar is set from base smartvar');
        // Check the computer property uses the dependent property which is linked to a SmartVar property
        test.ok(computed.age() === 10, 'check linked smartvar is set from base smartvar');


        test.done();
    },
    testDocsExample: function(test) {
        test.expect(3);

        var screwdrivers = new SmartVar( { posisizes: [35,2,4] });
        var hammers = new SmartVar({ hammerTypes: ['claw'] });

        // Composite SmartVar with two linked SmartVars and an auto-computed property
        var toolkit = new SmartVar({ posisizes: screwdrivers, hammerTypes: hammers, numTools: function (parent) {
            parent.registerDependency('numtools', ['screwdrivers', 'hammers']);

            console.log("running tools count: ");
            var screwdriverCount = parent.posisizes().length;
            console.log('There are: ' + screwdriverCount + " screwdrivers");
            var hammerCount = parent.hammerTypes().length;
            console.log('There are: ' + hammerCount + " hammers");
            console.log("-------------------");
            return hammerCount + screwdriverCount;

        }});

        screwdrivers.posisizes.push(5);

        test.ok(toolkit.numTools() === 5, 'There should be more tools');


        hammers.hammerTypes.push("pan");
        test.ok(toolkit.numTools() === 6, 'There should be more tools');

        // TODO: Tidy up notation here
        test.ok(toolkit.hammerTypes()[1]() === "pan", 'Missing pan hammer');
        test.done();

    }
};

//        exports.testSomething = function(test) {
//
//    test.expect(1);
//
//
//    test.ok(true, "this assertion should pass");
//
//    var value1 = new SmartVar({ arg1: 2, arg2:4 });
//    var arrTest1 = new SmartVar([0,1,2]);
//
//    var textModel = new SmartVar({lastName:'world'});
//
//
//    // smart variable which is computer from two other smart variables
//    var computed = new SmartVar({arg1: value1, arg2:value1, age: function(parent) {
//        parent.registerDependency('age', ['arg1','arg2']);
//        console.log("running computed function: ");
//        console.log('arg1 is: '+parent.arg1());
//        console.log('arg2 is: '+parent.arg2());
//        console.log("-------------------");
//        return parent.arg1()*parent.arg2();
//    }});
//
//    var model = new SmartVar({ firstName: 'hello',    // simple string
//        lastName: textModel,    // smart var
//        age: computed,   // computed function which is based on properties in another model which are auto-updated
//        arrTest: [1,2,{'d':'d','e':'e'}],
//        complex: { a: 'a',b:'b'}});
//
//
//
//
//
//    console.debug(model);
//    model.firstName('mark');
//    model.arrTest[1]('x');
//
//    console.log('change a derived property: ');
//    textModel.lastName('newWorld');
//    console.debug(model);
//
//    model.complex.a('c');
//    model.arrTest[2].d('x');
//
//    console.log('arr test: '+model.arrTest[2].d());
//    console.log('smart var test: '+model.lastName());
//
//    console.debug(computed);
//    console.log('age: '+computed.age());    // computed attr
//    console.log('model age: '+model.age()); // from a smart var with a computed attr
//
//    value1.arg1(4); // causes model.age to automatically changed via computed function
////console.log('model age: '+model.age()); // from a smart var with a computed attr
////console.debug(computed);
//    console.debug(model);
//
////model
////    .stream('model.arrTest')            // subsribe with filter to model
////    .seriesEach()                         // returns and object to handle the iteration (subscribes to the series each object)
////    .sendTo('base.path.one');            // subscribes to the series each object
//
//
//
//    testStream.update(null, 'test','val1',0);
//
//
//
//    var list = new SmartVar({arr: ['one','two','three']});
//
//    list.subscribe(function(obj,parentElement, attr,value,oldValue) {
//        console.log("new list item added: "+attr+" , "+value.toString());
//    });
//    list.arr.push('test'); // todo: push/pop/slice/shift/ ....
//   //TODO: Obj delete prop / add new property
//
//    console.debug(list);
//    console.log(list.arr[3]());
//    list.arr[3]('test2');


