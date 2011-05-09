/**
 *  A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *  @author Chris Denman
 *  @author Marc Palmer
 */
if ( !window.Node ) {
    window.$.each( ['ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE',
        'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE',
        'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE',
        'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE'],
        function( i, n ) {
            window.Node[ n] = i + 1;
        });
}

Horn.prototype.splitEach = function( object, delimiter, callback ) {
    Horn.prototype.each( object.toString().split( delimiter !== undefined ?
        delimiter : " "), function( i, token ) {
            if ( token.trim() !== '' ) { callback( token); }
    });
};

Horn.prototype.isAdjustingPath = function ( path ) {
    return (path !== null) && (path !== undefined) &&
        (path.toString().trim() !== '');
};

Horn.prototype.bind = function( fn, ctx ) {
    return function() { return fn.apply(ctx, arguments); };
};

Horn.prototype.each = function( collection, fn, ctx ) {
    if ( (collection === undefined) || (collection === null) ) { return; }
    window.$.each( collection, ctx ? Horn.prototype.bind( fn, ctx) : fn);
};

Horn.prototype.didRemoveProperty = function( object, property ) {
    return object.hasOwnProperty( property) && delete object[ property];
};

Horn.prototype.definesArgument = function( args, propertyName ) {
    return (args !== undefined) && (args.hasOwnProperty( propertyName));
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

Horn.prototype.getDataAttr = function( n, name ) {
    return window.$(n).data( name);
};

Horn.prototype.contains = function( objects, object ) {
    var rv = null;
    Horn.prototype.each( objects, function( i, o ) {
        if ( rv = window.$(o)[0] === window.$(object)[0] ) { return false; }
    });
    return rv;
};

Horn.prototype.traverse = function( value, callback, key ) {
    if ( typeof value === 'object' ) {
        Horn.prototype.each( value, function( k, v ) {
            Horn.prototype.traverse( v, callback, key + '-' + k);
        });
    } else { callback( key, value); }
};

function Horn() {
    this.defaults = {
        storeBackRefs:  false,
        converters:     {},
        patternInfo:    {}
    };

    this.opts = window.$.extend( {}, this.defaults);

    this.getFeature = function( args ) {
        return Horn.prototype.bind( this.features[ args.type], this)(args); // @todo bind every call here, replace
    };

    this.extract = function( args ) {
        Horn.prototype.each( this.getFeature({type: 'ROOT_NODES'}),
            function( i, n ) { this.visitNodes( n, ''); }, this);
        return this.model;
    };

    this.fromTemplate = function( args ) {
        var clonedTemplate = window.$(args.selector).clone();
        clonedTemplate.removeAttr( "id");

        // clone, strip id and walk the template
        // for each value node, see if there's a data element which has a path
        // which matches that formed from the current template node's key
        // populate the value

    };

        // abstract this so sth
    this.visitNodes = function( dataElement, path ) {
        var _path = this.getFeature({type: 'INDICATOR_PATH', n: dataElement});
        path = Horn.prototype.isAdjustingPath( _path) ?
            (path + '-' + _path) : path;
        Horn.prototype.each( window.$(dataElement).children(), function( i, n ) {
            if ( !this.getFeature({type: 'INDICATOR_ROOT', n: n}) &&
                !this.handleValue( n, path) ) {
                this.visitNodes( n, path);
            }
        }, this);
    };

    this.option = function( optionName, arg0, arg1 ) {
        var _this = this;
        switch ( optionName ) {
            case "pattern":
                Horn.prototype.splitEach( arg0, ",", function( token ) {
                    _this.opts.patternInfo[ token] = { converterName: arg1 };
                });
                return;

            case "converter":
                _this.opts.converters[ arg0] = arg1;
                return;
        }
        if ( optionName !== undefined ) { this.opts[ optionName] = arg0; }
    };

    this.populate = function( args ) {
        var typeOfPattern;
        var modelValue;
        var newValue;
        var rootNode = Horn.prototype.definesArgument( args, 'rootNode') ?
            args.rootNode : undefined;
        var alteredNodes = [];
        Horn.prototype.each( this.valueNodes, function( i, n ) {
            modelValue = n.context[ n.key];
            if ( modelValue !== n.value ) {
                if ( !rootNode ||
                    (rootNode && Horn.prototype.contains(
                        window.$(n.node).parents(), rootNode)) ) {
                        typeOfPattern = this.getPattern( i);
                        newValue = typeOfPattern !== null ?
                            this.convert( modelValue,
                                typeOfPattern.converterName, false, false) :
                                    modelValue.toString();
                        if ( n.node.nodeName.toLowerCase() === "abbr" ) {
                            window.$(n.node).attr('title', newValue);
                        } else { window.$(n.node).text( newValue); }
                        n.value = modelValue;
                        alteredNodes.push( n.node);
                    }
            }
        }, this);
        return alteredNodes;
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

    this.setValue = function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = path.split( "-");
            if ( path[0] === '' ) { path.shift(); }
            if ( this.model === undefined ) {
                this.model = !isNaN( parseInt( path[ 0])) ? [] : {};
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

    this.handleValue = function( node, parentPath ) {
        var theContained;
        var fullPath;
        var text;
        var isTextNode;
        var isABBRNode;
        var typedValue;
        var path = this.getFeature({type: 'INDICATOR_PATH', n: node});
        var contents = window.$(window.$(node).contents());
        var isJSON = this.getFeature({type: 'INDICATOR_JSON', n: node});
        if ( contents.size() === 1 ) {
                fullPath = Horn.prototype.isAdjustingPath( path)
            if ( isJSON || fullPath ) {
                fullPath = fullPath ? (parentPath + '-' + path) : parentPath;
                theContained = contents[0];
                isTextNode = theContained.nodeType === window.Node.TEXT_NODE;
                isABBRNode = isTextNode && node.nodeName.toLowerCase() === "abbr";
                if ( isTextNode || isABBRNode ) {
                    text = window.unescape( isABBRNode ?
                        window.$(node).attr('title') :
                        window.$(theContained).text());
                    if ( isJSON ) {
                        typedValue = window.$.evalJSON( text);
                        if ( typeof typedValue === 'object' ) {
                            Horn.prototype.traverse( typedValue,
                                Horn.prototype.bind(
                                    function( key, value ) {
                                        this.doSetValue( value, fullPath + key,
                                            isJSON, node);
                                    }, this), '');
                        } else {
                            this.doSetValue(
                                typedValue, fullPath, isJSON, node);
                        }
                    } else {
                        this.doSetValue( text, fullPath, isJSON, node); }
                    return true;
                }
            }
        }
        return false;
    };

    this.doSetValue = function( value, fullPath, isJSON, node ) {
        var typedValue = this.convertValue( value, fullPath, false, isJSON);
        var details =  this.setValue( typedValue !== null ?
            typedValue : value, fullPath);
        if ( (this.opts.storeBackRefs === true) && (!isJSON) ) {
            if ( this.valueNodes === undefined ) { this.valueNodes = {}; }
            this.valueNodes[ fullPath.substring( 1)] = { node: node,
                context: details.context,
                key: details.key, value: details.value};
        }
    };

    this.getCacheConverter = function( converterName ) {
        var cachedConverter = this.opts.converters[ converterName];
        if ( cachedConverter === undefined ) { return value.toString(); }
        if ( typeof cachedConverter === 'function' ) {
            cachedConverter = new this.opts.converters[ converterName]();
            this.opts.converters[ converterName] = cachedConverter;
        }
        return cachedConverter;
    };

    this.convertValue = function( value, path, toText, isJSON ) {
        var typeOfPattern;
        isJSON = isJSON === true;
        if ( Horn.prototype.startsWith( path, '-') ) { path = path.substring( 1); }
        typeOfPattern = this.getPattern( path);
        return (typeOfPattern !== null) ?
            this.convert( value, typeOfPattern.converterName, !toText, isJSON) :
            null;
    };

    this.convert = function( value, converterName, fromText, isJSON ) {
        isJSON = isJSON === true;
        var converter = this.getCacheConverter( converterName);
        return converter === null ? null :
            (isJSON ? converter.fromJSON( value) :
                (fromText ? converter.fromText( value) :
                    converter.toText( value)));
    };
}

window.horn = new Horn();