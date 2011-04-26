module( "TestHorn_HTML5 - HTML Detection");

test(
    'HTML Detection - Triggering HTML5 mode using data-horn="true".',
    function() {
        dataTest({
            nodes: [
                {
                    nodes: $('<div data-horn="true"></div>')
                }
            ],
            callback: function( horn ) {
                ok( horn.opts.html5 === undefined);
                horn.extract();
                ok( horn.opts.html5 === true);
            }
        });
    });

test(
    'HTML Detection - Triggering HTML5 mode using data-horn="_".',
    function() {
        dataTest({
            nodes: [
                {
                    nodes: $('<div data-horn="_"></div>')
                }
            ],
            callback: function( horn ) {
                ok( horn.opts.html5 === undefined);
                horn.extract();
                ok( horn.opts.html5 === true);
            }
        });
    });



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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                ok( horn.opts.html5 === true);
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
                nodes:  $('<div data-horn="true"><span data-horn-path="a">one</span><span data-horn-path="b">two</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( horn.opts.html5 === true);
                ok( isObject( model));
                ok( model[ 'a'] === 'one');
                ok( model[ 'b'] === 'two');
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
                ok( horn.getDataAttr( $('#testing'), "dataNameHorn") === 'testingHTML5DataAttributes');

        }});
    });

test(
    "getDataAttr() - Returns undefined if no such attribute exists for the node.",
    function() {
        var horn = new Horn();
        ok( !horn.isAttached( $('#testing')));
        ok( horn.getDataAttr( $('#testing'), "dataNameHorn") === undefined);
    });