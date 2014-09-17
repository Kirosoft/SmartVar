# Stream


The stream class facilitates the combination of functions in a fluent style.


    var myStream = new Stream();

    myStream()
        .changes()               // changes in myStream are sent here
        .changes();              // .. and here



    