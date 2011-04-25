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




module( "TestHorn - Horn.isAdjustingKey()");

test(
    "Horn.prototype.isAdjustingKey() - horn.isAdjustingKey( null) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( null) === false);
    });

test(
    "Horn.prototype.isAdjustingKey() - horn.isAdjustingKey( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( undefined) === false);
    });

test(
    "Horn.prototype.isAdjustingKey() - horn.isAdjustingKey( '') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( '') === false);
    });

test(
    "Horn.prototype.isAdjustingKey() - horn.isAdjustingKey( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( ' ') === false);
    });

test(
    "Horn.prototype.isAdjustingKey() - horn.isAdjustingKey( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( 'null') === true);
    });

test(
    "Horn.prototype.isAdjustingKey() - horn.isAdjustingKey( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingKey( 'a') === true);
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




module( "TestHorn - {valueNodes:X}");

test(
    "{valueNodes:X} - No value nodes if no storeBackRefs specified.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                target: $('body'),
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "key", "IntegerConverter");
                var model = horn.extract();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === -1);

                ok( horn.valueNodes === undefined);
            }});
    });

test(
    "{valueNodes:X} - Value nodes if storeBackRefs specified.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [{
                target: $('body'),
                nodes: $('<div class="horn"><span class="_key">-1</span></div>')
            }],

            callback: function( horn ) {
                horn.option( 'pattern', 'key', 'IntegerConverter');
                horn.extract( {storeBackRefs: true});
                ok( countOwnProps( horn.valueNodes) === 1);
                ok( horn.valueNodes.hasOwnProperty( 'key'));
            }
        });
    });

test(
    "{valueNodes:X} - Unconverted String value, check valueNode attributes.",
    function() {
        dataTest( {
            nodes: [{
                target: $('body'),
                nodes: $('<div class="horn"><span class="_key">-1</span></div>')
            }],
            callback: function( horn ) {
                var model = horn.extract({storeBackRefs: true});
                var node = horn.valueNodes[ 'key'];
                ok( node !== undefined);
                ok( node.hornKey === '-key');
                ok( node.key === 'key');
                ok( node.value === '-1');
                ok( $(node.node).text() === node.value);
                ok( node.context === horn.model);
                ok( node.context[ node.key] === model.key);
            }
        });
    });

test(
    "{valueNodes:X} - 2 Value nodes if two values.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [{
                target: $('body'),
                nodes: $('<div class="horn"><div class="_a"><span class="_key">-1</span></div><div class="_b"><span class="_key">-1</span></div></div>')
            }],
            callback: function( horn ) {
                horn.option( 'pattern', 'key', 'IntegerConverter');
                horn.extract({storeBackRefs: true});
                ok( countOwnProps( horn.valueNodes) === 2);
            }
        });
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




module( "TestHorn - Horn.prototype.extractKey()");

test(
    "Horn.prototype.extractKey() - that no key is extracted if no suitable 'class' attribute token exists.",
    function() {
        var horn = new Horn();
        var badPrefix = String.fromCharCode( horn.defaults.cssPrefix.charCodeAt( 0) + 1);
        ok( horn.CONST_HORN_CSS_PREFIX !== badPrefix);
        var node = $('<div class="' + badPrefix + '" />');

        ok( horn.extractKey( node) === null);
    });

test(
    "Horn.prototype.extractKey() - that the code handles the element having no 'class' atribute.",
    function() {
        var horn = new Horn();
        var node = $('<div />');

        ok( horn.extractKey( node) === null);
    });             0

test(
    "Horn.prototype.extractKey() - extracts known good key.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.defaults.cssPrefix + 'expected" />');

        ok( horn.extractKey( node) === 'expected');
    });

test(
    "Horn.prototype.extractKey() - extracts the first key from multiple.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.defaults.cssPrefix + 'expected ' + horn.defaults.cssPrefix + 'unexpected" />');

        ok( horn.extractKey( node) === 'expected');
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




module( "TestHorn - Model Tests");

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
    "Model Tests - no data expected, undefined returned.",
    function() {
        dataTest( {
            callback: function( horn ) {
                var model = horn.extract();
                ok( model === undefined);
            }});
    });

test(
    "Model Tests - _0 - 'one'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">one</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 1);
                ok( model[ 0] === 'one');
            }});

    });

test(
    "Model Tests - _1 - 2",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_1">2</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "1", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 2);
                ok( model[ 1] === 2);
            }});
    });

test(
    "Model Tests - _2 - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_2">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "2", "BooleanConverter");
                var data = horn.extract();
                ok( isArray( data));
                ok( data.length === 3);
                ok( data[ 2] === true);
            }});
    });

test(
    "Model Tests - _3-0 - 'three'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_0">three</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 1);

                ok( model[ 3][ 0] === 'three');
            }});
    });

test(
    "Model Tests - _3-1 - 4",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_1">4</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-1", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 2);

                ok( model[ 3][ 1] === 4);
            }});
    });

