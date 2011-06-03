/**
 *  A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *
 *  - Defaults for no converters present
 *  - change tests so that we implement a regex based converter construct
 *
 *
 *  @author Chris Denman
 *  @author Marc Palmer
 */
function Horn() {

    this.reset = function() {
        this.state = {
            opts: window.$.extend( {}, {storeBackRefs:  true})
        };
    };

    this.reset();

    this.setDefaultModel = function() {
        if ( (this.state.model === undefined) &&
            (this.state.opts.hasOwnProperty( 'defaultModel')) ) {
                this.state.model = this.state.opts.defaultModel;
        }
    };

    /**
     *  Extract HORN data from the DOM and build a data model from it.
     *  <p>
     *  After extraction the model can be retrieved using horn.getModel(),
     *  this function also returns the model.
     *  <p>
     *  Data is extracted from the DOM either by locating all Horn 'root nodes'
     *  and then traversing them for data. Alternatively, the DOM nodes to
     *  traverse specified by either, a jQuery selector or list of elements.
     *  <p>
     *  If multiple elements with the same effective property path are encountered
     *  <p>
     *
     *
     *  @param args.selector    optional jQuery selector used to select the
     *      nodes to extract a Horn data model from, overrides default
     *      mechanism when supplied
     *  @param args.rootNodes   optional object of nodes that can be traversed
     *      using <code>jQuery.each( ... )</code> use to extract a Horn data
     *      model from, overrides default mechanism when supplied.
     *
     *  @todo think about repeat calls to extract with no arguments
     */
    this.extract = function( args ) {
        var _this = this;
        var rootNodes = this.definesArgument( args, 'rootNodes') ?
            args.rootNodes : (this.definesArgument( args, 'selector') ?
                window.$(args.selector) :
                this.getFeature({type: 'ROOT_NODES'}));
        this.setDefaultModel();
        this.each( rootNodes,
            function( i, n ) { this.visitNodes( n, '',
                function( n, path ) {
                    var isRoot =
                        _this.getFeature( {type: 'INDICATOR_ROOT', n: n});
                    if ( _this.isDefinedNotNull( isRoot) === true ) {
                        return false; }
                    var componentData = _this.getComponentData( n, path);
                    if ( _this.isDefinedNotNull( componentData) === false) {
                        return true; }
                    if ( componentData.isJSON === false ) {
                        componentData.value = _this.convert( {
                            value: componentData.text,
                            path:  componentData.path,
                            type:  'fromText', // dom > model
                            node:  componentData.node
                        });
                    }
                    _this[componentData.isJSON === true ? 'addJSONComponents' :
                        'addComponent']( componentData);
                    return false;
                }
            ); }, this);
        return this.state.model;
    };

    this.newFromTemplate = function( args ) {
        var template;
        var components = [];
        if ( this.definesArgument( args, 'template') === true ) {
            template = args.template;
        } else {
            template = window.$(args.selector).clone();
            template.removeAttr( "id");
        }

        if ( this.definesArgument( args, 'id') === true ) {
            template.attr( "id", args.id);
        }

        this.setDefaultModel();
        this.visitNodes( template, args.path ? args.path : '', this.bind(
            function( n, path ) {
                return this.handleTemplateValue( n, path, components);
            }, this));

        this.addComponents({components: components});

        return template;
    };

    this.handleTemplateValue = function( node, path, components ) {
        var componentData = this.getComponentData( node, path);
        var key = this.getFeature({type: 'INDICATOR_PATH', n: node});
        if ( this.isAdjustingPath( key) === true ) {
            componentData.path = (path + '-' + key); }
        if ( this.isDefinedNotNull( componentData) === true ) {
            if ( !componentData.isJSON  ) { components.push( componentData); }
            return false;
        }
        return true;
    };

    this.addComponents = function( args ) {
        this.traverse(
            this.state.model,
            this.bind( function( k, v, context, propName ) {
                this.each( args.components, function( i, componentData ) {
                    var textValue;
                    if ( k === componentData.path ) {
                        textValue = this.convert( {
                            value: v,
                            path:  k,
                            type:  'toText', // model -> dom
                            node:  componentData.node
                        });
                        if ( (textValue === undefined) && this.isDefinedNotNull( v)) {
                            textValue = v.toString(); // @todo perhaps we need better default conversion here
                        }
                        componentData.text = textValue;
                        this.setDOMNodeValue( {node: componentData.node,
                            value: componentData.text});
                        this.addComponent({
                            node: componentData.node,
                            context: context,
                            key: propName,
                            value: v,
                            path: componentData.path});
                    }
                }, this);
            }, this));
    };

    this.removeComponents = function( args ) {
        this.each( this.state.components, function( i, n ) {
            if ( this.startsWith( i, args.stem ) ) { delete this.state.components[ i]; }
        }, this);
    };

    this.addComponent = function( args ) {
        var culledPath = args.path.substring( 1);
        var details = {context: args.context, key: args.key, value: args.value};
        if ( (this.state.opts.storeBackRefs === true) && (!args.isJSON) ) {
            if ( this.state.components === undefined ) {
                this.state.components = {}; }
            this.state.components[ culledPath] = { node: args.node,
                context: details.context, key: details.key, value: details.value};
        }
        return details;
    };

    /**
     *  Refresh the DOM nodes with the current model values.
     *  <p>
     *  Only DOM nodes that produced data on a previous call to
     *  <code>horn.extract( ... )</code> will be considered for updating.
     *  <p>
     *  <strong>Important: </strong>In addition, only DOM nodes that were
     *  extracted whilst the <strong>storeBackRefs</strong> option was set will
     *  be considered for updating.
     *
     *  @param args.rootNode   optional DOM node such that if supplied, only
     *      nodes under this node will be updated.
     */
    this.render = function( args ) {
        this.each( this.state.components, function( i, n ) {
            this.renderComponent( {rootNode: this.definesArgument(
                args, 'rootNode') ? args.rootNode : undefined,
                    component: n, path: i});
        }, this);
    };

    this.renderComponent = function( args ) {
        var rootNode = args.rootNode;
        var component = args.component;
        var modelValue = component.context[ component.key];
        var textValue;
        if ( modelValue !== component.value ) {
            if ( !rootNode || (rootNode && this.contains(
                window.$(component.node).parents(), rootNode)) ) {
                textValue = this.convert( {
                    value: modelValue,
                    path:  args.path,
                    type:  'toText', // model > dom
                    node: component.node
                });
                this.setDOMNodeValue( {node: component.node, value: textValue});
                component.value = modelValue;
            }
        }
    };

    this.getModel = function() {
        return this.state.model;
    };

    this.option = function( optionName, arg0 ) {
        if ( this.isDefinedNotNull( optionName) ) {
            this.state.opts[ optionName] = arg0; }
    };

    // @todo this is only called presently fromn add component, we recurse the
    // property path tree and this tree seperately, we should join up
    // adjust path
    this.setValue = function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = path.split( "-");
            if ( path[0] === '' ) { path.shift(); }
            if ( this.state.model === undefined ) {
                this.state.model = (!isNaN( parseInt( path[ 0])) ? [] : {});
            }
            return this.setValue( value, path, this.state.model);
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

    this.getComponentData = function( node, parentPath ) { // @todo remove parentPath here, is odd
        var theContained;
        var nodeName;
        var path = this.getFeature({type: 'INDICATOR_PATH', n: node});
        var contents = window.$(window.$(node).contents());
        var cd = {
            isJSON: this.getFeature({type: 'INDICATOR_JSON', n: node}),
            path: this.isAdjustingPath( path),
            node: node};
        var contentsSize = contents.size();
        var isEmptyNode = contentsSize === 0;
        if ( (contentsSize === 1) || (isEmptyNode && !cd.isJSON))  {
            if ( !isEmptyNode ) { theContained = contents[0]; }
            if ( cd.isJSON || cd.path ) { // @todo check the logic wrt json here, does this contradict --
                cd.path = cd.path ? (parentPath + '-' + path) : parentPath;
                nodeName = node.nodeName.toLowerCase();
                cd.isFormElementNode =
                    (nodeName === 'input') || (nodeName === 'textarea');
                cd.isABBRNode = !cd.isFormElementNode &&
                    (nodeName.toLowerCase() === "abbr");
                cd.isTextNode = !cd.isABBRNode && (isEmptyNode ||
                    (theContained.nodeType === window.Node.TEXT_NODE));

                if ( cd.isFormElementNode || cd.isTextNode || cd.isABBRNode ) {
                    cd.text = this.getDOMNodeValue( {node: node});
                    return cd;
                }
            }
        }
        return false;
    };

    this.addJSONComponents = function( args ) {
        var jsonData = window.$.evalJSON( args.text);
        var rootPath = args.path;
        if ( typeof jsonData === 'object' ) {
            this.traverse( jsonData,
                this.bind(
                    function( k, v ) {
                        args.value = this.convert( {
                            value: v,
                            path:  rootPath + k,
                            type:  'fromJSON', // json > model
                            node:  args.node});
                        this.addComponent( args);
                    }, this), '');
        } else {
            args.value = this.convert( {
                value: jsonData,
                path:  rootPath,
                type:  'fromJSON', // json > model
                node:  args.node});
            this.addComponent( args);
        }
    };

    this.visitNodes = function( dataElement, path, fn ) {
        var _path = this.getFeature({type: 'INDICATOR_PATH', n: dataElement});
        if ( this.isAdjustingPath( _path) ) {
            path = (path + '-' + _path); }
        this.each(
            window.$(dataElement).children(),
            function( i, n ) {
                if ( fn( n, path) ) { this.visitNodes( n, path, fn); }},
            this);
    };

    this.convert = function ( args ) {
        var converter = this.state.opts.converter;
        return ( this.isDefinedNotNull( converter) === true ) ?
            converter.call( this, args) : undefined;
    };
}

