module( "TestHorn - Horn.features.extractCSSPropertyPath()");

test(
    "Horn.prototype.extractCSSPropertyPath() - that no key is extracted if no suitable 'class' attribute token exists.",
    function() {
        var horn = new Horn();
        var badPrefix = String.fromCharCode( horn.features.cssPrefix.charCodeAt( 0) + 1);
        ok( horn.CONST_HORN_CSS_PREFIX !== badPrefix);
        var node = $('<div class="' + badPrefix + '" />');

        ok( horn.features.extractCSSPropertyPath.call( horn, node) === null);
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - that the code handles the element having no 'class' atribute.",
    function() {
        var horn = new Horn();
        var node = $('<div />');

        ok( horn.features.extractCSSPropertyPath.call( horn, node) === null);
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - extracts known good key.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.features.cssPrefix + 'expected" />');

        ok( horn.features.extractCSSPropertyPath.call( horn, node) === 'expected');
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - extracts the first key from multiple.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.features.cssPrefix + 'expected ' +
            horn.features.cssPrefix + 'unexpected" />');

        ok( horn.features.extractCSSPropertyPath.call( horn, node) === 'expected');
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
                horn.option( "storeBackRefs", true);
                var model = horn.extract();
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
                horn.option( "storeBackRefs", true);
                var model = horn.extract();
                var node = horn.valueNodes[ 'key'];
                ok( node !== undefined);
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
                horn.option( "storeBackRefs", true);
                horn.extract();
                ok( countOwnProps( horn.valueNodes) === 2);
            }
        });
    });




module( "TestHorn - Model Tests");

