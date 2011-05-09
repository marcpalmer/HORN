/**
 *  A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *  @author Chris Denman
 *  @author Marc Palmer
 */
function Horn() {
    this.defaults = {
        storeBackRefs:  false,
        converters:     {},
        patternInfo:    {}
    };

    this.opts = window.$.extend( {}, this.defaults);

    this.getFeature = function( args ) {
        return Horn.prototype.bind( Horn.prototype.features[ args.type], this)(args); // @todo bind every call here, replace
    };

    this.extract = function( args ) {
        var _this = this;
        Horn.prototype.each( this.getFeature({type: 'ROOT_NODES'}),
            function( i, n ) { this.visitNodes( n, '',
                function( n, path ) {

                    var isRoot = _this.getFeature({type: 'INDICATOR_ROOT', n: n});
                    if ( isRoot ) { return false; }
                    var valueData = _this.isValueNode( n, path);
                    if ( !valueData ) { return true; }
                    _this.handleValue( valueData);
                    return false;
                }
            ); }, this);
        return this.model;
    };

    this.populateTemplateValue = function( node, path, data ) {
        var key;
        var regexp;
        var valueData = this.isValueNode( node, path);
        if ( valueData ) {
            if ( valueData.isJSON  ) { return false; }
            key = this.getFeature({type: 'INDICATOR_PATH', n: node});
            if ( Horn.prototype.isAdjustingPath( key) ) {
                path = (path + '-' + key); } // @todo note key combining here
            Horn.prototype.traverse( data,
                Horn.prototype.bind( function( k, v ) {
                    regexp = new RegExp( k.replace( '*', '.*'));
                    if ( regexp.test( path) ) {
                        var typeOfPattern = this.getPattern( k);
                        Horn.prototype.setNodeValue( {node: node, value: typeOfPattern !== null ?
                            this.convert( v, typeOfPattern.converterName,
                                false, false) : v.toString()});
                    }
                }, this)
            );
            return false;
        }
        return true;
    };

    this.fromTemplate = function( args ) {
        var clonedTemplate = window.$(args.selector).clone();
        clonedTemplate.removeAttr( "id");
        if ( args.id ) { clonedTemplate.attr( "id", args.id); }
        var data = args.data;

        // clone, strip id and walk the template
        this.visitNodes( clonedTemplate, '',
            Horn.prototype.bind(
            function( n, path ) {
                return this.populateTemplateValue( n, path, data);
            }, this));

        return clonedTemplate;
    };

    this.visitNodes = function( dataElement, path, fn ) {
        var _path = this.getFeature({type: 'INDICATOR_PATH', n: dataElement});
        if ( Horn.prototype.isAdjustingPath( _path) ) {
            path = (path + '-' + _path); }
        Horn.prototype.each(
            window.$(dataElement).children(),
            function( i, n ) {
                if ( fn( n, path) ) { this.visitNodes( n, path, fn); }},
            this);
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
                        Horn.prototype.setNodeValue( {node: n.node, value: newValue});
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
                if ( re.exec( path) !== null ) {
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

    this.isValueNode = function( node, parentPath ) { // @todo remove parentPath here, is odd
        var theContained;
        var text;
        var isTextNode;
        var isABBRNode;
        var path = this.getFeature({type: 'INDICATOR_PATH', n: node});
        var contents = window.$(window.$(node).contents());
        var isJSON = this.getFeature({type: 'INDICATOR_JSON', n: node});
        var contentsSize = contents.size();
        var fullPath = Horn.prototype.isAdjustingPath( path);
        var isEmptyNode = contentsSize === 0;
        if ( (contentsSize === 1) || (isEmptyNode && !isJSON))  {
            if ( !isEmptyNode ) {
                theContained = contents[0];
            }
            if ( isJSON || fullPath ) {
                fullPath = fullPath ? (parentPath + '-' + path) : parentPath;
                isABBRNode = node.nodeName.toLowerCase() === "abbr";
                isTextNode = !isABBRNode && (isEmptyNode ||
                    (theContained.nodeType === window.Node.TEXT_NODE));
                if ( isTextNode || isABBRNode ) {
                    text = window.unescape( isABBRNode ?
                        window.$(node).attr('title') :
                        (isEmptyNode ? '' : window.$(theContained).text()));
                    return { isJSON: isJSON,
                        isTextNode: isTextNode,
                        isABBRNode: isABBRNode, node: node, text: text,
                        path: fullPath};
                }
            }
        }
        return false;
    };

    this.handleValue = function( args ) {
        var jsonData;
        if ( args.isJSON ) {
            jsonData = window.$.evalJSON( args.text);
            if ( typeof jsonData === 'object' ) {
                Horn.prototype.traverse( jsonData,
                    Horn.prototype.bind(
                        function( key, value ) {
                            this.addValueNode( value, args.path + key,
                                args.isJSON, args.node);
                        }, this), '');
            } else {
                this.addValueNode( jsonData, args.path, args.isJSON, args.node);
            }
        } else {
            this.addValueNode( args.text, args.path, args.isJSON, args.node); }
    };

    this.addValueNode = function( value, fullPath, isJSON, node ) {
        var typedValue = this.patternConvert( value, fullPath, false, isJSON);
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
        if ( cachedConverter === undefined ) { return null; }
        if ( typeof cachedConverter === 'function' ) {
            cachedConverter = new this.opts.converters[ converterName]();
            this.opts.converters[ converterName] = cachedConverter;
        }
        return cachedConverter;
    };

    this.patternConvert = function( value, path, toText, isJSON ) {
        var typeOfPattern;
        isJSON = isJSON === true;
        if ( Horn.prototype.startsWith( path, '-') ) {
            path = path.substring( 1); }
        typeOfPattern = this.getPattern( path);
        return (typeOfPattern !== null) ?
            this.convert( value, typeOfPattern.converterName, !toText, isJSON) :
            null;
    };

    // @todo just pass in method name here?
    this.convert = function( value, converterName, fromText, isJSON ) {
        isJSON = isJSON === true;
        var converter = this.getCacheConverter( converterName);
        if ( converter === undefined ) { return null; }
        return converter[
            isJSON ? 'fromJSON' : fromText ? 'fromText' : 'toText']( value);
    };
}

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
    return (path !== null) &&
        (path !== undefined) && (path.toString().trim() !== '');
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
        rv = window.$(o)[0] === window.$(object)[0];
        if ( rv ) { return false; }
    });
    return rv;
};

Horn.prototype.traverse = function( value, callback, key ) {
    if ( typeof value === 'object' ) {
        Horn.prototype.each( value, function( k, v ) {
            Horn.prototype.traverse( v, callback, key ? (key + '-' + k) : ("-" + k));
        });
    } else { callback( key, value); }
};

Horn.prototype.setNodeValue = function( args ) {
    if ( args.node.nodeName.toLowerCase() === "abbr" ) {
        window.$(args.node).attr('title', args.value);
    } else { window.$(args.node).text( args.value); }
};


window.horn = new Horn();