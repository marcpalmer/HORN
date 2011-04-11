var bindings = {};
var maxID = -1;

var makeID = function () {
    return "hi_" + (++maxID);
}

var converterForNode = function( node ) {
    node = $(node);
    if ( node.hasClass( 'integerValue') ) {
        return new TestIntegerConverter();
    }

    if ( node.hasClass( 'dateValue') ) {
        return new TestDateConverter();
    }

    if ( node.hasClass( 'booleanValue') ) {
        return new TestBooleanConverter();
    }

    return null;
}

var indent = function ( count ) {
    var rv = '';
    while ( count-- > 0 ) { rv += '&nbsp;&nbsp;&nbsp;&nbsp;'; }
    return rv;
};

var span = function ( text, classAttribute ) {
    return '<span' + ((classAttribute !== undefined) ? (' class=\'' +
        classAttribute.toString() + '\'') : '') + '>' + text + '</span>';
};

var input = function ( content, classAttr, object, parent, id ) {
    return "<input value='" + content + "' class='dynamic " + classAttr +
        "'  id='" + id + "' type='text'/>";
};

var render = function ( object, ind, parent, pk ) {
    var count;
    var rv;
    var i;
    var index;
    var childText = indent( ind);
    var type;
    if ( rv === undefined ) { rv = ''; }
    if ( isArray( object) ) {
        for ( i = 0; i < object.length; i++ ) {
            childText += ("<br/>" + indent( ind) +
                this.render.call( this, object[ i], ind + 1, object, i));
            if ( i != object.length - 1) { childText += ', '; }
        }
        return  span( "[") + childText + span("]");
    } else
    if ( isObject( object) ) {
        count = countOwnProps( object);
        index = 0;
        for ( i in object ) {
            if ( object.hasOwnProperty( i) ) {
                childText += ("<br/>" + span( indent( ind) + "\"" + i + "\": ") +
                    this.render.call( this, object[ i], ind + 1, object, i) +
                        ((index < count - 1) ? span(",") : ''));
                index++;
            }
        }
        return span("{") + childText + span("}");
    } else {
        switch (typeof object) {
            case 'string':
                type = 'stringValue';
            break;

            case 'boolean':
                type = 'booleanValue';
            break;

            default:
                i = object.constructor.toString();
                if ( i.indexOf( 'Date') > 0  ) {
                    type = 'dateValue';
                } else
                if ( i.indexOf( 'Number') > 0  ) {
                    type = 'integerValue';
                }
            break;
        }

        if ( type !== undefined ) {
            i = makeID();
            bindings[ i] = {parent: parent, pk: pk, type: type};
            if ( type === 'dateValue' ) {
                object = $.datepicker.formatDate( "d MM yy", object);
            }
            return input( object.toString(), type, object, parent, i);
        }
    }
}

$(document).ready(function() {
    var index;
    var converter;
    horn = new Horn();
    var model = horn.parse({storeBackRefs: true});
    $('#formattedOutput').html( render( model, 0));
    $('.dynamic').change( function( event ) {
        var binding = bindings[ $(this).attr('id')];
        converter = converterForNode( $(this));
        binding.parent[ binding.pk] = converter !== null ?
            converter.fromScreen( $(this).val()) : $(this).val();
    });
    $('.dateValue').datepicker({dateFormat: 'd MM yy'});
    $('#populateButton').click( function(event) {
        horn.populate();
    });
});