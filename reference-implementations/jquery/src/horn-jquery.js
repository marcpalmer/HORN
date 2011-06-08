/**
 *  A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *  @author Chris Denman
 *  @author Marc Palmer
 */
window.Horn = function() {
    var state;

    var setDefaultModel = function() {
        if ( (state.model === undefined) &&
            (state.opts.hasOwnProperty( 'defaultModel')) ) {
            state.model = state.opts.defaultModel;
        }
    };

    var getModelReference = this.bind( function( args ) {
        var rv;
        var tokens = this.pathToTokens( args);
        var length = tokens.length;
        if ( length > 0 ) {
            rv = {ref: state.model, key: tokens[ length - 1]};
            tokens.length = tokens.length - 1;
            this.each( tokens, function( i, n ) {
                if ( this.isDefinedNotNull( rv.ref) ) {
                    if ( rv.ref.hasOwnProperty( n) ) { rv.ref = rv.ref[ n]; }
                } else { return false; }
            }, this);
            if ( this.isDefinedNotNull( rv.ref) === false ) { rv = undefined; }
        }
        return rv;
    }, this);

    var setValue = this.bind( function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = this.pathToTokens( {path: path});
            if ( state.model === undefined ) {
                state.model = (!isNaN( parseInt( path[ 0])) ? [] : {});
            }
            parentContext = state.model;
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
                return setValue( value, path, subContext);
            } else {
                parentContext[ token] = value;
                return {context: parentContext, key: token, value: value};
            }
        }
    }, this);

    var convert = this.bind( function ( args ) {
        var converter = state.opts.converter;
        if ( this.startsWith( args.path, "-") ) {
            args.path = args.path.substring( 1);
        }
        return ( this.isDefinedNotNull( converter) === true ) ?
            converter.call( this, args) : undefined;
    }, this);

    var addComponent = this.bind( function( args ) {
        var details;
        var culledPath = args.path.substring( 1);
        var rv;
        if ( args.setModel !== false ) {
            details = setValue(  args.value, args.path);
        }
        if ( (state.opts.storeBackRefs === true) && (!args.isJSON) ) {
            if ( this.isDefinedNotNull( details) === true ) {
                args.context = details.context;
                args.key = details.key;
            }
            if ( state.components === undefined ) {
                state.components = {}; }
            rv = {node: args.node, value: args.value};
            if ( this.isDefinedNotNull( args.context) === true ) {
                rv.context = args.context;
                rv.key = args.key;
            }
            state.components[ culledPath] = rv;
        }
    }, this);

    var addComponents = this.bind( function( args ) {
        this.each(
            args.components,
            function( i, newArgs ) {
                var modelValue;
                var textValue;
                var ref = getModelReference( newArgs);
                if ( this.isDefinedNotNull( ref) === true )  {
                    modelValue = ref.ref[ ref.key];
                    textValue = convert( {
                        value: modelValue,
                        path:  newArgs.path,
                        type:  'toText',
                        node:  newArgs.node
                    });
                    if ( (textValue === undefined) &&
                        this.isDefinedNotNull( modelValue)) {
                        textValue = modelValue + "";
                    }
                    newArgs.text = textValue;
                    this.setDOMNodeValue( {node: newArgs.node,
                        value: newArgs.text});
                    addComponent({
                        setModel: false,
                        node: newArgs.node,
                        context: ref.ref,
                        key: ref.key,
                        value: modelValue,
                        path: newArgs.path});
                }
            }, this);
    }, this);

    var addJSONComponents = this.bind(
        function( args ) {
            var defaults = {type:  'fromJSON', node:  args.node};
            var addJSONHelper = this.bind( function( args ) {
                var oldValue = args.value;
                args.value = convert( args);
                if ( this.isDefinedNotNull( args.value) === false ) {
                    args.value = oldValue;
                }
                addComponent( args);
            }, this);
            var jsonData = $.evalJSON( args.text);
            var rootPath = args.path;
            if ( typeof jsonData === 'object' ) {
                this.traverse( jsonData,
                    this.bind( function( k, v ) {
                        addJSONHelper( $.extend( defaults,
                            {value: v, path:  rootPath + k}));
                    }, this), '');
            } else {
                addJSONHelper( $.extend( defaults,
                    {value: jsonData, path:  rootPath}));
            }
        }, this);

    var renderComponent = this.bind( function( args ) {
        var rootNode = args.rootNode;
        var component = args.component;
        var modelValue = component.context[ component.key];
        var textValue;
        if ( modelValue !== component.value ) {
            if ( !rootNode || (rootNode &&
                this.contains( $(component.node).parents(), rootNode)) ) {
                textValue = convert( {
                    value: modelValue,
                    path:  args.path,
                    type:  'toText',
                    node: component.node});
                if ( this.isDefinedNotNull( textValue) === false) {
                    textValue = modelValue + "";
                }
                this.setDOMNodeValue( {node: component.node, value: textValue});
                component.value = modelValue;
                return component.node;
            }
        }
    }, this);

    $.extend(
        this, {

            /**
             * Reset all internal state: the model, and opt
             * <p>
             * Doesn't alter the prototype at all (so stuff added from css / html5) flavours remain.
             * <p>
             * The html5 / css impls are NOT stateful currently.
             */
            reset: function() {
                state = { opts: $.extend( {}, {model: undefined,
                    storeBackRefs:  true})};
            },

            /**
             * Remove component bindings for those elements with a property path
             * that starts with args.stem. Regex supported i think.
             */
            removeComponents: function( args ) {
                this.each( state.components, function( i, n ) {
                    if ( this.startsWith( i, args.stem ) ) {
                        delete state.components[ i]; } }, this);
            },

            /**
             *  Extract HORN data from the DOM and build a data model from it.
             *  <p>
             *  After extraction the model can be retrieved using
             *  horn.getModel(),
             *  this function also returns the model.
             *  <p>
             *  Data is extracted from the DOM either by locating all Horn
             *  'root nodes' and then traversing them for data. Alternatively,
             *  the DOM nodes to traverse can be specified by either a jQuery
             *  selector or list of elements.
             *  <p>
             *  If multiple elements with the same effective property path are
             *  encountered, the final such one takes effect.
             *
             *
             *  @param args.selector    optional jQuery selector used to select
             *      the nodes to extract a Horn data model from, overrides
             *      default mechanism when supplied
             *  @param args.rootNodes   optional object of nodes that can be
             *      traversed using <code>jQuery.each( ... )</code> use to
             *      extract a Horn data model from, overrides default mechanism
             *      when supplied.
             */
            extract: function( args ) {
                var _this = this;
                var rootNodes = this.definesArgument( args, 'rootNodes') ?
                    args.rootNodes : (this.definesArgument( args, 'selector') ?
                        $(args.selector) : this.rootNodes());
                setDefaultModel();
                this.each( rootNodes,
                    function( i, n ) { this.visitNodes( n, '',
                        function( n, path ) {
                            if ( _this.hasRootIndicator( { n: n}) === true ) {
                                return false; }
                            var componentData = _this.getComponentData( n, path);
                            if ( componentData === false ) {
                                return true; }
                            if ( componentData.isJSON === false ) {
                                componentData.value = convert( {
                                    value: componentData.text,
                                    path:  componentData.path,
                                    type:  'fromText',
                                    node:  componentData.node
                                });
                                if ( _this.isDefinedNotNull(
                                    componentData.value) === false ) {
                                    componentData.value = componentData.text;
                                }
                                addComponent( componentData);
                            } else {
                                addJSONComponents( componentData);
                            }
                            return false;
                        }
                    ); }, this);
                return state.model;
            },

            /**
             * Create a new UI element by cloning an existing template that is
             * marked up with HORN indicators, and populate the DOM nodes with
             * data from the specified property path.
             *
             * The args parameter supports the following arguments:
             *
             * template - A jQuery object representing the DOM template to clone
             * id - The new "id" attribute value for the cloned DOM node
             * path - The property path within the model, to use to populate
             * this DOM node and its descendents
             */
            newFromTemplate: function( args ) {
                var template;
                var components = [];
                if ( this.definesArgument( args, 'template') === true ) {
                    template = args.template;
                } else {
                    template = $(args.selector).clone();
                    template.removeAttr( "id");
                }

                if ( this.definesArgument( args, 'id') === true ) {
                    template.attr( "id", args.id);
                }

                setDefaultModel();
                this.visitNodes( template, args.path ? args.path : '',
                    this.bind( function( n, path ) {
                        return this.handleTemplateValue( n, path, components);
                    }, this));

                addComponents({components: components});

                return template;
            },

            /**
             *  Refresh DOM nodes with their current model values.
             *  <p>
             *
             *  @param args.rootNode   optional DOM node such that if supplied,
             *      only nodes under this node will be updated.
             *
             *  @return a list of nodes that had their sreen value changed
             */
            render: function( args ) {
                var alteredNodes = [];
                this.each( state.components, function( i, n ) {
                    var node = renderComponent( {rootNode: this.definesArgument(
                        args, 'rootNode') ? args.rootNode : undefined,
                            component: n, path: i});
                    if ( this.isDefinedNotNull( node) ) {
                        alteredNodes.push( node); }
                }, this);
                return alteredNodes;
            },

            /**
             *  Return the Horn model.
             *
             *  @return the current model
             */
            getModel: function() {
                return state.model;
            },

            /**
             *  Set an option by name to the given value.
             *  <p>
             *  The following options are currently supported: defaultModel, storeBackRefs, conveter
             *  <p>
             *
             *  @param args.optionName   the name of the option to set
             *  @param args.value        the value to set
             */
            option: function( optionName, value ) {
                if ( this.isDefinedNotNull( optionName) ) {
                    state.opts[ optionName] = value; }
            }
    });

    this.reset();
}

