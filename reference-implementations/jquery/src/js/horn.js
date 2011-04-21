/**
 * A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 * Authors: Chris Denman and Marc Palmer
 */
function Horn() {

    this.CONST_HORN_CSS_PREFIX
        = '_';
    this.CONST_HORN_CSS_PREFIX_LENGTH
        = this.CONST_HORN_CSS_PREFIX.length;
    this.CONST_HORN_CSS_DELIMITER
        = '-';
        this.CONST_HORN_CSS_HORN
        = 'horn';
    this.CONST_HORN_CSS_HORN_JSON
        = 'horn-json';
    this.CONST_META_NAME_TYPEOF
        = 'typeof';
    this.CONST_META_NAME_TYPEOF_LENGTH
        = this.CONST_META_NAME_TYPEOF.length;

    if ( !window.Node ) {
        $.each( ['ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE',
            'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE',
            'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE',
            'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE'],
            function( i, n ) {
                window.Node[ n] = i + 1;
            });
    }

    this.startsWith = function ( value, stem ) {
        value = value.toString();
        stem = stem.toString();
        return  (stem.length > 0) &&
                ((value = value.match( "^" + stem)) !== null) &&
                (value.toString() === stem);
    };

    this.isAttached = function( ref ) {
	    return ref.parents(':last').is('html');
    };

    this.toTokens = function ( value, delimiter ) {
        var obj = {};

        $.each(
            value.split( delimiter !== undefined ? delimiter : " "),
            function( i, n ) {
                n = n.trim();
                if ( n !== "" ) {
                    obj[ n] = n;
                }});

        return obj;
    };

    /* 
     * Update DOM with data from the internal model, to update your UI
     */
    this.populate = function() {
        var typeOfPattern;
        var modelValue;
        var newValue;
        
        this.each( this.valueNodes, function (i, n) {
            modelValue = n.context[ n.key];
            if ( modelValue !== n.value ) {
                typeOfPattern = this.firstPattern( i);
                newValue = typeOfPattern !== null ?
                    this.convert( modelValue,
                        typeOfPattern.contentAttribute, false) :
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

    this.definesArgument = function( args, propertyName ) {
        return (args !== undefined) && (args !== null) &&
            (args.hasOwnProperty( propertyName));
    };

    /*
     * Parse the HORN data out of the DOM
     * Args supplied are a map of options:
     * - storeBackRefs
     * - converters
     */
    this.parse = function( args ) {
        this.cacheMetaElements();
        this.storeBackRefs = this.definesArgument( args, 'storeBackRefs') &&
            args.storeBackRefs;

        this.converters = this.definesArgument( args, 'converters') ?
            args.converters : {};

        this.each(
            $("." + this.CONST_HORN_CSS_HORN),
            function( i, n ) {
                if ( this.getClosestDataParent( n) === null ) {
                    this.visitNodes.call( this, n, '');
                }
            },
            this);

        return this.model;
    };

    this.cacheMetaElements = function() {
        this.metaInfo = [];
        this.each( $("meta"), function( i, n ) {
            var nameTokens;
            var contentAttribute;
            var nameAttribute = $(n).attr( "name");
            if ( nameAttribute !== "" ) {
                nameTokens = this.toTokens( nameAttribute);
                contentAttribute = $(n).attr( "content").trim();
                if ( this.didRemoveProperty(
                    nameTokens, this.CONST_META_NAME_TYPEOF) &&
                    (contentAttribute !== "") ) {
                    this.each( nameTokens, function( i, pattern ) {
                            if ( !this.patternDefined( pattern) ) {
                                this.metaInfo[ this.metaInfo.length] = {
                                    pattern: pattern,
                                    contentAttribute: contentAttribute};
                            }
                        }, this);
                }
            }}, this);
    };

    this.patternDefined = function( pattern ) {
        var rv = false;
        $.each( this.metaInfo, function( i, n ) {
            if ( n.pattern === pattern ) {
                rv = true;
                return false;
            }});

        return rv;
    };

    this.firstPattern = function( key ) {
        var rv = null;
        $.each(
            this.metaInfo,
            function( i, n) {
                var cachedPattern = n.rePattern;
                var re = cachedPattern || new RegExp( n.pattern);
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
                if ( this.startsWith( n, this.CONST_HORN_CSS_PREFIX) ) {
                    key = n.substring( this.CONST_HORN_CSS_PREFIX_LENGTH);
                    if ( key === '' ) { key = null; }
                    return false;
                }
            },
            this);

        return key;
    };

    this.didRemoveProperty = function( object, property ) {
        return object.hasOwnProperty( property) && delete object[ property];
    };

    this.setValue = function( value, key, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof key === 'string' ) {
            key = key.split( this.CONST_HORN_CSS_DELIMITER);
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
        if ( this.startsWith( hornKey, this.CONST_HORN_CSS_DELIMITER) ) {
            hornKey = hornKey.substring( 1);
        }
        typeOfPattern = this.firstPattern( hornKey);
        if ( typeOfPattern !== null ) {
            return this.convert(
                value, typeOfPattern.contentAttribute, !toText);
        }
        return null;
    };

    this.getClosestDataParent = function( element ) {
        var parent = null;
        this.each( $(element).parents(), function( i, n ) {
            if ( $(n).hasClass( this.CONST_HORN_CSS_HORN) ) {
                parent = n;
                return false;
            }
        }, this);

        return parent;
    };

    this.getIfSingleTextNode = function( element ) {
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
        var isJSON = $(node).hasClass( this.CONST_HORN_CSS_HORN_JSON);
        if ( (contents.length === 1) &&
            (isJSON || (this.isAdjustingKey( key))) ) {
            fullKey = this.isAdjustingKey( key) ?
                (parentKey + this.CONST_HORN_CSS_DELIMITER + key) :
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

    this.isAdjustingKey = function ( key ) {
        return (key !== null) &&
            (key !== undefined) &&
            (key.toString().trim() !== '');
    };

    this.visitNodes = function( dataElement, hornKey ) {
        var key = this.extractKey( dataElement);
        hornKey = this.isAdjustingKey( key) ?
            (hornKey + this.CONST_HORN_CSS_DELIMITER + key) : hornKey;

        this.each( $(dataElement).children(), function( i, n ) {
            if ( !this.handleValue( n, hornKey) ) {
                this.visitNodes.call( this, n, hornKey);
            }
        }, this);
    };

    this.bind = function( fn, ctx ) {
        return function() { return fn.apply(ctx, arguments); };
    };

    this.each = function( collection, fn, ctx ) {
        if ( (collection === undefined) || (collection === null) ) {
            return;
        }
        $.each( collection, ctx != undefined ? this.bind( fn, ctx) : fn);
    };

    this.convert = function( value, converterName, fromText ) {
        var cachedConverter = this.converters[ converterName];
        if ( cachedConverter === undefined ) { return value.toString(); }
        if ( typeof cachedConverter === 'function' ) {
            cachedConverter = new this.converters[ converterName]();
            this.converters[ converterName] = cachedConverter;
        }
        return fromText ? cachedConverter.fromText( value) :
            cachedConverter.toText( value);
    };
}