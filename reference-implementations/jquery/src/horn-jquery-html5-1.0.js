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
            return (SMUtils.isDefinedNotNull( rv) === true) ? (rv + "") : undefined;
        },

        hasRootIndicator: function( node ) {
            var hornDeclaration = this.getDataAttr( node, this.dataNameHorn);
            var jsonDeclaration = this.getDataAttr( node, this.dataNameJSON);
            return ((SMUtils.isDefinedNotNull( hornDeclaration) === true) &&
                (SMUtils.hasPrefix( hornDeclaration, "/") === true)) ||
                ((SMUtils.isDefinedNotNull( jsonDeclaration) === true) &&
                (SMUtils.hasPrefix( jsonDeclaration, "/") === true));
        },

        hasJSONIndicator: function( node ) {
            return SMUtils.isDefinedNotNull(
                this.getDataAttr( node, this.dataNameJSON)) === true;
        },

        pathIndicator: function( node ) {
            var hornDeclaration = this.getDataAttr( node, this.dataNameHorn);
            var jsonDeclaration = this.getDataAttr( node, this.dataNameJSON);
            if ( jsonDeclaration === 'true' ) { jsonDeclaration = undefined; }
            var declaration = SMUtils.isDefinedNotNull( hornDeclaration) ?
                hornDeclaration : jsonDeclaration;
            return SMUtils.isDefinedNotNull( declaration) ?
                this.toInternalPath(declaration) : declaration;
        },

        rootNodes: function( args ) {
            return $('[data-horn*="/"], [data-horn-json*="/"]');
        }
    });
