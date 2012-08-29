/**
 *  @fileOverview Spotty Mushroom Utility JavaScript Code
 *
 *  @author <a href="mailto:cdenman@me.com">Chris Denman</a>
 *
 *  @version 1.0
 *
 *  @requires JQuery
 */

/**
 *  Provides both static and instance functions.
 *
 *  @namespace SMUtils
 *
 *  @constructor
 *
 *  @return {SMUtils} a newly initialised instance
 */
function SMUtils(){

    /**
     *  @field
     *  @private
     */
    var elementCache = {};

    /**
     *  Return either cached, or live elements by selector.
     *
     *  @param {String} selector the JQ selector string to use, $(selector) is
     *      performed behind the scenes
     *  @param {Boolean} refresh should we refresh the cache value with this
     *      selection or not
     *
     *  @return the result of applying the given selector to the DOM or a cached
     *      version thereof if refresh is false.
     *
     *  @see SMUtils.clearCache
     *  @see SMUtils.cacheEntry
     *
     *  @public
     */
    this.getBy = function ( selector, refresh ) {
        var data = this.cacheEntry( selector);
        if ( !SMUtils.isDefinedNotNull( data) || (refresh === true) ) {
            data = $(selector);
            if ( data.length === 0 ) { data = undefined; }
            this.setCacheEntry( selector, data);
        }
        return data;
    };

    /**
     *  Return a cached-selector value.
     *
     *  @param selector the element selector cache key
     *
     *  @return
     *
     *  @public
     */
    this.cacheEntry = function ( selector ) {
        return elementCache[ selector];
    };

    /**
     *  Set a cache entry value.
     *
     *  @param selector the element selector cache key
     *  @param value the value to cache
     *
     *  @public
     *
     */
    this.setCacheEntry = function ( selector, value ) {
        elementCache[ selector] = value;
    };

    /**
     *  Clears the element cache.
     *
     *  @see SMUtils.getBy
     *
     *  @public
     */
    this.clearCache = function () { elementCache = {}; };
}

/**
 *  Wrapper around jQuery $.ajax call for (typically) JSON content types.
 *  Sensible defaults are provided, intended to cover the majority of cases.
 *  <P>
 *  This function also works-around a jQuery bug by proxying the success
 *  handler.
 *
 *  @param args
 *  @param {String} [args.contentType] default value <code>"text/json"</code>
 *  @param {Function|String} [args.data] jQuery compatible data or a function
 *      that yields such
 *  @param {String} [args.dataType] default value <code>"json"</code>
 *  @param {Boolean} [args.processData] default value <coded>true</code> iff
 *      <code>args.type === "GET"</code>
 *  @param {Number} [args.timeout] default value <code>8000</code>
 *  @param {String} [args.type] default value <code>"GET"</code>
 *
 *  @todo test
 */
SMUtils.ajax = function( args ) {
    var successProxy = function(data, textStatus) {
        if ( (data !== null) && (SMUtils.isDefinedNotNull( args.success)) ) { // Trap CONN_REFUSED jquery bug
            return args.success( data, textStatus);
        }
    };
    if ( typeof args.data === 'function' ) { args.data = args.data(); }
    var defaults = {
        contentType: "text/json",
        dataType: "json",
        timeout: 8000,
        success: successProxy,
        type: "GET"};
    $.extend( defaults, args);
    if ( args.processData === undefined ) {
        defaults.processData = (defaults.type.toUpperCase() === "GET");
    }
    $.ajax( defaults);
};

/**
 *  Inserts an element into an existing array by index.
 *  <p>
 *  Preserves the identity of the array.
 *
 *  @param {Array} array the array to modify
 *  @param {Number} position the position at which to insert the new array
 *      element
 *  @param [item] the value to assign to the new array element
 *      (if not <code>undefined</code>)
 *
 *  @return {Array} the array 'array' passed in
 *
 *  @public
 */
SMUtils.arrayInsert = function (array, position, item) {
    var shiftCount;
    var length = array.length;
    for ( shiftCount = 0; shiftCount <= length - position;
        shiftCount = shiftCount + 1 ) {
        array[ length - shiftCount] = array[ length - 1 - shiftCount];
    }
    if ( item !== undefined ) { array[ position] = item; }
    return array;
};

