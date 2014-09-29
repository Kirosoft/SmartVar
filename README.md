SmartVar
========

![Build Status](https://travis-ci.org/Kirosoft/SmartVar.svg)

Create smart variables/models in a functional reactive style




[SmartVar documentation](docs/SmartVar.md)


* Reactive Model Supporting
* Live link SmartVars to other SmartVars
* Supports computed properties based on local and other SmartVar propeties



var myModel = new SmartVar({
                firstName: 'mark','lastName: 'norman', 
                displayName: (parent) => { parent.registerDependency(displayName), [firstName, lastName]) }
            });
            
            
myModel
    .changes(<filter>)            
    .filter( function() { })
    .bindTo($('#test1');
    
 
 
myInput('#inp1')
        .sendTo(myModel, 'filterPath');
        
        
        
