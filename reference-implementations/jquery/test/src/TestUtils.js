var isAttached = function( node ) {
    return $(node).parents().length !== 0;
};

var countOwnProps = function( object ) {
    var index;
    var count = 0;
    for ( index in object ) { if ( object.hasOwnProperty( index) ) { count++; } }
    return count;
};

var isEmptyObject = function( object ) {
    var count;
    var index;
    if ( !isObject( object) ) { return false; }
    if ( countOwnProps( object) > 0 ) { return false; }
    return true;
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
}

var isArray = function( object ) {
    if ( object === undefined ) { return false; }
    if ( object === null ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Array') < 0) { return false; }
    return true;
};

var dataTest = function( args ) {
    if ( args.nodes ) {
        $.each( args.nodes, function( i, nodeInfo ) {
            $(nodeInfo.nodes).appendTo(nodeInfo.target ? nodeInfo.target : $('body'));
        });
    }
    try {
        var horn = new Horn();
        if ( args.passConverters === true ) {
            horn.option( 'converter', 'IntegerConverter',
                function () {
                    this.toText = function( value ) {
                        return value.toString();
                    }
                    this.fromText = function( value ) {
                        return parseInt( value);
                    }
                });

            horn.option( 'converter', 'BooleanConverter',
                function () {
                    this.toText = function( value ) {
                        return value + "";
                    }
                    this.fromText = function( value ) {
                        return value.toLowerCase() === 'true';
                    }
                });

                horn.option( 'converter', 'DateConverter',
                function () {
                        this.toText = function( value ) {
                            return $.datepicker.formatDate( "yy-mm-dd", value);
                        }
                        this.fromText = function( value ) {
                            return $.datepicker.parseDate( "yy-mm-dd", value);
                        }
                    });
        }
        args.callback( horn);
    } finally {
        if ( args.nodes ) {
            $.each( args.nodes, function( i, nodeInfo ) {
                $(nodeInfo.nodes).remove();
            });
        }
    }
};