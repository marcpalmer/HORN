/**
 * A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 * Authors: Chris Denman and Marc Palmer
 */
function Horn() {

    if ( !window.Node ) {
        $.each( ['ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE',
            'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE',
            'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE',
            'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE'],
            function( i, n ) {
                window.Node[ n] = i + 1;
            });
    }

    this.defaults = {
        cssPrefix:          '_',
        cssDelimiter:       '-',
        cssRootContext:     'horn',
        cssJSON:            'data-json',
        converters: {
            // name: constructor OR
            // name: instance
        },
        patternInfo: {
            // name: converter Name
        }
    };

    this.opts = $.extend( {}, this.defaults);


	// Privileged Functions - public access, can access privates, can't be
    // modified but can be replaced with public flavours

    this.option = function( option ) {
        switch ( option ) {
            case "pattern":
                this.opts.patternInfo[ arguments[ 1]] = {
                    converterName: arguments[ 2]
                }
                break;

            case "converter":
                this.opts.converters[ arguments[ 1]] = arguments[ 2];
                break;
        }
    };

    this.populate = function() {
        var typeOfPattern;
        var modelValue;
        var newValue;

        this.each( this.valueNodes, function (i, n) {
            modelValue = n.context[ n.key];
            if ( modelValue !== n.value ) {
                typeOfPattern = this.getPattern( i);
                newValue = typeOfPattern !== null ?
                    this.convert( modelValue,
                        typeOfPattern.converterName, false) :
                            modelValue.toString();

                if ( n.node.nodeName.toLowerCase() === "abbr" ) {
                    n.value = modelValue;
                    $(n.node).attr('title', newValue);
                } else {
                    n.value = modelValue;
                    $(n.node).text( newValue);
                }

            }
        }, this);
    };

    this.extract = function( args ) {
        this.storeBackRefs = this.definesArgument( args, 'storeBackRefs') &&
            args.storeBackRefs;

        this.each(
            $("." + this.opts.cssRootContext),
            function( i, n ) {
                if ( this.getClosestDataParent( n) === null ) {
                    this.visitNodes.call( this, n, '');
                }
            },
            this);

        return this.model;
    };

    this.patternDefined = function( pattern ) {
        var rv = false;
        $.each( this.opts.patternInfo, function( i, n ) {
            if ( i === pattern ) {
                rv = true;
                return false;
            }});

        return rv;
    };

    this.getPattern = function( key ) {
        var rv = null;
        $.each(
            this.opts.patternInfo,
            function( i, n ) {
                var cachedPattern = n.rePattern;
                var re = cachedPattern || new RegExp( i);
                if ( cachedPattern === undefined ) { n.rePattern = re; }
                var m = re.exec( key);
                if ( m !== null ) {
                    rv = n;
                    return false;
                }
            }
        );

        return rv;
    };

    this.extractKey = function( n ) {
        var key = null;
        this.each(
            this.toTokens( $(n).attr( "class")),
            function( i, n ) {
                if ( this.startsWith( n, this.opts.cssPrefix) ) {
                    key = n.substring( this.opts.cssPrefix.length); // @todo cache
                    if ( key === '' ) { key = null; }
                    return false;
                }
            },
            this);

        return key;
    };

    this.setValue = function( value, key, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof key === 'string' ) {
            key = key.split( this.opts.cssDelimiter);
            if ( key[0] === '' ) { key.shift(); }
            if ( this.model === undefined ) {
                this.model = !isNaN(   parseInt( key[ 0])) ? [] : {};
            }
            return this.setValue( value, key, this.model);
        }
        numTokens = key.length;
        if ( numTokens > 0 ) {
            token = key.shift();
            if ( numTokens > 1 ) {
                if ( !parentContext.hasOwnProperty( token) ) {
                    subContext = !isNaN( parseInt( key[ 0])) ? [] : {};
                    parentContext[ token] = subContext;
                }
                subContext = parentContext[ token];

                return this.setValue( value, key, subContext);
            } else {
                parentContext[ token] = value;
                return {context: parentContext, key: token, value: value};
            }
        }
    };

    this.convertValue = function( value, hornKey, toText ) {
        var typeOfPattern;
        if ( this.startsWith( hornKey, this.opts.cssDelimiter) ) {
            hornKey = hornKey.substring( 1);
        }
        typeOfPattern = this.getPattern( hornKey);
        if ( typeOfPattern !== null ) {
            return this.convert(
                value, typeOfPattern.converterName, !toText);
        }
        return null;
    };

    this.getClosestDataParent = function( element ) {
        var parent = null;
        this.each( $(element).parents(), function( i, n ) {
            if ( $(n).hasClass( this.opts.cssRootContext) ) {
                parent = n;
                return false;
            }
        }, this);

        return parent;
    };

    this.handleValue = function( node, parentKey ) {
        var theContained;
        var fullKey;
        var text;
        var isTextNode;
        var isABBRNode;
        var typedValue;
        var details;
        var key = this.extractKey( node);
        var contents = $(node).contents();
        var isJSON = $(node).hasClass( this.opts.cssJSON);
        if ( (contents.length === 1) &&
            (isJSON || (this.isAdjustingKey( key))) ) {
            fullKey = this.isAdjustingKey( key) ?
                (parentKey + this.opts.cssDelimiter + key) :
                parentKey;
            theContained = contents[0];
            isTextNode = theContained.nodeType === window.Node.TEXT_NODE;
            isABBRNode = isTextNode && node.nodeName.toLowerCase() === "abbr";
            if ( isTextNode || isABBRNode ) {
                text = window.unescape( isABBRNode ?
                    $(node).attr('title') : $(theContained).text());
                typedValue = isJSON ? $.evalJSON( text) :
                    this.convertValue( text, fullKey, false);
                details = this.setValue( typedValue !== null ?
                    typedValue : text, fullKey);
                if ( (this.storeBackRefs === true) && (!isJSON) ) {
                    if ( this.valueNodes === undefined ) {
                        this.valueNodes = {};
                    }

                    this.valueNodes[ fullKey.substring( 1)] = { node: node,
                        hornKey: fullKey, context: details.context,
                        key: details.key, value: details.value};
                }
                return true;
            }
        }
        return false;
    };

    this.visitNodes = function( dataElement, hornKey ) {
        var key = this.extractKey( dataElement);
        hornKey = this.isAdjustingKey( key) ?
            (hornKey + this.opts.cssDelimiter + key) : hornKey;

        this.each( $(dataElement).children(), function( i, n ) {
            if ( !this.handleValue( n, hornKey) ) {
                this.visitNodes.call( this, n, hornKey);
            }
        }, this);
    };

    this.convert = function( value, converterName, fromText ) {
        var cachedConverter = this.opts.converters[ converterName];
        if ( cachedConverter === undefined ) { return value.toString(); }
        if ( typeof cachedConverter === 'function' ) {
            cachedConverter = new this.opts.converters[ converterName]();
            this.opts.converters[ converterName] = cachedConverter;
        }
        return fromText ? cachedConverter.fromText( value) :
            cachedConverter.toText( value);
    };
}


