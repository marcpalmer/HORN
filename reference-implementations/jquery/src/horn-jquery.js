
/**
 *  @fileOverview A reference implementation of HORN 1.0 on JS/JQuery/JQuery UI.
 *
 *  @author <a href="mailto:cdenman@me.com">Chris Denman</a>
 *  @author <a href="mailto:marc@anyware.co.uk">Marc Palmer</a>
 *
 *  @version 1.0
 *
 *  @requires JQuery
 */

/**
 *  Used to create new Horn instances.
 *
 *  @constructor
 */
var Horn = function() {

    /**
     *  @private
     *  @field
     */
    var state;

    /**
     * @private
     * @function
     */
    var setDefaultModel = this.scope( function() {
        if ( !this.isDefinedNotNull( state.model)
            && state.opts.hasOwnProperty( 'defaultModel') ) {
            state.model = state.opts.defaultModel;
        }
    }, this);

    /**
     * @private
     * @function
     */
    var setDefaultArgs = this.scope( function( args ) {
        var existingArgs = !this.definesProperty( args, 'args') ? {} : args.args;
        if ( this.definesProperty( args, 'defaults') ) {
            $.extend( existingArgs, args.defaults);
        }
        return existingArgs;
    }, this);

    /**
     * @private
     * @function
     */
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

    /**
     * @private
     * @function
     */
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

    /**
     * @private
     * @function
     */
    var convert = this.scope( function ( args ) {
        var converter = state.opts.converter;
        if ( this.startsWith( args.path, "-") ) {
            args.path = args.path.substring( 1);
        }
        return this.isDefinedNotNull( converter) ?
            converter.call( this, args) : undefined;
    }, this);

    /**
     * @private
     * @function
     */
    var addBinding = this.scope( function( args ) {
        var details;
        var culledPath = args.path.substring( 1);
        var rv;
        if ( args.setModel !== false ) {
            details = setValue(  args.value, args.path);
        }
        if ( (args.readOnly === false) && (!args.isJSON) ) {
            if ( this.isDefinedNotNull( details) ) {
                args.context = details.context;
                args.key = details.key;
            }

            if ( !this.isDefinedNotNull( state.bindings) ) {
                state.bindings = {}; }
            rv = {node: args.node, value: args.value};
            if ( this.isDefinedNotNull( args.context) ) {
                rv.context = args.context;
                rv.key = args.key;
            }
            state.bindings[ culledPath] = rv;
        }
    }, this);

    /**
     * @private
     * @function
     */
    var addBindings = this.scope( function( args ) {
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
                    addBinding({
                        setModel: false,
                        node: newArgs.node,
                        context: ref.ref,
                        key: ref.key,
                        value: modelValue,
                        path: newArgs.path});
                }
            }, this);
    }, this);

    /**
     * @private
     * @function
     */
    var addJSONBindings = this.scope(
        function( args ) {
            var defaults = {type:  'fromJSON', node:  args.node,
                readOnly: args.readOnly};
            var addJSONHelper = this.scope( function( vargs ) {
                var oldValue = vargs.value;
                vargs.value = convert( vargs);
                if ( !this.isDefinedNotNull( vargs.value) ) {
                    vargs.value = oldValue;
                }
                addBinding( vargs);
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

    /**
     * @private
     * @function
     */
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

    /**
     * @private
     * @function
     */
    var extract = this.scope( function( args ) {
        var _this = this;
        var rootNodes = this.definesProperty( args, 'rootNodes') ?
            args.rootNodes : (this.definesProperty( args, 'selector') ?
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

                    componentData.readOnly = args.readOnly;
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
                        addBinding( componentData);
                    } else {
                        addJSONBindings( componentData);
                    }
                    return false;
                }
            ); }, this);
        return state.model;
    }, this);

    /**
     *  Resets all internal state: the model, all options and bindings.
     *
     *  @public
     */
    this.reset = function() {
        state = { opts: $.extend( {}, {model: undefined,
            readOnly:  false})};
    };

    /**
     *  Removes either, all bindings or, all bindings with property paths that match a given regex pattern.
     *
     *  @param {Object} [args] all arguments for this function
     *  @param {String|Object} [args.pattern] a regular expression pattern to match against, converted to a String using toString() before use
     *
     *  @public
     */
    this.unbind = function( args ) {
        var pat = this.definesProperty( args, 'pattern') ?
            args.pattern.toString() : false;
        this.each( state.bindings, function( i, n ) {
            if ( (pat === false) || (i.match( pat) !== null) ) {
                delete state.bindings[ i]; } }, this);
    };

    /**
     *
     *  @param {Object} [args] all arguments for this function
     *
     *  @return
     *
     *  @public
     */
    this.load = function( args ) {
        return extract( setDefaultArgs( {args: args, defaults: {readOnly: true}}));
    };

    /**
     *  bind and load
     *
     *  @param {Object} [args] all arguments for this function
     *
     *  @return
     *
     *  @public
     */
    this.bind = function( args ) {
        return extract( setDefaultArgs( {args: args, defaults: {readOnly: false}}));
    };

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
     * this DOM node and its descendants
     *
     *  @param {Object} [args] all arguments for this function
     *
     *  @return the cloned template
     *
     *  @public
     */
    this.cloneAndBind = function( args ) {
        var template;
        var pathStem;
        var components = [];
        if ( this.definesProperty( args, 'template') ) {
            template = args.template;
        } else {
            template = $(args.selector).clone();
            template.removeAttr( "id");
        }

        if ( this.definesProperty( args, 'id') ) {
            template.attr( "id", args.id);
        }

        setDefaultModel();

        pathStem = this.definesProperty( args, 'path') ? args.path : '';

        this.visitNodes( template, pathStem,
            this.scope( function( n, path ) {
                return this.handleTemplateValue( n, path, components);
            }, this));

        addBindings({components: components});

        return template;
    };

    /**
     *  Update all bound DOM nodes with their current model values.
     *
     *  @param {Object} [args] all arguments for this function
     *  @param args.rootNode optional DOM node such that if supplied, only nodes under this node will be updated.
     *
     *  @return a list of nodes that had their sreen value changed
     *
     *  @public
     */
    this.updateDOM = function( args ) {
        var alteredNodes = [];
        this.each( state.bindings, function( i, n ) {
            var node = renderComponent( {rootNode: this.definesProperty(
                args, 'rootNode') ? args.rootNode : undefined,
                    component: n, path: i});
            if ( this.isDefinedNotNull( node) ) {
                alteredNodes.push( node); }
        }, this);
        return alteredNodes;
    };

    /**
     *  Returns the model
     *
     *  @return the model
     *
     *  @public
     */
    this.model = function() {
        return state.model;
    };

    /**
     *  Get an option's value by name, or set an option's value by name.
     *  <p>
     *  If no value is provided, the value of the named option is returned.
     *  <p>
     *
     *  The following options are currently supported: defaultModel, readOnly, converter
     *  <p>
     *
     *  @param {Object} optionName the name of the option to set
     *  @param {Object} [value] the value to set
     *
     *  @return
     *
     *  @public
     */
    this.option = function( optionName, value ) {
        if ( value !== undefined ) {
            state.opts[ optionName] = value;
        } else { return state.opts[ optionName]; }
    };

    this.reset();
};