test(
    "Model Tests - _3-2 - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-2", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 3);

                ok( model[ 3][ 2] === false);
            }});
    });

test(
    "Model Tests - _3-3-0 - 'five'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_0">five</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 4);

                ok( isArray( model[ 3][ 3]));
                ok( model[ 3][ 3].length === 1);

                ok( model[ 3][ 3][ 0] === 'five');
            }});
    });

test(
    "Model Tests - _3-3-1 - 6",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_1">6</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-3-1", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 4);

                ok( isArray( model[ 3][ 3]));
                ok( model[ 3][ 3].length === 2);

                ok( model[ 3][ 3][ 1] === 6);
            }});
    });

test(
    "Model Tests - _3-3-2 - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_2">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-3-2", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 4);

                ok( isArray( model[ 3][ 3]));
                ok( model[ 3][ 3].length === 3);

                ok( model[ 3][ 3][ 2] === true);                
            }});
    });

test(
    "Model Tests - _3-4-k - 'seven'",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_k">seven</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-3-2", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 5);

                ok( isObject( model[ 3][ 4]));
                ok( model[ 3][ 4][ 'k'] === 'seven');                
            }});    
    });

test(
    "Model Tests - _3-4-l - 8",
    function() {
         dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_l">8</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-4-l", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 5);

                ok( isObject( model[ 3][ 4]));
                ok( model[ 3][ 4][ 'l'] === 8);
            }});    
    });

test(
    "Model Tests - _3-4-m - false",
    function() {
         dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_m">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "3-4-m", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 4);

                ok( isArray( model[ 3]));
                ok( model[ 3].length === 5);

                ok( isObject( model[ 3][ 4]));
                ok( model[ 3][ 4][ 'm'] === false);
            }});    
    });

test(
    "Model Tests - _4-f - 'nine'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_f">nine</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( model[ 4][ 'f'] === 'nine');
            }});     
    });

test(
    "Model Tests - _4-g - 10",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_g">10</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-g", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( model[ 4][ 'g'] === 10);
            }});             
    });

test(
    "Model Tests - _4-h - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_h">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-h", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( model[ 4][ 'h'] === true);
            }});
    });

test(
    "Model Tests - _4-i-1 - 'eleven'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_1">eleven</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 2);

                ok( model[ 4][ 'i'][1] === 'eleven');
            }});
    });

test(
    "Model Tests - _4-i-2 - 12",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_2">12</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-i-2", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 3);

                ok( model[ 4][ 'i'][ 2] === 12);
            }});
    });

test(
    "Model Tests - _4-i-3 - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_3">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-i-3", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 4);

                ok( model[ 4][ 'i'][ 3] === false);
            }});
    });

test(
    "Model Tests - _4-j-n - 'thirteen'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_n">thirteen</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isObject( model[ 4][ 'j']));

                ok( model[ 4][ 'j'][ 'n'] === 'thirteen');
            }});
    });

test(
    "Model Tests - _4-j-o - 14",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_o">14</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-j-o", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isObject( model[ 4][ 'j']));

                ok( model[ 4][ 'j'][ 'o'] === 14);
        }});
    });

test(
    "Model Tests - _4-j-p - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_p">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-j-p", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isObject( model[ 4][ 'j']));

                ok( model[ 4][ 'j'][ 'p'] === true);
        }});
    });

test(
    "Model Tests - _a - 'one'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">one</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( model[ 'a'] === 'one');
        }});
    });

test(
    "Model Tests - _b - 2",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_b">2</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "b", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( model.b === 2);
        }});
    });

test(
    "Model Tests - _d-0 - 'three'",
    function() {
    dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_0">three</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.d));
                ok( model.d.length === 1);
                ok( model.d[ 0] === 'three');
        }});
    });

test(
    "Model Tests - _d-1 - 4",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_1">4</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "d-1", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.d));
                ok( model.d.length === 2);
                ok( model.d[ 1] === 4);
        }});
    });

test(
    "Model Tests - _d-2 - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "d-2", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.d));
                ok( model.d.length === 3);
                ok( model.d[ 2] === false);
        }});
    });

test(
    "Model Tests - _d-3-0 - 'five'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_0">five</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.d));
                ok( model.d.length === 4);
                ok( isArray( model.d[3]));
                ok( model.d[3].length === 1);
                ok( model.d[3][0] === 'five');
        }});
    });

test(
    "Model Tests - _d-3-1 - 6",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_1">6</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "d-3-1", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.d));
                ok( model.d.length === 4);
                ok( isArray( model.d[3]));
                ok( model.d[3].length === 2);
                ok( model.d[3][1] === 6);
        }});
    });

test(
    "Model Tests - _d-3-2 - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_2">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "d-3-2", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.d));
                ok( model.d.length === 4);
                ok( isArray( model.d[3]));
                ok( model.d[3].length === 3);
                ok( model.d[3][2] === true);
        }});
    });

