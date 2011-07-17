/**
 *  @fileOverview HTML5 features for the HORN 1.0
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
 *  A Horn delegate implementation that extracts Horn data from custom HTML5
 *  data attributes.
 *  <P>
 *  Please refer to our online documentation for fuller details
 *  <a href="http://horn.io/">http://horn.io/</a>.
 *  <P>
 *  Use this function to create new <code>HornHTML5Features</code> instances,
 *  thus: <code>var hornHTML5Features = new HornHTML5Features();</code>.
 *  <P>
 *  Set it to use on a horn instance,
 *  <code>horn.delegate( hornHTML5Features);</code>.
 *
 *  @constructor
 *
 *  @return {HornHTML5Features} a newly initialised
 *      <code>HornHTML5Features</code> instance
 */
function HornHTML5Features() {

    /**
     *  Determine if a given node possesses a Horn root node indicator
     *  (the data attribute 'horn').
     *  <P>
     *  In this implementation we return <code>true</code> if 'node' declares
     *  a data-attribute named 'horn' with any value whatsoever.
     *
     *  @param {Element} node the node to examine as to declaring a root
     *      indicator
     *
     *  @return <code>true</code> if 'node' does possess a Horn root node
     *      indicator (of any value), <code>false</code> otherwise.
     *
     *  @public
     */
    this.hasRootIndicator = function( node ) {
        var hornDeclaration = SMUtils.getDataAttr(
            node, HornHTML5Features.dataNameHorn);
        var jsonDeclaration = SMUtils.getDataAttr(
            node, HornHTML5Features.dataNameJSON);
        return (SMUtils.isDefinedNotNull( hornDeclaration) &&
            SMUtils.hasPrefix( hornDeclaration, "/")) ||
            (SMUtils.isDefinedNotNull( jsonDeclaration) &&
                SMUtils.hasPrefix( jsonDeclaration, "/"));
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
        return SMUtils.isDefinedNotNull(
            SMUtils.getDataAttr( node, HornHTML5Features.dataNameJSON));
    };

    /**
     *  Extracts and returns the Horn path indicator for a given node.
     *  <P>
     *  In this, the HTML5 implementation, nodes can declare paths using
     *  data-attributes named, either 'horn', OR 'json'.
     *  <P>
     *  Paths are given in full JavaScript-like syntax so for example,
     *  <code>a.b[a].x[2][3</code>
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
        var hornDeclaration = SMUtils.getDataAttr(
            node, HornHTML5Features.dataNameHorn);
        var jsonDeclaration = SMUtils.getDataAttr(
            node, HornHTML5Features.dataNameJSON);
        if ( jsonDeclaration === 'true' ) { jsonDeclaration = undefined; }
        var declaration = SMUtils.isDefinedNotNull( hornDeclaration) ?
            hornDeclaration : jsonDeclaration;
        return SMUtils.isDefinedNotNull( declaration) ?
            Horn.toInternalPath(declaration) : declaration;
    };

    /**
     *  Return all the current HTML document's Horn root nodes.
     *  <P>
     *  This implementation thus returns all nodes with a data-attribute named
     *  'horn' with a value that starts with a forward-slash character '/'.
     *
     *  @return a list of this document's Horn root nodes
     *
     *  @public
     */
    this.rootNodes = function( args ) {
        return $('[data-horn*="/"], [data-horn-json*="/"]');
    };
}

/**
 *  The HTML5 data-attribute name for nodes declaring Horn property paths.
 *
 *  @public
 */
HornHTML5Features.dataNameHorn = 'horn';

/**
 *  The HTML5 data-attribute name for nodes declaring Horn JSON data property
 *  paths.
 *
 *  @public
 */
HornHTML5Features.dataNameJSON = 'horn-json';

if ( SMUtils.isDefinedNotNull( horn) ) { horn.delegate( new HornHTML5Features()); }