// Prototype functions, anyone may read/write - essentially shared across all
// instances

Horn.prototype.isAdjustingKey = function ( key ) {
    return (key !== null) &&
        (key !== undefined) &&
        (key.toString().trim() !== '');
};

Horn.prototype.bind = function( fn, ctx ) {
    return function() { return fn.apply(ctx, arguments); };
};

Horn.prototype.each = function( collection, fn, ctx ) {
    if ( (collection === undefined) || (collection === null) ) {
        return;
    }
    $.each( collection, ctx != undefined ? this.bind( fn, ctx) : fn);
};

Horn.prototype.didRemoveProperty = function( object, property ) {
    return object.hasOwnProperty( property) && delete object[ property];
};

Horn.prototype.definesArgument = function( args, propertyName ) {
    return (args !== undefined) && (args !== null) &&
        (args.hasOwnProperty( propertyName));
};

Horn.prototype.startsWith = function ( value, stem ) {
    value = value.toString();
    stem = stem.toString();
    return  (stem.length > 0) &&
            ((value = value.match( "^" + stem)) !== null) &&
            (value.toString() === stem);
};

Horn.prototype.isAttached = function( ref ) {
    return $(ref).parents(':last').is('html');
};

Horn.prototype.toTokens = function ( value, delimiter ) {
    var obj = {};

    $.each( value.split( delimiter !== undefined ? delimiter : " "),
        function( i, n ) {
            n = n.trim();
            if ( n !== "" ) { obj[ n] = n; }});

    return obj;
};

Horn.prototype.getIfSingleTextNode = function( element ) {
    var contained = $(element).contents();
    var theContained;
    if ( contained.length === 1 ) {
        theContained = contained[ 0];
        if ( theContained.nodeType === window.Node.TEXT_NODE ) {
            return window.unescape( theContained.nodeValue);
        }
    }

    return null;
};