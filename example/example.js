

    var bindings = {};
    var maxID = -1;

    var DATE_FORMAT = "dd MM yy";

    var makeID = function () {
        return "hi_" + (++maxID);
    };

    var isArray = function( object ) {
        if ( object === undefined ) { return false; }
        if ( object === null ) { return false; }
        if ( typeof object !== 'object' ) { return false; }
        if ( object.constructor.toString().indexOf( 'Array') < 0) { return false; }
        return true;
    };

    var isObject = function( object ) {
        if ( object === undefined ) { return false; }
        if ( object === null ) { return false; }
        if ( typeof object !== 'object' ) { return false; }
        if ( object.constructor.toString().indexOf( 'Object') < 0) { return false; }
        return true;
    };

    var converterNameForNode = function( node ) {
        node = $(node);
        if ( node.hasClass( 'numberValue') ) {
            return "IntegerConverter";
        }

        if ( node.hasClass( 'dateValue') ) {
            return "DateConverter";
        }

        if ( node.hasClass( 'booleanValue') ) {
            return "BooleanConverter";
        }

        return null;
    };

    var indent = function ( count ) {
        var rv = '';
        while ( count-- > 0 ) { rv += '&nbsp;&nbsp;&nbsp;&nbsp;'; }
        return rv;
    };

    var span = function ( text, classAttribute ) {
        return '<span' + ((classAttribute !== undefined) ? (' class=\'' +
            classAttribute.toString() + '\'') : '') + '>' + text + '</span>';
    };

    var input = function ( value, type, id ) {
        var insert = (type ? "Value" : "");
        return "<input value='" + value + "' class='dynamic " + type + insert +
            "'  id='" + id + "' type='text'/>";
    };


    var render = function ( object, ind, parent, pk ) {
        var rv;
        var isO = isObject( object);
        var isA = isArray( object);
        if ( ind === undefined ) { ind = 0; }
        if ( isO || isA ) {
            rv = (isA ? "[" : "{") + "<br/>"
            horn.each( object, function( key, value ) {
                rv +=   indent( ind + 1) + "\"" + key + "\": " +
                        render( value, ind + 1, object, key) + ",<br/>";
            });
            rv += indent( ind) + (isA ? "]" : "}");
            return  rv;
        } else {
            rv = typeof object;
            isO = makeID();
            isA = "";

            if ( object instanceof Date ) { rv = 'date'; }
            if ( rv === 'string' ) { isA = "\"" + input( object, null, isO) + "\""; } else
            if ( rv === 'boolean' ) { isA = input( object ? "Yes" : "No", rv, isO); } else
            if ( rv === 'number' ) { isA = input( object, rv, isO); } else
            if ( rv === 'date' ) { isA = input( $.datepicker.formatDate( DATE_FORMAT, object), rv, isO); }
            if ( isA !== "" ) { bindings[ isO] = {parent: parent, pk: pk, type: rv + "Value"}; }
            return isA;
        }
    };

//    horn = new Horn();

    window.horn.option( 'converter', 'IntegerConverter',
        function () {
            this.toText = function( value ) { return value.toString(); };
            this.fromText = function( value ) { return parseInt( value); };
        });

    window.horn.option( 'converter', 'BooleanConverter',
        function () {
            this.toText = function( value ) {
                return value ? "Yes" : "No";
            };
            this.fromText = function( value ) {
                return value.toLowerCase() == 'yes';
            };
        });

    window.horn.option( 'converter', 'DateConverter',
        function () {
            this.toText = function( value ) {
                return $.datepicker.formatDate( DATE_FORMAT, value);
            };
            this.fromText = function( value ) {
                return $.datepicker.parseDate( DATE_FORMAT, value);
            };
        });

    window.horn.option( 'pattern', '.*Date', 'DateConverter');
    window.horn.option( 'pattern', '.*pages', 'IntegerConverter');
    window.horn.option( 'pattern', '.*price', 'IntegerConverter');

$(function() {
    $('#formattedOutput').html( render( window.horn.getModel() ));
    $('.dynamic').change( function( event ) {
        var obj = $(this);
        var binding = bindings[ obj.attr('id')];
        var converterName = converterNameForNode(obj);
        var val = horn.convert( obj.val(), converterName, true);
        binding.parent[ binding.pk] = val;
    });
    $('.dateValue').datepicker({dateFormat: DATE_FORMAT});
    $('a.populateButton').click( function( event ) { horn.render(); event.stopPropagation(); });
});