function Horn() {

    this.CONST_HORN_TYPE_BOOLEAN                        = 'Boolean';
    this.CONST_HORN_TYPE_INTEGER                        = 'Integer';
    this.CONST_HORN_TYPE_DATE                           = 'Date';

    this.CONST_HORN_CSS_PREFIX                          = '_';
    this.CONST_HORN_CSS_DELIMITER                       = '-';
    this.CONST_HORN_CSS_DATA                            = 'data';
    this.CONST_HORN_CSS_DATA_JSON                       = 'data-json';

    this.CONST_META_NAME_TYPEOF                         = 'typeof';
    this.CONST_META_NAME_JSON                           = 'json';

    this.CONST_HORN_CSS_PREFIX_LENGTH
        = this.CONST_HORN_CSS_PREFIX.length;
    this.CONST_META_NAME_TYPEOF_LENGTH
        = this.CONST_META_NAME_TYPEOF.length;

    /**
     * Define the usual Window.node constants if not present, IE workaround.
     */
    if ( !window.Node ) {
        window.Node = {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            ENTITY_REFERENCE_NODE: 5,
            ENTITY_NODE: 6,
            PROCESSING_INSTRUCTION_NODE: 7,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9,
            DOCUMENT_TYPE_NODE: 10,
            DOCUMENT_FRAGMENT_NODE: 11,
            NOTATION_NODE: 12};
    }

    /**
     * Returns true iff 'value' as String begins with 'stem' as String.
     * <p>
     * Both arguments have <code>toString</code> called on them before
     * comparison.
     * <p>
     * Note that an empty stem (length 0) is not considered to start any other
     * string (event itself).
     *
     * @return true if value.toString() begins with stem.toString()
     */
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

    /**
     *  
     */
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

    this.populate = function() {
        var key;
        var valueNode;
        var typeOfPattern;
        var modelValue;
        var newValue;

            // change to each when working
        for ( key in this.valueNodes ) {
            if ( this.valueNodes.hasOwnProperty( key) ) {
                valueNode = this.valueNodes[ key];
                modelValue = valueNode.context[ valueNode.key];
                if ( modelValue !== valueNode.value ) {
                    typeOfPattern = this.firstPattern( key);
                    newValue = typeOfPattern !== null ?
                        this.convert( modelValue,
                            typeOfPattern.contentAttribute, false) :
                                modelValue.toString();

                    if ( valueNode.node.nodeName.toLowerCase() === "abbr" ) {
                        valueNode.value = newValue;
                        $(valueNode.node).attr('title', newValue);
                    } else {
                        valueNode.value = newValue;
                        $(valueNode.node).text( newValue);
                    }

                }
            }
        }
    };

    this.definesArgument = function( args, propertyName ) {
        return (args !== undefined) && (args !== null) &&
            (args.hasOwnProperty( propertyName));
    };

    /**
     *
     */
    this.parse = function( args ) {
        this.cacheMetaElements();
        this.storeBackRefs = this.definesArgument( args, 'storeBackRefs') &&
            args.storeBackRefs;

        this.converters = this.definesArgument( args, 'converters') ?
            args.converters : {};

        this.each(
            $("." + this.CONST_HORN_CSS_DATA),
            function( i, n ) {
                if ( this.getClosestDataParent( n) === null ) {
                    this.visitNodes.call( this, n, '');
                }
            },
            this);

        return this.target;
    };

    /**
     *
     */
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

    /**
     *
     */
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

    /**
     *  Extracts and returns the first 'class' attribute token String that defines a horn key.
     *  <p>
     *  If no horn key is found, <code>null</code> is returned.
     */
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

    /**
     * Returns true if the given property was removed from the object supplied.
     */
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
            if ( this.target === undefined ) {
                this.target = !isNaN(   parseInt( key[ 0])) ? [] : {};
            }
            return this.setValue( value, key, this.target);
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

    this.coerceValue = function( value, hornKey, toScreen ) {
        var typeOfPattern;
        if ( this.startsWith( hornKey, this.CONST_HORN_CSS_DELIMITER) ) {
            hornKey = hornKey.substring( 1);
        }
        typeOfPattern = this.firstPattern( hornKey);
        if ( typeOfPattern !== null ) {
            return this.convert( value, typeOfPattern.contentAttribute, !toScreen);
        }
        return null;
    };

    this.getClosestDataParent = function( element ) {
        var parent = null;
        this.each( $(element).parents(), function( i, n ) {
            if ( $(n).hasClass( this.CONST_HORN_CSS_DATA) ) {
                parent = n;
                return false;
            }
        }, this);

        return parent;
    };

    /**
     *  If the element contains a single text node, get, un-escape and return
     *  its value.
     */
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
        var isJSON = $(node).hasClass( this.CONST_HORN_CSS_DATA_JSON);
        if ( (contents.length === 1) && (isJSON || (this.isAdjustingKey( key))) ) {
            fullKey = this.isAdjustingKey( key) ?
                (parentKey + this.CONST_HORN_CSS_DELIMITER + key) :
                parentKey;
            theContained = contents[0];
            isTextNode = theContained.nodeType === window.Node.TEXT_NODE;
            isABBRNode = theContained.nodeName.toLowerCase() === "abbr";
            if ( isTextNode || isABBRNode ) {
                text = isTextNode ? window.unescape( $(theContained).text()) :
                    $(theContained).attr('title');
                typedValue = isJSON ? $.evalJSON( text) :
                    this.coerceValue( text, fullKey, false);
                details = this.setValue( typedValue !== null ?
                    typedValue : text, fullKey);
                if ( (this.storeBackRefs === true) && (!isJSON) ) {
                    if ( this.valueNodes === undefined ) {
                        this.valueNodes = {};
                    }

                    this.valueNodes[ fullKey] = { node: node, hornKey: fullKey,
                        context: details.context, key: details.key,
                        value: details.value};
                }
                return true;
            }
        }
        return false;
    };

    /**
     * Return true if the given key represents a valid, context altering horn
     * key.
     */
    this.isAdjustingKey = function ( key ) {
        return (key !== null) &&
            (key !== undefined) &&
            (key.toString().trim() !== '');
    };

    /**
     * Called (initially) on the root (has no parent with the same CSS class
     * that distinguishes itself) 'data' elements in the DOM.
     * <p>
     * We traverse down through the DOM looking for elements that satisfy
     * Horn's criteria for any particular element.
     */
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

    /**
     * Returns a function that calls function 'fn' using the given context 'ctx'.
     */
    this.bind = function( fn, ctx ) {
        return function() { return fn.apply(ctx, arguments); };
    };

    /**
     * Call $Query.each against 'collection' using callback 'fn' under context 'ctx'.
     */
    this.each = function( collection, fn, ctx ) {
        $.each( collection, this.bind( fn, ctx));
    };

    this.convert = function( value, converterName, fromScreen ) {
        var cachedConverter = this.converters[ converterName];
        if ( cachedConverter === undefined ) { return value.toString(); }
        if ( typeof cachedConverter === 'function' ) {
            cachedConverter = new this.converters[ converterName]();
            this.converters[ converterName] = cachedConverter;
        }
        return fromScreen === false ? cachedConverter.toScreen( value) :
            cachedConverter.fromScreen( value);
    };
}