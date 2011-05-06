//module( "TestHorn - Horn.encodeCSS()");
//
//test(
//    "Horn.encodeCSS() - On null or undefined returns undefined.",
//    function() {
//        var horn = new Horn();
//        ok( horn.encodeCSS( null) === undefined);
//        ok( horn.encodeCSS( undefined) === undefined);
//    });
//
//test(
//    "Horn.encodeCSS() - Sanity check various values - this relies upon the default horn options.",
//    function() {
//        var horn = new Horn();
//        ok( horn.encodeCSS( 'a') === "_a");
//        ok( horn.encodeCSS( 'a[10]') === "_a-10");
//        ok( horn.encodeCSS( '[10]') === "_10");
//        ok( horn.encodeCSS( '[10][20]') === "_10-20");
//        ok( horn.encodeCSS( 'x[1].y[2].z[3]') === "_x-1-y-2-z-3");
//        ok( horn.encodeCSS( 'x[1][2][3].y[2].z') === "_x-1-2-3-y-2-z");
//    });




module( "TestHorn_HTML5 - Model Tests");

test(
    "Model Tests - _0 - 'one'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="true"><span data-horn-path="0">one</span></div>')}
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
                nodes:  $('<div data-horn="true"><span data-horn-path="1">2</span></div>')}
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
                nodes:  $('<div data-horn="true"><span data-horn-path="2">true</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3"><span data-horn-path="0">three</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3"><span data-horn-path="1">4</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3"><span data-horn-path="2">false</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3-3"><span data-horn-path="0">five</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3-3"><span data-horn-path="1">6</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3-3"><span data-horn-path="2">true</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3-4"><span data-horn-path="k">seven</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3-4"><span data-horn-path="l">8</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="3-4"><span data-horn-path="m">false</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4"><span data-horn-path="f">nine</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4"><span data-horn-path="g">10</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4"><span data-horn-path="h">true</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4-i"><span data-horn-path="1">eleven</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4-i"><span data-horn-path="2">12</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4-i"><span data-horn-path="3">false</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4-j"><span data-horn-path="n">thirteen</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4-j"><span data-horn-path="o">14</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="4-j"><span data-horn-path="p">true</span></div>')}
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
                nodes:  $('<div data-horn="true"><span data-horn-path="a">one</span></div>')}
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
                nodes:  $('<div data-horn="true"><span data-horn-path="b">2</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d"><span data-horn-path="0">three</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d"><span data-horn-path="1">4</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d"><span data-horn-path="2">false</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d-3"><span data-horn-path="0">five</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d-3"><span data-horn-path="1">6</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d-3"><span data-horn-path="2">true</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d-4"><span data-horn-path="k">seven</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d-4"><span data-horn-path="l">8</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="d-4"><span data-horn-path="m">false</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e"><span data-horn-path="f">nine</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e"><span data-horn-path="g">10</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e"><span data-horn-path="h">true</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e-i"><span data-horn-path="1">eleven</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e-i"><span data-horn-path="2">12</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e-i"><span data-horn-path="3">false</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e-i"><span data-horn-path="n">thirteen</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e-i"><span data-horn-path="o">14</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="e-i"><span data-horn-path="p">true</span></div>')}
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
                nodes:  $('<div data-horn="true"><span data-horn-path="a">0x10</span></div>')}
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
                nodes:  $('<div data-horn="true"><span data-horn-path="a">0310667130</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="a"><div data-horn-path="b"><div data-horn-path="c"><span data-horn-path="d">-23</span></div></div></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="0"><span data-horn-json="true">{"a": "hello"}</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="0"><span data-horn-json="true">{"a": 1}</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="0"><span data-horn-json="true">{"a": true}</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="key"><span data-horn-json="true">{"a": true, "b": false}</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="key"><span data-horn-json="true">{"a": [1], "b": {"c": false}}</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="key"><span data-horn-json="true">{"a": 1}</span></div>')}
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
    "Model Tests - Embedded JSON Object with two properties.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="true" data-horn-path="key"><span data-horn-json="true">{"a": true, "b": false}</span></div>')}
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
                nodes:  $('<div data-horn="true" data-horn-path="key"><span data-horn-json="true">{"a": [1], "b": {"c": false}}</span></div>')}
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
    "Model Tests - that two properties can exist in the same context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="true"><span data-horn-path="a">one</span><span data-horn-path="b">two</span></div>')}
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
                nodes:  $(  '<div class="span-20 prepend-top noticeelement list-events last" data-horn="true" data-horn-path="notices-0" id="1">' +
                                '<span class="hidden" data-horn-json="true">{"id": 1, "date": "2011-05-04"}</span>' +
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
                nodes:  $('<div data-horn="true"><div id="div0" data-horn-path="a">true</div><div id="div1" data-horn-path="b">false</div><div id="div2" data-horn-path="c">true</div></div>')}
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
                nodes:  $('<div data-horn="true"><div id="div0" data-horn-path="a">true</div><div id="div1" data-horn-path="b">false</div><div id="div2" data-horn-path="c">true</div></div>')}
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




module( "TestHorn_HTML5 - ABBR");

test(
    "ABBR - ABBR node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="true"><abbr data-horn-path="key" title="alternative">value</abbr></div>')}
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
                nodes:  $('<div data-horn="true"><abbr data-horn-path="key" title="12">value</abbr></div>')}
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
                nodes:  $('<div data-horn="true">baskdfhjdshfds h<abbr id="grabMe" data-horn-path="key" title="true">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "key", "BooleanConverter");
                horn.option( "storeBackRefs", true);
                var model = horn.extract();
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.populate();
                ok( $('#grabMe').attr( 'title') === 'false');
        }});
    });

test(
    "ABBR - ABBR node for value, but with JSON.",
    function() {
        dataTest( {
            passConverters: true,
            nodes: [ {
                nodes:  $('<div data-horn="true">baskdfhjdshfds h<abbr id="grabMe" data-horn-path="key" data-horn-json="true" title="false">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                horn.option( "storeBackRefs", true);
                var model = horn.extract();
                ok( isObject( model));
                ok( model.key === false);
                model.key = false;
                horn.populate();
        }});
    });



module( "TestHorn_HTML5 - getDataAttr()");

test(
    "getDataAttr() - Returns the attribute value expected.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="testingHTML5DataAttributes" id="testing" />')}
            ],
            callback: function( horn ) {
                ok( horn.isAttached( $('#testing')));
                ok( horn.getDataAttr( $('#testing'), "horn") === 'testingHTML5DataAttributes');

        }});
    });

test(
    "getDataAttr() - Returns undefined if no such attribute exists for the node.",
    function() {
        var horn = new Horn();
        ok( !horn.isAttached( $('#testing')));
        ok( horn.getDataAttr( $('#testing'), "dataNameHorn") === undefined);
    });