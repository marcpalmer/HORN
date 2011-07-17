/**
 *  @fileOverview CSS features for the HORN 1.0
 *
 *  @author <a href="mailto:cdenman@me.com">Chris Denman</a>
 *  @author <a href="mailto:marc@anyware.co.uk">Marc Palmer</a>
 *
 *  @version 1.0
 *
 *  @requires jQuery
 *  @requires Horn
 *
 *  (C) Spotty Mushroom 2011
 */

/**
 *  A Horn delegate implementation that extracts Horn data from DOM elements
 *  that possess certain custom CSS classes.
 *  <P>
 *  Use this implementation if using HTML5 is not an option.
 *  <P>
 *  Please refer to our online documentation for fuller details
 *  <a href="http://horn.io/">http://horn.io/</a>.
 *  <P>
 *  Use this function to create new <code>HornCSSFeatures</code> instances,
 *  thus: <code>var hornCSSFeatures = new HornCSSFeatures();</code>.
 *  <P>
 *  Set it to use on a horn instance,
 *  <code>horn.delegate( hornCSSFeatures);</code>.
 *
 *  @constructor
 *
 *  @return {HornCSSFeatures} a newly initialised
 *      <code>HornCSSFeatures</code> instance
 */
function HornCSSFeatures() {

    /**
     *  Determine if a given node possesses a Horn root node indicator
     *  (the CSS class 'horn').
     *
     *  @param {Element} node the node to examine as to declaring a root
     *      indicator
     *
     *  @return <code>true</code> if 'node' does possess a Horn root node
     *      indicator, <code>false</code> otherwise.
     *
     *  @public
     */
    this.hasRootIndicator = function( node ) {
        return $(node).hasClass( HornCSSFeatures.cssRootContext);
    };

    /**
     *  Extracts and returns the Horn path indicator for a given node.
     *  <P>
     *  In this implementation, path indicators are CSS class attribute values
     *  such as, '_a-0-b-c', that start with the underscore '_' and are formed
     *  of words or numbers interspersed with the minus character '-'.
     *
     *  @param {Element} node the node from which to extract the path indicator
     *
     *  @return {String|Boolean} if 'node' does have a Horn path indicator, it
     *      is returned in <code>String</code> form, else
     *      <code>Boolean false</code> is be returned
     *
     *  @public
     */
    this.pathIndicator = function( node ) {
        var cssPrefixLength = HornCSSFeatures.cssPrefix.length;
        var classAttr = $(node).attr( "class");
        var path;
        if ( classAttr ) {
            SMUtils.splitEach( classAttr,
                function( token ) {
                    if ( (path === undefined) &&
                        SMUtils.hasPrefix( token, HornCSSFeatures.cssPrefix) &&
                            (token.length > 1)) {
                        path = token.substring( cssPrefixLength);
                        return false;
                    }
                });
        }
        return path;
    };

    /**
     *  Determine if a node declares the JSON indicator.
     *  <P>
     *  Nodes that declare this indicator are implicitly value nodes and contain
     *  literal JSON encoded as the single text element body value child  of
     *  declaring elements.
     *
     *  @param {Element} node the element that may declare the Horn JSON
     *      indicator
     *
     *  @return <code>true</code> if 'node' declares the Horn JSON indicator
     *
     *  @public
     */
    this.hasJSONIndicator = function( node ) {
        return $(node).hasClass( HornCSSFeatures.cssJSON);
    };

    /**
     *  Return all the current HTML document's Horn root nodes.
     *  <P>
     *  This implementation thus returns all nodes with the CSS attribute
     *  'class' value '_horn' (regardless of nesting considerations).
     *
     *  @return a list of this document's Horn root nodes
     *
     *  @public
     */
    this.rootNodes = function() {
        return $("." + HornCSSFeatures.cssRootContext);
    };
}

/**
 *  The expected prefix for Horn property path indicators encoded as CSS
 *  'class' attribute values.
 *
 *  @public
 */
HornCSSFeatures.cssPrefix = '_';

/**
 *  The delimiter used to separate Horn property path tokens encoded as CSS
 *  'class' attribute values.
 *
 *  @public
 */
HornCSSFeatures.cssDelimiter = '-';

/**
 *  The CSS 'class' attribute value, nodes declare to indicate they are the root
 *  of a data-hierarchy.
 *
 *  @public
 */
HornCSSFeatures.cssRootContext = 'horn';

/**
 *  The CSS 'class' attribute value, nodes declare to indicate they contain
 *  literal JSON data as their single child text element.
 *
 *  @public
 */
HornCSSFeatures.cssJSON  = 'data-json';

if ( SMUtils.isDefinedNotNull( horn) ) { horn.delegate( new HornCSSFeatures()); }