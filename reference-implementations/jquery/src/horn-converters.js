/**
 *  @fileOverview Provides the <code>HornPatternConverter</code> class that
 *      assists in the conversion of Horn model values to their DOM node
 *      representation, and vice versa.
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
 *  Used to create new HornPatternConverter instances.
 *
 *  @param {Horn} args.horn the Horn instance to bind to
 *
 *  @class
 *  @function
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

    /**
     *
     *
     */
    this.addConverter = function( args ) {
        converters[ args.name] = args.converter; };

    /**
     *
     *
     *  @public
     */
    this.addPattern = function( pattern, converterName ) {
        patterns[ args.pattern] = args.converterName; };

    /**
     *
     *  @return
     *
     *  @public
     */
    this.convert = function( args ) {
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
    };

    /**
     *
     *  @return
     *
     *  @public
     */
    this.getConverter = function( args) { return converters[ args.name]; };

    /**
     *
     *
     *  @public
     */
    this.removeConverter = function( args ) { delete converters[ args.name]; };

    /**
     *
     *
     *  @public
     */
    this.removePattern = function( args ) { delete patterns[ args.pattern]; };

    /**
     *  Reset all
     *
     *  @public
     */
    this.reset = function( args ) {
        instance = undefined;
        converters = {};
        patterns = {};
    };

    this.reset();
    instance = args.horn;
    instance.option( "converter", this.convert);
};

var hornConverter = new HornPatternConverter({horn: horn});

hornConverter.addConverter( {name: "Integer", converter:
    function( args ) {
        return args.type === 'fromText' ?
            parseInt( args.value) : args.value + "";
}});

hornConverter.addConverter( {name: "Boolean", converter:
    function( args ) {
        return args.type === 'fromText' ?
            args.value.toLowerCase() === 'true' : args.value + "";
}});