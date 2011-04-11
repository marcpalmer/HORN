var HornIntegerConverter = function () {
    this.toScreen = function( value, key, pattern ) {
        return value.toString();
    }

    this.fromScreen = function( value, key, pattern ) {
        return parseInt( value);
    }
}

var HornBooleanConverter = function () {
    this.toScreen = function( value, key, pattern ) {
        return value + "";
    }

    this.fromScreen = function( value, key, pattern ) {
        return value.toLowerCase() === 'true';
    }
}

var HornDateConverter = function () {
    this.toScreen = function( value, key, pattern ) {
        return $.datepicker.formatDate( "yy-mm-dd", value);
    }

    this.fromScreen = function( value, key, pattern ) {
        return $.datepicker.parseDate( "yy-mm-dd", value);
    }
}