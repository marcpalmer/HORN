/**
 *  @fileOverview HTML5 features for the HORN 1.0
 *
 *  @author <a href="mailto:cdenman@me.com">Chris Denman</a>
 *  @author <a href="mailto:marc@anyware.co.uk">Marc Palmer</a>
 *
 *  @version 1.0
 *
 *  @requires
 */

/**
 *  Used to create new <code>HornHTML5Features</code> instances, thus:
 *      <code>var hornHTML5Features = new HornHTML5Features();</code>.
 *
 *  @constructor
 *
 *  @return {HornHTML5Features} a newly initialised
 *      <code>HornHTML5Features</code> instance
 */
function HornHTML5Features() {

    /**
     *  description
     *
     *  @param {Element} node
     *
     *  @return
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
     *  description
     *
     *  @param {Element} node
     *
     *  @return
     *
     *  @public
     */
    this.hasJSONIndicator = function( node ) {
        return SMUtils.isDefinedNotNull(
            SMUtils.getDataAttr( node, HornHTML5Features.dataNameJSON));
    };

    /**
     *  description
     *
     *  @param {Element} node
     *
     *  @return
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
     *  description
     *
     *  @param {Element} node
     *
     *  @return
     *
     *  @public
     */
    this.rootNodes = function( args ) {
        return $('[data-horn*="/"], [data-horn-json*="/"]');
    };
}

horn.delegate( new HornHTML5Features());

/**
 *  Description
 *
 *  @public
 */
HornHTML5Features.dataNameHorn = 'horn';

/**
 *  Description
 *
 *  @public
 */
HornHTML5Features.dataNameJSON = 'horn-json';