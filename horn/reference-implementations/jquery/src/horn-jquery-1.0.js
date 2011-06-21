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
 *  Used to create new <code>Horn</code> instances, thus:
 *      <code>var horn = new Horn();</code>.
 *
 *  @constructor
 *
 *  @return {Horn} a newly initialised Horn instance
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
        var rv;
        var details;
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
            state.bindings[ args.path] = rv;
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
                        type:  'toText',
                        path:  newArgs.path,
                        node:  newArgs.node
                    });
                    if ( (textValue === undefined) &&
                        this.isDefinedNotNull( modelValue)) {
                        textValue = modelValue + "";
                    }
                    newArgs.text = textValue;
                    this.hornNodeValue( {node: newArgs.node,
                        value: newArgs.text});
                    addBinding({
                        setModel: false,
                        value: modelValue,
                        node: newArgs.node,
                        key: ref.key,
                        context: ref.ref,
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
            if ( typeof jsonData === 'object' ) {
                this.traverse( jsonData,
                    this.scope( function( k, v ) {
                        addJSONHelper( $.extend( defaults, { value: v,
                            path:  args.path + k})); }, this));
            } else {
                addJSONHelper( $.extend( defaults,
                    {value: jsonData, path:  args.path}));
            }
        }, this);

    /**
     * @private
     * @function
     */
    var convert = this.scope( function ( args ) {
        var converter = state.opts.converter;
        if ( !this.isDefinedNotNull( converter) ) { return undefined; }
        return converter.call( this, $.extend( {}, args,
            {path: this.toExternalPath( args.path)}))
    }, this);

    /**
     * @private
     * @function
     */
    var extract = this.scope( function( args ) {
        var _this = this;
        var pathStem = this.definesProperty( args, 'pathStem') ?
            this.toInternalPath( args.pathStem) : undefined;
        var rootNodes = this.definesProperty( args, 'nodes') ?
            $(args.nodes) : this.rootNodes();
        setDefaultModel();
        this.each( rootNodes,
            function( i, n ) {
                var inGraph = false;
                this.walkDOM( n,
                    function( n, path ) {
                        if ( _this.hasRootIndicator(n) ) {
                            if ( inGraph ) { return false; }
                                else { inGraph = true; }
                        }
                        var bindingData = _this.hasHornBinding( n);
                        if ( bindingData === false ) {
                            return true; }
                        bindingData.readOnly = args.readOnly;
                        bindingData.path = _this.combinePaths( pathStem, path);
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
                );
            }, this);
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
        var bindingData = this.hasHornBinding( node);
        if ( (bindingData !== false) && !bindingData.isJSON ) {
            bindingData.path = path;
            bindings.push( bindingData);
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
        var cArgs;
        if ( modelValue !== binding.value ) {
            if ( !rootNode || (rootNode && this.contains(
                $(binding.node).parents(), rootNode)) ) {
                cArgs = {
                    value: modelValue,
                    path:  args.path,
                    type:  'toText',
                    node: binding.node};
                textValue = convert( cArgs);
                if ( !this.isDefinedNotNull( textValue) ) {
                    textValue = modelValue + "";
                }
                this.hornNodeValue( {node: binding.node, value: textValue});
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
        var existingArgs = this.definesProperty(
            args, 'args') ? args.args : {};
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
     *  Walk DOM tree(s) and extract model data, allowing for subsequent model
     *  to DOM updates.
     *  <p>
     *  After execution, each Horn value element encountered will have a
     *  corresponding representation in the model. Altering such model
     *  values and then calling <code>updateDOM(...)</code> will refresh their
     *  display values.
     *  <p>
     *  The DOM tree(s) to walk may be specified in exactly one of two ways:
     *  <ol>
     *      <li>
     *          Horn will automatically find all DOM trees that have a root
     *          indicator.
     *      </li>
     *      <li>
     *          Passing in 'args.nodes', a collection of DOM elements or a
     *          jQuery node selector.
     *      </li>
     *  </ol>
     *  <p>
     *  Before a value is stored in the model it is converted to its
     *  <code>String</code> representation. Alternatively, applications can
     *  register converter functions to override this default behaviour.
     *  <p>
     *  If model to DOM updates are not required, the alternative yet otherwise
     *  identical function, <code>{@link Horn#load}</code> should be used
     *  (or the 'readOnly' option).
     *
     *  @param {Object} args
     *  @param {Element|String} [args.nodes] DOM nodes or a jQuery selector
     *  @param {String} [args.pathStem] a property path prefix that will be
     *      appended the paths of value nodes' property paths before storage in
     *      the model
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
     *  Walks a tree of cloned (or selected) DOM nodes, binding them to model
     *  elements and populating their display values.
     *  <p>
     *  During the walk, the property path for each DOM value node visited is
     *  inspected and if there is a corresponding model element with the same
     *  path it will be bound to the DOM node and the DOM node will receive its
     *  value.
     *  <p>
     *  For each DOM value node encountered, the optional 'args.pathStem' will
     *  be added to its property path before binding to a model value. Allowing
     *  nodes derived from a single template to be bound to multiple model
     *  locations.
     *  <p>
     *  Model to DOM data conversions are performed using this function with the
     *  type parameter value 'toText'.
     *
     *  @param {Object} args
     *  @param {Element|String} [args.node] a jQuery node or selector - nodes
     *      selected by this argument will not be cloned.
     *  @param {Element|String} [args.template] jQuery node or selector - these
     *      nodes will be cloned and the root node will have its 'id' attribute
     *      removed and possibly set to 'args.newID'
     *  @param {String} [args.id] the new 'id' attribute value applied to nodes
     *      cloned or selected using 'args.template'
     *  @param {String} [args.pathStem] a property path prefix appended to all
     *      walked DOM nodes before binding to model values
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
        pathStem = this.definesProperty( args, 'pathStem') ?
            this.toInternalPath( args.pathStem) : '';
        this.walkDOM( node,
            this.scope( function( n, path ) {
                return handleTemplateBinding( n, path, bindings);
            }, this), pathStem);
        addBindings({bindings: bindings});
        return node;
    };

    /**
     *  Identical to {@link Horn#bind} except that subsequent model changes are
     *  not reflected in the DOM.
     *
     *  @param args identical to those used in {@link Horn#bind}
     *
     *  @see Horn#bind
     *
     *  @public
     */
    this.load = function( args ) {
        return extract(
            setDefaultArgs( {args: args, defaults: {readOnly: true}}));
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
     *      <li>
     *          <p>
     *          <strong>defaultModel</strong> - For setting an explicit default
     *          model (<code>Object</code> or <code>Array</code>)
     *          </p>
     *      </li>
     *      <li>
     *          <p>
     *          <strong>readOnly</strong> - If set to true, the automatic
     *          extraction at startup will call load() instead of bind() so
     *          there is no two-way binding to the DOM.
     *          </p>
     *      </li>
     *      <li>
     *          <p>
     *          <strong>converter</strong> - A function with the following
     *          signature, <code>(args)</code> that will be called upon to
     *          convert values under the following scenarios:
     *          </p>
     *          <p>
     *              <ul>
     *                  <li>
     *                      <p>
     *                      <strong>DOM to model</strong> :- when values are
     *                      extracted from the DOM for storage in the model
     *                      (functions <code>{@link Horn#bind}</code>,
     *                      <code>{@link Horn#load}</code>) the
     *                      <code>convert</code> function
     *                      will be called with 'type' parameter value
     *                      '<strong>fromText</strong>'.
     *                      </p>
     *                  </li>
     *                  <li>
     *                      <p>
     *                      <strong>Model to DOM</strong> :- when values
     *                      read from the model are destined for the DOM,
     *                      (functions <code>{@link Horn#updateDOM}</code>,
     *                      <code>{@link Horn#bindTo}</code>) the
     *                      <code>convert</code> function will be called with
     *                      'type' parameter value '<strong>toText</strong>'.
     *                      </p>
     *                  </li>
     *                  <li>
     *                      <p>
     *                      <strong>JSON to model</strong> :- when JSON values
     *                      are extracted from the DOM for model storage
     *                      (functions <code>{@link Horn#bind}</code>,
     *                      <code>{@link Horn#load}</code>), the
     *                      <code>convert</code> function will be called with
     *                      'type' parameter value '<strong>fromJSON</strong>'.
     *                      </p>
     *                  </li>
     *              </ul>
     *          </p>
     *          <p>
     *              The complete set of arguments passed to the
     *              <code>convert</code> function are namely:
     *              <ul>
     *                  <li>
     *                      <p>
     *                      <strong>args.type</strong> :- the conversion 'type'
     *                      as described above.
     *                      </p>
     *                  </li>
     *
     *                  <li>
     *                      <p>
     *                      <strong>args.value</strong> :- the value for
     *                      conversion. The JavaScript type is dependent on the
     *                      conversion being performed (<code>String</code> for
     *                      '<strong>fromText</strong>' conversions and the
     *                      corresponding model value's type in all others).
     *                      </p>
     *                  </li>
     *
     *                  <li>
     *                      <p>
     *                      <strong>args.path</strong> :- the property path for
     *                      the DOM or model value.
     *                      </p>
     *                  </li>
     *
     *                  <li>
     *                      <p>
     *                      <strong>args.node</strong> :- the DOM node that
     *                      generated the value.
     *                      </p>
     *                  </li>
     *              </ul>
     *          </p>
     *          <p>
     *              Converter functions can return <code>undefined</code> in
     *              which case the value (all such values) will be treated as
     *              <code>String</code> types - the same behaviour as having no
     *              converter function registered.
     *          </p>
     *          <p>
     *              <strong>Only a single converter function can be registered,
     *              with any invocation overwriting any previously registered
     *              function.</strong>
     *          </p>
     *      </li>
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
     *
     *  @test
     */
    this.reset = function() {
        state = { opts: $.extend( {}, {model: undefined, readOnly:  false})};
    };

    /**
     *  Removes either, all bindings or, all bindings with a given property path
     *  , or all bindings with property path's that match a given regular
     *  expression.
     *  <p>
     *  If no arguments are defined, <strong>all bindings are removed</strong>.
     *  <p>
     *  If both 'args.path' and 'args.pattern' are supplied, the result is the
     *  same as calling this function twice, once supplying 'args.path' and
     *  thence 'args.pattern'.
     *
     *  @param {Object} args
     *  @param {String} [args.path] all bindings with property path's that
     *      equal this argument, will be removed
     *  @param {String} [args.pattern] all bindings with property path's that
     *      match this regular expression, will be removed
     *
     *  @public
     */
    this.unbind = function( args ) {
        var definesPath = this.definesProperty( args, 'path');
        var internalPath = definesPath ? this.toInternalPath( args.path) :
            undefined;
        var definesPattern = this.definesProperty( args, 'pattern');
        var unbindAll = !definesPattern && !definesPath;
        this.each( state.bindings,
            function( i, n ) {
                if (    unbindAll ||
                        (definesPath && (i === internalPath)) ||
                        (definesPattern && (i.match( args.pattern)))) {
                    delete state.bindings[ i];
                }
            }, this);
    };

    /**
     *  Update all bound DOM nodes with their current model values, if altered.
     *  <p>
     *  This function will not update DOM nodes if their model value has not
     *  changed.
     *
     *  @param {Element} rootNode optional DOM node such that if supplied, only
     *      nodes under this nodes will be updated
     *
     *  @return {Array} an array of nodes that had their DOM values changed
     *
     *  @public
     */
    this.updateDOM = function( rootNode ) {
        var alteredNodes = [];
        this.each( state.bindings, function( i, n ) {
            var node = render( {rootNode: rootNode, binding: n, path: i});
            if ( this.isDefinedNotNull( node) ) { alteredNodes.push( node); }
        }, this);
        return alteredNodes;
    };

    this.reset();
};

Horn.prototype = {

    /**
     *  Join parent and child internal Horn property paths.
     *  <p>
     *  If exactly one path is <code>null</code> or <code>undefined</code>, the
     *  other is returned. If both paths are not defined, the empty
     *  <code>String</code> is returned.
     *
     *  @param {String} [parent] the parent horn property path
     *  @param {String} [child] the child horn property path
     *
     *  @return {String} the resultant, combined property path
     *
     *  @methodOf Horn.prototype
     */
    combinePaths: function( parent, child ) {
        var parentDefined = this.isPathDefined( parent);
        var childDefined = this.isPathDefined( child);
        if ( parentDefined && childDefined ) {
            return parent + "-" + child;
        } else if ( parentDefined ) {
            return parent;
        } else if ( childDefined ) {
            return child;
        } else { return ""; }
    },

    /**
     *  Determines if two values are the same.
     *  <p>
     *  Uses the <code>compare</code> function if it is defined on either
     *  argument else, the strict equality operator <code>===</code> is put
     *  to work.
     *  <p>
     *  Handles de-referencing jQuery instances.
     *
     *  @param i a value to compare
     *  @param j a value to compare
     *
     *  @return {Boolean} <code>true</code> if the two values are equal,
     *      <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    compare: function( i, j ) {
        if ( i instanceof jQuery ) { i = i.get(0); }
        if ( j instanceof jQuery ) { j = j.get(0); }
        return (i.compare && i.compare( j)) ||
            (j.compare && j.compare( i)) || (i === j);
    },

    /**
     *  Returns <code>true</code> if a container contains an item.
     *
     *  @param {Object|Array} container the container to search
     *  @param {Object} item the item to locate
     *
     *  @return {Boolean} <code>true</code> if the item was found,
     *      <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    contains: function( container, item ) {
        return this.indexOf(container, item) !== -1;
    },

    /**
     *  Shallow copy properties from source to destination objects.
     *  <p>
     *  Copies neither, <code>undefined</code> nor prototypical, properties.
     *  <p>
     *  The source of property names to copy is given by the property names
     *  defined in 'args.dest' unless the optional 'args.props' argument is
     *  supplied, in which case it is used instead.
     *
     *  @param {Object} args
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
     *  @return {Boolean} <code>true</code> if the arguments do define the given
     *      property, <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    definesProperty: function( args, propertyName ) {
        return (args !== undefined) && (args.hasOwnProperty( propertyName)) &&
            this.isDefinedNotNull( args[ propertyName]);
    },

    /**
     *  Iterates over collection types and executes a callback for each value
     *  encountered.
     *  <p>
     *  An optional scope context can be provided which will provide the
     *  <code>this</code> for the callback function.
     *  <p>
     *  The callback function should have the following signature
     *  <strong>( i, n )</strong> : where 'i' is the propertyName of the item
     *  within its container (for objects and arrays and strings) and 'n' is the
     *  item.
     *
     *  @param {Object} collection the item to iterate over
     *  @param {Function} fn the callback function which will be called for each
     *      item
     *  @param {Object} [ctx] the scope under which to execute the callback.
     *
     *  @methodOf Horn.prototype
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
     *
     *  @return <code>false</code> if the given node is not a value node else,
     *      this function returns an object containing the binding information
     *      extracted
     *
     *  @methodOf Horn.prototype
     */
    hasHornBinding: function( node ) {
        var theContained;
        var nodeName;
        var contents = $($(node).contents());
        var isPathDefined = this.isPathDefined(
            this.pathIndicator(node));
        var cd = {
            isJSON: this.hasJSONIndicator(node),
            node: node};
        var contentsSize = contents.size();
        var isEmptyNode = contentsSize === 0;
        if ( (contentsSize === 1) || (isEmptyNode && !cd.isJSON))  {
            if ( !isEmptyNode ) { theContained = contents[0]; }
            if ( cd.isJSON || isPathDefined ) {
                nodeName = node.nodeName.toLowerCase();
                cd.isFormElementNode =
                    (nodeName === 'input') || (nodeName === 'textarea');
                cd.isABBRNode = !cd.isFormElementNode &&
                    (nodeName.toLowerCase() === "abbr");
                cd.isTextNode = !cd.isABBRNode && (isEmptyNode ||
                    (theContained.nodeType === Node.TEXT_NODE));
                if ( cd.isFormElementNode || cd.isTextNode || cd.isABBRNode ) {
                    cd.text = this.hornNodeValue( {node: node});
                    return cd;
                }
            }
        }
        return false;
    },

    /**
     *  Is the given <code>String</code> value prefixed by a given stem.
     *  <p>
     *  'Stem' can be a regular expression pattern.
     *
     *  @param value the value to test
     *  @param stem the candidate prefix for the given value
     *
     *  @return {Boolean} <code>true</code> if the given <code>String</code> is
     *      prefixed, by the given stem, <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    hasPrefix: function ( value, stem ) {
        return  (stem.length > 0) &&
            ((value = value.match( "^" + stem)) !== null) &&
                (value.toString() === stem);
    },

    /**
     *  Sets or retrieves a DOM node's Horn text.
     *  <p>
     *  The value retrieved is HTML un-escaped.
     *
     *  @param {Object} args
     *  @param {Element} args.node the node from which to retrieve text
     *  @param {Object} args.value the value to set
     *
     *  @return {String} the given node's displayed text
     *
     *  @methodOf Horn.prototype
     */
    hornNodeValue: function( args ) {
        var isSet = this.definesProperty( args, 'value');
        var jNode = $(args.node);
        switch (jNode[0].nodeName.toLowerCase()) {
            case "input": case "textarea":
                if ( isSet ) { jNode.val( args.value); }
                    else { return jNode.val(); }
            break;

            case "abbr":
                if ( isSet ) { jNode.attr( "title", args.value); }
                    else { return jNode.attr( "title"); }
            break;

            default:
                if ( isSet ) { jNode.text( args.value); }
                    else { return jNode.text(); }
            break;
        }
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
     */
    indexOf: function( container, item, index ) {
        index = -1;
        this.each( container, function( i, o ) {
            if ( this.compare( o, item ) ) {
                index = i;
                return false;
            }
        }, this);
        return index;
    },

    /**
     *  Determines if a given value represents a property path.
     *  <p>
     *  The 'path' argument is converted to a <code>String</code> before
     *  examination.
     *
     *  @param {Object} path an object that represents a property path
     *
     *  @return {Boolean} <code>true</code> if the given path is a defined
     *      property path, <code>false</code> otherwise
     *
     *  @methodOf Horn.prototype
     */
    isPathDefined: function ( path ) {
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
    isAttached: function( node ) {
        return $(node).parents(':last').is('html');
    },

    /**
     *  Determines if a value is neither, <code>undefined</code> nor
     *  <code>null</code>?
     *
     *  @param value the value to check
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
            ((this.hasPrefix( path, "-")|| this.hasPrefix( path, "_"))  ?
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
     *  @return {Boolean} <code>true</code> if the property was defined and was
     *      removed, <code>false</code> otherwise
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
     *  Execute a callback function for each token of a split
     *  <code>String</code>.
     *  <p>
     *  The value is converted to a <code>String</code> and then split, using
     *  either a supplied delimiter or the default delimiter, " ".
     *
     *  @param value converted to a <code>String</code> and then split
     *  @param {Function} callback a function with the following signature
     *  <code>( i, token )</code> - where i is the index of the token
     *      (zero based), and token is the current token
     *  @param {String} [delimiter] a delimiter used to split 'object's
     *
     *  @methodOf Horn.prototype
     */
    splitEach: function( value, callback, delimiter ) {
        var breakOut = false;
        this.each( (value + "").split( this.isDefinedNotNull( delimiter) ?
            delimiter : " "), function( i, token ) {
                if ( token.trim() !== '' ) {
                    breakOut = breakOut || (callback( token) === false);
                    return !breakOut;
                }
        });
    },

    /**
     *  Converts an Horn property path in internal form to its external,
     *  JavaScript representation.
     *  <p>
     *  For example: <code>horn.toExternalPath( 'x-1-2-3-y-2-z') ===
     *  'x[1][2][3].y[2].z'.</code>
     *
     *  @param {String} path internal Horn property path to convert
     *
     *  @methodOf Horn.prototype
     */
    toExternalPath: function( path ) {
        return path.replace( /\-?(\d+)/g, "[$1]").replace( /\-/g, ".");
    },

    /**
     *  Converts a property path in external JavaScript form to that used
     *  internally.
     *  <p>
     *  For example: <code>horn.toInternalPath('x[1][2][3].y[2].z') ===
     *  'x-1-2-3-y-2-z'</code>.
     *  <p>
     *  This function tolerates extraneous leading '-' characters.
     *
     *  @param {String} path the external property path to convert
     *
     *  @methodOf Horn.prototype
     */
    toInternalPath: function( path ) {
        var rv = path.replace(
            /(\[(\w+)\])/g, ".$2").replace( /\./g, "-").replace( "/", "");
        return this.hasPrefix( rv, "-") ? rv.substring(1) : rv;
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
     *      following signature, <code>( path, value, context, propName)</code>,
     *      where 'path' is the value's property path within its container,
     *      'value' is the current value found, 'context' is the object in which
     *      the value can be found and 'key' is the property name within
     *      'context' that the value can be found.
     *  @param {String} [path] an optional property path that will be prefixed
     *      to every callback reported property path constructed
     *  @param [context] internal (recursive) use only - do not supply a value
     *  @param [propName] internal (recursive) use only  - do not supply a value
     *
     *  @methodOf Horn.prototype
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
     *  up a property paths as it goes.
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
     *  @param {Function} callback the callback function with the following
     *      signature (node, path)  - where node is the current node being
     *      visited and path is its full property path (relative to the first
     *      DOM node visited and the path argument to <code>walkDOM(...)</code>
     *      proper
     *  @param {String} [path] the Horn property path stem that will be
     *      prepended to each Horn path constructed
     *
     *  @methodOf Horn.prototype
     */
    walkDOM: function( node, callback, path ) {
        if ( !this.isDefinedNotNull( path) ) { path = ''; }
        path = this.combinePaths( path, this.pathIndicator(node));
        if ( callback( node, path) === true ) {
            this.each( $(node).children(), function( i, n ) {
                this.walkDOM( n, callback, path); }, this);
        }
    }
};

window.horn = new Horn();

$(function() {
    if ( horn.option( "readOnly") === true ) {
        horn.load();
    } else {
        horn.bind();
    }
});