/**
 *  Remove an array element by index.
 *  <p>
 *  Preserves the identity of the array.
 *  <p>
 *  Assumes that array is filled contiguously from index 0 to index
 *  <code>array.length - 1</code>
 *
 *  @param {Array} array the array to remove an element from
 *  @param {Number} position the position of the element to remove from the
 *      array
 *
 *  @return {Array} the array 'array' passed in
 *
 *  @public
 */
SMUtils.arrayRemove = function (array, position) {
    var shiftCount;
    var length = array.length;
    for ( shiftCount = 0; shiftCount < length - position - 1;
        shiftCount += 1 ) {
        array[ position + shiftCount] = array[ position + shiftCount + 1];
    }
    array.length -= 1;
    return array;
};

/**
 *  Returns a new function that executes the given one under a new head
 *  context.
 *
 *  @param {Function} fn the function to bind a new context to
 *  @param {Object} ctx the new 'this' context the function will be executed
 *      under
 *
 *  @return {Function} a new function that calls the supplied, under a new
 *      context
 *
 *  @public
 */
SMUtils.bind = function( fn, ctx ) {
    return function() {
        return fn.apply(ctx, arguments);
    };
};

/**
 *  Call a list of functions in order.
 *  <p>
 *  Passes the return value of the previous function to the next using
 *  'args._rv' (else <code>undefined</code>.
 *  <p>
 *  Passes the index of the function in the collection to the function as
 *  'args._i'.
 *  <p>
 *  Passes 'args' as the single argument to each called function.
 *
 *  @param fns a collection of functions to be called in order, traversed using
 *      SMUtils.each
 *  @param {Object} ctx the context under which each function is executed
 *
 *  @public
 */
SMUtils.chain = function( fns, ctx ) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    SMUtils.each( fns, function( i, n ) {
        n.apply(ctx,args);
    });
};

/**
 *  Clone a given DOM node, strip or set new ID and return it.
 *  <p>
 *  Polymorphic in the sense that the idOrObject argument can be the id of
 *  an element to clone or the object to clone itself. As the name suggests.
 *
 *  @param {String|Object} idOrObject the object to clone or the id of an
 *      object to fetch and clone
 *  @param  {String} [newID] newID to apply to the cloned object, note that
 *      if this is not supplied, the original id will be stripped
 *
 *  @return the timer ID (from setTimeout) for the given task just scheduled
 *      by calling this method
 *
 *  @public
 */
SMUtils.cloneAndStripID = function ( idOrObject, newID ) {
    var clonedNode = (typeof idOrObject === "string") ?
        $("#" + idOrObject).clone() : $(idOrObject).clone();
    if ( newID ) { clonedNode.attr( "id", newID); } else {
        clonedNode.removeAttr( "id"); }

    return clonedNode;
};

/**
 *  Determines if two values are the same.
 *  <p>
 *  Uses the <code>compare</code> function if it is defined on either
 *  argument else, the strict equality operator <code>===</code> is put
 *  to work.
 *  <p>
 *  Handles de-referencing jQuery instances. jQuery lists always compare
 *  <code>false</code>.
 *
 *  @param i a value to compare to 'j'
 *  @param j a value to compare to 'i'
 *
 *  @return {Boolean} <code>true</code> if the two values are equal,
 *      <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.compare = function( i, j ) {

    if ( i instanceof jQuery ) {
        if ( i.length !== 1 ) { return false; }
        i = i.get(0);
    }

    if ( j instanceof jQuery ) {
        if ( j.length !== 1 ) { return false; }
        j = j.get(0);
    }

    return (SMUtils.isDefinedNotNull( i) &&
        SMUtils.isDefinedNotNull( j) &&
        SMUtils.isDefinedNotNull( i.compare) &&
        SMUtils.isDefinedNotNull( j.compare) ) ?
            i.compare( j) && j.compare( i) : (i === j);
};

/**
 *  Returns <code>true</code> if a container contains an item.
 *
 *  @param {Object|Array} container the container to search
 *  @param {Object} item the item to locate
 *
 *  @return {Boolean} <code>true</code> if the item was found,
 *      <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.contains = function( container, item ) {
    return SMUtils.indexOf(container, item) !== -1;
};

/**
 *  Shallow copy properties from source to destination objects.
 *  <p>
 *  Copies neither, <code>undefined</code> nor prototypical, properties.
 *  <p>
 *  The source of property names to copy is given by the property names
 *  defined in 'args.dest' unless the optional 'args.props' argument is
 *  supplied, in which case it is used instead.
 *
 *  @param {Object} args
 *  @param {Object} args.src the property source
 *  @param {Object} args.dest the property destination
 *  @param {Object} [args.props] an alternative source of property names
 *
 *  @public
 */
