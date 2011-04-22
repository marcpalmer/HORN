horn.option( 'converter', 'IntegerConverter',
    function () {
        this.toText = function( value ) {
            return value.toString();
        }
        this.fromText = function( value ) {
            return parseInt( value);
        }
    });

horn.option( 'converter', 'BooleanConverter',
    function () {
        this.toText = function( value ) {
            return value + "";
        }
        this.fromText = function( value ) {
            return value.toLowerCase() === 'true';
        }
    });