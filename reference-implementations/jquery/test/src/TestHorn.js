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




module( "TestHorn - Horn.patternDefined()");

test(
    "Horn.patternDefined() - No patterns with no content.",
    function() {
        var horn = new Horn();
        horn.parse();

        ok( isEmptyArray( horn.metaInfo));
    });

test(
    "Horn.patternDefined() - That two identical patterns yield a single pattern and that it is returned correctly.",
    function() {
        dataTest( null,
            null,
            function( data, horn ) {
                ok( horn.patternDefined( 'notices.*can.*') === true);
            },
            $('<meta name="typeof notices.*can.*" content="HornBooleanConverter" /><meta name="typeof notices.*can.*" content="HornBooleanConverter" />'));
    });

test(
    "Horn.patternDefined() - Case sensitivity enforced.",
    function() {
        dataTest( null,
            null,
            function( data, horn ) {
                ok( horn.patternDefined( 'notices.*Can.*') === false);
            },
            $('<meta name="typeof notices.*can.*" content="HornBooleanConverter" />'));
    });




module( "TestHorn - Horn.isAdjustingKey()");

test(
    "Horn.isAdjustingKey() - horn.isAdjustingKey( null) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( null) === false);
    });

test(
    "Horn.isAdjustingKey() - horn.isAdjustingKey( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( undefined) === false);
    });

test(
    "Horn.isAdjustingKey() - horn.isAdjustingKey( '') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( '') === false);
    });

test(
    "Horn.isAdjustingKey() - horn.isAdjustingKey( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( ' ') === false);
    });

test(
    "Horn.isAdjustingKey() - horn.isAdjustingKey( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( 'null') === true);
    });

test(
    "Horn.isAdjustingKey() - horn.isAdjustingKey( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( 'a') === true);
    });




module( "TestHorn - Horn.startsWith()");

test(
    "String.prototype.startsWith - Sanity check on random string.",
    function() {
        var horn = new Horn();
        var val = "asakmfkdsj klasdjflkdlskfldksajflkdjs f8ds ufoas dfi";

        ok( horn.startsWith( val, val.substring(0, val.length - 5)) === true);
    });

test(
    "String.prototype.startsWith - Check reflexivity, ie. s.startsWith( s) === true.",
    function() {
        var horn = new Horn();
        var val = "abcdefghijklmnopqrstuvwxyz";

        ok( horn.startsWith( val, val) === true);
    });

test(
    "String.prototype.startsWith - Test regex not supported as expected.",
    function() {
        var val = "abcdefghijklmnopqrstuvwxyz";
        var horn = new Horn();

        ok( horn.startsWith( val, ".") === false);
    });

test(
    "String.prototype.startsWith - doesn't trim.",
    function() {
        var val = "  ";
        var horn = new Horn();

        ok( horn.startsWith( val, " ") === true);
    });



module( "TestHorn - Horn.toTokens()");

test(
    "Horn.toTokens() - check that nothing's adding prototype properties to Object.",
    function() {
        var horn = new Horn();

        var count = 0; for (var index in {}) {count++};
        ok( count === 0, "Something's adding prototype properties to {}, can't continue with tests.");
    });

test(
    "Horn.toTokens() - single token from a \"test\" string.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("test");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 1);
        ok( tokens.test === "test");
    });

test(
    "Horn.toTokens() - single token from a \"test\" string with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("    test     ");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 1);
        ok( tokens.test === "test");
    });

test(
    "Horn.toTokens() - three tokens from \"  x    y     z\" with trimming as of default \" \" delimiter.",
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
    "Horn.toTokens() - three tokens from \"__x____y_____z_____\" with trimming with non default \"_\" delimiter.",
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
    "Horn.toTokens() - that regex isn't supported.",
    function() {
        var horn = new Horn();
        var tokens = horn.toTokens("abc", ".");
        var count = 0; for (var index in tokens) {count++};

        ok( count === 1);
        ok( tokens.abc === "abc");
    });




module( "TestHorn - {valueNodes:X}");