SMUtils.copyInto = function( args ) {
    var val;
    SMUtils.each( SMUtils.isDefinedNotNull( args.props) ?
        args.props : args.dest, function( i, n ) {
        if ( args.src.hasOwnProperty( i) ) {
            val = args.src[ i];
            if ( val !== undefined ) { args.dest[ i] = val; }
        } }, this);
};

/**
 *  Shallow copy a list of named properties into a new {Object}.
 *  <p>
 *  Values are copied by assignment.
 *
 *  @param {Object} args
 *  @param args.src         the property value source to copy from
 *  @param args.fields      an interatable list of field names
 *
 *  @return a new {Object} with named properties copied from 'args.src'
 *
 *  @public
 *
 *  @deprecated
 */
SMUtils.copy = function( args ) {
    var dest = {};
    $(args.fields).each( function( i, o ) {
        dest[ o] = args.src[ o];
    });
    return dest;
};

/**
 *  Removes all non-word characters from a <code>String</code> value.
 *
 *  @param {String} value the value to remove all non-word characters from.
 *
 *  @return {String} <code>string</code> with all non-word characters removed
 *
 *  @public
 */
SMUtils.cullNonWordCharacters = function ( value ) {
    return value.replace( /[^a-zA-Z0-9\-]/g, "");
};

/**
 *  Determines if a collection defines a named property.
 *  <p>
 *  The property can be neither, prototypical nor <code>undefined</code>
 *  nor <code>null</code>.
 *
 *  @param args the object to check for the given property
 *  @param propertyName the name of the property to check for
 *
 *  @return {Boolean} <code>true</code> if the arguments do define the given
 *      property, <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.definesProperty = function( args, propertyName ) {
    return (args !== undefined) && (args.hasOwnProperty( propertyName)) &&
        SMUtils.isDefinedNotNull( args[ propertyName]);
};

/**
 *  Delete a named cookie by setting it as expired.
 *
 *  @param {String} name the name of the cookie to delete
 *
 *  @public
 */
SMUtils.deleteCookie = function( name ) {
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
};

/**
 *  Iterates over collection types and executes a callback for each value
 *  encountered.
 *  <p>
 *  An optional scope context can be provided which will provide the
 *  <code>this</code> for the callback function.
 *  <p>
 *  The callback function should have the following signature
 *  <strong>( i, n )</strong> : where 'i' is the propertyName of the item
 *  within its container (for objects and arrays and strings) and 'n' is the
 *  item.
 *
 *  @param {Object} collection the item to iterate over
 *  @param {Function} fn t§he callback function which will be called for each
 *      item
 *  @param {Object} [ctx] the scope under which to execute the callback.
 *
 *  @public
 */
SMUtils.each = function( collection, fn, ctx ) {
    if ( SMUtils.isDefinedNotNull( collection) ) {
        $.each( collection, SMUtils.isDefinedNotNull( ctx) ?
            SMUtils.bind( fn, ctx) : fn);
    }
};

/**
 *  Determines if a <code>String</code> value end with a given character
 *  sequence.
 *
 *  @param {String} value the sequence to test
 *  @param {String} postfix the terminating character sequence to test for
 *
 *  @return {Boolean} <code>true</code> if the given value is a postfix of
 *      'value', <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.endsWith = function( value, postfix ) {
    return SMUtils.isDefinedNotNull( value.match( postfix + "$"));
};


/**
 *  Adds a property name/value to an object if the value supplied is
 *  neither, <code>null</code> or <code>undefined</code>.
 *
 *  @param {Object} object the object to receive the new property
 *  @param value the candidate property value
 *  @param {String} name the candidate property name
 *
 *  @return {Object} the possibly modified object
 *
 *  @public
 */
SMUtils.extendIfDefined = function ( object, value, name ) {
    if ( SMUtils.isDefinedNotNull( value) ) { object[ name] = value; }
    return object;
};


