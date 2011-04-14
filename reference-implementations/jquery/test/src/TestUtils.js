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

var dataTest = function( name, bodyNodes, dataCallback, headNodes, storeBackRefs, passConverters ) {
    var body = $('body');
    var head = $('head');
    if ( bodyNodes != null ) {
        jQuery.each( bodyNodes, function(i, n) {$(n).appendTo(body);});
    }
    if ( headNodes != null ) {
        jQuery.each( headNodes, function(i, n) {$(n).appendTo(head);});
    }
    try {
        var horn = new Horn();
        horn.name = name;
        var opts = {storeBackRefs: storeBackRefs === true};
        if ( passConverters ) {
            opts.converters = {
                HornIntegerConverter: function () {
                    this.toScreen = function( value ) {
                        return value.toString();
                    }
                    this.fromScreen = function( value ) {
                        return parseInt( value);
                    }
                },
                HornBooleanConverter: function () {
                    this.toScreen = function( value ) {
                        return value + "";
                    }
                    this.fromScreen = function( value ) {
                        return value.toLowerCase() === 'true';
                    }
                },
                HornDateConverter: function () {
                    this.toScreen = function( value ) {
                        return $.datepicker.formatDate( "yy-mm-dd", value);
                    }
                    this.fromScreen = function( value ) {
                        return $.datepicker.parseDate( "yy-mm-dd", value);
                    }
                }
            };
        }
        dataCallback( horn.parse(opts), horn);
        horn.populate();
    } finally {
        if ( bodyNodes != null ) {
            jQuery.each( bodyNodes, function(i, n) {$(n).remove();});
        }
        if ( headNodes != null ) {
            jQuery.each( headNodes, function(i, n) {$(n).remove();});
        }
    }
};