/**
 *  @fileOverview Provides the <code>HornPatternConverter</code> class that
 *      assists in mapping <strong>Horn</strong> property paths to
 *      corresponding types; and their native JS value <> String value
 *      conversions.
 *
 *  @author <a href="mailto:cdenman@me.com">Chris Denman</a>
 *  @author <a href="mailto:marc@anyware.co.uk">Marc Palmer</a>
 *
 *  @version 1.0
 *
 *  @requires JQuery
 *  @requires Horn
 */

/**
 *  Creates a new HornPatternConverter instance which should continue even though
 *  we have started a new line.
 *
 *  @param {Object} args all arguments for this constructor
 *  @param {Horn} args.horn the horn instance to which to bind this pattern converter
 *      instance
 *
 *  @constructor
 */
HornPatternConverter = function( args ) {

    /**
     *  @private
     *  @field
     */
    var instance;

    /**
     *  @private
     *  @field
     */
    var converters;

    /**
     *  @private
     *  @field
     */
    var patterns;

    $.extend( this, {

        /**
         *
         *
         */
        addConverter: function( args ) {
            converters[ args.name] = args.converter; },

        /**
         *
         *
         *  @public
         */
        addPattern: function( args ) {
            patterns[ args.pattern] = args.converterName; },

        /**
         *
         *  @return
         *
         *  @public
         */
        convert: function( args ) {
            var rv;
            instance.each( patterns, function( i, n ) {
                var match = args.path.match( i);
                if ( instance.isDefinedNotNull( match) &&
                    (match.toString() === args.path) ) {
                    rv = converters[ n]( args);
                    return false;
                }
            });
            return rv === undefined ? args.value : rv;
        },

        /**
         *
         *  @return
         *
         *  @public
         */
        getConverter: function( args) { return converters[ args.name]; },

        /**
         *
         *
         *  @public
         */
        removeConverter: function( args ) { delete converters[ args.name]; },

        /**
         *
         *
         *  @public
         */
        removePattern: function( args ) { delete patterns[ args.name]; },

        /**
         *
         *
         *  @public
         */
        reset: function( args ) {
            instance = undefined;
            converters = {};
            patterns = {};
        }
    });

    this.reset();
    instance = args.horn;
    instance.option( "converter", this.convert);
};

var hornConverter = new HornPatternConverter({horn: horn});

hornConverter.addConverter( {name: "IntegerConverter", converter:
    function( args ) {
        return args.type === 'fromText' ?
            parseInt( args.value) : args.value + "";
}});

hornConverter.addConverter( {name: "BooleanConverter", converter:
    function( args ) {
        return args.type === 'fromText' ?
            args.value.toLowerCase() === 'true' : args.value + "";
}});