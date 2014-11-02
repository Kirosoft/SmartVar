/**
 * Created by user on 10/09/2014.
 */
///<reference path='../typescript-node-definitions/node.d.ts'/>

//
class Stream {
    private subscribers = [];
    private processFunc: any = null;

    constructor() {
        return this;
    }

    subscribe (stream:Stream, filter?:string) {
        var handle = this.subscribers.length;

        this.subscribers.push({ 'stream': stream, 'callback': null, 'filter': filter, 'active':true});

        return handle;
    }

    subscribeCallback (callback, filter?:string) {
        var handle = this.subscribers.length;

        this.subscribers.push({ 'callback': callback, 'stream': null, 'filter': filter, 'active':true});

        return handle;
    }

    unSubscribe(handle) {
        this.subscribers[handle].active = false;
    }

    update (newObj, parentElement, changedAttr:string, newValue, oldValue)  {

        this.processAttributeEvent(newObj, parentElement, changedAttr, newValue, oldValue);

        //console.log('Update: Attr: '+changedAttr+ " , value: "+newValue);
        this.notifySubscribers(newObj, parentElement, changedAttr, newValue, oldValue);
    }

    processAttributeEvent(newObj, parentElement, changedAttr:string, newValue, oldValue) {

    }

    // An element on this object changed in value notify all subscribers
    notifySubscribers (obj, parentElement, attr:string, value, oldValue, msg? :string) {
        var _self = this;

        for (var f = 0; f< _self.subscribers.length;f++) {
            if (_self.subscribers[f].filter) {
                if (_self.subscribers[f].filter === attr) {

                    if (_self.subscribers[f].active) {

                        if (_self.subscribers[f].callback) {
                            _self.subscribers[f].callback(attr,value, oldValue);

                        } else if (_self.subscribers[f].stream.processFunc) {
                            _self.subscribers[f].stream.processFunc(attr,value, oldValue);
                        }
                        if (_self.subscribers[f].stream) {
                            _self.subscribers[f].stream.update(attr,value, oldValue);
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
    }

    changes (processFunc)  {

        var newStream = new Stream();
        newStream.processFunc = processFunc;
        this.subscribe(newStream);

        return newStream;

    }

}

module.exports = {
    Stream: Stream
};