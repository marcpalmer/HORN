//        if ( this.opts.html5 === undefined ) {
//            this.opts.html5 =
//                window.$('*[data-' + this.opts.dataNameHorn + ']').size() > 0;
//        }

Horn.prototype.features = {
    dataNameHorn:       'horn',
    dataNamePath:       'horn-path',
    dataNameJSON:       'horn-json',

    INDICATOR_ROOT: function( args ) {
        return this.getDataAttr( args.n, this.features.dataNameHorn);
    },

    INDICATOR_PATH: function( args ) {
        return this.getDataAttr( args.n, this.features.dataNamePath);
    },

    INDICATOR_JSON: function( args ) {
        return this.getDataAttr( args.n, this.features.dataNameJSON);
    },

    ROOT_NODES: function( args ) {
        return window.$('*[data-' + this.features.dataNameHorn + ']');
    }
};
