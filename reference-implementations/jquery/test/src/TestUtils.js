function SMTestUtils(){};

SMTestUtils.countOwnProps = function( object ) {
    var index;
    var count = 0;
    for ( index in object ) {
        if ( object.hasOwnProperty( index) ) { count++; }
    }
    return count;
};

SMTestUtils.walk = function walk(node, func) {
    func( node);
    var children = $(node).children();
    for ( var index = 0; index < children.length; index++ ) {
        walk( children[ index], func);
    }
};

SMTestUtils.isJQueryObject = function( object ) {
    return object instanceof jQuery;
};

SMTestUtils.isEmptyObject = function( object ) {
    var count;
    var index;
    if ( !isObject( object) ) { return false; }
    if ( countOwnProps( object) > 0 ) { return false; }
    return true;
};

SMTestUtils.isFunction = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    return typeof object === 'function';
};

SMTestUtils.isObject = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Object') < 0) { return false; }
    return true;
};

SMTestUtils.isEmptyArray = function( object ) {
    if ( !isArray( object) ) { return false; }
    return object.length === 0;
};

SMTestUtils.isArray = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Array') < 0) { return false; }
    return true;
};



SMTestUtils.dataTest = function( args ) {
    if ( args.nodes ) {
        $.each( args.nodes, function( i, nodeInfo ) {
            $(nodeInfo.nodes).appendTo(nodeInfo.target ? nodeInfo.target :
                $('body'));
        });
    }
    try {
        args.callback();
    } finally {
        if ( args.nodes ) {
            $.each( args.nodes, function( i, nodeInfo ) {
                $(nodeInfo.nodes).remove();
            });
        }
    }
};


/**
 *  Test helper function that 'appendTo's nodes to a the DOM, calls a callback
 *  and then removes them again.
 *  <p>
 *  Useful for unit testing w/o altering the document b/w test invocations.
 *
 *  @params args.context    the context in which to call the callback (optional)
 *
 *  @params args.callback   a callback function that will be called with no
 *                          arguments after the nodes have been added and before
 *                          deletion
 *
 *  @params args.nodes      an array of objects of the following format:
 *
 *                              {
 *                                  target: jQuery node,
 *                                  nodes:  jQuery nodes
 *                              }
 *
 *                          At the start of the test, 'nodes' are appended to
 *                          node 'appendTo' and at the end of the test, removed.
 *
 *  @params args.globals    an object with keys as global property name and values:
 *
 *                              {
 *                                  replacement: function to replace existing with.
 *                              }
 *
 *
 */
SMTestUtils.dataTest = function( args ) {
    SMUtils.each( args.nodes, function( i, nodeInfo ) {
        $(nodeInfo.nodes).appendTo(nodeInfo.target ? nodeInfo.target :
            $('body'));
    });
    try {
        SMUtils.each( args.globals, function( i, varInfo ) {
            args.globals[ i].cached = window[ i];
            window[ i] = varInfo.replacement;});
        try {
            args.callback();
        } finally {
            SMUtils.each( args.globals, function( i, varInfo ) {
                window[ i] = varInfo.cached;});
        }
    } finally {
        SMUtils.each(args.nodes, function( i, nodeInfo ) {
            $(nodeInfo.nodes).remove();
        });

    }
};

SMTestUtils.walk = function walk(node, func) {
    func( node);
    var children = $(node).children();
    for ( var index = 0; index < children.length; index++ ) {
        walk( children[ index], func);
    }
};

SMTestUtils.randomString = function( alphabet, length ) {
    var i;
    var numChars = alphabet.length;
    var text = "";
    for ( i = 0; i < length; i++ ) {
        text += alphabet.charAt( Math.floor( Math.random() * numChars));
    }
    return text;
};

SMTestUtils.intInclusive = function( from, to ) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

SMTestUtils.replaceAt = function( value, index, char ) {
    return value.substr(0, index) + char + value.substr( index);
};

SMTestUtils.arrayCompare = function( array1, array2 ) {
    var i;
    if ( array2.length !== array1.length ) { return false; }
    for ( i = 0; i < array1.length; i++ ) {
        if ( (array2[i].compare && !array2[i].compare(array1[i])) ||
            (array2[i] !== array1[i]) ) { return false; }
    }
    return true;
};

SMTestUtils.setPatternConverter = function( horn, converterName, pattern ) {
    pattern = hornConverter.toRegularExpression( pattern);
    if ( converterName === 'IntegerConverter' ) {
        horn.option( "converter", function( args ) {
            if ( (args.path.match( pattern).toString() === args.path) ) {
                return args.type === 'fromText' ? parseInt( args.value) :
                    args.value.toString();
            }
        });
    } else if ( converterName === 'BooleanConverter' ) {
        horn.option( "converter", function( args ) {
            if ((args.path.match( pattern).toString() === args.path) &&
                (args.type !== 'fromJSON') ) {
                return args.type === 'fromText' ?
                    (args.value.toLowerCase() === 'true') : (args.value + "");
            }
        });
    } else if ( converterName === 'DateConverter' ) {
        horn.option( "converter", function( args ) {
            if ( (args.path.match( pattern).toString() === args.path) &&
                (args.type !== 'fromJSON') ) {
                return args.type === 'fromText' ?
                    $.datepicker.parseDate( "yy-mm-dd", value) :
                    $.datepicker.formatDate( "yy-mm-dd", value);
            }
        });
    }
};