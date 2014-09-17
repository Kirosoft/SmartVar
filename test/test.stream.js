///<reference path="stream.ts"/>

var stream = require('../source/Stream');
var utils = require('../source/utils');
var smartUtils = require('../source/SmartUtils');

utils.requireClass('SmartUtils', 'SmartUtils');
utils.requireClass('Stream', 'Stream');


module.exports = {
    setUp: function (callback) {
        this.foo = 'bar';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testCallbackChain: function (test) {
        test.expect(3);

        var testStream = new Stream();
        var updatedAttrName = 'test';
        var updatedAttrValue = 0;

        var testCallback1 = function ( obj, parentElement, attr, value, oldValue) {
            //console.log('testCallbackChain: callback: Attr: '+ attr + " , value: " + value);
            test.ok(attr === updatedAttrName, "Check attribute name");
            test.ok(value === updatedAttrValue, "Check attribute value");
            test.ok(true, "Callback received");
        };

        // Fully async, fluent interface
        // Params configure - flow moves left -> right
        // if (update) is array do auto forEachSeries
        testStream
            .changes(testCallback1);         // process func for each element

        testStream.update(null, 'test', updatedAttrName, updatedAttrValue);

        test.done();
    },
    testCallbackChainMulti : function(test) {
        test.expect(6);

        var testStream = new Stream();
        var updatedAttrName = 'test';
        var updatedAttrValue = 0;

        var testCallback1 = function ( obj, parentElement, attr, value, oldValue) {
            console.log('testCallbackChainMulti: callback: Attr: '+ attr + " , value: " + value);
            test.ok(attr === updatedAttrName, "Check attribute name");
            test.ok(value === updatedAttrValue, "Check attribute value");
            test.ok(true, "Callback received");
        };
        var testCallback2 = function ( obj, parentElement, attr, value, oldValue) {
            console.log('testCallbackChainMulti: callback: Attr: '+ attr + " , value: " + value);
            test.ok(attr === updatedAttrName, "Check attribute name");
            test.ok(value === updatedAttrValue, "Check attribute value");
            test.ok(true, "Callback received");
        };

        // Fully async, fluent interface
        // Params configure - flow moves left -> right
        // if (update) is array do auto forEachSeries
        testStream
            .changes(testCallback1);         // process func for each element

        testStream
            .changes(testCallback2);         // process func for each element

        testStream.update(null, 'test', updatedAttrName, updatedAttrValue);

        test.done();
    },
    testCallbackChainDeep : function(test) {
        test.expect(6);

        var testStream = new Stream();
        var updatedAttrName = 'test';
        var updatedAttrValue = 0;

        var testCallback1 = function ( obj, parentElement, attr, value, oldValue) {
            console.log('testCallbackChainDeep: callback: Attr: '+ attr + " , value: " + value);
            test.ok(attr === updatedAttrName, "Check attribute name");
            test.ok(value === updatedAttrValue, "Check attribute value");
            test.ok(true, "Callback received");
        };
        var testCallback2 = function ( obj, parentElement, attr, value, oldValue) {
            console.log('testCallbackChainDeep: callback: Attr: '+ attr + " , value: " + value);
            test.ok(attr === updatedAttrName, "Check attribute name");
            test.ok(value === updatedAttrValue, "Check attribute value");
            test.ok(true, "Callback received");
        };

        // Fully async, fluent interface
        // Params configure - flow moves left -> right
        // if (update) is array do auto forEachSeries
        testStream
            .changes(testCallback1)         // process func for each element
            .changes(testCallback2);         // process func for each element

        testStream.update(null, 'test', updatedAttrName, updatedAttrValue);

        test.done();
    }
    , testprocessAttributeEvent : function(test) {
        test.expect(3);


        Stream.prototype.processAttributeEvent = function (newObj, parentElement, changedAttr, newValue, oldValue) {
            console.log("processattributeevent: " + changedAttr);
            test.ok(changedAttr === updatedAttrName, "callback received");
        };

        var testStream = new Stream();
        var updatedAttrName = 'test';
        var updatedAttrValue = 0;

        // Fully async, fluent interface
        // Params configure - flow moves left -> right
        // if (update) is array do auto forEachSeries
        testStream
            .changes()         // process func for each element
            .changes();         // process func for each element

        testStream.update(null, 'test', updatedAttrName, updatedAttrValue);

        test.done();
    }

};
