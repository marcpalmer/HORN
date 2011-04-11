var TestIntegerConverter = function () {
    this.toScreen = function( value, key, pattern ) {
        return value.toString();
    }

    this.fromScreen = function( value, key, pattern ) {
        return parseInt( value);
    }
}

var TestBooleanConverter = function () {
    this.toScreen = function( value, key, pattern ) {
        return value === true ? 'Yes' : 'False';
    }

    this.fromScreen = function( value, key, pattern ) {
        return value.toLowerCase() === 'yes';
    }
}

var TestDateConverter = function () {
    this.toScreen = function( value, key, pattern ) {
        return $.datepicker.formatDate( "d MM yy", value);
    }

    this.fromScreen = function( value, key, pattern ) {
        return $.datepicker.parseDate( "d MM yy", value);
    }
}