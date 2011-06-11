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
 *
 *  @return {Horn} a newly initialized Horn instance
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
            args.bindings,
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
                    this.setHornDOMNodeValue( {node: newArgs.node,
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
                    }, this));
            } else {
                addJSONHelper( $.extend( defaults,
                    {value: jsonData, path:  rootPath}));
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
                    var bindingData = _this.hasHornBinding( n, path);
                    if ( bindingData === false ) {
                        return true; }
                    bindingData.readOnly = args.readOnly;
                    if ( bindingData.isJSON === false ) {
                        bindingData.value = convert( {
                            value: bindingData.text,
                            path:  bindingData.path,
                            type:  'fromText',
                            node:  bindingData.node
                        });
                        if ( !_this.isDefinedNotNull( bindingData.value) ) {
                            bindingData.value = bindingData.text;
                        }
                        addBinding( bindingData);
                    } else {
                        addJSONBindings( bindingData);
                    }
                    return false;
                }
            ); }, this);
        return state.model;
    }, this);

    /**
     * @private
     * @function
     */
    var getModelReference = this.scope( function( args ) {
        var rv;
        var tokens = this.pathToTokens( args.path);
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
     *  @private
     *  @function
     */
    var handleTemplateBinding = this.scope( function( node, path, bindings ) {
        var key;
        var bindingData = this.hasHornBinding( node, path);
        if ( bindingData !== false ) {
            key = this.pathIndicator({n: node});
            if ( this.isAdjustingPath( key) ) {
            bindingData.path = (path + '-' + key); }
            if ( !bindingData.isJSON  ) {
            bindings.push( bindingData); }
            return false;
        }
        return true;
    }, this);

    /**
     * @private
     * @function
     */
    var render = this.scope( function( args ) {
        var rootNode = args.rootNode;
        var binding = args.binding;
        var modelValue = binding.context[ binding.key];
        var textValue;
        if ( modelValue !== binding.value ) {
            if ( !rootNode || (rootNode &&
                this.contains( $(binding.node).parents(), rootNode)) ) {
                textValue = convert( {
                    value: modelValue,
                    path:  args.path,
                    type:  'toText',
                    node: binding.node});
                if ( !this.isDefinedNotNull( textValue) ) {
                    textValue = modelValue + "";
                }
                this.setHornDOMNodeValue( {node: binding.node, value: textValue});
                binding.value = modelValue;
                return binding.node;
            }
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
    var setValue = this.scope( function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = this.pathToTokens( path);
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
     *  Walk DOM tree(s) and extract model data, allowing for subsequent
     *  updating.
     *  <p>
     *  After execution, each value element encountered will have a
     *  corresponding representation in the model. Altering such model
     *  values and then calling <code>updateDOM(...)</code> will refresh their
     *  displayed value.
     *  <p>
     *  The DOM tree(s) to walk can be specified in exactly one of three ways:
     *  <ol>
     *      <li>
     *          Horn will automatically find all DOM trees that have a root
     *          indicator.
     *      </li>
     *      <li>
     *          Passing a collection of DOM elements as
     *          <code>args.rootNodes</code>.
     *      </li>
     *      <li>
     *          Passing a JQuery selector string as <code>args.selector.</code>
     *      </li>
     *  </ol>
     *  <p>
     *  Before a value is stored in the model it is converted to its
     *  <code>String</code> representation. Alternatively, applications can
     *  register converter functions to override this default behaviour.
     *  <p>
     *  If later, model to DOM updates are not required, the alternative yet
     *  otherwise identical function, <code>{@link Horn#load}</code> should be
     *  used.
     *
     *  @param {Object} [rootNodes] a collection of DOM nodes to bind from, overrides
     *      the default node selection mechanism
     *  @param {String} [selector] a jQuery DOM node selector for nodes to bind
     *      from,
     *
     *  @return the updated model
     *
     *  @see Horn#option for the detailing of converter functions
     *  @see Horn#load
     *
     *  @public
     */
    this.bind = function( args ) {
        return extract(
            setDefaultArgs( {args: args, defaults: {readOnly: false}}));
    };

    /**
     *  Clone an HTML template, then walk it, binding values encountered.  
     *  <p>
     *  
     *
     *  Create a new UI element by cloning an existing template that is
     *  marked up with Horn indicators, and populate the DOM nodes with
     *  data from the specified property path.
     *
     *  @param {String} args.path the property path within the model, to use to populate
     *      this DOM node and its descendants
     *
     *  @param {Object} [args.data]
     *  @param {Element|String} [args.node] a jQuery node or selector String
     *  @param {Element|String} [args.template] jQuery node or selector String
     *  @param [args.id] the new 'id' attribute value for a cloned args.template
     *
     *  @return the newly cloned and populated template
     *
     *  @public
     */
    this.bindTo = function( args ) {
        var node;
        var pathStem;
        var bindings = [];
        if ( this.definesProperty( args, 'node') ) {
            node = $(args.node);
        } else {
            node = $(args.template).clone();
            node.removeAttr( "id");
            if ( this.definesProperty( args, 'id') ) {
               node.attr( "id", args.id);
            }
        }

        setDefaultModel();

        pathStem = this.definesProperty( args, 'path') ? args.path : '';

        this.visitNodes( node, pathStem,
            this.scope( function( n, path ) {
                return handleTemplateBinding( n, path, bindings);
            }, this));

        addBindings({bindings: bindings});

        return node;
    };

    /**
     *  Identical to {@link Horn#bind} except that subsequent model changes are
     *  not reflected in the DOM.
     *
     *  @param args identical to those used in {@link Horn#bind}
     *
     *  @see Horn#load
     *
     *  @public
     */
    this.load = function( args ) {
        return extract( setDefaultArgs( {args: args, defaults: {readOnly: true}}));
    };

    /**
     *  Returns the model.
     *
     *  @return {Object} the model
     *
     *  @public
     */
    this.model = function() {
        return state.model;
    };

    /**
     *  Get an option's value by name, or set an option's value by name.
     *  <p>
     *  If no value is provided, the value of the named option is returned,
     *  otherwise the return value is undefined.
     *  <p>
     *  The following options are currently supported:<br>
     *  <ul>
     *      <li><strong>defaultModel</strong> - for setting an explicit default
     *          model (<code>Object</code> or <code>Array</code>)</li>
     *      <li><strong>readOnly</strong> - </li>
     *      <li><strong>converter</strong> - </li>
     *  </ul>
     *
     *  @param {Object} optionName the name of the option to set
     *  @param {Object} [value] the value to set
     *
     *  @return the value of the named option if no value supplied else
     *      <code>undefined</code>
     *
     *  @public
     */
    this.option = function( optionName, value ) {
        if ( value !== undefined ) {
            state.opts[ optionName] = value;
        } else { return state.opts[ optionName]; }
    };

    /**
     *  Resets this instance's internal state: the model, the 'defaultModel',
     *  'readOnly' and 'converter' options.
     *
     *  @see Horn#option
     *
     *  @public
     */
    this.reset = function() {
        state = { opts: $.extend( {}, {model: undefined, readOnly:  false})};
    };

    /**
     *  Removes either, all bindings or, all bindings with property paths that
     *  match a given regex pattern.
     *
     *  @param {String|Object} [args.pattern] a regular expression pattern to
     *      match against, converted to a String using toString() before use
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
     *  Update all bound DOM nodes with their current model values, if altered.
     *  <p>
     *  This function will not update DOM nodes if their model value has not
     *  changed.
     *
     *  @param args.rootNode optional DOM node such that if supplied, only nodes
     *      under this nodes will be updated.
     *
     *  @return {Array} an array of nodes that had their DOM values changed
     *
     *  @public
     */
    this.updateDOM = function( args ) {
        var alteredNodes = [];
        this.each( state.bindings, function( i, n ) {
            var node = render( {rootNode: this.definesProperty(
                args, 'rootNode') ? args.rootNode : undefined,
                    binding: n, path: i});
            if ( this.isDefinedNotNull( node) ) {
                alteredNodes.push( node); }
        }, this);
        return alteredNodes;
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
     *  @return {Boolean} <code>true</code> if the item was found,
     *  <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     *
     *  @todo change here caused a test to fail, look at what's going on
     *  good coverage on tests that use this method
     */
    contains: function( container, item ) {
        return this.indexOf(container, item) !== undefined;
    },

    /**
     *  Shallow copies properties from source to destination objects.
     *  <p>
     *  Copies neither, <code>undefined</code> nor prototypical, properties.
     *  <p>
     *  The source of property names to copy is given by
     *  <code>args.dest</code>'s property names, unless the optional
     *  <code>args.props</code> argument is supplied, in which case it is used
     *  instead.
     *
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
     *  Determines if a collection defines a named property.
     *  <p>
     *  The property can be neither, prototypical nor <code>undefined</code>
     *  nor <code>null</code>.
     *
     *  @param args the object to check for the given property
     *  @param propertyName the name of the property to check for
     *
     *  @return {Boolean} <code>true</code> if the arguments do define the given property,
     *      <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    definesProperty: function( args, propertyName ) {
        return (args !== undefined) && (args.hasOwnProperty( propertyName)) &&
            this.isDefinedNotNull( args[ propertyName]);
    },

    /**
     *  Calls a callback function for each of an object's properties.
     *  <p>
     *  An optional scope context can be provided which will provide the 'this'
     *  for the callback function.
     *  <p>
     *  The callback function should have the following signature
     *  <strong>( i, n )</strong> : where i is the propertyName and n is the item.
     *
     *  @param {Object} collection the object to iterate over
     *  @param fn the callback function which will be called for each item
     *  @param {Object} [ctx] the scope under which to execute the callback.
     *
     *  @methodOf Horn.prototype
     *
     *  @todo test
     */
    each: function( collection, fn, ctx ) {
        if ( (collection === undefined) || (collection === null) ) { return; }
        $.each( collection, ctx ? this.scope( fn, ctx) : fn);
    },

    /**
     *  Determines if a given node in the context of a Horn DOM tree is a value
     *  node or not.
     *  <p>
     *  If the node is a value node, the necessary binding information is
     *  extracted and returned.
     *
     *  @param node the DOM node to examine
     *  @param parentPath the node's parent Horn property path
     *
     *  @return <code>false</code> if the given node is not a value node else,
     *      this function returns an object containing the binding information
     *      extracted
     *
     *  @methodOf Horn.prototype
     */
    hasHornBinding: function( node, parentPath ) {
        var theContained;
        var nodeName;
        var path = this.pathIndicator({n: node});
        var contents = $($(node).contents());
        var isAdjustingPath = this.isAdjustingPath( path);
        var cd = {
            isJSON: this.jsonIndicator({n: node}),
            node: node};
        var contentsSize = contents.size();
        var isEmptyNode = contentsSize === 0;
        if ( (contentsSize === 1) || (isEmptyNode && !cd.isJSON))  {
            if ( !isEmptyNode ) { theContained = contents[0]; }
            if ( cd.isJSON || isAdjustingPath ) {
                cd.path = isAdjustingPath ? (parentPath + '-' + path) :
                    parentPath;
                nodeName = node.nodeName.toLowerCase();
                cd.isFormElementNode =
                    (nodeName === 'input') || (nodeName === 'textarea');
                cd.isABBRNode = !cd.isFormElementNode &&
                    (nodeName.toLowerCase() === "abbr");
                cd.isTextNode = !cd.isABBRNode && (isEmptyNode ||
                    (theContained.nodeType === Node.TEXT_NODE));

                if ( cd.isFormElementNode || cd.isTextNode || cd.isABBRNode ) {
                    cd.text = this.getHornDOMNodeValue( {node: node});
                    return cd;
                }
            }
        }
        return false;
    },

    /**
     *  Retrieves a DOM node's displayed text.
     *  <p>
     *  The value retrieved is HTML un-escaped.
     *
     *  @param args.node the node from which to retrieve text
     *
     *  @return {String} the given node's displayed text
     *
     *  @methodOf Horn.prototype
     *
     *  @todo test
     *
     *  @todo use in tests rather than doing manually perhaps? perhaps in
     *  example too?
     */
    getHornDOMNodeValue: function( args ) {
        var nodeName = args.node.nodeName.toLowerCase();
        var jNode = $(args.node);
        return unescape(
            ((nodeName === "input") || (nodeName === 'textarea')) ?
                jNode.val() : ((nodeName === "abbr") ? jNode.attr('title') :
                jNode.text()));
    },

    /**
     *  Determines the index of an item with a container.
     *  <p>
     *  Returns the <code>Number</code> array index, OR {String} property name
     *  of the given item relative to its container if the item was found else
     *  <code>undefined</code>.
     *
     *  @param container {Object|Array} container the item collection
     *  @param item item the element for which to determine its index
     *
     *  @return the index of the item in its container else
     *
     *  @methodOf Horn.prototype
     *
     *  @todo test
     */
    indexOf: function( container, item ) {
        var index;
        this.each( container, function( i, o ) {
            if ( this.compare( o, item ) ) {
                index = i;
                return false;
            }
        }, this);
        return index;
    },

    /**
     *  Determines if two values the same.
     *  <p>
     *  Uses the <code>compare</code> function if it is defined on either
     *  argument else, the strict equality operator <code>===</code> is put
     *  to work.
     *
     *  @param i the a value to compare
     *  @param j the a value to compare
     *
     *  @return {Boolean} <code>true</code> if the two values are equal,
     *  <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     *
     *  @todo not sure if this clause (j.compare && j.compare( i)) is needed,
     *  read up on the workings of the compare function
     *
     *  @todo test
     */
    compare: function( i, j ) {
        return (i.compare && i.compare( j)) || (j.compare && j.compare( i)) || (i === j);
    },

    /**
     *  Determines if the given Horn property path is 'context-altering'.
     *  <p>
     *  The 'path' argument is converted to a <code>String</code> before
     *  examination.
     *
     *  @param {Object} path an object that represents a Horn property path
     *
     *  @return {Boolean} <code>true</code> if , <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isAdjustingPath: function ( path ) {
        return this.isDefinedNotNull( path) && ((path + "").trim() !== '');
    },

    /**
     *  Determines if an element is attached to the DOM or not.
     *
     *  @param ref a DOM element to check for being attached
     *
     *  @return {Boolean} <code>true</code> if the element is attached,
     *      <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isAttached: function( node ) { return $(node).parents(':last').is('html'); },

    /**
     *  Is the given value neither, <code>undefined</code> nor <code>null</code>?
     *
     *  @param args value the value to check
     *
     *  @return {Boolean} <code>true</code> if the value is neither,
     *      <code>undefined</code> nor <code>null</code>,
     *      <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isDefinedNotNull: function( value ) {
        return (value !== undefined) && (value !== null);
    },

    /**
     *  Split a Horn property path into tokens.
     *  <p>
     *  For example, <code>pathToTokens( "-a-0-b-2-2")</code> yields,
     *  <code>[a, 0, b, 2, 2]</code>.
     *
     *  @param {String} path the Horn property path to split
     *
     *  @return {Array} the tokens extracted from the property path
     *
     *  @methodOf Horn.prototype
     */
    pathToTokens: function( path ) {
        return path ?
            (this.startsWith( path, "-") ?
                path.substring( 1) : path).split( "-") :
            undefined;
    },

    /**
     *  Removes a named property from an object if it exists and is non
     *  prototypical.
     *
     *  @param {Object} object the object to remove the property from
     *  @param {String} propName the name of the property to remove
     *
     *  @return {Boolean} <code>true</code> if the property was defined and was removed,
     *      <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    removeProperty: function( object, propName ) {
        return object.hasOwnProperty( propName) && delete object[ propName];
    },

    /**
     *  Returns a new function that executes the given one under a new head
     *  context.
     *
     *  @param {Function} fn the function to bind a new context to
     *  @param {Object} ctx the new 'this' context the function will be executed
     *      under
     *
     *  @return {Function} a new function that calls the supplied, under a new
     *      context
     *
     *  @methodOf Horn.prototype
     */
    scope: function( fn, ctx ) {
        return function() { return fn.apply(ctx, arguments); };
    },

    /**
     *  Sets the 'value' for a given Horn DOM node.
     *  <p>
     *  The behaviour here is specific to Horn, for example with
     *  <code>ABBR</code> elements, we set their title, not their true displayed
     *  value.
     *
     *  @param {Element} args.node the node to set the value of
     *  @param {Object} args.value the value to set
     *
     *  @methodOf Horn.prototype
     *
     *  @todo test
     */
    setHornDOMNodeValue: function( args ) {
        var nodeName = args.node.nodeName.toLowerCase();
        var n = $(args.node);
        if ( (nodeName === "input") || (nodeName === 'textarea') ) {
            n.val( args.value);
        } else if ( nodeName === "abbr" ) {
            n.attr('title', args.value);
        } else { n.text( args.value); }
    },

    /**
     *  Execute a callback function for each token of a split
     *  <code>String</code>.
     *  <p>
     *  The value is converted to a string and then split, using either a
     *  delimiter supplied or the default delimiter " ".
     *
     *  @param value converted to a <code>String</code> and then split
     *  @param {Function} a function with the following signature ( i, token )
     *      - where i is the index of the token (zero based) and token is the
     *      current token
     *  @param {String} [delimiter] a delimiter used to split 'object's
     *
     *  @methodOf Horn.prototype
     */
    splitEach: function( value, callback, delimiter ) {
        this.each( (value + "").split( this.isDefinedNotNull( delimiter) ?
            delimiter : " "), function( i, token ) {
                if ( token.trim() !== '' ) { callback( token); }
        });
    },

    /**
     *  Is the given <code>String</code> value prefixed by a given stem.
     *  <p>
     *  'Stem' can be a regular expression pattern.
     *
     *  @param value the value to test
     *  @param stem the candidate prefix for the given value
     *
     *  @return {Boolean} <code>true</code> if the given <code>String</code> is prefixed,
     *      by the given stem, <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    startsWith: function ( value, stem ) {
        return  (stem.length > 0) &&
            ((value = value.match( "^" + stem)) !== null) &&
                (value.toString() === stem);
    },

    /**
     *  Traverses an object graph and executes a callback function for each
     *  value encountered.
     *  <p>
     *  <code>Object</code> and <code>Array</code> types are considered
     *  containers of values rather than values themselves.
     *  <p>
     *  For any model value, the corresponding equivalent Horn property path is
     *  constructed and reported to the callback function. An optional property
     *  path stem may be supplied which will be prepended to any such path.
     *
     *  @param value the root of the object graph to traverse
     *  @param {Function} callback a callback function that will be executed for
     *      each value of the object graph encountered, it should have the
     *      following signature: ( path, value, context, propName) where, 'path'
     *      is the value's Horn path within its container, 'value' is the
     *      current value found, 'context' is the object in which the value can
     *      be found and 'key' is the property name within 'context' that the
     *      value can be found.
     *  @param {String} [path] an optional property path that will be prefixed
     *      to every callback reported property path constructed
     *  @param [context] internal use only - no value required
     *  @param [propName] internal use only  - no value required
     *
     *  @methodOf Horn.prototype
     *
     *  @todo test
     */
    traverse: function( value, callback, path, context, propName ) {
        if ( (value instanceof Object) || (value instanceof Array) ) {
            this.each( value, function( k, v ) { this.traverse( v, callback,
                path ? (path + '-' + k) : ("-" + k), value, k);
            }, this);
        } else { callback( path, value, context, propName); }
    },

    /**
     *  Walks the DOM and executes a callback for each node visited, building
     *  up a Horn property path as it goes by extracting DOM nodes' property
     *  path indicators.
     *  <p>
     *  This function takes a property path stem it prepends to all Horn paths
     *  constructed.
     *  <p>
     *  The callback function can stop at a given node by returning a non
     *  <code>true</code> value.
     *
     *  @param {Element} node the node to start the walk from, this node is
     *      implicitly visited (the callback will not be executed in respect
     *      of it)
     *  @param {String} path the Horn property path stem that will be prepended
     *      to each Horn path constructed
     *  @param {Function} fn the callback function with the following signature
     *  ( node, path )  - where node is the current node being visited and path
     *  is its full property path (relative to the first DOM node visited and
     *  the path argument to <code>visitNodes(...)</code> proper.
     *  visited and
     *
     *  @methodOf Horn.prototype
     *
     *  @todo test
     */
    visitNodes: function( node, path, fn ) {
        var _path = this.pathIndicator({n: node});
        if ( this.isAdjustingPath( _path) ) { path = (path + '-' + _path); }
        this.each( window.$(node).children(), function( i, n ) {
            if ( fn( n, path) === true ) {
                this.visitNodes( n, path, fn); }}, this);
    }
};

var horn = new Horn();

$(function() {
    if ( horn.option( "readOnly") === true ) {
        horn.load();
    } else {
        horn.bind();
    }
});