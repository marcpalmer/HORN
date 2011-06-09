var isAttached = function( node ) {
    return $(node).parents().length !== 0;
};

var countOwnProps = function( object ) {
    var index;
    var count = 0;
    for ( index in object ) { if ( object.hasOwnProperty( index) ) { count++; } }
    return count;
};

var isJQueryObject = function( object ) {
    return object instanceof jQuery;
};

var isEmptyObject = function( object ) {
    var count;
    var index;
    if ( !isObject( object) ) { return false; }
    if ( countOwnProps( object) > 0 ) { return false; }
    return true;
};

var isFunction = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    return typeof object === 'function';
};

var isObject = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Object') < 0) { return false; }
    return true;
};

var isEmptyArray = function( object ) {
    if ( !isArray( object) ) { return false; }
    return object.length === 0;
};

var isArray = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Array') < 0) { return false; }
    return true;
};

var setPatternConverter = function( horn, converterName, pattern ) {
    if ( converterName === 'IntegerConverter' ) {
        horn.option( "converter", function( args ) {
            if ( pattern.match( args.path) ) {
                return args.type === 'fromText' ? parseInt( args.value) :
                    args.value.toString();
            }
        });
    } else if ( converterName === 'BooleanConverter' ) {
        horn.option( "converter", function( args ) {
            if ( pattern.match( args.path) ) {
                return args.type === 'fromText' ? (args.value.toLowerCase() === 'true') : (args.value + "");
            }
        });
    } else if ( converterName === 'DateConverter' ) {
        horn.option( "converter", function( args ) {
            if ( pattern.match( args.path) ) {
                return args.type === 'fromText' ? $.datepicker.parseDate( "yy-mm-dd", value) : $.datepicker.formatDate( "yy-mm-dd", value);
            }
        });
    }
};

var dataTest = function( args ) {
    if ( args.nodes ) {
        $.each( args.nodes, function( i, nodeInfo ) {
            $(nodeInfo.nodes).appendTo(nodeInfo.target ? nodeInfo.target : $('body'));
        });
    }
    try {
        args.callback( new Horn());
    } finally {
        if ( args.nodes ) {
            $.each( args.nodes, function( i, nodeInfo ) {
                $(nodeInfo.nodes).remove();
            });
        }
    }
};