test(
    "{valueNodes:X} - No value nodes if no storeBackRefs specified.",
    function() {
        ok( isAttached( $('._key')) === false);
        dataTest( null,
            $('<div class="data"><span class="value _key">-1</span></div>'),
            function( data, horn ) {
                ok( isAttached( $('._key')));
                ok( isObject( data));
                ok( data.key === -1);
                ok( horn.valueNodes === undefined);
            },
            $('<meta name="typeof key" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "{valueNodes:X} - Value nodes if storeBackRefs specified.",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _key">-1</span></div>'),
            function( data, horn ) {
                ok( countOwnProps( horn.valueNodes) === 1);
                ok( horn.valueNodes.hasOwnProperty( 'key'));
            },
            $('<meta name="typeof key" content="HornIntegerConverter" />'),
            true,
            true);
    });

test(
    "{valueNodes:X} - Unconverted String value, check valueNode attributes.",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _key">-1</span></div>'),
            function( data, horn ) {
                var node = horn.valueNodes[ 'key'];
                ok( node !== undefined);
                ok( node.hornKey === '-key');
                ok( node.key === 'key');
                ok( node.value === '-1');
                ok( $(node.node).text() === node.value);
                ok( node.context === horn.target);
                ok( node.context[ node.key] === data.key);
            },
            null,
            true);
    });

