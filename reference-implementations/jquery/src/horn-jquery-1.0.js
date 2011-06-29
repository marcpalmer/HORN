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
 *  @return {Horn} a newly initialised <code>Horn</code> instance
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
    var addBinding = SMUtils.bind( function( args ) {
        var rv;
        var details;
        if ( args.setModel !== false ) {
            details = setValue(  args.value, args.path);
        }
        if ( (args.readOnly === false) && (!args.isJSON) ) {
            if ( SMUtils.isDefinedNotNull( details) ) {
                args.context = details.context;
                args.key = details.key;
            }
            if ( !SMUtils.isDefinedNotNull( state.bindings) ) {
                state.bindings = {}; }
            rv = {node: args.node, value: args.value};
            if ( SMUtils.isDefinedNotNull( args.context) ) {
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
    var addBindings = SMUtils.bind( function( args ) {
        SMUtils.each(
            args.bindings,
            function( i, newArgs ) {
                var modelValue;
                var textValue;
                var ref = getModelReference( newArgs);
                if ( SMUtils.isDefinedNotNull( ref) )  {
                    modelValue = ref.ref[ ref.key];
                    textValue = convert( {
                        value: modelValue,
                        type:  'toText',
                        path:  newArgs.path,
                        node:  newArgs.node
                    });
                    if ( (textValue === undefined) &&
                        SMUtils.isDefinedNotNull( modelValue)) {
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
    var addJSONBindings = SMUtils.bind(
        function( args ) {
            var defaults = {type:  'fromJSON', node:  args.node,
                readOnly: args.readOnly};
            var addJSONHelper = SMUtils.bind( function( vargs ) {
                var oldValue = vargs.value;
                vargs.value = convert( vargs);
                if ( !SMUtils.isDefinedNotNull( vargs.value) ) {
                    vargs.value = oldValue;
                }
                addBinding( vargs);
            }, this);
            var jsonData = $.evalJSON( args.text);
            if ( typeof jsonData === 'object' ) {
                this.traverse( jsonData,
                    SMUtils.bind( function( k, v ) {
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
    var convert = SMUtils.bind( function ( args ) {
        var converter = state.opts.converter;
        if ( !SMUtils.isDefinedNotNull( converter) ) { return undefined; }
        return converter.call( this, $.extend( {}, args,
            {path: this.toExternalPath( args.path)}))
    }, this);

    /**
     * @private
     * @function
     */
    var extract = SMUtils.bind( function( args ) {
        var _this = this;
        var pathStem = SMUtils.definesProperty( args, 'pathStem') ?
            this.toInternalPath( args.pathStem) : undefined;
        var rootNodes = SMUtils.definesProperty( args, 'nodes') ?
            $(args.nodes) : this.rootNodes();
        setDefaultModel();
        SMUtils.each( rootNodes,
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
                            if ( !SMUtils.isDefinedNotNull( bindingData.value) ) {
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
    var getModelReference = SMUtils.bind( function( args ) {
        var rv;
        var tokens = this.pathToTokens( args.path);
        var length = tokens.length;
        if ( length > 0 ) {
            rv = {ref: state.model, key: tokens[ length - 1]};
            tokens.length = tokens.length - 1;
            SMUtils.each( tokens, function( i, n ) {
                if ( SMUtils.isDefinedNotNull( rv.ref) ) {
                    if ( rv.ref.hasOwnProperty( n) ) { rv.ref = rv.ref[ n]; }
                } else { return false; }
            }, this);
            if ( !SMUtils.isDefinedNotNull( rv.ref) ) { rv = undefined; }
        }
        return rv;
    }, this);

    /**
     *  @private
     *  @function
     */
    var handleTemplateBinding = SMUtils.bind( function( node, path, bindings ) {
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
    var render = SMUtils.bind( function( args ) {
        var rootNode = args.rootNode;
        var binding = args.binding;
        var modelValue = binding.context[ binding.key];
        var textValue;
        var cArgs;
        if ( modelValue !== binding.value ) {
            if ( !rootNode || (rootNode && SMUtils.contains(
                $(binding.node).parents(), rootNode)) ) {
                cArgs = {
                    value: modelValue,
                    path:  args.path,
                    type:  'toText',
                    node: binding.node};
                textValue = convert( cArgs);
                if ( !SMUtils.isDefinedNotNull( textValue) ) {
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
    var setDefaultArgs = SMUtils.bind( function( args ) {
        var existingArgs = SMUtils.definesProperty(
            args, 'args') ? args.args : {};
        if ( SMUtils.definesProperty( args, 'defaults') ) {
            $.extend( existingArgs, args.defaults);
        }
        return existingArgs;
    }, this);

    /**
     * @private
     * @function
     */
    var setDefaultModel = SMUtils.bind( function() {
        if ( !SMUtils.isDefinedNotNull( state.model)
            && state.opts.hasOwnProperty( 'defaultModel') ) {
            state.model = state.opts.defaultModel; // @todo clone here
        }
    }, this);

    /**
     * @private
     * @function
     */
    var setValue = SMUtils.bind( function( value, path, parentContext ) {
        var token;
        var numTokens;
        var subContext;
        if ( typeof path === 'string' ) {
            path = this.pathToTokens( path);
            if ( !SMUtils.isDefinedNotNull( state.model) ) {
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
     *  Returns all <strong>bound</strong> model-entry paths that contain blank
     *  <code>""</code> <code>String</code> values.
     *  <p>
     *  The model paths can be optionally filtered by requiring them to have a
     *  given prefix.
     *  <p>
     *  Also optionally, the DOM nodes corresponding to the given model entry
     *  can be content-checked to determine if it (instead) has a blank
     *  <code>String</code> value.
     *
     *  @param {Object} args
     *  @param {String} [args.path] the prefix that returned property paths must
     *      have, if not supplied all property paths will be returned - if they
     *      fulfill the content requirements
     *  @param {Boolean} [args.inspectDOM] iff. <code>true<code> then instead
     *      of using the model entries' value to compare with <code>""</code>,
     *      the model entries' corresponding DOM node's value will be used
     *      instead
     *
     *  @return {Array} an <code>Array</code> containing all model entries that
     *      have the given (or any) path prefix and have either their model, or
     *      DOM node values equal to the blank <code>String</code>
     *      <code>""</code>
     *
     *  @public
     */
    this.blankModelEntries = function( args ) {
        var blankPaths = [];
        var pathDefined = SMUtils.definesProperty( args, 'path');
        var inspectDOM = SMUtils.definesProperty( args, 'inspectDOM') &&
            (args.inspectDOM === true);
        var path = pathDefined ? this.toInternalPath( args.path) : undefined;
        SMUtils.each( state.bindings, function( i, n ) {
            if ( (!pathDefined || SMUtils.hasPrefix( i, path)) ) {
                if (((inspectDOM && SMUtils.isDefinedNotNull( n.node)) ?
                    this.hornNodeValue( {node: n.node}) : n.value) === "") {
                    blankPaths.push(this.toExternalPath(i));
                }
            }
        }, this);
        return blankPaths;
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
     *      removed and set to 'args.newID' if supplied
     *  @param {String} [args.id] the new 'id' attribute value applied to nodes
     *      cloned, if using 'args.template'
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
        if ( SMUtils.definesProperty( args, 'node') ) {
            node = $(args.node);
        } else {
            node = $(args.template).clone();
            node.removeAttr( "id");
            if ( SMUtils.definesProperty( args, 'id') ) {
               node.attr( "id", args.id);
            }
        }
        setDefaultModel();
        pathStem = SMUtils.definesProperty( args, 'pathStem') ?
            this.toInternalPath( args.pathStem) : '';
        this.walkDOM( node,
            SMUtils.bind( function( n, path ) {
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
     *  Return the DOM node that corresponds to a given model value's Horn
     *  property path.
     *  <p>
     *  If there is no model value bound to a DOM node for the supplied path,
     *  <code>undefined</code> is returned.
     *
     *  @param {String} path the property path corresponding to a DOM node that
     *      yielded a given model value
     *
     *  @return the DOM node that corresponds to a given model value
     *
     *  @public
     */
    this.nodeForPath = function( path ) {
        path = this.toInternalPath( path);
        return (SMUtils.isDefinedNotNull( state.bindings) &&
            SMUtils.isDefinedNotNull( state.bindings[path]) &&
            SMUtils.isDefinedNotNull( state.bindings[path].node)) ?
                state.bindings[ path].node : undefined;
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
        var definesPath = SMUtils.definesProperty( args, 'path');
        var internalPath = definesPath ? this.toInternalPath( args.path) :
            undefined;
        var definesPattern = SMUtils.definesProperty( args, 'pattern');
        var unbindAll = !definesPattern && !definesPath;
        SMUtils.each( state.bindings,
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
        SMUtils.each( state.bindings, function( i, n ) {
            var node = render( {rootNode: rootNode, binding: n, path: i});
            if ( SMUtils.isDefinedNotNull( node) ) { alteredNodes.push( node); }
        }, this);
        return alteredNodes;
    };

    this.reset();
};

Horn.prototype = {

    /**
     *  Join parent and child (internal) property paths.
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
        var isPathDefined = this.isPathDefined( this.pathIndicator(node));
        var cd = { isJSON: this.hasJSONIndicator(node), node: node};
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
        var isSet = SMUtils.definesProperty( args, 'value');
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
        return SMUtils.isDefinedNotNull( path) && ((path + "").trim() !== '');
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
        return path ? ((SMUtils.hasPrefix( path, "-") ||
            SMUtils.hasPrefix( path, "_"))  ?
                path.substring( 1) : path).split( "-") : undefined;
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
        return SMUtils.hasPrefix( rv, "-") ? rv.substring(1) : rv;
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
            SMUtils.each( value, function( k, v ) { this.traverse( v, callback,
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
        if ( !SMUtils.isDefinedNotNull( path) ) { path = ''; }
        path = this.combinePaths( path, this.pathIndicator(node));
        if ( callback( node, path) === true ) {
            SMUtils.each( $(node).children(), function( i, n ) {
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