/**
 *  Returns the index of the first item in an ordered collection that satisfies
 *  a discriminating function.
 *
 *  @param {Object} collection the collection to search
 *  @param {Function} fn a function with the signature <code>( i, n )</code>
 *      that should return <code>true</code> if the given element 'n' satisfies
 *      the desired criteria; 'i' is the index {Number} of the item in its
 *      container
 *
 *  @return {Number} the index of the first satisfying index else
 *      <code>-1</code>
 *
 *  @public
 */
SMUtils.find = function( collection, fn ) {
    var index = -1;
    if ( this.isDefinedNotNull( collection) ) {
        SMUtils.each( collection, function( i, n ) {
            if ( fn( i, n ) === true ) {
                index = i;
                return false;
            }
        });
    }
    return index;
};

/**
 *  Takes a string value, splits it using a delimiter (or the default
 *  <code>""</code>) and returns the first token that starts with a given
 *  prefix.
 *  <p>
 *  The value returned is the matching token less the prefix.
 *
 *  @param {Object} args
 *  @param args.value the value to process
 *  @param args.prefix the prefix to search amongst the tokens for
 *  @param args.delimiter the delimiter to use to split up the value
 *
 *  @public
 */
SMUtils.firstTokenWithPrefix = function( args ) {
    var returnValue = null;
    var delimiter = args.delimiter != null ? args.delimiter : " ";
    if ( args.prefix === '' ) {
        return null;
    }
    $(args.value.split( delimiter)).each( function() {
        var trimmedValue = SMUtils.trim( this);
        if ( (returnValue == null) &&
            SMUtils.startsWith( trimmedValue, args.prefix)) {
            returnValue = trimmedValue.substring(
                args.prefix.length, trimmedValue.length);
        }
    });

    return returnValue;
};

/**
 *  Focuses the child of 'args.parent' with a given or default tab index.
 *
 *  @param args
 *  @param args.element only children of this element will be considered for
 *      focusing
 *  @param [args.index] (default <code>0</code>) the tab index of the child to
 *      attempt to focus
 *
 *  @public
 *
 *  @test
 *
 *  @todo work any conditions about disabled controls
 */
SMUtils.focusTabChild = function( args ) {
    var element = $("[tabindex='" +
        (typeof args.index !== 'number' ? 0 : args.index) + "']", args.parent);
    if ( SMUtils.isDefinedNotNull(element) ) { $(element).focus(); }
};

/**
 *  Format a <code>String</code> using a template and variable context.
 *  <p>
 *  "foo bar {0} {sausages} bar foo fnar {fnar}" with the following
 *  values 0:->1, sausages->hello, fnar->pixie yeilds,
 *  "foo bar 1 hello bar foo fnar pixie".
 *  <p>
 *  Substituted values are read from the context using the name they have
 *  in the format string, so '0', 'sausages' etc.
 *
 *  @param {Object|Array} context the source of values substituted by name into
 *      the format string
 *
 *  @return {String} the same or a modified version of the string this method is
 *      called for with portions substituted as described above
 *
 *  @public
 */
SMUtils.format = function( value, context ) {
    return value.replace( new RegExp( "{(\\d*|\\w*)}", "g"),
        function(match) {
            return context[ match.substring( 1, match.length - 1)];
        });
};

/**
 *  Returns a named cookie's value.
 *  <p>
 *  The cookie's value is processed using <code>unescape( ... )</code>
 *  before being returned.
 *
 *  @param {String} name the name of the cookie of which to return its value
 *
 *  @return {String} the 'un-escaped' named cookie value, else
 *      <code>null<code>
 *
 *  @public
 */
SMUtils.getCookie = function( name ) {
    var results = document.cookie.match( '(^|;) ?' + name + '=([^;]*)(;|$)');
    if ( results ) {
        var result = results[ 2];
        if ( result.indexOf( "\"") !== -1 ) {
            var length = result.length;
            result = result.substring( 1, length - 1);
            result = SMUtils.replaceAll( result, "\\\\\"", "\"");
        }
        if ( SMUtils.trim(result).length > 0 ) {
            return unescape( result);
        }
    }
    return null;
};

/**
 *  Returns a node's named data attribute value.
 *
 *  @param {Element} node the node to extract the named data attribute from
 *  @param {String} name the name of the data attribute to retrieve
 *
 *  @return a {String} representation of the given node's named data
 *      attribute (if it exists) else <code>undefined</code>
 *
 *  @public
 */
