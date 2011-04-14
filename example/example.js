var bindings = {};
var maxID = -1;

var makeID = function () {
    return "hi_" + (++maxID);
};

var converterNameForNode = function( node ) {
    node = $(node);
    if ( node.hasClass( 'integerValue') ) {
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
            if ( i !== object.length - 1) { childText += ', '; }
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
};

$(document).ready(function() {
    horn = new Horn();
    var model = horn.parse({
        storeBackRefs: true,
        converters: {
            IntegerConverter: function () {
                this.toScreen = function( value, key, pattern ) {
                    return value.toString();
                };
                this.fromScreen = function( value, key, pattern ) {
                    return parseInt( value);
                };
            },
            BooleanConverter: function () {
                this.toScreen = function( value, key, pattern ) {
                    return value ? "Yes" : "No";
                };
                this.fromScreen = function( value, key, pattern ) {
                    return value.toLowerCase() === 'yes';
                };
            },
            DateConverter: function () {
                this.toScreen = function( value, key, pattern ) {
                    return $.datepicker.formatDate( "d MM yy", value);
                };
                this.fromScreen = function( value, key, pattern ) {
                    return $.datepicker.parseDate( "d MM yy", value);
                };
            }
        }
    });
    $('#formattedOutput').html( render( model, 0));
    $('.dynamic').change( function( event ) {
        var obj = $(this);
        var binding = bindings[ obj.attr('id')];
        binding.parent[ binding.pk] = horn.convert( obj.val(), converterNameForNode(obj), true);
    });
    $('.dateValue').datepicker({dateFormat: 'd MM yy'});
    $('#populateButton').click( function(event) {
        horn.populate();
    });
});