Horn.prototype.getFeature = function( args ) {
    return this.features[ args.type].call( this, args);
};

Horn.prototype.traverse = function( value, callback, key, context, propName ) {
    if (!(value instanceof jQuery) &&
        ((value instanceof Object) || (value instanceof Array)) &&
        (value.constructor.toString().indexOf( 'Date') < 0) ) { // @todo special date handling here for non recursing into model values
        this.each( value, function( k, v ) {
            this.traverse(
                v, callback, key ? (key + '-' + k) : ("-" + k), value, k);
        }, this);
    } else { callback( key, value, context, propName); }
};

Horn.prototype.splitEach = function( object, delimiter, callback ) {
    this.each( object.toString().split( delimiter !== undefined ?
        delimiter : " "), function( i, token ) {
            if ( token.trim() !== '' ) { callback( token); }
    });
};

Horn.prototype.isAdjustingPath = function ( path ) {
    return (path !== null) &&
        (path !== undefined) && (path.toString().trim() !== '');
};

Horn.prototype.definesArgument = function( args, propertyName ) {
    return (args !== undefined) && (args.hasOwnProperty( propertyName)) &&
        this.isDefinedNotNull( args[ propertyName]);
};

Horn.prototype.isDefinedNotNull = function( ref ) {
    return (ref !== undefined) && (ref !== null);
};

