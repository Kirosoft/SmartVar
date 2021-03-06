SmartVar
========

![Build Status](https://travis-ci.org/Kirosoft/SmartVar.svg)



An experimental implementation of compose-able reactive style variables/models in Javascript.


Dependant properties between models are updated automatically and functions referencing properties are recomputed automatically with changes.

Example useage:


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



This example shows the SmartVar Toolkit which is a combination of the SmartVar hammerTypes and screwdrivers.
The Toolkit SmartVar includes a computed property numTools which is calculated lazily (i.e. on demand) based on the local properties which reference the SmartVar properties on the respective objects.
So, using this model we can build arbitrarily complex interdependent objects that exist in only one place and will update all related objects.

 This kind of functionality can work well with a front end framework such as React.

 Similar concepts exist as part of other frameworks e.g. Scala.RX


[SmartVar documentation](docs/SmartVar.md)

TODO:

Add, fluent/functional style iterators

        myModel
            .changes(<filter>)
            .filter( function() { })
            .bindTo($('#test1');
    
 
Add, support for stream based updates/changes

        myInput('#inp1')
                .sendTo(myModel, 'filterPath');
        
        
        
    var t1 = new Sequence.arraySequence([1,2,3,4]);
    var t2 = new ArraySequence([5,6,7,8]);
    var t3 = new ArraySequence([9,10,11,12]);

    var res = t1.transform(incXfr)
                .merge(t2, t3)
                .transform(incXfr)      // map op
                //.transform(isEvenXfr)
                .transform(debugXfr, 'merged event stream: ')
                .transducer(aggregateXfr)
                .transform(debugXfr, 'aggregate event stream: ')
                .toArray(true);
                
