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

    hornConverter.addConverter( {
        name: "BooleanConverter",
        converter: function( args ) {
            return args.type === 'fromText' ?
                value.toLowerCase() === 'yes' :
                (args.value === true ? "Yes" : "No");
        }});

    hornConverter.addConverter( {
        name: "DateConverter",
        converter: function( args ) {
            return args.type === 'fromText' ?
                $.datepicker.parseDate( DATE_FORMAT, args.value) :
                ($.datepicker.formatDate( DATE_FORMAT, args.value));
    }});

    hornConverter.addPattern( { pattern: '.*Date', converterName: 'DateConverter'});
    hornConverter.addPattern( { pattern: '.*pages', converterName: 'IntegerConverter'});
    hornConverter.addPattern( { pattern: '.*price', converterName: 'IntegerConverter'});

$(function() {
    $('#formattedOutput').html( render( horn.model() ));
    $('.dynamic').change( function( event ) {
        var obj = $(this);
        var binding = bindings[ obj.attr('id')];
        var converterName = converterNameForNode(obj);
        var converter;
        if ( !converterName ) {
            binding.parent[ binding.pk] = obj.val();
        } else {
            converter = hornConverter.getConverter({name: converterName});
            convertedValue = converter( {type: 'fromText', value: obj.val()});
            binding.parent[ binding.pk] = convertedValue;
        }
    });
    $('.dateValue').datepicker({dateFormat: DATE_FORMAT});
    $('a.refreshButton').click( function( event ) {
        $('.changed').removeClass('changed');
        var affected = horn.updateDOM();
        $(affected).addClass('changed');
        event.stopPropagation();
        return false;
    });
});