test(
    "{valueNodes:X} - 2 Value nodes if two values.",
    function() {
        dataTest( null,
            $('<div class="data"><div class="_a"><span class="value _key">-1</span></div><div class="_b"><span class="value _key">-1</span></div></div>'),
            function( data, horn ) {
                ok( countOwnProps( horn.valueNodes) === 2);
            },
            $('<meta name="typeof key" content="HornIntegerConverter" />'),
            true,
            true);
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




module( "TestHorn - Horn.cacheMetaElements()");

test(
    "cacheMetaElements() - sanity check that the test environment isn't using any Horn &lt;meta/&gt; element data!",
    function() {
        var horn = new Horn();
        horn.metaInfo = [];
        horn.cacheMetaElements();

        ok( (horn.metaInfo.length === 0));
    });

test(
    "cacheMetaElements() - sanity check bad &lt;meta/&gt; element inserted into head.",
    function() {
        var node = $('<meta name="layout" content="board" id="kill___me___"/>');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 0);
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - sanity check good &lt;meta/&gt; element inserted into head.",
    function() {
        var node = $('<meta name="typeof notices.*can.*" content="HornBooleanConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 1);

            ok( horn.metaInfo[0].contentAttribute === 'HornBooleanConverter');
            ok( horn.metaInfo[0].pattern === 'notices.*can.*');
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that the \"content\" attribute is correctly trimmed.",
    function() {
        var node = $('<meta name="typeof notices.*can.*" content="      HornBooleanConverter       " />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 1);

            ok( horn.metaInfo[0].pattern === 'notices.*can.*');
            ok( horn.metaInfo[0].contentAttribute === 'HornBooleanConverter');
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that a \"content\" attribute is required.",
    function() {
        var node = $('<meta name="typeof notices.*can.*" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 0);
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that a non blank \"content\" attribute is required.",
    function() {
        var node = $('<meta name="typeof notices.*can.*" content="" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 0);
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that the \'typeof\' attribute specifier is case-sensitive.",
    function() {
        var node = $('<meta name="Typeof notices.*can.*" content="HornBooleanConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 0);
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that just a \'typeof\' attribute specifier and no other attributes is handled.",
    function() {
        var node = $('<meta name="typeof notices.*can.*" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 0);
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that \'typeof X X\' only yields a single internal pattern.",
    function() {
        var node = $('<meta name="typeof notices.*can.* notices.*can.*" content="HornBooleanConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();
            ok( horn.metaInfo.length === 1);
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that \'typeof X Y\' yields two internal patterns.",
    function() {
        var node = $('<meta name="typeof notices.*can.* people.*can.*" content="HornBooleanConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();
            ok( horn.metaInfo.length === 2);

            ok( horn.metaInfo[0].contentAttribute === 'HornBooleanConverter');
            ok( horn.metaInfo[0].pattern === 'notices.*can.*');

            ok( horn.metaInfo[1].contentAttribute === 'HornBooleanConverter');
            ok( horn.metaInfo[1].pattern === 'people.*can.*');
        } finally {
            node.remove();
        }
    });

test(
    "cacheMetaElements() - that adding two &lt;meta/&gt; elements with the same attribute values only yields a single internal pattern.",
    function() {
        var node1 = $('<meta name="typeof notices.*can.*" content="HornBooleanConverter" />');
        var node2 = $('<meta name="typeof notices.*can.*" content="HornBooleanConverter" />');
        node1.appendTo( $('head'));
        node2.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 1, "This isn't critical as more of an implementation detail but could add proportionally more overhead in large document scenarios than fixing this test.");
        } finally {
            node1.remove();
            node2.remove();
        }
    });

test(
    "cacheMetaElements() - that &lt;meta/&gt; elements that exist in other locations than the head, are handled.",
    function() {
        var node = $('<meta name="typeof notices.*can.*" content="HornBooleanConverter" />');
        node.appendTo( $('body'));

        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.metaInfo.length === 1);
        } finally {
            node.remove();
        }
    });




module( "TestHorn - Horn.extractHornKey()");

test(
    "extractHornKey() - that no key is extracted if no suitable 'class' attribute token exists.",
    function() {
        var horn = new Horn();
        var badPrefix = String.fromCharCode( horn.CONST_HORN_CSS_PREFIX.charCodeAt( 0) + 1);
        ok( horn.CONST_HORN_CSS_PREFIX !== badPrefix);
        var node = $('<div class="' + badPrefix + '" />');

        ok( horn.extractKey( node) === null);
    });

test(
    "extractKey() - that the code handles the element having no 'class' atribute.",
    function() {
        var horn = new Horn();
        var node = $('<div />');

        ok( horn.extractKey( node) === null);
    });

test(
    "extractKey() - extracts known good key.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.CONST_HORN_CSS_PREFIX + 'expected" />');

        ok( horn.extractKey( node) === 'expected');
    });

test(
    "extractKey() - extracts the first key from multiple.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.CONST_HORN_CSS_PREFIX + 'expected ' + horn.CONST_HORN_CSS_PREFIX + 'unexpected" />');

        ok( horn.extractKey( node) === 'expected');
    });




module( "TestHorn - Horn.getClosestDataParent()");

test(
    "getClosestDataParent() - three data nodes in a hierarchy, the bottom one yields the correct parent.",
    function() {
        var horn = new Horn();
        var node1 = $('<div class="' + horn.CONST_HORN_CSS_DATA + '" id="node1" />');
        var node2 = $('<div class="' + horn.CONST_HORN_CSS_DATA + '" id="node2" />');
        var node3 = $('<div class="' + horn.CONST_HORN_CSS_DATA + '" id="node3" />');
        node3.appendTo( node2);
        node2.appendTo( node1);
        try {
            node1.appendTo( $('body'));

            ok( $(horn.getClosestDataParent( node3)).attr( 'id') === "node2");
        } finally {
            node1.remove();
        }
    });

test(
    "getClosestDataParent() - returns null if no suitable parent.",
    function() {
        var horn = new Horn();
        var node1 = $('<div class="' + horn.CONST_HORN_CSS_DATA + '" id="node1" />');
        try {
            node1.appendTo( $('body'));

            ok( horn.getClosestDataParent( node1) === null);
        } finally {
            node1.remove();
        }
    });

test(
    "getClosestDataParent() - works spanning irrelevant nodes.",
    function() {
        var horn = new Horn();
        var node1 = $('<div class="' + horn.CONST_HORN_CSS_DATA + '" id="node1" />');
        var node2 = $('<div/>');
        var node3 = $('<div/>');
        var node4 = $('<div/>');
        var node5 = $('<div class="' + horn.CONST_HORN_CSS_DATA + '" id="node5" />');
        node5.appendTo( node4);
        node4.appendTo( node3);
        node3.appendTo( node2);
        node2.appendTo( node1);
        try {
            node1.appendTo( $('body'));

            ok( $(horn.getClosestDataParent( node5)).attr( 'id') === "node1");
        } finally {
            node1.remove();
        }
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




module( "TestHorn - Horn.coerceValue()");

test(
    "coerceValue() - that it returns null if there are no matching patterns.",
    function() {

        var horn = new Horn();
        horn.metaInfo = [];

        var value = "value";
        var hornKey = "_hornKey";

        ok( horn.coerceValue( value, hornKey, false) === null);
    });

test(
    "coerceValue() - that coercing to Integers of non-json-supplied values with a match all regex pattern works as expected.",
    function() {
        dataTest(
            null,
            null,
            function( data, horn ) {
                ok( horn.coerceValue( "1", "_hornKey", false) === 1);
            },
            $('<meta name="typeof .*" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "coerceValue() - that coercing to (negative) Integers of non-json-supplied values with a match all regex pattern works as expected.",
    function() {
        dataTest(
            null,
            null,
            function( data, horn ) {
                ok( horn.coerceValue( "-1", "_hornKey", false) === -1);
            },
            $('<meta name="typeof .*" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "coerceValue() - no coercion if no matching regex against the value's hornKey.",
    function() {
        var node = $('<meta name="typeof noMatch" content="HornIntegerConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.parse();

            ok( horn.coerceValue( "-1", "_hornKey", false) === null);
        } finally {
            node.remove();
        }
    });

test(
    "coerceValue() - that dates are coerced and parsed correctly.",
    function() {
        dataTest(
            null,
            null,
            function( data, horn ) {
                var coercedValue = horn.coerceValue( "2011-04-01", "_ourdate", false);
                ok( coercedValue.constructor.toString().indexOf( 'Date') > 0);

                ok( coercedValue.getFullYear() === 2011);
                ok( coercedValue.getMonth() === 3);
                ok( coercedValue.getDate() === 1);
            },
            $('<meta name="typeof .*date.*" content="HornDateConverter" />'),
            false,
            true);

    });

test(
    "coerceValue() - that boolean values are coerced and parsed correctly.",
    function() {
        dataTest(
            null,
            null,
            function( data, horn ) {
                ok( horn.coerceValue( "true",   "_ourtruth", false) === true);
                ok( horn.coerceValue( "tRuE",   "_ourtruth", false) === true);
                ok( horn.coerceValue( "TRUE",   "_ourtruth", false) === true);
                ok( horn.coerceValue( "false",  "_ourtruth", false) === false);
                ok( horn.coerceValue( "FaLsE",  "_ourtruth", false) === false);
                ok( horn.coerceValue( "FALSE",  "_ourtruth", false) === false);
            },
            $('<meta name="typeof .*truth.*" content="HornBooleanConverter" />'),
            false,
            true);
    });




module( "TestHorn - JSON output tests");

/*
                                    'Key' - 'Value'         Structure
    [
        "one",                      _0 - 'one'              [S
        2,                          _1 - 2                  [I
        true,                       _2 - true               [B
        [
            "three",                _3-0 - 'three'          [[S
            4,                      _3-1 - 4                [[I
            false,                  _3-2 - false            [[B
            [
                "five",             _3-3-0 - 'five'         [[[S
                6,                  _3-3-1 - 6              [[[I
                true],              _3-3-2 - true           [[[B
            {
                k:  "seven",        _3-4-k - 'seven'        [[{:S
                l:  8,              _3-4-l - 8              [[{:I
                m:  false}],        _3-4-m - false          [[{:B
        {
            f:  "nine",             _4-f - 'nine'           [{:S
            g:  10,                 _4-g - 10               [{:I
            h:  true,               _4-h - true             [{:B
            i:  [
                "eleven",           _4-i-1 - 'eleven'       [{:[S
                12,                 _4-i-2 - 12             [{:[I
                false],             _4-i-3 - false          [{:[B
            j:  {
                n:  "thirteen",     _4-j-n - 'thirteen'     [{:{:S
                o:  14,             _4-j-o - 14             [{:{:I
                p:  true            _4-j-p - true           [{:{:B
            }
        }
    ]

    {
        a:  "one",                  _a - 'one'              {:S
        b:  2,                      _b - 2                  {:2
        c:  true,                   _c - true               {:B
        d:  [
                "three",            _d-0 - 'three'          {:[S
                4,                  _d-1 - 4                {:[I
                false,              _d-2 - false            {:[B
                [
                    "five",         _d-3-0 - 'five'         {:[[S
                    6,              _d-3-1 - 6              {:[[I
                    true],          _d-3-2 - true           {:[[B
                {
                    k:  "seven",    _d-4-k - 'seven'        {:[{:S
                    l:  8,          _d-4-l - 8              {:[{:I
                    m:  false}]],   _d-4-m - false          {:[{:B
        e:  {
                f:  "nine",         _e-f - 'nine'           {:{:S
                g:  10,             _e-g - 10               {:{:I
                h:  true,           _e-h - true             {:{:B
                i:  [
                    "eleven",       _e-i-1 - 'eleven'       {:{:[S
                    12,             _e-i-2 - 12             {:{:[I
                    false],         _e-i-3 - false          {:{:[B
                j:  {
                    n:  "thirteen", _e-j-n - 'thirteen'     {:{:{:S
                    o:  14,         _e-j-o - 14             {:{:{:I
                    p:  true        _e-j-p - true           {:{:{:B
                }
            }
    }
*/

test(
    "Data Ouput Tests - no data expected, undefined returned.",
    function() {
        dataTest( null,
            $('<div></div>'),
            function( data ) {
                ok( data === undefined);
            });
    });

test(
    "Data Output Tests - _0 - 'one'",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _0">one</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 1);
                ok( data[ 0] === 'one');
            });
    });

test(
    "Data Output Tests - _1 - 2",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _1">2</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 2);
                ok( data[ 1] === 2);
            },
            $('<meta name="typeof 1" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _2 - true",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _2">true</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 3);
                ok( data[ 2] === true);
            },
            $('<meta name="typeof 2" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _3-0 - 'three'",
    function() {
        dataTest( null,
            $('<div class="data _3"><span class="_0">three</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 1);

                ok( data[ 3][ 0] === 'three');
            });
    });

test(
    "Data Output Tests - _3-1 - 4",
    function() {
        dataTest( null,
            $('<div class="data _3"><span class="_1">4</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 2);

                ok( data[ 3][ 1] === 4);
            },
            $('<meta name="typeof 3-1" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _3-2 - false",
    function() {
        dataTest( null,
            $('<div class="data _3"><span class="_2">false</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 3);

                ok( data[ 3][ 2] === false);
            },
            $('<meta name="typeof 3-2" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _3-3-0 - 'five'",
    function() {
        dataTest( null,
            $('<div class="data _3-3"><span class="_0">five</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 4);

                ok( isArray( data[ 3][ 3]));
                ok( data[ 3][ 3].length === 1);

                ok( data[ 3][ 3][ 0] === 'five');
            });
    });

test(
    "Data Output Tests - _3-3-1 - 6",
    function() {
        dataTest( null,
            $('<div class="data _3-3"><span class="_1">6</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 4);

                ok( isArray( data[ 3][ 3]));
                ok( data[ 3][ 3].length === 2);

                ok( data[ 3][ 3][ 1] === 6);
            },
            $('<meta name="typeof 3-3-1" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _3-3-2 - true",
    function() {
        dataTest( null,
            $('<div class="data _3-3"><span class="_2">true</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 4);

                ok( isArray( data[ 3][ 3]));
                ok( data[ 3][ 3].length === 3);

                ok( data[ 3][ 3][ 2] === true);
            },
            $('<meta name="typeof 3-3-2" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _3-4-k - 'seven'",
    function() {
        dataTest( null,
            $('<div class="data _3-4"><span class="_k">seven</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 5);

                ok( isObject( data[ 3][ 4]));
                ok( data[ 3][ 4][ 'k'] === 'seven');
            });
    });

test(
    "Data Output Tests - _3-4-l - 8",
    function() {
        dataTest( null,
            $('<div class="data _3-4"><span class="_l">8</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 5);

                ok( isObject( data[ 3][ 4]));
                ok( data[ 3][ 4][ 'l'] === 8);
            },
            $('<meta name="typeof 3-4-l" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _3-4-m - false",
    function() {
        dataTest( null,
            $('<div class="data _3-4"><span class="_m">false</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 4);

                ok( isArray( data[ 3]));
                ok( data[ 3].length === 5);

                ok( isObject( data[ 3][ 4]));
                ok( data[ 3][ 4][ 'm'] === false);
            },
            $('<meta name="typeof 3-4-m" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _4-f - 'nine'",
    function() {
        dataTest( null,
            $('<div class="data _4"><span class="_f">nine</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( data[ 4][ 'f'] === 'nine');
            });
    });

test(
    "Data Output Tests - _4-g - 10",
    function() {
        dataTest( null,
            $('<div class="data _4"><span class="_g">10</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( data[ 4][ 'g'] === 10);
            },
            $('<meta name="typeof 4-g" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _4-h - true",
    function() {
        dataTest( null,
            $('<div class="data _4"><span class="_h">true</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( data[ 4][ 'h'] === true);
            },
            $('<meta name="typeof 4-h" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _4-i-1 - 'eleven'",
    function() {
        dataTest( null,
            $('<div class="data _4-i"><span class="_1">eleven</span></div>'),
            function( data ) {

                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( isArray( data[ 4][ 'i']));
                ok( data[ 4][ 'i'].length === 2);

                ok( data[ 4][ 'i'][1] === 'eleven');
            });
    });

test(
    "Data Output Tests - _4-i-2 - 12",
    function() {
        dataTest( null,
            $('<div class="data _4-i"><span class="_2">12</span></div>'),
            function( data ) {

                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( isArray( data[ 4][ 'i']));
                ok( data[ 4][ 'i'].length === 3);

                ok( data[ 4][ 'i'][ 2] === 12);
            },
            $('<meta name="typeof 4-i-2" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _4-i-3 - false",
    function() {
        dataTest( null,
            $('<div class="data _4-i"><span class="_3">false</span></div>'),
            function( data ) {

                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( isArray( data[ 4][ 'i']));
                ok( data[ 4][ 'i'].length === 4);

                ok( data[ 4][ 'i'][ 3] === false);
            },
            $('<meta name="typeof 4-i-3" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _4-j-n - 'thirteen'",
    function() {
        dataTest( null,
            $('<div class="data _4-j"><span class="_n">thirteen</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( isObject( data[ 4][ 'j']));

                ok( data[ 4][ 'j'][ 'n'] === 'thirteen');
            });
    });

test(
    "Data Output Tests - _4-j-o - 14",
    function() {
        dataTest( null,
            $('<div class="data _4-j"><span class="_o">14</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( isObject( data[ 4][ 'j']));

                ok( data[ 4][ 'j'][ 'o'] === 14);
            },
            $('<meta name="typeof 4-j-o" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _4-j-p - true",
    function() {
        dataTest( null,
            $('<div class="data _4-j"><span class="_p">true</span></div>'),
            function( data ) {
                ok( isArray( data));
                ok( data.length === 5);

                ok( isObject( data[ 4]));
                ok( isObject( data[ 4][ 'j']));

                ok( data[ 4][ 'j'][ 'p'] === true);
            },
            $('<meta name="typeof 4-j-p" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _a - 'one'",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _a">one</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( data[ 'a'] === 'one');
            });
    });

test(
    "Data Output Tests - _b - 2",
    function() {
        dataTest( null,
            $('<div class="data"><span class="_b">2</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( data.b === 2);
            },
            $('<meta name="typeof b" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _d-0 - 'three'",
    function() {
        dataTest( null,
            $('<div class="data _d"><span class="_0">three</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isArray( data.d));
                ok( data.d.length === 1);
                ok( data.d[ 0] === 'three');
            });
    });

test(
    "Data Output Tests - _d-1 - 4",
    function() {
        dataTest( null,
            $('<div class="data _d"><span class="_1">4</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isArray( data.d));
                ok( data.d.length === 2);
                ok( data.d[ 1] === 4);
            },
            $('<meta name="typeof d-1" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _d-2 - false",
    function() {
        dataTest( null,
            $('<div class="data _d"><span class="_2">false</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isArray( data.d));
                ok( data.d.length === 3);
                ok( data.d[ 2] === false);
            },
            $('<meta name="typeof d-2" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _d-3-0 - 'five'",
    function() {
        dataTest( null,
            $('<div class="data _d-3"><span class="_0">five</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isArray( data.d));
                ok( data.d.length === 4);
                ok( isArray( data.d[3]));
                ok( data.d[3].length === 1);
                ok( data.d[3][0] === 'five');
            });
    });

test(
    "Data Output Tests - _d-3-1 - 6",
    function() {
        dataTest( null,
            $('<div class="data _d-3"><span class="_1">6</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isArray( data.d));
                ok( data.d.length === 4);
                ok( isArray( data.d[3]));
                ok( data.d[3].length === 2);
                ok( data.d[3][1] === 6);
            },
            $('<meta name="typeof d-3-1" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _d-3-2 - true",
    function() {
        dataTest( null,
            $('<div class="data _d-3"><span class="_2">true</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isArray( data.d));
                ok( data.d.length === 4);
                ok( isArray( data.d[3]));
                ok( data.d[3].length === 3);
                ok( data.d[3][2] === true);
            },
            $('<meta name="typeof d-3-2" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _d-4-k - 'seven'",
    function() {
        dataTest( null,
            $('<div class="data _d-4"><span class="_k">seven</span></div>'),
            function( data ) {
                ok( isObject( data));

                ok( isArray( data.d));
                ok( data.d.length === 5);

                ok( isObject( data.d[ 4]));

                ok( data.d[ 4].k === 'seven');
            });
    });

test(
    "Data Output Tests - _d-4-l - 8",
    function() {
        dataTest( null,
            $('<div class="data _d-4"><span class="_l">8</span></div>'),
            function( data ) {
                ok( isObject( data));

                ok( isArray( data.d));
                ok( data.d.length === 5);

                ok( isObject( data.d[ 4]));

                ok( data.d[ 4].l === 8);
            },
            $('<meta name="typeof d-4-l" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _d-4-m - false",
    function() {
        dataTest( null,
            $('<div class="data _d-4"><span class="_m">false</span></div>'),
            function( data ) {
                ok( isObject( data));

                ok( isArray( data.d));
                ok( data.d.length === 5);

                ok( isObject( data.d[ 4]));

                ok( data.d[ 4].m === false);
            },
            $('<meta name="typeof d-4-m" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _e-f - 'nine'",
    function() {
        dataTest( null,
            $('<div class="data _e"><span class="_f">nine</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( data.e.f === 'nine');
            });
    });

test(
    "Data Output Tests - _e-g - 10",
    function() {
        dataTest( null,
            $('<div class="data _e"><span class="_g">10</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( data.e.g === 10);
            },
            $('<meta name="typeof e-g" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _e-h - true",
    function() {
        dataTest( null,
            $('<div class="data _e"><span class="_h">true</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( data.e.h === true);
            },
            $('<meta name="typeof e-h" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _e-i-1 - 'eleven'",
    function() {
        dataTest( null,
            $('<div class="data _e-i"><span class="_1">eleven</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( isArray( data.e.i));
                ok( data.e.i.length === 2);
                ok( data.e.i[ 1] === 'eleven');

            });
    });

test(
    "Data Output Tests - _e-i-2 - 12",
    function() {
        dataTest( null,
            $('<div class="data _e-i"><span class="_2">12</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( isArray( data.e.i));
                ok( data.e.i.length === 3);
                ok( data.e.i[ 2] === 12);
            },
            $('<meta name="typeof e-i-2" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _e-i-3 - false",
    function() {
        dataTest( null,
            $('<div class="data _e-i"><span class="_3">false</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( isArray( data.e.i));
                ok( data.e.i.length === 4);
                ok( data.e.i[ 3] === false);

            },
            $('<meta name="typeof e-i-3" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _e-j-n - 'thirteen'",
    function() {
        dataTest( null,
            $('<div class="data _e-i"><span class="_n">thirteen</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( isObject( data.e.i));
                ok( data.e.i.n === 'thirteen');

            });
    });

test(
    "Data Output Tests - _e-j-o - 14",
    function() {
        dataTest( null,
            $('<div class="data _e-i"><span class="_o">14</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( isObject( data.e.i));
                ok( data.e.i.o === 14);

            },
            $('<meta name="typeof e-i-o" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - _e-j-p - true",
    function() {
        dataTest( null,
            $('<div class="data _e-i"><span class="_p">true</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( isObject( data.e));
                ok( isObject( data.e.i));
                ok( data.e.i.p === true);
            },
            $('<meta name="typeof e-i-p" content="HornBooleanConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - that integers can be expressed using hexadecimal notation.",
    function() {
        dataTest( null,
            $('<div class="data"><span class=" _a">0x10</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( data.a === 16);
            },
            $('<meta name="typeof a" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - that integers can be expressed using octal notation.",
    function() {
        dataTest( null,
            $('<div class="data"><span class="_a">0310667130</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( data.a === 52653656);
            },
            $('<meta name="typeof a" content="HornIntegerConverter" />'),
            false,
            true);
    });

test(
    "Data Output Tests - Split definition using nested html.",
    function() {
        dataTest( null,
            $('<div class="data _a"><div class="_b"><div class="_c"><span class="_d">-23</span></div></div></div>'),
            function( data) {
                ok( data.a.b.c.d === -23);
          },
          $('<meta name="typeof a-b-c-d" content="HornIntegerConverter" />'),
            false,
            true);
  });

test(
    "Data Output Tests - Embedded JSON Object with string property stored in object in root context.",
    function() {
        dataTest( null,
            $('<div class="data _0"><span class="horn-json">{"a": "hello"}</span></div>'),
            function( data) {
                ok( isArray( data));
                ok( isObject( data[0]));
                ok( data[ 0].a === 'hello');
          });
  });

test(
    "Data Output Tests - Embedded JSON Object with integer property stored in array root context.",
    function() {
        dataTest( null,
            $('<div class="data _0"><span class="horn-json">{"a": 1}</span></div>'),
            function( data) {
                ok( isArray( data));
                ok( isObject( data[ 0]));
                ok( data[ 0].a === 1);
          });
  });

test(
    "Data Output Tests - Embedded JSON Object with boolean property stored in array root context.",
    function() {
        dataTest( null,
            $('<div class="data _0"><span class="horn-json">{"a": true}</span></div>'),
            function( data) {
                ok( isArray( data));
                ok( isObject( data[ 0]));
                ok( data[ 0].a === true);
          });
  });

test(
    "Data Output Tests - that two properties can exist in the same context.",
    function() {
        dataTest( null,
            $('<div class="data"><span class="value _a">one</span><span class="value _b">two</span></div>'),
            function( data ) {
                ok( isObject( data));
                ok( data[ 'a'] === 'one');
                ok( data[ 'b'] === 'two');
            });
    });




module( "TestHorn - ABBR");

test(
    "ABBR - ABBR node for value, no type conversion.",
    function() {
        dataTest(
            null,
            $('<div class="data"><abbr class="_key" title="alternative">value</abbr></div>'),
            function( data, horn ) {
                ok( isObject( data));
                ok( data.key === 'alternative');
            },
            null,
            true,
            false);
    });

test(
    "ABBR - ABBR node for value, converted to Integer.",
    function() {
        dataTest(
            null,
            $('<div class="data"><abbr class="_key" title="12">value</abbr></div>'),
            function( data, horn ) {
                ok( isObject( data));
                ok( data.key === 12);
            },
            $('<meta name="typeof key" content="HornIntegerConverter" />'),
            true,
            true);
    });

test(
    "ABBR - ABBR node for value, converted to Boolean, repopulated and checked.",
    function() {
        ok( isAttached( $('._key')) === false);
        dataTest(
            null,
            $('<div class="data"><abbr class="_key" title="true">value</abbr></div>'),
            function( data, horn ) {
                ok( isAttached( $('._key')));
                ok( isObject( data));
                ok( data.key === true);
                data.key = false;
                horn.populate();
                ok( $('._key').attr( 'title') === 'false');
            },
            $('<meta name="typeof key" content="HornBooleanConverter" />'),
            true,
            true);
    });


module( "TestHorn - Population");

test(
    "Population - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        ok( isAttached( $('._key')) === false);
        dataTest( null,
            $('<div class="data"><span class="value _key">-1</span></div>'),
            function( data, horn ) {
                ok( isAttached( $('._key')));
                ok( isObject( data));
                ok( data.key === -1);
                data.key = 13;
                horn.populate();
                ok( $('._key').text() === '13');
            },
            $('<meta name="typeof key" content="HornIntegerConverter" />'),
            true,
            true);
    });