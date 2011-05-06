Horn.prototype.features = {
    cssPrefix:          '_',
    cssDelimiter:       '-',
    cssRootContext:     'horn',
    cssJSON:            'data-json',

    extractCSSPropertyPath: function( n ) {
        var path = null;
        this.splitEach(
            window.$(n).attr( "class"),
            " ",
            function( token ) {
                if ( this.startsWith( token, this.features.cssPrefix) ) {
                    path = token.substring( this.features.cssPrefix.length); // @todo cache length
                    if ( path === '' ) {
                        path = null;
                    }
                    return false;
                }
            });

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