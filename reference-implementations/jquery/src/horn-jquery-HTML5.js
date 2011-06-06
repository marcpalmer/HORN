Horn.prototype.features = {
    dataNameHorn:       'horn',
    dataNamePath:       'horn-path',
    dataNameJSON:       'horn-json',

    INDICATOR_ROOT: function( args ) {
        return Horn.prototype.getDataAttr( args.n, this.features.dataNameHorn) === 'true';
    },

    INDICATOR_PATH: function( args ) {
        return Horn.prototype.getDataAttr( args.n, this.features.dataNamePath);
    },

    INDICATOR_JSON: function( args ) {
        return Horn.prototype.getDataAttr( args.n, this.features.dataNameJSON) === true;
    },

    ROOT_NODES: function( args ) {
        return window.$('*[data-' + this.features.dataNameHorn + ']');
    }
};
