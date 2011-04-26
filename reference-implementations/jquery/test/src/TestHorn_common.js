module( "TestHorn - Horn Miscellany");

test(
    "Horn Miscellany - check that we have all the required window.Node values expected.",
    function() {
        var horn = new Horn();

        ok( window.Node.ELEMENT_NODE === 1);
        ok( window.Node.ATTRIBUTE_NODE === 2);
        ok( window.Node.TEXT_NODE === 3);
        ok( window.Node.CDATA_SECTION_NODE === 4);
        ok( window.Node.ENTITY_REFERENCE_NODE === 5);
        ok( window.Node.ENTITY_NODE === 6);
        ok( window.Node.PROCESSING_INSTRUCTION_NODE === 7);
        ok( window.Node.COMMENT_NODE === 8);
        ok( window.Node.DOCUMENT_NODE === 9);
        ok( window.Node.DOCUMENT_TYPE_NODE === 10);
        ok( window.Node.DOCUMENT_FRAGMENT_NODE === 11);
        ok( window.Node.NOTATION_NODE === 12);
    });

test(
    "Horn Miscellany - check that we have the required prototype indicator constants expected.",
    function() {
        var horn = new Horn();

        ok( horn.INDICATOR_ROOT === 0);
        ok( horn.INDICATOR_PATH === 1);
        ok( horn.INDICATOR_JSON === 2);
    });




module( "TestHorn - Horn.encodeCSS()");

test(
    "Horn.encodeCSS() - On null or undefined returns undefined.",
    function() {
        var horn = new Horn();
        ok( horn.encodeCSS( null) === undefined);
        ok( horn.encodeCSS( undefined) === undefined);
    });

test(
    "Horn.encodeCSS() - Sanity check various values - this relies upon the default horn options.",
    function() {
        var horn = new Horn();
        ok( horn.encodeCSS( 'a') === "_a");
        ok( horn.encodeCSS( 'a[10]') === "_a-10");
        ok( horn.encodeCSS( '[10]') === "_10");
        ok( horn.encodeCSS( '[10][20]') === "_10-20");
        ok( horn.encodeCSS( 'x[1].y[2].z[3]') === "_x-1-y-2-z-3");
        ok( horn.encodeCSS( 'x[1][2][3].y[2].z') === "_x-1-2-3-y-2-z");
    });




module( "TestHorn - Horn.patternDefined()");

test(
    "Horn.patternDefined() - No patterns with no content.",
    function() {
        var horn = new Horn();
        horn.extract();

        ok( isEmptyObject( horn.opts.patternInfo));
    });

test(
    "Horn.patternDefined() - That two identical patterns yield a single pattern and that it is returned correctly.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", "notices.*can.*", "BooleanConverter");
                ok( horn.patternDefined( 'notices.*can.*') === true);
            }
        });
    });

test(
    "Horn.patternDefined() - Case sensitivity enforced.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( 'pattern', 'notices.*Can.*', 'BooleanConverter');
                ok( horn.patternDefined( '') === false);
            }});
    });




module( "TestHorn - Horn.isAdjustingPath()");

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( null) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( null) === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( undefined) === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( '') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( '') === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( ' ') === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( 'null') === true);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( 'a') === true);
    });




module( "TestHorn - Horn.prototype.startsWith()");

test(
    "Horn.prototype.startsWith - Sanity check on random string.",
    function() {
        var horn = new Horn();
        var val = "asakmfkdsj klasdjflkdlskfldksajflkdjs f8ds ufoas dfi";

        ok( horn.startsWith( val, val.substring(0, val.length - 5)) === true);
    });

test(
    "Horn.prototype.startsWith - Check reflexivity, ie. s.startsWith( s) === true.",
    function() {
        var horn = new Horn();
        var val = "abcdefghijklmnopqrstuvwxyz";

        ok( horn.startsWith( val, val) === true);
    });

test(
    "Horn.prototype.startsWith - Test regex not supported as expected.",
    function() {
        var val = "abcdefghijklmnopqrstuvwxyz";
        var horn = new Horn();

        ok( horn.startsWith( val, ".") === false);
    });

test(
    "Horn.prototype.startsWith - doesn't trim.",
    function() {
        var val = "  ";
        var horn = new Horn();

        ok( horn.startsWith( val, " ") === true);
    });



module( "TestHorn - Horn.prototype.toTokens()");

test(
    "Horn.prototype.toTokens() - check that nothing's adding prototype properties to Object.",
    function() {
        var horn = new Horn();

        var count = 0; for (var index in {}) {count++};
        ok( count === 0, "Something's adding prototype properties to {}, can't continue with tests.");
    });

test(
    "Horn.prototype.toTokens() - single token from a \"test\" string.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("test");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 1);
        ok( tokens.test === "test");
    });

test(
    "Horn.prototype.toTokens() - single token from a \"test\" string with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("    test     ");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 1);
        ok( tokens.test === "test");
    });

test(
    "Horn.prototype.toTokens() - three tokens from \"  x    y     z\" with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("  x    y     z");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 3);
        ok( tokens.x === "x");
        ok( tokens.y === "y");
        ok( tokens.z === "z");
    });

test(
    "Horn.prototype.toTokens() - three tokens from \"__x____y_____z_____\" with trimming with non default \"_\" delimiter.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("__x____y_____z_____", "_");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 3);
        ok( tokens.x === "x");
        ok( tokens.y === "y");
        ok( tokens.z === "z");
    });

test(
    "Horn.prototype.toTokens() - that regex isn't supported.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("abc", ".");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 1);
        ok( tokens.abc === "abc");
    });




module( "TestHorn - getPattern");

