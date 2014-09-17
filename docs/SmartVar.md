# SmartVar


The SmartVar class provides a functional reactive style variable wrapper and builds on top of the [Stream](stream.md)
 fluent style interface.
 

 
 
## Get/Set Number
 
Set an a numeric value as a property as follows:

    <smartVar>.property(<newvalue>);

retrieve a value:

    <smartVar>.property();
    
For example:
 
     var value1 = new SmartVar({ arg1: 1});
     
     // get the value out
     console.log(value1.arg1());        //=> output 1
     
     // set the value
     value1.arg1(10);
     console.log(value1.arg1());        //=> output 10
     

## Get/Set String
 
Set an a string value as a property as follows:

    <smartVar>.property(<newvalue>);

retrieve a value:

    <smartVar>.property();
    
For example:

     var value1 = new SmartVar({ arg1: 'hello'});
     
     // get the value out
     console.log(value1.arg1());        //=> output 'hello'
     
     // set the value
     value1.arg1('world');
     console.log(value1.arg1());        //=> output 'world'
     
## Get/Set Object

     var value1 = new SmartVar({ arg1: { name: 'fred', address: 'freds address'}});
     
     // get the value out
     console.log(value1.arg1.name());        //=> output 'fred'
     console.log(value1.arg1.address());        //=> output 'freds address'
     
     // set the value by each property
     value1.arg1.name('bill');
     console.log(value1.arg1.name());        //=> output 'bill'
     
     value1.arg1.address('bills address');
     console.log(value1.arg1.address());        //=> output 'bills address'

     // overwrite the whole object with a new one
     value.arg1.update({ name: 'john', address: 'johns address'});
     console.log(value1.arg1.name());        //=> output 'john'
     console.log(value1.arg1.address());        //=> output 'johns address'
     
## Get/Set Array

    var value1 = new SmartVar({ arg1: ['a', 'b', 'c']});
    
    console.log(value1.arg1[0]());        //=> output 'a'
    console.log(value1.arg1[1]());        //=> output 'b'
    console.log(value1.arg1[2]());        //=> output 'c'

    // set an element value
    value1.arg1[0]('x');
    console.log(value1.arg1[0]());        //=> output 'x'
    
    // push an element
    value1.arg1.push('y');
    console.log(value1.arg1[3]());        //=> output 'y'

## Get/Set SmartVar

    var value1 = new SmartVar({ arg1: 10 });
    
    // value2.arg1 is linked to the value1.arg1 property (auto-matched by name
    var value2 = new SmartVar({ arg1: value1 });
    
    console.log(value2.arg1());          // => output 10
    
    // set the base value
    value1.arg1(50);
    
    // check the link property value
    console.log(value2.arg1());          // => output 50
    
## Get/Set Computed
    
    // smart variable which is computer from two other smart variables
    var computed = new SmartVar({arg1: 5, arg2:10, age: function(parent) {
        parent.registerDependency('age', ['arg1','arg2']);
        console.log("running computed function: ");
        console.log('arg1 is: '+parent.arg1());
        console.log('arg2 is: '+parent.arg2());
        console.log("-------------------");
        return parent.arg1()*parent.arg2();
    }});

    console.log(computed.age());          // => output 50
    
    // change arg1
    computed.arg1(10);

    console.log(computed.age());          // => output 100