Horn.prototype.bind = function( fn, ctx ) {
    return function() { return fn.apply(ctx, arguments); };
};

Horn.prototype.each = function( collection, fn, ctx ) {
    if ( (collection === undefined) || (collection === null) ) { return; }
    window.$.each( collection, ctx ? this.bind( fn, ctx) : fn);
};

Horn.prototype.didRemoveProperty = function( object, property ) {
    return object.hasOwnProperty( property) && delete object[ property];
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
    this.each( objects, function( i, o ) {
        rv = window.$(o)[0] === window.$(object)[0];
        if ( rv ) { return false; }
    });
    return rv;
};

/**
 *  Copies properties from source into destination.
 *  <p>
 *  Does not copy 'undefined' valued properties.
 *  <p>
 *  Takes args.dest's property names as candidate names to copy from args.src
 *  unless an alternative source of property names is supplied (args.props).
 *
 *  @param args.src     the source from which to copy property values
 *  @param args.dest    the destination into which to copy the property values
 *  @param args.props   an alternative source for the definition of copyable property names
 */
Horn.prototype.copyInto = function( args ) {
    var val;
    this.each( args.props ? args.props : args.dest, function( i, n ) {
        if ( args.src.hasOwnProperty( i) ) {
            val = args.src[ i];
            if ( val !== undefined ) { args.dest[ i] = val; }
        } }, this);
    return args.dest;
};

Horn.prototype.getDOMNodeValue = function( args ) {
    var nodeName = args.node.nodeName.toLowerCase();
    var jNode = window.$(args.node);
    return window.unescape(
        ((nodeName === "input") || (nodeName === 'textarea')) ?
            jNode.val() : ((nodeName === "abbr") ? jNode.attr('title') :
            jNode.text()));
};

Horn.prototype.setDOMNodeValue = function( args ) {
    var nodeName = args.node.nodeName.toLowerCase();
    var jNode = window.$(args.node);
    if ( (nodeName === "input") || (nodeName === 'textarea') ) {
        jNode.val( args.value);
    } else if ( nodeName === "abbr" ) {
        jNode.attr('title', args.value);
    } else { jNode.text( args.value); }
};


if ( !window.Node ) {
    window.$.each( [
        'ELEMENT', 'ATTRIBUTE', 'TEXT',
            'CDATA_SECTION', 'ENTITY_REFERENCE', 'ENTITY',
            'PROCESSING_INSTRUCTION', 'COMMENT', 'DOCUMENT',
            'DOCUMENT_TYPE', 'DOCUMENT_FRAGMENT', 'NOTATION'],
        function( i, n ) {
            window.Node[ n + '_NODE'] = i + 1;
        });
}

window.horn = new Horn();