SMUtils.getDataAttr = function( node, name ) {
    var rv =  $(node).data( name);
    return SMUtils.isDefinedNotNull( rv) ? (rv + "") : undefined;
};

/**
 *  Fade an element to a given opacity and optionally hide it.
 *  <p>
 *  If the opacity is specified as '0' then the element will be hidden.
 *
 *  @param {Element} object the object to fade in or out
 *  @param {Number} msTime the time in milli-Seconds to take to do the fade
 *  @param {Number} opacity the final desired opacity (0 to 100 inclusive)
 *
 *  @public
 */
SMUtils.fadeHide = function(object, msTime, opacity) {
    if ( opacity === 0 ) {
        object.fadeTo( msTime, opacity, function() { object.hide(); });
    } else { object.show().fadeTo( msTime, opacity); }
};


/**
 *  Return the current window's location (minus any anchor portion) with an
 *  optional new anchor.
 *
 *  @param {String} [anchor] the new anchor to apply
 *
 *  @return {String} the current window's location with no, or a new anchor
 *      portion
 *
 *  @public
 *
 *  @test
 */
SMUtils.getLocation = function( anchor ) {
    var url = location.toString();
    var indexOfHash = url.toString().indexOf( "#");
    if ( indexOfHash > 0 ) {
        url = url.toString().substring( 0, indexOfHash);
    }
    return url + (SMUtils.isDefinedNotNull( anchor) ? ('#' + anchor) : '');
};

/**
 *  Is the given <code>String</code> value prefixed by a given stem.
 *  <p>
 *  'Stem' can be a regular expression pattern.
 *
 *  @param value the value to test
 *  @param stem the candidate prefix for the given value
 *
 *  @return {Boolean} <code>true</code> if the given <code>String</code> is
 *      prefixed, by the given stem, <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.hasPrefix = function ( value, stem ) {
    return  (stem.length > 0) &&
        ((value = value.match( "^" + stem)) !== null) &&
            (value.toString() === stem);
};

/**
 *  Determines the index of an item with a container.
 *  <p>
 *  Returns the <code>Number</code> array index, OR {String} property name
 *  of the given item relative to its container if the item was found else
 *  <code>undefined</code>.
 *
 *  @param container {Object|Array} container the item collection
 *  @param item item the element for which to determine its index
 *
 *  @return the index of the item in its container else
 *
 *  @public
 */
SMUtils.indexOf = function( container, item, index ) {
    index = -1;
    SMUtils.each( container, function( i, o ) {
        if ( SMUtils.compare( o, item ) ) {
            index = i;
            return false;
        }
    }, this);
    return index;
};

/**
 *  Execute a function after a given delay.
 *
 *  @param {Function} fn the function to call after the specified time
 *      delay
 *  @param {Number} delay the time delay (in milli-Seconds) to wait before
 *      calling the function
 *
 *  @return the timer ID (from setTimeout) for the given task just scheduled
 *      by calling this method
 *
 *  @public
 */
SMUtils.invokeLater = function( fn, delay ) {
    return setTimeout( function() { fn(); }, delay);
};

/**
 *  Determines if an element is attached to the DOM or not.
 *
 *  @param ref a DOM element to check for being attached
 *
 *  @return {Boolean} <code>true</code> if the element is attached,
 *      <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.isAttached = function( node ) {
    return $(node).parents(':last').is('html');
};

/**
 *  Determines if the given value is an empty or blank <code>String</code>.
 *
 *  @param {String} value the value to check
 *
 *  @return {Boolean} <code>true</code> if the given argument is just
 *      whitespace, <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.isBlank = function( value ) {
    return SMUtils.trim(value) === '';
};

/**
 *  Determines if a value is neither, <code>undefined</code> nor
 *  <code>null</code>?
 *
 *  @param value the value to check
 *
 *  @return {Boolean} <code>true</code> if the value is neither,
 *      <code>undefined</code> nor <code>null</code>,
 *      <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.isDefinedNotNull = function( value ) {
    return (value !== undefined) && (value !== null);
};

/**
 *  Removes all non-prototype properties from an object.
 *
 *  @param {Object} object the object to remove the property from
 *
 *  @return {Object} the possibly modified 'object'
 *
 *  @public
 */
SMUtils.removeAllProperties = function( object ) {
    SMUtils.each(object, function(i, n) { SMUtils.removeProperty(object, i); });

};

