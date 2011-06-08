
module( "TestHorn - Horn Miscellany");

test(
    "Features - Test horn has hasRootIndicator function.",
    function() {
        ok( isFunction( new Horn().hasRootIndicator));
    }
);

test(
    "Features - Test horn has jsonIndicator function.",
    function() {
        ok( isFunction( new Horn().jsonIndicator));
    }
);

test(
    "Features - Test horn has pathIndicator function.",
    function() {
        ok( isFunction( new Horn().pathIndicator));
    }
);

test(
    "Features - Test horn has rootNodes function.",
    function() {
        var horn = new Horn();
        ok( isFunction( horn.rootNodes));
    }
);




module( "TestHorn - extractCSSPropertyPath()");

test(
    "extractCSSPropertyPath() - that no key is extracted if no suitable 'class' attribute token exists.",
    function() {
        var horn = new Horn();
        var badPrefix = String.fromCharCode( horn.cssPrefix.charCodeAt( 0) + 1);
        ok( horn.CONST_HORN_CSS_PREFIX !== badPrefix);
        var node = $('<div class="' + badPrefix + '" />');

        ok( horn.extractCSSPropertyPath.call( horn, node) === null);
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - that the code handles the element having no 'class' atribute.",
    function() {
        var horn = new Horn();
        var node = $('<div />');

        ok( horn.extractCSSPropertyPath.call( horn, node) === null);
    });

test(
    "Horn.prototype.extractCSSPropertyPath() - extracts known good key.",
    function() {
        var horn = new Horn();
        var node = $('<div class="' + horn.cssPrefix + 'expected" />');

        ok( horn.extractCSSPropertyPath.call( horn, node) === 'expected');
    });




module( "TestHorn - {components:X}");

test(
    "{components:X} - No components if readOnly specified as true.",
    function() {
        dataTest( {
            nodes: [ {
                target: $('body'),
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");
                horn.option( "readOnly", "true");

                var model = horn.bind();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === -1);
                ok( false);
            }});
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
                var model = horn.bind();
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
                var model = horn.bind();
                ok( isArray( model));
                ok( model.length === 1);
                ok( model[ 0] === 'one');
            }});

    });

test(
    "Model Tests - _1 - 2",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_1">2</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "1");
                var model = horn.bind();
                ok( isArray( model));
                ok( model.length === 2);
                ok( model[ 1] === 2);
            }});
    });

test(
    "Model Tests - _2 - true",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_2">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "2");
                var data = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_1">4</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "3-1");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "3-2");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_1">6</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "3-3-1");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_2">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "3-3-2");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_k">seven</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "3-3-2");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_l">8</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "3-4-l");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_m">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "3-4-m");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_g">10</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "4-g");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_h">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "4-h");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_1">12</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "4-i-1");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "4-i-2");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_o">14</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "4-j-o");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_p">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "4-j-p");
                var model = horn.bind();
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
                var model = horn.bind();
                ok( isObject( model));
                ok( model[ 'a'] === 'one');
        }});
    });

test(
    "Model Tests - _b - 2",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_b">2</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "b");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_1">4</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "d-1");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d-2");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_1">6</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "d-3-1");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_2">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d-3-2");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_l">8</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "d-4-l");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_m">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d-4-m");
                var model = horn.bind();
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
                var model = horn.bind();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( model.e.f === 'nine');
        }});
    });

test(
    "Model Tests - _e-g - 10",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_g">10</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "e-g");
                var model = horn.bind();
                ok( isObject( model));
                ok( isObject( model.e));
                ok( model.e.g === 10);
        }});
    });

test(
    "Model Tests - _e-h - true",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_h">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "e-h");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_1">12</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "e-i-1");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_2">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "e-i-2");
                var model = horn.bind();
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
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_o">14</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "e-i-o");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_p">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "e-i-p");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div class="horn"><span class=" _a">0x10</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "a");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.a === 16);
        }});
    });

test(
    "Model Tests - that integers can be expressed using octal notation.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">0310667130</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "a");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.a === 52653656);
        }});
    });

test(
    "Model Tests - Split key definition using nested html.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _a"><div class="_b"><div class="_c"><span class="_d">-23</span></div></div></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "a-b-c-d");
                var model = horn.bind();
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
                var model = horn.bind();
                ok( isArray( model));
                ok( isObject( model[0]));
                ok( model[ 0].hasOwnProperty( 'a'));
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
                var model = horn.bind();
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
                var model = horn.bind();
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
                var model = horn.bind();
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
                var model = horn.bind();
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
                setPatternConverter( horn, "IntegerConverter", "key-a");
                var model = horn.bind();
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
                var model = horn.bind();
                ok( isObject( model));
                ok( model[ 'a'] === 'one');
                ok( model[ 'b'] === 'two');
        }});
    });