Horn.prototype = {

    /**
     *  Returns <code>true</code> if a container contains an item.
     *  <p>
     *  Equality testing is performed with <code>===</code>.
     *
     *  @param container the container to search
     *  @param {Object} item the item to search for
     *
     *  @return <code>true</code> if the item was found, <code>false</code>
     *  otherwise
     *
     *  @methodOf Horn.prototype
     */
    contains: function( container, item ) {
        var rv = null;
        this.each( container, function( i, o ) {
            rv = $(o)[0] === $(item)[0];
            if ( rv ) { return false; }
        });
        return rv;
    },

    /**
     *  Shallow copies properties from source to destination objects.
     *  <p>
     *  Neither copies, <code>undefined</code> valued properties, nor
     *  prototypical properties.
     *  <p>
     *  The source of property names to copy is given by args.dest's property
     *  names unless the optional args.props is supplied in which case it is
     *  used instead.
     *
     *  @param {Object} args all arguments for this function
     *  @param {Object} args.src the property source
     *  @param {Object} args.dest the property destination
     *  @param {Object} [args.props] an alternative source of property names
     *
     *  @methodOf Horn.prototype
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

    /**
     *  Does an arguments <code>Object</code> define a given property.
     *  <p>
     *  The property can not be a prototypical property nor
     *  <code>undefined</code> or <code>null</code>.
     *
     *  @param args the object to check for the given property
     *  @param propertyName the name of the property to check for
     *
     *  @return <code>true</code> if the arguments do define the given property, <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    definesProperty: function( args, propertyName ) {
        return (args !== undefined) && (args.hasOwnProperty( propertyName)) &&
            this.isDefinedNotNull( args[ propertyName]);
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param object
     *  @param property
     *
     *  @return <code>true</code> if , <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    didRemoveProperty: function( object, property ) {
        return object.hasOwnProperty( property) && delete object[ property];
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param collection
     *  @param fn
     *  @param ctx
     *
     *  @return
     *
     *  @methodOf Horn.prototype
     */
    each: function( collection, fn, ctx ) {
        if ( (collection === undefined) || (collection === null) ) { return; }
        $.each( collection, ctx ? this.scope( fn, ctx) : fn);
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param node
     *  @param parentPath
     *
     *  @return
     *
     *  @methodOf Horn.prototype
     */
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

    /**
     *  xxxx
     *  <p>
     *
     *  @param {Object} args all arguments for this function
     *  @param
     *
     *  @methodOf Horn.prototype
     */
    getDOMNodeValue: function( args ) {
        var nodeName = args.node.nodeName.toLowerCase();
        var jNode = $(args.node);
        return unescape(
            ((nodeName === "input") || (nodeName === 'textarea')) ?
                jNode.val() : ((nodeName === "abbr") ? jNode.attr('title') :
                jNode.text()));
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param element
     *
     *  @return
     *
     *  @methodOf Horn.prototype
     */
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

    /**
     *  xxxx
     *  <p>
     *
     *  @param node
     *  @param path
     *  @param components
     *
     *  @return
     *
     *  @methodOf Horn.prototype
     */
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

    /**
     *  xxxx
     *  <p>
     *
     *  @param path
     *
     *  @return <code>true</code> if , <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isAdjustingPath: function ( path ) {
        return this.isDefinedNotNull( path) && (path.toString().trim() !== '');
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param ref
     *
     *  @return <code>true</code> if , <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isAttached: function( node ) { return $(node).parents(':last').is('html'); },

    /**
     *  xxxx
     *  <p>
     *
     *  @param args
     *
     *  @return <code>true</code> if , <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isDefinedNotNull: function( ref ) {
        return (ref !== undefined) && (ref !== null);
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param {Object} args all arguments for this function
     *  @param
     *
     *  @return
     *
     *  @methodOf Horn.prototype
     */
    pathToTokens: function( args ) {
        return (this.startsWith( args.path, "-") ?
            args.path.substring( 1) : args.path).split( "-");
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param value
     *  @param stem
     *
     *  @return
     *
     *  @methodOf Horn.prototype
     */
    scope: function( fn, ctx ) {
        return function() { return fn.apply(ctx, arguments); };
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param {Object} args all arguments for this function
     *  @param
     *
     *  @methodOf Horn.prototype
     */
    setDOMNodeValue: function( args ) {
        var nodeName = args.node.nodeName.toLowerCase();
        var jNode = $(args.node);
        if ( (nodeName === "input") || (nodeName === 'textarea') ) {
            jNode.val( args.value);
        } else if ( nodeName === "abbr" ) {
            jNode.attr('title', args.value);
        } else { jNode.text( args.value); }
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param object
     *  @param delimiter
     *  @param callback
     *
     *  @methodOf Horn.prototype
     */
    splitEach: function( object, delimiter, callback ) {
        this.each( object.toString().split( delimiter !== undefined ?
            delimiter : " "), function( i, token ) {
                if ( token.trim() !== '' ) { callback( token); }
        });
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param value
     *  @param stem
     *
     *  @return <code>true</code> if , <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    startsWith: function ( value, stem ) {
        return  (stem.length > 0) &&
            ((value = value.match( "^" + stem)) !== null) &&
                (value.toString() === stem);
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param value
     *  @param callback
     *  @param key
     *  @param context
     *  @param propName
     *
     *  @methodOf Horn.prototype
     */
    traverse: function( value, callback, key, context, propName ) {
        if ( (value instanceof Object) || (value instanceof Array) ) {
            this.each( value, function( k, v ) { this.traverse( v, callback,
                key ? (key + '-' + k) : ("-" + k), value, k);
            }, this);
        } else { callback( key, value, context, propName); }
    },

    /**
     *  xxxx
     *  <p>
     *
     *  @param dataElement
     *  @param path
     *  @param fn
     *
     *  @methodOf Horn.prototype
     */
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