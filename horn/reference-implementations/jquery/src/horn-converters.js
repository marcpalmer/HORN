window.HornPatternConverter = function( args ) {
    var instance;
    var converters;
    var patterns;

    var reset = function( args ) {
        instance = undefined;
        converters = {};
        patterns = {};
    };

    $.extend( this, {
        addConverter: function( args ) { converters[ args.name] = args.converter; },
        addPattern: function( args ) { patterns[ args.pattern] = args.converterName; },
        convert: function( args ) {
            var rv;
            instance.each( patterns, function( i, n ) {
                var match = args.path.match( i);
                if ( instance.isDefinedNotNull( match) && (match.toString() === args.path) ) {
                    rv = converters[ n]( args);
                    return false;
                }
            });
            return rv === undefined ? args.value : rv;
        },
        getConverter: function( args) { return converters[ args.name]; },
        removeConverter: function( args ) { delete converters[ args.name]; },
        removePattern: function( args ) { delete patterns[ args.name]; }
    });

    reset();
    instance = args.horn;
    instance.option( "converter", this.convert);
};

var hornConverter = new HornPatternConverter({horn: horn});

hornConverter.addConverter( {name: "IntegerConverter", converter: function( args ) {
    return args.type === 'fromText' ? parseInt( args.value) : args.value + "";
}});

hornConverter.addConverter( {name: "BooleanConverter", converter: function( args ) {
    return args.type === 'fromText' ? args.value.toLowerCase() === 'true' : args.value + "";
}});