test(
    "Model Tests - Only nodes under rootNode are populated.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div id="root" class="horn"><div id="div0" class="_a">true</div></div><div id="root2" class="horn"><div id="div1" class="_b">false</div></div>')}
            ],
            callback: function( horn ) {
                var model;
                ok( horn.isAttached( $('#root')));
                ok( horn.isAttached( $('#root2')));
                setPatternConverter( horn, "BooleanConverter", "a|b");

                model = horn.bind();
                ok( isObject( model));
                ok( model.a === true);
                ok( model.b === false);
                model.a = false;
                model.b = true;
                horn.updateDOM( {rootNode: $('#root')});
                ok( $('#div0').text() === 'false');
                ok( $('#div1').text() === 'false');
        }});
    });

test(
    "Model Tests - Single node doing the whole job non JSON.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<span class="horn _propName">true</span>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "propName");
                var model = horn.bind();
                model = horn.bind();
                ok( isObject( model));
                ok( model.propName === true);
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
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === 'alternative');
        }});
    });

test(
    "ABBR - ABBR node for value, converted to Integer.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><abbr class="_key" title="12">value</abbr></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "ABBR - ABBR node for value, converted to Boolean, repopulated and checked.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn">baskdfhjdshfds h<abbr class="_key" title="true">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                var model;
                setPatternConverter( horn, "BooleanConverter", "key");

                model = horn.bind();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('._key').attr( 'title') === 'false');
        }});
    });


module( "TestHorn - Population");

test(
    "Population - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>'),}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");

                var model = horn.bind();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === -1);
                model.key = 13;
                horn.updateDOM();
                ok( $('._key').text() === '13');
        }});
    });

test(
    "Population - testing the correct nodes are reruned from populate, in the correct order.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key1">a</span><span class="_key2">b</span></div>'),}
            ],
            callback: function( horn ) {
                var model = horn.bind();
                ok( horn.isAttached( $('._key1')));
                ok( horn.isAttached( $('._key2')));
                ok( isObject( model));
                ok( model.key1 === 'a');
                ok( model.key2 === 'b');
                model.key1 = 'b';
                model.key2 = 'a';
                var alteredNodes = horn.updateDOM();
                ok( alteredNodes.length === 2);
                ok( $('._key1').text() === 'b');
                ok( $('._key2').text() === 'a');
                ok( $(alteredNodes[ 0]).text() === 'b');
                ok( $(alteredNodes[ 1]).text() === 'a');

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
                var model = horn.bind();
                ok( model.z.a === 'a');
                ok( model.b === 'b');
                ok( model.z.a.b === undefined);
                ok( model.z.b === undefined);
            }});
    });




module( "TestHorn - Population");

test(
    "Population - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>'),}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");

                var model = horn.bind();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === -1);
                model.key = 13;
                horn.updateDOM();
                ok( $('._key').text() === '13');
        }});
    });




module( "TestHorn - INPUT");

test(
    "INPUT - INPUT node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><input class="_key" value="testValue"/></div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === 'testValue');
        }});
    });

test(
    "INPUT - INPUT node for value, converted to Integer.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><input class="_key" value="12"/></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "INPUT - INPUT node for value, converted to Boolean, repopulated and checked.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn">baskdfhjdshfds h<input class="_key" value="true"/>akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "key");

                var model = horn.bind();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('._key').val() === 'false');
        }});
    });




module( "TestHorn - TEXTAREA");

test(
    "TEXTAREA - TEXTAREA node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><textarea class="_key">testValue</textarea></div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === 'testValue');
        }});
    });

test(
    "TEXTAREA - TEXTAREA node for value, converted to Integer.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><textarea class="_key">12</textarea></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "TEXTAREA - TEXTAREA node for value, converted to Boolean, repopulated and checked.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn">baskdfhjdshfds h<textarea class="_key" >true</textarea>akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "key");

                var model = horn.bind();
                ok( horn.isAttached( $('._key')));
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('._key').val() === 'false');
        }});
    });





module( "From Template");

test(
    "From Template - Testing the population of a template with no type conversion nor pattern matching.",
    function() {
        ok( !isAttached( $('#newID')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn">' +
                            '    <div class="_a-b-c"><span class="_d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div class="_a-b-c"><span class="_d"></span></div>' +
                            '</div>')}],
            callback: function( horn ) {
                horn.name = 'test';
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                model.a.b.c.d = 'updatedValue';
                var populatedTemplate = horn.cloneAndBind( {
                    id: 'newID',
                    selector: '#template'});
                ok( isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( isAttached( $('#newID')));
                try {
                    ok($( '._d', $('#newID')).text() === 'updatedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !isAttached( $('#newID')));
            }});
    });

test(
    "From Template - Testing the population of a template with no type conversion - no matching data a.",
    function() {
        ok( !isAttached( $('#newID')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn">' +
                            '    <div class="_a-b-c"><span class="_d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div class="_a-b-c"><span class="_d"></span></div>' +
                            '</div>')}],
            callback: function( horn ) {
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                var populatedTemplate = horn.cloneAndBind( {
                    id: 'newID',
                    selector: '#template',
                    data: { f: { b: { c: { d: 'updatedValue'}}}}});
                ok( isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( isAttached( $('#newID')));
                try {
                    ok($( '._d', $('#newID')).text() !== 'updatedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !isAttached( $('#newID')));
            }});
    });

