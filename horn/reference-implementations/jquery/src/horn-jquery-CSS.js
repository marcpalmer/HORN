Horn.prototype.features = {
    cssPrefix:          '_',
    cssDelimiter:       '-',
    cssRootContext:     'horn',
    cssJSON:            'data-json',

    extractCSSPropertyPath: function( n ) {
        var cssPrefixLength = Horn.prototype.features.cssPrefix.length;
        var classAttr = window.$(n).attr( "class");
        var path = null;
        if ( classAttr ) {
            Horn.prototype.splitEach(
                classAttr,
                " ",
                function( token ) {
                    if ( Horn.prototype.startsWith( token,
                        Horn.prototype.features.cssPrefix) ) {
                        path = token.substring( cssPrefixLength);
                        if ( path === '' ) { path = null; }
                        return false;
                    }
                });
        }

        return path;
    },

    INDICATOR_ROOT: function( args ) {
        return window.$(args.n).hasClass( this.features.cssRootContext);
    },

    INDICATOR_PATH: function( args ) {
        return this.features.extractCSSPropertyPath.call( this, args.n);
    },

    INDICATOR_JSON: function( args ) {
        return window.$(args.n).hasClass( this.features.cssJSON);
    },

    ROOT_NODES: function( args ) {
        return window.$("." + this.features.cssRootContext);
    }
};