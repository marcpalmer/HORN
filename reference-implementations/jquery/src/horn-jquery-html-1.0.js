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
 *  Used to...
 */
$.extend(
    Horn.prototype, {
        dataNameHorn:           'horn',
        dataNameJSON:           'horn-json',

        getDataAttr: function( n, name ) {
            var rv =  $(n).data( name);
            return (this.isDefinedNotNull( rv) === true) ? (rv + "") : undefined;
        },

        hasRootIndicator: function( args ) {
            var hornDeclaration = this.getDataAttr( args.n, this.dataNameHorn);
            var jsonDeclaration = this.getDataAttr( args.n, this.dataNameJSON);
            return ((this.isDefinedNotNull( hornDeclaration) === true) &&
                (this.hasPrefix( hornDeclaration, "/") === true)) ||
                ((this.isDefinedNotNull( jsonDeclaration) === true) &&
                (this.hasPrefix( jsonDeclaration, "/") === true));
        },

        jsonIndicator: function( args ) {
            return this.isDefinedNotNull(
                this.getDataAttr( args.n, this.dataNameJSON)) === true;
        },

        pathIndicator: function( args ) {
            var hornDeclaration = this.getDataAttr( args.n, this.dataNameHorn);
            var jsonDeclaration = this.getDataAttr( args.n, this.dataNameJSON);
            if ( jsonDeclaration === 'true' ) { jsonDeclaration = undefined; }
            var declaration = this.isDefinedNotNull( hornDeclaration) ?
                hornDeclaration : jsonDeclaration;
            return this.isDefinedNotNull( declaration) ?
                this.toInternalPath(declaration) : declaration;
        },

        rootNodes: function( args ) {
            return $('[data-horn*="/"], [data-horn-json*="/"]');
        }
    });
