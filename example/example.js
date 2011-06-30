function HornExample() {

    var inputValues = {};
    var bindings = {};
    var maxID = -1;

    var indent = function ( count ) {
        var rv = '';
        while ( count-- > 0 ) { rv += '&nbsp;&nbsp;&nbsp;&nbsp;'; }
        return rv;
    };

    var input = function ( value, type, id ) {
        var insert = (type ? (type + "Value") : "");
        inputValues[ id] = value;
        return "<input class='dynamic " + insert +
            "'  id='" + id + "' type='text'/>";
    };

    var makeID = function () { return "sm_" + (++maxID); };

    var renderHTML = function ( object, ind, parent, pk ) {
        var rv;
        var isO = HornExample.isObject( object);
        var isA = HornExample.isArray( object);
        if ( ind === undefined ) { ind = 0; }
        if ( isO || isA ) {
            rv = (isA ? "[" : "{") + "<br/>";
            SMUtils.each( object, function( key, value ) {
                rv +=   indent( ind + 1) + "\"" + key + "\": " +
                        renderHTML( value, ind + 1, object, key) + ",<br/>";
            });
            rv += indent( ind) + (isA ? "]" : "}");
            return  rv;
        } else {
            rv = typeof object;
            isO = makeID();
            isA = "";
            if ( object instanceof Date ) { rv = 'date'; }
            if ( rv === 'string' ) {
                isA = "\"" + input( object, null, isO) + "\"";
            } else if ( rv === 'boolean' ) {
                isA = input( object ? "Yes" : "No", rv, isO);
            } else if ( rv === 'number' ) {
                isA = input( object, rv, isO);
            } else
            if ( rv === 'date' ) {
                isA = input( $.datepicker.formatDate(
                    HornExample.DATE_FORMAT, object), rv, isO);
            }

            if ( isA !== "" ) {
                bindings[ isO] = {parent: parent, pk: pk, type: rv + "Value"};
            }

            return isA;
        }
    };

    var span = function ( text, classAttribute ) {
        return '<span' + ((classAttribute !== undefined) ? (' class=\'' +
            classAttribute.toString() + '\'') : '') + '>' + text + '</span>';
    };

    this.binding = function( id ) {
        return bindings[ id];
    };

    this.render = function ( target, hornModel ) {
        target.html( renderHTML( hornModel));
        SMUtils.each( inputValues, function( i, n ) {
            $('#' + i).val( n);
        });
    };
}

HornExample.DATE_FORMAT = "dd MM yy";

HornExample.isArray = function( object ) {
    if ( !SMUtils.isDefinedNotNull( object) ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Array') < 0) { return false; }
    return true;
};

HornExample.isObject = function( object ) {
    if ( !SMUtils.isDefinedNotNull( object) ) { return false; }
    if ( typeof object !== 'object' ) { return false; }
    if ( object.constructor.toString().indexOf( 'Object') < 0) { return false; }
    return true;
};

HornExample.converterNameForNode = function( node ) {
    node = $(node);
    if ( node.hasClass( 'numberValue') ) { return "Integer"; }
    if ( node.hasClass( 'dateValue') ) { return "Date"; }
    if ( node.hasClass( 'booleanValue') ) { return "BooleanYesNo"; }
    return null;
};

hornConverter.add( "BooleanYesNo", function( args ) {
    return args.type === 'fromText' ?
        value.toLowerCase() === 'yes' :
        (args.value === true ? "Yes" : "No");});

hornConverter.add( "Date", function( args ) {
    return args.type === 'fromText' ?
        $.datepicker.parseDate( HornExample.DATE_FORMAT, args.value) :
        ($.datepicker.formatDate( HornExample.DATE_FORMAT, args.value));});

hornConverter.pattern( '*.*Date', 'Date');
hornConverter.pattern( '*.*pages', 'Integer');
hornConverter.pattern( '*.*price', 'Integer');

hornExample = new HornExample();

$(function() {
    hornExample.render( $('#formattedOutput'), horn.model());
    $('.dynamic').change( function( event ) {
        var converter;
        var obj = $(this);
        var binding = hornExample.binding(obj.attr('id'));
        var converterName = HornExample.converterNameForNode(obj);
        if ( converterName ) {
            converter = hornConverter.get(converterName);
            convertedValue = converter( {type: 'fromText', value: obj.val()} );
            binding.parent[ binding.pk] = convertedValue;
        } else {
            binding.parent[ binding.pk] = obj.val();
        }
    });
    $('.dateValue').datepicker({dateFormat: HornExample.DATE_FORMAT});
    $('a.refreshButton').click( function( event ) {
        $('.changed').removeClass('changed');
        var affected = horn.updateDOM();
        $(affected).addClass('changed');
        event.stopPropagation();
        return false;});
});