test(
    "Horn.getPattern - that it does return defined patterns.",
    function() {
        dataTest({
            callback: function( horn ) {
                horn.option( "pattern", "key", "DateConverter");
                ok( horn.opts.patternInfo[ 'key'].converterName === 'DateConverter');
            }});
    });



module( "TestHorn - Horn.didRemoveProperty()");

test(
    "didRemoveProperty() - that we can remove a new object's property X.",
    function() {
        var horn = new Horn();

        ok( horn.didRemoveProperty( {"a": "b"}, "a"));
    });

test(
    "didRemoveProperty() - that we can't remove a property that doesn't exist.",
    function() {
        var horn = new Horn();
        var propertyName = "ajsdjfklsadjkfljlksadjfkljsdklfjlksadjf";
        var testObj = {};

        ok( testObj[ propertyName] === undefined);
        ok( !horn.didRemoveProperty( testObj, propertyName));
    });

test(
    "didRemoveProperty() - removal of known property is reported as have being removed and is actually removed.",
    function() {
        var testObj = {};
        ok( testObj.propertyName === undefined);

        var horn = new Horn();
        testObj.propertyName = "propertyValue";

        ok( horn.didRemoveProperty( testObj, "propertyName") === true);
        ok( testObj.propertyName === undefined);
    });




module( "TestHorn - Horn.prototype.extractCSSPropertyPath()");

test(
    "Horn.prototype.extractCSSPropertyPath() - that no key is extracted if no suitable 'class' attribute token exists.",
    function() {
        var horn = new Horn();
        var badPrefix = String.fromCharCode( horn.defaults.cssPrefix.charCodeAt( 0) + 1);
        ok( horn.CONST_HORN_CSS_PREFIX !== badPrefix);
        var node = $('<div class="' + badPrefix + '" />');

        ok( horn.extractCSSPropertyPath( node) === null);
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - that the code handles the element having no 'class' atribute.",
    function() {
        var horn = new Horn();
        var node = $('<div />');

        ok( horn.extractCSSPropertyPath( node) === null);
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - extracts known good key.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.defaults.cssPrefix + 'expected" />');

        ok( horn.extractCSSPropertyPath( node) === 'expected');
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - extracts the first key from multiple.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.defaults.cssPrefix + 'expected ' + horn.defaults.cssPrefix + 'unexpected" />');

        ok( horn.extractCSSPropertyPath( node) === 'expected');
    });




module( "TestHorn - Horn.getIfSingleTextNode()");

test(
    "getIfSingleTextNode() - that an empty '&lt;a/&gt;' element doesn't return anything using this function.",
    function() {
        try {
            var horn = new Horn();
            var node = $('<a/>');
            node.appendTo( $('body'));

            ok( horn.getIfSingleTextNode( node) === null);
        } finally {
            node.remove();
        }
    });

test(
    "getIfSingleTextNode() - that applied to '&lt;a&gt;123 456&lt;/a&gt;' return the expected value '123 456'.",
    function() {
        try {
            var horn = new Horn();
            var node = $('<a>123 456</a>');
            node.appendTo( $('body'));

            ok( horn.getIfSingleTextNode( node) === '123 456');
        } finally {
            node.remove();
        }
    });

test(
    "getIfSingleTextNode() - that applied to '&lt;a&gt; 123 456 &lt;/a&gt;' return the expected value ' 123 456 ', nice and bushy like.",
    function() {
        try {
            var horn = new Horn();
            var node = $('<a> 123 456 </a>');
            node.appendTo( $('body'));

            ok( horn.getIfSingleTextNode( node) === ' 123 456 ');
        } finally {
            node.remove();
        }
    });

test(
    "getIfSingleTextNode() - that when applied to elements with more than 1 child (at least one text node), returns null.",
    function() {
        try {
            var horn = new Horn();
            var node = $('<a> 123<a>a</a>456 </a>');
            node.appendTo( $('body'));

            ok( horn.getIfSingleTextNode( node) === null);
        } finally {
            node.remove();
        }
    });




module( "TestHorn - Horn.convertValue()");

test(
    "convertValue() - that it returns null if there are no matching patterns.",
    function() {

        var horn = new Horn();
        horn.metaInfo = [];

        var value = "value";
        var hornKey = "_hornKey";

        ok( horn.convertValue( value, hornKey, false) === null);
    });

test(
    "convertValue() - that coercing to Integers of non-json-supplied values with a match all regex pattern works as expected.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", ".*", "IntegerConverter");
                var model = horn.extract();
                ok( horn.convertValue( "1", "_hornKey", false) === 1);
            }});
    });

test(
    "convertValue() - that coercing to (negative) Integers of non-json-supplied values with a match all regex pattern works as expected.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", ".*", "IntegerConverter");
                var model = horn.extract();
                ok( horn.convertValue( "-1", "_hornKey", false) === -1);
            }});
    });

test(
    "convertValue() - no coercion if no matching regex against the value's hornKey.",
    function() {
        var node = $('<meta name="typeof noMatch" content="IntegerConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.extract();

            ok( horn.convertValue( "-1", "_hornKey", false) === null);
        } finally {
            node.remove();
        }
    });

test(
    "convertValue() - that boolean values are coerced and parsed correctly.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", ".*truth.*", "BooleanConverter");
                var model = horn.extract();
                ok( horn.convertValue( "true",   "_ourtruth", false) === true);
                ok( horn.convertValue( "tRuE",   "_ourtruth", false) === true);
                ok( horn.convertValue( "TRUE",   "_ourtruth", false) === true);
                ok( horn.convertValue( "false",  "_ourtruth", false) === false);
                ok( horn.convertValue( "FaLsE",  "_ourtruth", false) === false);
                ok( horn.convertValue( "FALSE",  "_ourtruth", false) === false);
            }});
    });
