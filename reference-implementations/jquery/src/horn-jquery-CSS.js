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
            Horn.prototype.splitEach( classAttr, " ",
                function( token ) {
                    if ( _this.startsWith( token, _this.cssPrefix) ) {
                        path = token.substring( cssPrefixLength);
                        if ( path === '' ) { path = null; }
                        return false;
                    }
                });
        }
        return path;
    },

    hasRootIndicator: function( args ) {
        return $(args.n).hasClass( this.cssRootContext);
    },

    pathIndicator: function( args ) {
        return this.extractCSSPropertyPath.call( this, args.n);
    },

    jsonIndicator: function( args ) {
        return $(args.n).hasClass( this.cssJSON);
    },

    rootNodes: function() {
        return $("." + this.cssRootContext);
    }
});