test(
    "From Template - Testing the population of a template with no type conversion - no matching data b.",
    function() {
        ok( !isAttached( $('#newID')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn">' +
                            '    <div id="grabber1" class="_a-b-c"><span id="grabber2" class="_d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div class="_a-b-c"><span class="_d"></span></div>' +
                            '</div>')}],
            callback: function( horn ) {
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                ok( horn.getComponentData( $('#grabber1')[0], '', true) === false);
                ok( isObject( horn.getComponentData( $('#grabber2')[0], '')));
                var populatedTemplate = horn.cloneAndBind( {
                    id: 'newID',
                    selector: '#template',
                    data: { a: { b: { c: { f: 'updatedValue'}}}}});
                ok( isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( isAttached( $('#newID')));
                try {
                    ok($( '._d', $('#newID')).text() !== 'upda  tedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !isAttached( $('#newID')));
            }});
    });

test(
    "From Template - Real word case of populating html template from a given data structure - rootNode passed.",
    function() {
        ok( !horn.isAttached( $('.terms')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div id="newNotice" class="boardtype_events hidden" title="ui.events.label.addNewEvent">' +
                            '    <label for="title" class="main">What*</label>' +
                            '    <input class="_title " type="text" size="60" maxlength="100" tabindex="0" id="title"  name="title" value="" />' +
                            '    <div class="fieldtext"><label class="errorDetail position-for-crossfade hidden" for="title"></label><label class="hint position-for-crossfade" for="title">A summary of the event e.g. &quot;Birthday party&quot; </label></div>' +
                            '    <label for="place" class="main">Where</label>' +
                            '    <input class="_place" type="text" size="60" maxlength="64" id="place"  name="place" value="" />' +
                            '    <div class="fieldtext"><label class="errorDetail position-for-crossfade hidden" for="place"></label><label class="hint position-for-crossfade" for="place">Give a location e.g. &quot;The village hall&quot;</label></div>' +
                            '    <label for="date" class="main">When*</label>' +
                            '    <input class="span-5 _date" type="text"   id="date" name="date" value="" />' +
                            '    <label for="time" class="main">Time</label>' +
                            '    <input class="_time" type="text" size="60" maxlength="64" id="time"  name="time" value="" />' +
                            '    <div class="fieldtext"><label class="errorDetail position-for-crossfade hidden" for="time"></label><label class="hint position-for-crossfade" for="time">Example: &quot;7pm&quot; or &quot;any time after 3pm&quot;</label></div>' +
                            '    <label for="description" class="main">More details</label>' +
                            '    <textarea rows="3" class="_description" id="description" name="description" ></textarea>' +
                            '    <div class="fieldtext"><label class="errorDetail position-for-crossfade hidden" for="description"></label><label class="hint position-for-crossfade" for="description">Add any extra information you like</label></div>' +
                            '    <label for="contact" class="main">Contact </label>' +
                            '    <input type="text" size="60" maxlength="64" class="_contact" id="contact"  name="contact" value="" />' +
                            '    <div class="fieldtext"><label class="errorDetail position-for-crossfade hidden" for="contact"></label><label class="hint position-for-crossfade" for="contact">Who should people contact and how?</label></div>' +
                            '    <div class="button-newnotice-area">' +
                            '        <button class="nlButton saveButton ui-corner-all button-dialog positive">Save this event</button>' +
                            '        or' +
                            '        <a class="nlAnchor cancelButton cancelLink" title="Press this to cancel and close the form">Cancel</a>' +
                            '    </div>' +
                            '    <a class="terms" target="_terms" href="http://info.test.noticelocal.com/blurb/terms">By clicking Save you agree to our terms of use</a>' +
                            '</div>'
                            )}
            ],
            callback: function( horn ) {
                horn.debug = true;
                ok( horn.isAttached( $('.terms')));
                var date = new Date();
                horn.option( "defaultModel", {
                    place:          'where',
                    time:           'time',
                    title:          1,
                    contact:        'contact',
                    description:    'moredetails',
                    date:           date
                });
                ok( $('._place').val() === '');
                ok( $('._time').val() === '');
                ok( $('._title').val() === '');
                ok( $('._contact').val() === '');
                ok( $('._description').val() === '');
                horn.cloneAndBind( {template: $('#newNotice')});
                ok( $('._date').val() === date.toString());
                ok( $('._place').val() === 'where');
                ok( $('._time').val() === 'time');
                ok( $('._title').val() === '1');
                ok( $('._contact').val() === 'contact');
                ok( $('._description').val() === 'moredetails');
        }});
        ok( !horn.isAttached( $('.terms')));

    });