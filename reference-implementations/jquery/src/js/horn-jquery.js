/**
 *  A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *  @author Chris Denman
 *  @author Marc Palmer
 */
function Horn() {

    if ( !window.Node ) {
        window.$.each( ['ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE',
            'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE',
            'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE',
            'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE'],
            function( i, n ) {
                window.Node[ n] = i + 1;
            });
    }

    this.defaults = {
            // CSS flavour
        cssPrefix:          '_',
        cssDelimiter:       '-',
        cssRootContext:     'horn',
        cssJSON:            'data-json',

            // HTML5 flavour
        dataNameHorn:       'horn',
        dataNamePath:       'horn-path',
        dataNameJSON:       'horn-json',

        converters: {},
        patternInfo: {}
    };

    this.opts = window.$.extend( {}, this.defaults);

    this.getDataAttr = function( n, name ) {
        return window.$(n).data( this.opts[ name]);
    };

    this.getIndicator = function( args ) {
        var isHTML5 = this.opts.html5 === true;
        switch ( args.type ) {
            case this.INDICATOR_ROOT:
                return isHTML5 ?
                    this.getDataAttr( args.n, "dataNameHorn") :
                    window.$(args.n).hasClass( this.opts.cssRootContext);

            case this.INDICATOR_PATH:
                return isHTML5 ?
                    this.getDataAttr( args.n, "dataNamePath") :
                    this.extractCSSPropertyPath( args.n);

            case this.INDICATOR_JSON:
                return isHTML5 ?
                    this.getDataAttr( args.n, "dataNameJSON") :
                    window.$(args.n).hasClass( this.opts.cssJSON);
        }
    };

    this.getRootContextNodes = function() {
        return this.opts.html5 ?
            window.$('*[data-' + this.opts.dataNameHorn + ']') :
            window.$("." + this.opts.cssRootContext);
    };


    this.extract = function( args ) {
        this.storeBackRefs = this.definesArgument( args, 'storeBackRefs') &&
            args.storeBackRefs;
        this.opts.html5 =
            window.$('*[data-' + this.opts.dataNameHorn + ']').size() > 0; // @todo change, shouldn't sense, should be informed
        this.each( this.getRootContextNodes(),
            function( i, n ) { this.visitNodes( n, ''); }, this);
        return this.model;
    };


	// Privileged Functions - public access, can access privates, can't be
    // modified but can be replaced with public flavours
    this.option = function( option ) {
        switch ( option ) {
            case "pattern":
                this.opts.patternInfo[ arguments[ 1]] = {
                    converterName: arguments[ 2]
                };
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
                    window.$(n.node).attr('title', newValue);
                } else {
                    n.value = modelValue;
                    window.$(n.node).text( newValue);
                }
            }
        }, this);
    };

    this.patternDefined = function( pattern ) {
        var rv = false;
        window.$.each( this.opts.patternInfo, function( i, n ) {
            if ( i === pattern ) {
                rv = true;
                return false;
            }});

        return rv;
    };

    this.getPattern = function( path ) {
        var rv = null;
        window.$.each(
            this.opts.patternInfo,
            function( i, n ) {
                var cachedPattern = n.rePattern;
                var re = cachedPattern || new RegExp( i);
                if ( cachedPattern === undefined ) { n.rePattern = re; }
                var m = re.exec( path);
                if ( m !== null ) {
                    rv = n;
                    return false;
                }
            }
        );

        return rv;
    };

    this.extractCSSPropertyPath = function( n ) {
        var path = null;
        this.each(
            this.toTokens( window.$(n).attr( "class")),
            function( i, n ) {
                if ( this.startsWith( n, this.opts.cssPrefix) ) {
                    path = n.substring( this.opts.cssPrefix.length);
                    if ( path === '' ) { path = null; }
                    return false;
                }
            },
            this);

        return path;
    };

    this.setValue = function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = path.split( this.opts.cssDelimiter);
            if ( path[0] === '' ) { path.shift(); }
            if ( this.model === undefined ) {
                this.model = !isNaN(   parseInt( path[ 0])) ? [] : {};
            }
            return this.setValue( value, path, this.model);
        }
        numTokens = path.length;
        if ( numTokens > 0 ) {
            token = path.shift();
            if ( numTokens > 1 ) {
                if ( !parentContext.hasOwnProperty( token) ) {
                    subContext = !isNaN( parseInt( path[ 0])) ? [] : {};
                    parentContext[ token] = subContext;
                }
                subContext = parentContext[ token];

                return this.setValue( value, path, subContext);
            } else {
                parentContext[ token] = value;
                return {context: parentContext, key: token, value: value};
            }
        }
    };

    this.convertValue = function( value, path, toText ) {
        var typeOfPattern;
        if ( this.startsWith( path, this.opts.cssDelimiter) ) {
            path = path.substring( 1);
        }
        typeOfPattern = this.getPattern( path);
        if ( typeOfPattern !== null ) {
            return this.convert(
                value, typeOfPattern.converterName, !toText);
        }
        return null;
    };

    this.handleValue = function( node, parentPath ) {
        var theContained;
        var fullPath;
        var text;
        var isTextNode;
        var isABBRNode;
        var typedValue;
        var details;
        var path = this.getIndicator({type: this.INDICATOR_PATH, n: node});
        var contents = window.$(window.$(node).contents());
        var isJSON = this.getIndicator({type: this.INDICATOR_JSON, n: node});
        if ( (contents.size() === 1) &&
            (isJSON || (this.isAdjustingPath( path))) ) {
            fullPath = this.isAdjustingPath( path) ?
                (parentPath + this.opts.cssDelimiter + path) :
                parentPath;
            theContained = contents[0];
            isTextNode = theContained.nodeType === window.Node.TEXT_NODE;
            isABBRNode = isTextNode && node.nodeName.toLowerCase() === "abbr";
            if ( isTextNode || isABBRNode ) {
                text = window.unescape( isABBRNode ?
                    window.$(node).attr('title') : window.$(theContained).text());
                typedValue = isJSON ? window.$.evalJSON( text) :
                    this.convertValue( text, fullPath, false);
                details = this.setValue( typedValue !== null ?
                    typedValue : text, fullPath);
                if ( (this.storeBackRefs === true) && (!isJSON) ) {
                    if ( this.valueNodes === undefined ) {
                        this.valueNodes = {};
                    }

                    this.valueNodes[ fullPath.substring( 1)] = { node: node,
                        context: details.context,
                        key: details.key, value: details.value};
                }
                return true;
            }
        }
        return false;
    };

    this.visitNodes = function( dataElement, path ) {
        var _path = this.getIndicator({type: this.INDICATOR_PATH, n: dataElement});
        path = this.isAdjustingPath( _path) ?
            (path + this.opts.cssDelimiter + _path) : path;
        this.each( window.$(dataElement).children(), function( i, n ) {
            if ( !this.getIndicator({type: this.INDICATOR_ROOT, n: n}) &&
                !this.handleValue( n, path) ) {
                this.visitNodes( n, path);
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

    this.encodeCSS = function( value ) {
        var length;
        var delimiter = this.opts.cssDelimiter;
        if ( !value ) { return undefined; }
        value = value.toString().replace( /[\[\].]/g, delimiter).replace( /--/g, delimiter);
        if ( this.startsWith( value, delimiter) ) { value = value.substring( delimiter.length); }
        value = this.opts.cssPrefix + value;
        length = value.length;
        return value.charAt( length - 1) === delimiter ? value.substring( 0, length - 1): value;
    }
}


// Prototype functions, anyone may read/write - essentially shared across all
// instances

Horn.prototype.isAdjustingPath = function ( path ) {
    return (path !== null) &&
        (path !== undefined) &&
        (path.toString().trim() !== '');
};

Horn.prototype.bind = function( fn, ctx ) {
    return function() { return fn.apply(ctx, arguments); };
};

Horn.prototype.each = function( collection, fn, ctx ) {
    if ( (collection === undefined) || (collection === null) ) {
        return;
    }
    window.$.each( collection, ctx != undefined ? this.bind( fn, ctx) : fn);
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
    return window.$(ref).parents(':last').is('html');
};

Horn.prototype.toTokens = function ( value, delimiter ) {
    var obj = {};

    window.$.each( value.split( delimiter !== undefined ? delimiter : " "),
        function( i, n ) {
            n = n.trim();
            if ( n !== "" ) { obj[ n] = n; }});

    return obj;
};

Horn.prototype.getIfSingleTextNode = function( element ) {
    var theContained;
    var contained = window.$(window.$(element).contents());
    if ( contained.size() === 1 ) {
        theContained = contained[ 0];
        if ( theContained.nodeType === window.Node.TEXT_NODE ) {
            return window.unescape( theContained.nodeValue);
        }
    }

    return null;
};

window.$.each( ['INDICATOR_ROOT','INDICATOR_PATH','INDICATOR_JSON'],
    function( i, n) {
        if ( Horn.prototype[ n.toString()] === undefined ) {
            Horn.prototype[ n.toString()] = i;
        }
    });