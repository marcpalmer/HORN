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
 *  Used to...
 */
$.extend( Horn.prototype, {
    cssPrefix:          '_',
    cssDelimiter:       '-',
    cssRootContext:     'horn',
    cssJSON:            'data-json',

    extractCSSPropertyPath: function( n ) {
        var cssPrefixLength = this.cssPrefix.length;
        var classAttr = $(n).attr( "class");
        var path = null;
        var _this = this;
        if ( classAttr ) {
            Horn.prototype.splitEach( classAttr,
                function( token ) {
                    if ( _this.hasPrefix( token, _this.cssPrefix) ) {
                        path = token.substring( cssPrefixLength);
                        if ( path === '' ) { path = null; }
                        return false;
                    }
                });
        }
        return path;
    },

    hasRootIndicator: function( node ) {
        return $(node).hasClass( this.cssRootContext);
    },

    pathIndicator: function( node ) {
        return this.extractCSSPropertyPath.call( this, node);
    },

    jsonIndicator: function( node ) {
        return $(node).hasClass( this.cssJSON);
    },

    rootNodes: function() {
        return $("." + this.cssRootContext);
    }
});