/**
 *  Removes a named property from an object if it exists and is non
 *  prototypical.
 *
 *  @param {Object} object the object to remove the property from
 *  @param {String} propName the name of the property to remove
 *
 *  @return {Boolean} <code>true</code> if the property was defined and was
 *      removed, <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.removeProperty = function( object, propName ) {
    return object.hasOwnProperty( propName) && delete object[ propName];
};

/**
 *  Change the hosting window's location to a new value.
 *
 *  @param {String} url the new URL to navigate to
 *
 *  @public
 */
SMUtils.redirect = function ( url ) { window.location = url; };

/**
 *  Replace all character sequences that match the pattern
 *      <code>search</code> with the <code>replacement</code> pattern.
 *
 *  @param {String} text the text to search for replacement characters
 *  @param {String} search the search pattern to apply
 *  @param {String} replacement the replacement pattern to apply
 *
 *  @return {String} a new <code>String</code> with any character sequences that
 *      matched <code>search</code> transformed using <code>replacement</code>
 *
 *  @public
 */
SMUtils.replaceAll = function( text, search, replacement )  {
    return text.replace( new RegExp( search,"g"), replacement);
};

/**
 *  Replace matching character-sequences in a given <code>String</code> with
 *  values returned from 'replacementFunction'.
 *
 *  @param {String} dataString
 *  @param {String} pattern
 *  @param {Function} replacementFunction
 *
 *  @public
 *
 *  @todo test
 */
SMUtils.replaceWithTemplate = function ( dataString, pattern,
    replacementFunction ) {
    var result = '';
    var matchIndex;
    var u;
    while (matchIndex !== -1) {
        matchIndex = dataString.search(pattern);

        if (matchIndex > 0) {
            result += dataString.substring(0, matchIndex);
            dataString = dataString.slice(matchIndex);
        }
        if (matchIndex !== -1) {
            u = pattern.exec(dataString);
            result += replacementFunction.call(u);
            dataString = dataString.slice(u[0].length);
        } else {
            result += dataString;
        }
    }
    pattern.lastIndex = 0;
    return result;
};

/**
 *  Replaces a given string's postfix.
 *  <P>
 *  If 'text' does not end with 'postfix', it remains unaltered.
 *
 *  @param {String} text the text that ends with a given prefix
 *  @param {String} postfix the postfix of 'text' to replace
 *  @param {String} replacement the replacement postfix text
 *
 *  @return the possibly modified version of 'text'
 *
 *  @public
 */
SMUtils.replacePostfix = function( text, postfix, replacement ) {
    var textLength = text.length;
    var postfixLength = postfix.length;
    var index = text.lastIndexOf( postfix);
    return ( (index !== -1) && ((textLength - index) === postfixLength) ) ?
        (text.substring( 0, index) + replacement) : text;
};

/**
 *  Resets the given form element.
 *
 *  @param {jQuery} the form element to reset
 *
 *  @public
 */
SMUtils.resetForm = function( form ) { form[0].reset(); };

/**
 *  Displays a centered pop-up window with content from the given URL.
 *
 *  @param {Object} url the (typically HTTP) url to navigate the pop-up
 *      window to
 *  @param {Object} id the id value to pass to <code>window.open</code>
 *  @param {String|Number} w the width of the new window (in pixels)
 *  @param {String|Number} h the height of the new window  (in pixels)
 *
 *  @public
 */
SMUtils.showCenteredPopupWindow = function( url, id, w, h ) {
    window.open( url, id, SMUtils.format(
        'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,' +
            'resizable=0,width={0},height={1},left={2},top={3}',
        [w, h, ((screen.width - w) * 2), ((screen.height - h) * 2)]));
};

/**
 *  Execute a callback function for each token of a split
 *  <code>String</code>.
 *  <p>
 *  The value is converted to a <code>String</code> and then split, using
 *  either a supplied delimiter or the default delimiter, " ".
 *
 *  @param value converted to a <code>String</code> and then split
 *  @param {Function} callback a function with the following signature
 *  <code>( i, token )</code> - where i is the index of the token
 *      (zero based), and token is the current token
 *  @param {String} [delimiter] a delimiter used to split 'object's
 *
 *  @public
 */
SMUtils.splitEach = function( value, callback, delimiter ) {
    var breakOut = false;
    SMUtils.each( (value + "").split( SMUtils.isDefinedNotNull( delimiter) ?
        delimiter : " "), function( i, token ) {
            if ( SMUtils.trim(token) !== '' ) {
                breakOut = breakOut || (callback( token) === false);
                return !breakOut;
            }
    });
};

