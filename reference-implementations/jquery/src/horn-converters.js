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
 *  @constructor
 */
var HornPatternConverter = function (args) {

    /**
     *  @private
     *  @field
     */
    var hornInstance;

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
     *  Add a named converter.
     *  <p>
     *
     *  @param {String} name the name to associate with the converter
     *  @param {Function} converter the converter to add
     *
     *  @public
     */
    this.add = function (name, converter) {
        converters[name] = converter;
    };

    /**
     *  @return
     *
     *  @public
     */
    this.convert = function (args) {
        var rv;
        hornInstance.each(patterns, function (i, n) {
            var match = args.path.match(i);
            if (hornInstance.isDefinedNotNull(match) &&
                (match.toString() === args.path)) {
                rv = converters[n](args);
                return false;
            }
        });
        return rv === undefined ? args.value : rv;
    };

    /**
     *  Retrieve a named converter.
     *
     *  @param {String} name the name associated with the converter
     *
     *  @return {Function} the given converter else <code>undefined</code>
     *
     *  @public
     */
    this.get = function (name) {
        return converters[name];
    };

    /**
     *  Add a pattern, bound to a given named converter.
     *
     *  @param {String} pattern a valid regular expression that is designed to
     *      match one or many <code>Horn</code> property paths.
     *  @param {String} converterName the name of the converter that will handle
     *      conversions for the given property path
     *
     *  @public
     */
    this.pattern = function (pattern, converterName) {
        patterns[pattern] = converterName;
    };

    /**
     *  Remove a named converter function.
     *
     *  @param {String} name the name associated with the converter function
     *
     *  @public
     */
    this.remove = function (name) {
        if ( converters.hasOwnProperty( name) ) {
            delete converters[name];
        }
    };

    /**
     *  Remove a pattern>converter binding.
     *
     *  @param {String} pattern the regular expression pattern to remove
     *
     *  @public
     */
    this.removePattern = function (pattern) {
        delete patterns[pattern];
    };

    /**
     *  Reset all internal state.
     *  <p>
     *  Removes all converters and patterns.
     *  <p>
     *  Take a new <code>Horn</code> instance to bind to.
     *
     *  @param {Horn} horn the new <code>Horn</code> instance to use
     *
     *  @public
     */
    this.reset = function ( horn ) {
        converters = {};
        patterns = {};
        hornInstance = horn;
        hornInstance.option("converter", this.convert);
    };

    this.reset(args.horn);
};

var hornConverter = new HornPatternConverter({horn: horn});

hornConverter.add("Integer",
    function (args) {
        return args.type === 'fromText' ?
            parseInt(args.value) : args.value + "";
    });

hornConverter.add("Boolean",
    function (args) {
        return args.type === 'fromText' ?
            args.value.toLowerCase() === 'true' : args.value + "";
    });