Horn.prototype = {
    bind: function( fn, ctx ) {
        return function() { return fn.apply(ctx, arguments); };
    },

    contains: function( objects, object ) {
        var rv = null;
        this.each( objects, function( i, o ) {
            rv = $(o)[0] === $(object)[0];
            if ( rv ) { return false; }
        });
        return rv;
    },

    /**
     *  Copies properties from source into destination.
     *  <p>
     *  Does not copy 'undefined' valued properties.
     *  <p>
     *  Takes args.dest's property names as candidate names to copy from
     *  args.src unless an alternative source of property names is supplied
     *  (args.props).
     *
     *  @param args.src     the source from which to copy property values
     *  @param args.dest    the destination into which to copy the property
     *      values
     *  @param args.props   an alternative source for the definition of copyable
     *      property names
     */
    copyInto: function( args ) {
        var val;
        this.each( args.props ? args.props : args.dest, function( i, n ) {
            if ( args.src.hasOwnProperty( i) ) {
                val = args.src[ i];
                if ( val !== undefined ) { args.dest[ i] = val; }
            } }, this);
    },

    definesArgument: function( args, propertyName ) {
        return (args !== undefined) && (args.hasOwnProperty( propertyName)) &&
            this.isDefinedNotNull( args[ propertyName]);
    },

    didRemoveProperty: function( object, property ) {
        return object.hasOwnProperty( property) && delete object[ property];
    },

    each: function( collection, fn, ctx ) {
        if ( (collection === undefined) || (collection === null) ) { return; }
        $.each( collection, ctx ? this.bind( fn, ctx) : fn);
    },

    getComponentData: function( node, parentPath ) {
        var theContained;
        var nodeName;
        var path = this.pathIndicator({n: node});
        var contents = $($(node).contents());
        var cd = {
            isJSON: this.jsonIndicator({n: node}),
            path: this.isAdjustingPath( path),
            node: node};
        var contentsSize = contents.size();
        var isEmptyNode = contentsSize === 0;
        if ( (contentsSize === 1) || (isEmptyNode && !cd.isJSON))  {
            if ( !isEmptyNode ) { theContained = contents[0]; }
            if ( cd.isJSON || cd.path ) {
                cd.path = cd.path ? (parentPath + '-' + path) : parentPath;
                nodeName = node.nodeName.toLowerCase();
                cd.isFormElementNode =
                    (nodeName === 'input') || (nodeName === 'textarea');
                cd.isABBRNode = !cd.isFormElementNode &&
                    (nodeName.toLowerCase() === "abbr");
                cd.isTextNode = !cd.isABBRNode && (isEmptyNode ||
                    (theContained.nodeType === Node.TEXT_NODE));

                if ( cd.isFormElementNode || cd.isTextNode || cd.isABBRNode ) {
                    cd.text = this.getDOMNodeValue( {node: node});
                    return cd;
                }
            }
        }
        return false;
    },

    getDOMNodeValue: function( args ) {
        var nodeName = args.node.nodeName.toLowerCase();
        var jNode = $(args.node);
        return unescape(
            ((nodeName === "input") || (nodeName === 'textarea')) ?
                jNode.val() : ((nodeName === "abbr") ? jNode.attr('title') :
                jNode.text()));
    },

    getIfSingleTextNode: function( element ) {
        var theContained;
        var contained = $($(element).contents());
        if ( contained.size() === 1 ) {
            theContained = contained[ 0];
            if ( theContained.nodeType === Node.TEXT_NODE ) {
                return unescape( theContained.nodeValue);
            }
        }
        return null;
    },

    handleTemplateValue: function( node, path, components ) {
        var key;
        var componentData = this.getComponentData( node, path);
        if ( componentData !== false ) {
            key = this.pathIndicator({n: node});
            if ( this.isAdjustingPath( key) === true ) {
            componentData.path = (path + '-' + key); }
            if ( !componentData.isJSON  ) {
            components.push( componentData); }
            return false;
        }
        return true;
    },

    isAdjustingPath: function ( path ) {
        return this.isDefinedNotNull( path) && (path.toString().trim() !== '');
    },

    isAttached: function( ref ) { return $(ref).parents(':last').is('html'); },

    isDefinedNotNull: function( ref ) {
        return (ref !== undefined) && (ref !== null);
    },

    pathToTokens: function( args ) {
        return (this.startsWith( args.path, "-") ?
            args.path.substring( 1) : args.path).split( "-");
    },

    setDOMNodeValue: function( args ) {
        var nodeName = args.node.nodeName.toLowerCase();
        var jNode = $(args.node);
        if ( (nodeName === "input") || (nodeName === 'textarea') ) {
            jNode.val( args.value);
        } else if ( nodeName === "abbr" ) {
            jNode.attr('title', args.value);
        } else { jNode.text( args.value); }
    },

    splitEach: function( object, delimiter, callback ) {
        this.each( object.toString().split( delimiter !== undefined ?
            delimiter : " "), function( i, token ) {
                if ( token.trim() !== '' ) { callback( token); }
        });
    },

    startsWith: function ( value, stem ) {
        return  (stem.length > 0) &&
            ((value = value.match( "^" + stem)) !== null) &&
                (value.toString() === stem);
    },

    traverse: function( value, callback, key, context, propName ) {
        if ( (value instanceof Object) || (value instanceof Array) ) {
            this.each( value, function( k, v ) { this.traverse( v, callback,
                key ? (key + '-' + k) : ("-" + k), value, k);
            }, this);
        } else { callback( key, value, context, propName); }
    },

    visitNodes: function( dataElement, path, fn ) {
        var _path = this.pathIndicator({n: dataElement});
        if ( this.isAdjustingPath( _path) ) { path = (path + '-' + _path); }
        this.each( window.$(dataElement).children(), function( i, n ) {
            if ( fn( n, path) ) { this.visitNodes( n, path, fn); }}, this);
    }
};

if ( !Node ) {
    $.each( [
        'ELEMENT', 'ATTRIBUTE', 'TEXT',
            'CDATA_SECTION', 'ENTITY_REFERENCE', 'ENTITY',
            'PROCESSING_INSTRUCTION', 'COMMENT', 'DOCUMENT',
            'DOCUMENT_TYPE', 'DOCUMENT_FRAGMENT', 'NOTATION'],
        function( i, n ) {
            Node[ n + '_NODE'] = i + 1;
        });
}

horn = new Horn();