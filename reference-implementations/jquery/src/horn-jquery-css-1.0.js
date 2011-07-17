/**
 *  @fileOverview CSS features for the HORN 1.0
 *
 *  @author <a href="mailto:cdenman@me.com">Chris Denman</a>
 *  @author <a href="mailto:marc@anyware.co.uk">Marc Palmer</a>
 *
 *  @version 1.0
 *
 *  @requires
 */

/**
 *  Used to create new <code>HornCSSFeatures</code> instances, thus:
 *      <code>var hornCSSFeatures = new HornCSSFeatures();</code>.
 *
 *  @constructor
 *
 *  @return {HornCSSFeatures} a newly initialised
 *      <code>HornCSSFeatures</code> instance
 */
function HornCSSFeatures() {

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
        return $(node).hasClass( HornCSSFeatures.cssRootContext);
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
     *  description
     *
     *  @param {Element} node
     *
     *  @return
     *
     *  @public
     */
    this.hasJSONIndicator = function( node ) {
        return $(node).hasClass( HornCSSFeatures.cssJSON);
    };

    /**
     *  description
     *
     *  @return
     *
     *  @public
     */
    this.rootNodes = function() {
        return $("." + HornCSSFeatures.cssRootContext);
    };
}

horn.delegate( new HornCSSFeatures());

/**
 *  Description
 *
 *  @public
 */
HornCSSFeatures.cssPrefix = '_';

/**
 *  Description
 *
 *  @public
 */
HornCSSFeatures.cssDelimiter = '-';

/**
 *  Description
 *
 *  @public
 */
HornCSSFeatures.cssRootContext = 'horn';

/**
 *  Description
 *
 *  @public
 */
HornCSSFeatures.cssJSON  = 'data-json';