/*
                                    'Key' - 'Value'         Structure           Java
    [
        "one",                      _0 - 'one'              [S                  [0]
        2,                          _1 - 2                  [I                  [1]
        true,                       _2 - true               [B                  [2]
        [
            "three",                _3-0 - 'three'          [[S                 [3][0]
            4,                      _3-1 - 4                [[I                 [3][1]
            false,                  _3-2 - false            [[B                 [3][2]
            [
                "five",             _3-3-0 - 'five'         [[[S                [3][3][0]
                6,                  _3-3-1 - 6              [[[I                [3][3][1]
                true],              _3-3-2 - true           [[[B                [3][3][2]
            {
                k:  "seven",        _3-4-k - 'seven'        [[{:S               [3][4].k
                l:  8,              _3-4-l - 8              [[{:I               [3][4].l
                m:  false}],        _3-4-m - false          [[{:B               [3][4].m
        {
            f:  "nine",             _4-f - 'nine'           [{:S                [4].f
            g:  10,                 _4-g - 10               [{:I                [4].g
            h:  true,               _4-h - true             [{:B                [4].h
            i:  [
                "eleven",           _4-i-0 - 'eleven'       [{:[S               [4].i[0]
                12,                 _4-i-1 - 12             [{:[I               [4].i[1]
                false],             _4-i-2 - false          [{:[B               [4].i[2]
            j:  {
                n:  "thirteen",     _4-j-n - 'thirteen'     [{:{:S              [4].j.n
                o:  14,             _4-j-o - 14             [{:{:I              [4].j.o
                p:  true            _4-j-p - true           [{:{:B              [4].j.p
            }
        }
    ]

    {
        a:  "one",                  _a - 'one'              {:S                 a
        b:  2,                      _b - 2                  {:2                 b
        c:  true,                   _c - true               {:B                 c
        d:  [
                "three",            _d-0 - 'three'          {:[S                d[0]
                4,                  _d-1 - 4                {:[I                d[1]
                false,              _d-2 - false            {:[B                d[2]
                [
                    "five",         _d-3-0 - 'five'         {:[[S               d[3][0]
                    6,              _d-3-1 - 6              {:[[I               d[3][1]
                    true],          _d-3-2 - true           {:[[B               d[3][2]
                {
                    k:  "seven",    _d-4-k - 'seven'        {:[{:S              d[4].k
                    l:  8,          _d-4-l - 8              {:[{:I              d[4].l
                    m:  false}]],   _d-4-m - false          {:[{:B              d[4].m
        e:  {
                f:  "nine",         _e-f - 'nine'           {:{:S               e.f
                g:  10,             _e-g - 10               {:{:I               e.g
                h:  true,           _e-h - true             {:{:B               e.h
                i:  [
                    "eleven",       _e-i-0 - 'eleven'       {:{:[S              e.i[0]
                    12,             _e-i-1 - 12             {:{:[I              e.i[1]
                    false],         _e-i-2 - false          {:{:[B              e.i[2]
                j:  {
                    n:  "thirteen", _e-j-n - 'thirteen'     {:{:{:S             e.j.n
                    o:  14,         _e-j-o - 14             {:{:{:I             e.j.o
                    p:  true        _e-j-p - true           {:{:{:B             e.j.p
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
    "Model Tests - _4-i-0 - 'eleven'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_0">eleven</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 1);

                ok( model[ 4][ 'i'][0] === 'eleven');
            }});
    });

test(
    "Model Tests - _4-i-1 - 12",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_1">12</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-i-1", "IntegerConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 2);

                ok( model[ 4][ 'i'][ 1] === 12);
            }});
    });

test(
    "Model Tests - _4-i-2 - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "4-i-2", "BooleanConverter");
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 5);

                ok( isObject( model[ 4]));
                ok( isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 3);

                ok( model[ 4][ 'i'][ 2] === false);
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
    "Model Tests - _e-i-0 - 'eleven'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_0">eleven</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isArray( model.e.i));
                ok( model.e.i.length === 1);
                ok( model.e.i[ 0] === 'eleven');
        }});
    });

test(
    "Model Tests - _e-i-1 - 12",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_1">12</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-1", "IntegerConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isArray( model.e.i));
                ok( model.e.i.length === 2);
                ok( model.e.i[ 1] === 12);
        }});
    });

test(
    "Model Tests - _e-i-2 - false",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-2", "BooleanConverter");
                var model = horn.extract();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( isArray( model.e.i));
                ok( model.e.i.length === 3);
                ok( model.e.i[ 2] === false);
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
    "Model Tests - Embedded JSON Object with two properties.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key"><span class="data-json">{"a": true, "b": false}</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model.key));
                ok( model.key.a === true);
                ok( model.key.b === false);
        }});
  });

test(
    "Model Tests - Embedded JSON with nested filth.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key"><span class="data-json">{"a": [1], "b": {"c": false}}</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isObject( model.key));
                ok( isArray( model.key.a));
                ok( model.key.a.length === 1);
                ok( model.key.a[ 0] === 1);
                ok( isObject( model.key.b));
                ok( model.key.b.c === false);

        }});
  });

test(
    "Model Tests - Embedded JSON and type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key"><span class="data-json">{"a": 1}</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", ".*", "jsonIntegerConverter");
                ok( horn.opts.patternInfo.hasOwnProperty( '.*') === true);
                horn.option( "converter", "jsonIntegerConverter", function () {
                    this.fromJSON = function( value ) { return value + ""; };
                });
                var model = horn.extract();
                ok( horn.opts.patternInfo[ '.*'].converterName === 'jsonIntegerConverter');
                ok( horn.convertValue( 1, "_key-a", false, true) === "1");
                ok( isObject( model));
                ok( isObject( model.key));
                ok( model.key.a === "1");
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

test(
    "Model Tests - Embedded JSON with date conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="span-20 prepend-top noticeelement horn list-events last _notices-0" id="1">' +
                                '<span class="hidden data-json">{"id": 1, "date": "2011-05-04"}</span>' +
                            '</div>')}
            ],
            callback: function( horn ) {
                horn.option( 'converter', 'DateConverter',
                    function () {
                        this.fromJSON = function( value ) {
                            var date = new Date( value);
                            date.setFullYear( value.substring( 0, 4));
                            date.setMonth( parseInt( value.substring( 5, 7), 10) - 1);
                            date.setDate( parseInt( value.substring( 8, 10), 10));
                            return date;
                        }
                    });
                horn.option( 'pattern', '.*date', 'DateConverter');
                var model = horn.extract();
                ok( isObject( model));
                ok( isArray( model.notices));
                ok( isObject( model.notices[ 0]));
                ok( model.notices[ 0].id === 1);
                ok( model.notices[ 0].date instanceof Date);
                ok( model.notices[ 0].date.getFullYear() === 2011);
                ok( model.notices[ 0].date.getMonth() === 04);
                ok( model.notices[ 0].date.getDate() === 04);
        }});
    });

test(
    "Model Tests - Correct nodes returned from populate.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><div id="div0" class="_a">true</div><div id="div1" class="_b">false</div><div id="div2" class="_c">true</div></div>')}
            ],
            callback: function( horn ) {
                var alteredNodes;
                var model;
                horn.option( "pattern", "a", "BooleanConverter");
                horn.option( "pattern", "b", "BooleanConverter");
                horn.option( "pattern", "c", "BooleanConverter");
                horn.option( "storeBackRefs", true);
                model = horn.extract();
                ok( isObject( model));
                ok( model.a === true);
                ok( model.b === false);
                ok( model.c === true);
                model.a = false;
                model.b = false;
                model.c = false;
                alteredNodes = horn.populate();
                ok( isArray( alteredNodes))
                ok( alteredNodes.length === 2);

                ok( $(alteredNodes[ 0]).attr( 'id') === "div0");
                ok( $(alteredNodes[ 1]).attr( 'id') === "div2");

        }});
    });

test(
    "Model Tests - Correct nodes returned from populate (none).",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div class="horn"><div id="div0" class="_a">true</div><div id="div1" class="_b">false</div><div id="div2" class="_c">true</div></div>')}
            ],
            callback: function( horn ) {
                var alteredNodes;
                var model;
                horn.option( "pattern", "a", "BooleanConverter");
                horn.option( "pattern", "b", "BooleanConverter");
                horn.option( "pattern", "c", "BooleanConverter");
                horn.option( "storeBackRefs", true);
                model = horn.extract();
                ok( isObject( model));
                ok( model.a === true);
                ok( model.b === false);
                ok( model.c === true);
                alteredNodes = horn.populate();
                ok( isArray( alteredNodes))
                ok( alteredNodes.length === 0);
        }});
    });

test(
    "Model Tests - Only nodes under rootNode are populated.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div id="root" class="horn"><div id="div0" class="_a">true</div></div><div id="root2" class="horn"><div id="div1" class="_b">false</div></div>')}
            ],
            callback: function( horn ) {
                ok( horn.isAttached( $('#root')));
                ok( horn.isAttached( $('#root2')));
                var alteredNodes;
                var model;
                horn.option( "pattern", "a", "BooleanConverter");
                horn.option( "pattern", "b", "BooleanConverter");
                horn.option( "storeBackRefs", true);
                model = horn.extract();
                ok( isObject( model));
                ok( model.a === true);
                ok( model.b === false);
                model.a = false;
                model.b = true;
                alteredNodes = horn.populate( {name: 'test', rootNode: $('#root')});
                ok( isArray( alteredNodes));
                ok( alteredNodes.length === 1);
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
                nodes:  $('<div class="horn">baskdfhjdshfds h<abbr class="_key" title="true">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "key", "BooleanConverter");
                horn.option( "storeBackRefs", true);
                var model = horn.extract();
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
                horn.option( "storeBackRefs", true);
                var model = horn.extract();
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