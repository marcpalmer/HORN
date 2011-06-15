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
 *  <p>
 *  The HornPatternConverter is a utility 'class' that binds itself to a Horn
 *  instance and helps with converting Horn model data.
 *  <p>
 *  Reusable converter functions are registered to execute when conversion
 *  involve property paths that match given expressions.
 *
 *  @param {Horn} args.horn the Horn instance to bind to
 *
 *  @constructor
 *
 *  @test
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
     */
    this.add = function (name, converter) { converters[name] = converter; };

    /**
     *  @private
     *  @function
     */
    var convert = function (args) {
        var rv;
        hornInstance.each(patterns, function (i, n) {
            var match = args.path.match( i);
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
    this.get = function (name) { return converters[name]; };

    /**
     *  Add a pattern, bound to a given named converter.
     *
     *  @param {String} pattern a Horn property path with optional wildcard '*'
     *      characters
     *  @param {String} converterName the name of the converter that will handle
     *      conversions for the given property path
     *
     *  @public
     */
    this.pattern = function (pattern, converterName) {
        patterns[pattern] = this.toRegularExpression( converterName);
    };

    /**
     *  Add a regex pattern, bound to a given named converter.
     *
     *  @param {String} pattern a valid regular expression that is designed to
     *      match one or many <code>Horn</code> property paths.
     *  @param {String} converterName the name of the converter that will handle
     *      conversions for the given property path
     *
     *  @public
     */
    this.regexPattern = function (pattern, converterName) {
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
        if ( converters.hasOwnProperty( name) ) { delete converters[name]; }
    };

    /**
     *  Remove a regex pattern (pattern to converter binding).
     *
     *  @param {String} pattern the regular expression pattern to remove
     *
     *  @public
     */
    this.removeRegexPattern = function (pattern) { delete patterns[pattern]; };


    /**
     *  Remove a pattern (pattern to converter binding).
     *
     *  @param {String} pattern the regular expression pattern to remove
     *
     *  @public
     */
    this.removePattern = function (pattern) {
        delete patterns[this.toRegularExpression( pattern)];
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

HornPatternConverter.prototype = {

    /**
     *  Converts a horn property path with optional wildcard '*' characters into
     *  a regular expression.
     *  <p>
     *  '*' wildcards are converted into '.*' regular expression terms. Array
     *  indexing and object dereference operators are correctly escaped.
     *
     *  @param {String} pattern the Horn property path to convert to a regular
     *      expression
     *
     *  @return {String} a horn property path regular expression
     *
     *  @methodOf HornPatternConverter.prototype
     */
    toRegularExpression: function( path ) {
        return path.replace( /([\.\[\]])/g, "\\$1").replace( "*", ".*");
    }
};

var hornConverter = new HornPatternConverter({horn: horn});

hornConverter.add("Integer",
    function (args) {
        if ( args.type !== 'fromJSON' ) {
            return (args.type === 'fromText' ) ?
                parseInt(args.value) : args.value + "";
        }
    });

hornConverter.add("Boolean",
    function (args) {
        if ( args.type !== 'fromJSON' ) {
            return (args.type === 'fromText') ?
                args.value.toLowerCase() === 'true' : args.value + "";
        }
    });