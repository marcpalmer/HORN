/**
 *  A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *  @author Chris Denman
 *  @author Marc Palmer
 */
Horn = function() {
    var state;

    var setDefaultModel = this.scope( function() {
        if ( !this.isDefinedNotNull( state.model)
            && state.opts.hasOwnProperty( 'defaultModel') ) {
            state.model = state.opts.defaultModel;
        }
    }, this);

    var setDefaultArgs = this.scope( function( args ) {
        var existingArgs = !this.definesArgument( args, 'args') ? {} : args.args;
        if ( this.definesArgument( args, 'defaults') ) {
            $.extend( existingArgs, defaults);
        }
        return existingArgs;
    }, this);

    var getModelReference = this.scope( function( args ) {
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
            if ( !this.isDefinedNotNull( rv.ref) ) { rv = undefined; }
        }
        return rv;
    }, this);

    var setValue = this.scope( function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = this.pathToTokens( {path: path});
            if ( !this.isDefinedNotNull( state.model) ) {
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

    var convert = this.scope( function ( args ) {
        var converter = state.opts.converter;
        if ( this.startsWith( args.path, "-") ) {
            args.path = args.path.substring( 1);
        }
        return this.isDefinedNotNull( converter) ?
            converter.call( this, args) : undefined;
    }, this);

    var addComponent = this.scope( function( args ) {
        var details;
        var culledPath = args.path.substring( 1);
        var rv;
        if ( args.setModel !== false ) {
            details = setValue(  args.value, args.path);
        }
        if ( (state.opts.readOnly === false) && (!args.isJSON) ) {
            if ( this.isDefinedNotNull( details) ) {
                args.context = details.context;
                args.key = details.key;
            }

            if ( !this.isDefinedNotNull( state.components) ) {
                state.components = {}; }
            rv = {node: args.node, value: args.value};
            if ( this.isDefinedNotNull( args.context) ) {
                rv.context = args.context;
                rv.key = args.key;
            }
            state.components[ culledPath] = rv;
        }
    }, this);

    var addComponents = this.scope( function( args ) {
        this.each(
            args.components,
            function( i, newArgs ) {
                var modelValue;
                var textValue;
                var ref = getModelReference( newArgs);
                if ( this.isDefinedNotNull( ref) )  {
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

    var addJSONComponents = this.scope(
        function( args ) {
            var defaults = {type:  'fromJSON', node:  args.node};
            var addJSONHelper = this.scope( function( vargs ) {
                var oldValue = vargs.value;
                vargs.value = convert( vargs);
                if ( !this.isDefinedNotNull( vargs.value) ) {
                    vargs.value = oldValue;
                }
                addComponent( vargs);
            }, this);
            var jsonData = $.evalJSON( args.text);
            var rootPath = args.path;
            if ( typeof jsonData === 'object' ) {
                this.traverse( jsonData,
                    this.scope( function( k, v ) {
                        addJSONHelper( $.extend( defaults,
                            {value: v, path:  rootPath + k}));
                    }, this), '');
            } else {
                addJSONHelper( $.extend( defaults,
                    {value: jsonData, path:  rootPath}));
            }
        }, this);

    var renderComponent = this.scope( function( args ) {
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
                if ( !this.isDefinedNotNull( textValue) ) {
                    textValue = modelValue + "";
                }
                this.setDOMNodeValue( {node: component.node, value: textValue});
                component.value = modelValue;
                return component.node;
            }
        }
    }, this);

    var extract = this.scope( function( args ) {
        var _this = this;
        var rootNodes = this.definesArgument( args, 'rootNodes') ?
            args.rootNodes : (this.definesArgument( args, 'selector') ?
                $(args.selector) : this.rootNodes());
        setDefaultModel();
        this.each( rootNodes,
            function( i, n ) { this.visitNodes( n, '',
                function( n, path ) {
                    if ( _this.hasRootIndicator( { n: n}) ) {
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
                        if ( !_this.isDefinedNotNull( componentData.value) ) {
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
    }, this);

    $.extend(
        this, {

            /**
             * Reset all internal state: the model, and opt
             * <p>
             * Doesn't alter the prototype at all (so stuff added from css / html5) flavours remain.
             */
            reset: function() {
                state = { opts: $.extend( {}, {model: undefined,
                    readOnly:  false})};
            },

            /**
             * Remove component bindings for those elements with a property path
             * that starts with args.stem. Regex supported i think.
             */
            unbind: function( args ) {
                this.each( state.components, function( i, n ) {
                    if ( this.startsWith( i, args.stem ) ) {
                        delete state.components[ i]; } }, this);
            },

             /**
              * load and no bind
              */
             load: function( args ) {
                return extract( setDefaultArgs( {args: args}));
             },

             /**
              * load and bind
              */
             bind: function( args ) {
                return extract( setDefaultArgs( {args: args}));
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
            cloneAndBind: function( args ) {
                var template;
                var pathStem;
                var components = [];
                if ( this.definesArgument( args, 'template') ) {
                    template = args.template;
                } else {
                    template = $(args.selector).clone();
                    template.removeAttr( "id");
                }

                if ( this.definesArgument( args, 'id') ) {
                    template.attr( "id", args.id);
                }

                setDefaultModel();

                pathStem = this.definesArgument( args, 'path') ? args.path : '';

                this.visitNodes( template, pathStem,
                    this.scope( function( n, path ) {
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
            updateDOM: function( args ) {
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
            model: function() {
                return state.model;
            },

            /**
             *  Set an option by name to the given value.
             *  <p>
             *  The following options are currently supported: defaultModel, readOnly, converter
             *  <p>
             *
             *  @param args.optionName   the name of the option to set
             *  @param args.value        the value to set
             */
            option: function( optionName, value ) {
                if ( value !== undefined ) {
                    state.opts[ optionName] = value;
                } else { return state.opts[ optionName]; }
            }
    });

    this.reset();
};

Horn.prototype = {
    scope: function( fn, ctx ) {
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
        this.each( this.isDefinedNotNull( args.props) ?
            args.props : args.dest, function( i, n ) {
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
        $.each( collection, ctx ? this.scope( fn, ctx) : fn);
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
            if ( this.isAdjustingPath( key) ) {
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

$(function() {
    horn = new Horn();
    if ( horn.option( "readOnly") === false ) {
        horn.load();
    } else {
        horn.bind();
    }
});