/**
 *  Determines if a <code>String</code> value start with a given character
 *  sequence.
 *
 *  @param {String} value the sequence to test
 *  @param {String} prefix the initial character sequence to test for
 *
 *  @return {Boolean} <code>true</code> if the given value is a postfix of
 *      'value', <code>false</code> otherwise
 *
 *  @public
 */
SMUtils.startsWith = function( value, prefix ) {
    return SMUtils.isDefinedNotNull( value.match( "^" + prefix));
};

/**
 *  Execute a callback after a specified timeout.
 *  <p>
 *  Timers are referenced using <code>String</code> identifiers.
 *  <p>
 *  Timer's can be stopped from executing using {@link SMUtils.stopTimer}.
 *
 *  @param  {Object} args
 *  @param  {String} args.id the id of the timer
 *  @param  {String} args.timeout the timeout wait before executing the
 *      callback
 *  @param  args.callback a function to execute after the given timeout has
 *      expired
 *  @param  {Object} args.data an object reserved for this function's use,
 *      used to store state information (the internal JavaScript timer ID)
 *
 *  @see SMUtils.stopTimer
 *
 *  @public
 */
SMUtils.startTimer = function( args ) {
    if ( SMUtils.isDefinedNotNull( args.data[ args.id]) ) {
        SMUtils.stopTimer( args);
    }
    args.data[ args.id] = window.setTimeout( args.callback, args.timeout);
};

/**
 *  Stops a timed callback from executing.
 *  <p>
 *  This function is the 'inverse' of {@link SMUtils.startTimer}.
 *
 *  @param {Object} args
 *  @param {String} args.id the identifier of the timer to stop
 *  @param {Object} args.data the data block passed when this timer was
 *      created using {@link SMUtils.startTimer}
 *
 *  @see SMUtils.stopTimer
 *
 *  @public
 */
SMUtils.stopTimer = function( args ) {
    if ( SMUtils.isDefinedNotNull( args.data[ args.id]) ) {
        clearTimeout( args.data[ args.id]);
        delete args.data[ args.id];
    }
};

/**
 *  Strip the query-parameters portion of a url, if present.
 *  <p>
 *  This function has no effect if no query parameters are present in the
 *  input url.
 *
 *  @param {String} url <code>toString()</code> implementing reference
 *
 *  @return 'url' with any query parameters information removed
 *
 *  @public
 */
SMUtils.stripQueryParameters = function( url ) {
    url = url.toString();
    var index = url.indexOf( "?");
    return index !== -1 ? url.substring( 0, index) : url;
};

/**
 *  Trim leading and terminal whitespace from a <code>String</code>.
 *
 *  @param {String} value the value to trim and return
 *
 *  @return {String} the trimmed version of the given argument
 *
 *  @public
 */
SMUtils.trim = function( value ) {
    return value.replace(/^\s+|\s+$/g, '');
};

/**
 *  Walk a DOM tree (TBLR) staring with element 'node'.
 *  <P>
 *  A given node's children are visited only iff the callback function
 *  'callback' for the given parent return <code>true</code>.
 *
 *  @param {Element} node the first node to visit
 *  @param {Function} callback a function with the signature,
 *      <code>({Element})</code> that will be called for every node visited (
 *      starting with 'node'). To stop the walk at any given element, return
 *      a non <code>true</code> value.
 *
 *  @public
 */
SMUtils.walkDOM = function( node, callback ) {
    if (callback(node) === true) {
        SMUtils.each( $(node).children(), function( i, n ) {
            SMUtils.walkDOM( n, callback); }, this);
    }
};

/**
 *  Sets all time fields of a given <code>Date</code> instance to <code>0</code>.
 *  <p>
 *  Affects the: hours, minutes, seconds and milliseconds fields.
 *
 *  @param {Date} date the date instance to 'zero'.
 *
 *  @return {Date} the same instance passed in, with all time fields set to <code>0</code>
 *
 *  @public
 */
SMUtils.zeroTime = function( date ) {
    date.setHours( 0);
    date.setMinutes( 0);
    date.setSeconds( 0);
    date.setMilliseconds( 0);
    return date;
};

var smUtils = new SMUtils();