test(
    "Model Tests - _d-4-k - 'seven'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_k">seven</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));

                ok( isArray( model.d));
                ok( model.d.length === 5);

                ok( isObject( model.d[ 4]));

                ok( model.d[ 4].k === 'seven');
        }});
    });

test(
    "Model Tests - _d-4-l - 8",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_l">8</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "d-4-l", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));

                ok( isArray( model.d));
                ok( model.d.length === 5);

                ok( isObject( model.d[ 4]));

                ok( model.d[ 4].l === 8);
        }});
    });

test(
    "Model Tests - _d-4-m - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_m">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "d-4-m", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));

                ok( isArray( model.d));
                ok( model.d.length === 5);

                ok( isObject( model.d[ 4]));

                ok( model.d[ 4].m === false);
        }});
    });

test(
    "Model Tests - _e-f - 'nine'",
    function() {
        dataTest( {            
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_f">nine</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( model.e.f === 'nine');
        }});
    });

test(
    "Model Tests - _e-g - 10",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_g">10</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-g", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( model.e.g === 10);
        }});
    });

test(
    "Model Tests - _e-h - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_h">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-h", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( model.e.h === true);
        }});
    });

test(
    "Model Tests - _e-i-1 - 'eleven'",
    function() {
        dataTest( {            
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_1">eleven</span></div>')}
            ],
            callback: function( horn ) {                
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isArray( model.e.i));
                ok( model.e.i.length === 2);
                ok( model.e.i[ 1] === 'eleven');
        }});
    });

test(
    "Model Tests - _e-i-2 - 12",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_2">12</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-2", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isArray( model.e.i));
                ok( model.e.i.length === 3);
                ok( model.e.i[ 2] === 12);
        }});
    });

test(
    "Model Tests - _e-i-3 - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_3">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-3", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isArray( model.e.i));
                ok( model.e.i.length === 4);
                ok( model.e.i[ 3] === false);
        }});
    });

test(
    "Model Tests - _e-j-n - 'thirteen'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_n">thirteen</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isObject( model.e.i));
                ok( model.e.i.n === 'thirteen');
        }});
    });

test(
    "Model Tests - _e-j-o - 14",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_o">14</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-o", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isObject( model.e.i));
                ok( model.e.i.o === 14);
        }});
    });

test(
    "Model Tests - _e-j-p - true",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_p">true</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-p", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isObject( model.e.i));
                ok( model.e.i.p === true);
        }});
    });

test(
    "Model Tests - that integers can be expressed using hexadecimal notation.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><span class=" _a">0x10</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "a", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( model.a === 16);                
        }});
    });

test(
    "Model Tests - that integers can be expressed using octal notation.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">0310667130</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "a", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( model.a === 52653656);
        }});
    });

test(
    "Model Tests - Split key definition using nested html.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _a"><div class="_b"><div class="_c"><span class="_d">-23</span></div></div></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "a-b-c-d", "IntegerConverter");
                var model = horn.extract();
                ok( model.a.b.c.d === -23);
        }});
  });

test(
    "Model Tests - Embedded JSON Object with string property stored in object in root context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _0"><span class="data-json">{"a": "hello"}</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( isObject( model[0]));
                ok( model[ 0].a === 'hello');
        }});
  });

test(
    "Model Tests - Embedded JSON Object with integer property stored in array root context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _0"><span class="data-json">{"a": 1}</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( isObject( model[ 0]));
                ok( model[ 0].a === 1);
        }});
  });

test(
    "Model Tests - Embedded JSON Object with boolean property stored in array root context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _0"><span class="data-json">{"a": true}</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( isObject( model[ 0]));
                ok( model[ 0].a === true);
        }});
  });

test(
    "Model Tests - that two properties can exist in the same context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">one</span><span class="_b">two</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( model[ 'a'] === 'one');
                ok( model[ 'b'] === 'two');
        }});
    });




module( "TestHorn - ABBR");

test(
    "ABBR - ABBR node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><abbr class="_key" title="alternative">value</abbr></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( model.key === 'alternative');
        }});
    });

test(
    "ABBR - ABBR node for value, converted to Integer.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><abbr class="_key" title="12">value</abbr></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "key", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "ABBR - ABBR node for value, converted to Boolean, repopulated and checked.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><abbr class="_key" title="true">value</abbr></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "key", "BooleanConverter");
                var model = horn.extract({storeBackRefs: true});
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.populate();
                ok( $('._key').attr( 'title') === 'false');
        }});
    });


module( "TestHorn - Population");

test(
    "Population - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>'),}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "key", "IntegerConverter");
                var model = horn.extract({storeBackRefs: true});
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === -1);
                model.key = 13;
                horn.populate();
                ok( $('._key').text() === '13');
        }});
    });




module( "Nested Contexts");



test(
    "Nested Contexts - Simple nested in immediate parent.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _z"><div class="horn"><span class="_b">b</span></div><span class="_a">a</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( model.z.a === 'a');
                ok( model.b === 'b');
                ok( model.z.a.b === undefined);
                ok( model.z.b === undefined);
            }});
    });