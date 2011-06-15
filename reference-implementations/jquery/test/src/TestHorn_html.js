module( "horn-jquery-html-1.0.js");

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




test(
    "Model Tests - _0 - 'one'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><span data-horn="0">one</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
                ok( horn.isDefinedNotNull( model))
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
                nodes:  $('<div data-horn="/"><span data-horn="1">2</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[1]");
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
                nodes:  $('<div data-horn="/"><span data-horn="2">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[2]");
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
                nodes:  $('<div data-horn="/[3]"><span data-horn="[0]">three</span></div>')}
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
                nodes:  $('<div data-horn="/[3]"><span data-horn="[1]">4</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[3][1]");
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
                nodes:  $('<div data-horn="/[3]"><span data-horn="[2]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[3][2]");
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
                nodes:  $('<div data-horn="/[3][3]"><span data-horn="[0]">five</span></div>')}
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
                nodes:  $('<div data-horn="/[3][3]"><span data-horn="[1]">6</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[3][3][1]");
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
                nodes:  $('<div data-horn="/[3][3]"><span data-horn="[2]">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[3][3][2]");
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
                nodes:  $('<div data-horn="/[3][4]"><span data-horn="k">seven</span></div>')}
            ],
            callback: function( horn ) {
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
                nodes:  $('<div data-horn="/[3][4]"><span data-horn="l">8</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[3][4].l");
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
                nodes:  $('<div data-horn="/[3][4]"><span data-horn="m">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[3][4].m");
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
                nodes:  $('<div data-horn="/[4]"><span data-horn="f">nine</span></div>')}
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
                nodes:  $('<div data-horn="/[4]"><span data-horn="g">10</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[4].g");
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
                nodes:  $('<div data-horn="/[4]"><span data-horn="h">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[4].h");
                var model = horn.bind();
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
                nodes:  $('<div data-horn="/[4].i"><span data-horn="[1]">eleven</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div data-horn="/[4].i"><span data-horn="[2]">12</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[4].i[2]");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div data-horn="/[4].i"><span data-horn="[3]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[4].i[3]");
                var model = horn.bind();
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
                nodes:  $('<div data-horn="/[4].j"><span data-horn="n">thirteen</span></div>')}
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
                nodes:  $('<div data-horn="/[4].j"><span data-horn="o">14</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "[4].j.o");
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
                nodes:  $('<div data-horn="/[4].j"><span data-horn="p">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "[4].j.p");
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
                nodes:  $('<div data-horn="/"><span data-horn="a">one</span></div>')}
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
                nodes:  $('<div data-horn="/"><span data-horn="b">2</span></div>')}
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
                nodes:  $('<div data-horn="/d"><span data-horn="[0]">three</span></div>')}
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
                nodes:  $('<div data-horn="/d"><span data-horn="[1]">4</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "d[1]");
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
                nodes:  $('<div data-horn="/d"><span data-horn="[2]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d[2]");
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
                nodes:  $('<div data-horn="/d[3]"><span data-horn="[0]">five</span></div>')}
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
                nodes:  $('<div data-horn="/d[3]"><span data-horn="[1]">6</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "d[3][1]");
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
                nodes:  $('<div data-horn="/d[3]"><span data-horn="[2]">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d[3][2]");
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
                nodes:  $('<div data-horn="/d[4]"><span data-horn="k">seven</span></div>')}
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
                nodes:  $('<div data-horn="/d[4]"><span data-horn="l">8</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "d[4].l");
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
                nodes:  $('<div data-horn="/d[4]"><span data-horn="m">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d[4].m");
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
                nodes:  $('<div data-horn="/e"><span data-horn="f">nine</span></div>')}
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
                nodes:  $('<div data-horn="/e"><span data-horn="g">10</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "e.g");
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
                nodes:  $('<div data-horn="/e"><span data-horn="h">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "e.h");
                var model = horn.bind();
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
                nodes:  $('<div data-horn="/e.i"><span data-horn="[1]">eleven</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div data-horn="/e.i"><span data-horn="[2]">12</span></div>')}
            ],
            callback: function( horn ) {
                horn.option( "pattern", "e-i-2", "IntegerConverter");
                setPatternConverter( horn, "IntegerConverter", "e.i[2]");
                var model = horn.bind();
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
            nodes: [ {
                nodes:  $('<div data-horn="/e.i"><span data-horn="[3]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "e.i[3]");
                var model = horn.bind();
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
                nodes:  $('<div data-horn="/e.i"><span data-horn="n">thirteen</span></div>')}
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
                nodes:  $('<div data-horn="/e.i"><span data-horn="o">14</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "e.i.o");
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
                nodes:  $('<div data-horn="/e.i"><span data-horn="p">true</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "e.i.p");
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
                nodes:  $('<div data-horn="/"><span data-horn="a">0x10</span></div>')}
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
                nodes:  $('<div data-horn="/"><span data-horn="a">0310667130</span></div>')}
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
                nodes:  $('<div data-horn="/a"><div data-horn="b"><div data-horn="c"><span data-horn="d">-23</span></div></div></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "a.b.c.d");
                var model = horn.bind();
                ok( model.a.b.c.d === -23);
        }});
  });

test(
    "Model Tests - Embedded JSON Object with string property stored in object in root context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/[0]"><span data-horn-json=".">{"a": "hello"}</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
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
                nodes:  $('<div data-horn="/[0]"><span data-horn-json=".">{"a": 1}</span></div>')}
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
                nodes:  $('<div data-horn="/[0]"><span data-horn-json=".">{"a": true}</span></div>')}
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
                nodes:  $('<div data-horn="/key"><span data-horn-json=".">{"a": true, "b": false}</span></div>')}
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
                nodes:  $('<div data-horn="/key"><span data-horn-json="true">{"a": [1], "b": {"c": false}}</span></div>')}
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
                nodes:  $('<div data-horn="/key"><span data-horn-json=".">{"a": 1}</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key.a");
                var model = horn.bind();
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
                nodes:  $('<div data-horn="/key"><span data-horn-json=".">{"a": true, "b": false}</span></div>')}
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
                nodes:  $('<div data-horn="/key"><span data-horn-json=".">{"a": [1], "b": {"c": false}}</span></div>')}
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
    "Model Tests - that two properties can exist in the same context.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><span data-horn="a">one</span><span data-horn="b">two</span></div>')}
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
                nodes:  $('<div id="root" data-horn="/"><div id="div0" data-horn="a">true</div></div><div id="root2" data-horn="/"><div id="div1" data-horn="b">false</div></div>')}
            ],
            callback: function( horn ) {
                ok( horn.isAttached( $('#root')));
                ok( horn.isAttached( $('#root2')));
                var alteredNodes;
                var model;
                setPatternConverter( horn, "BooleanConverter", "a|b");
                model = horn.bind();
                ok( isObject( model));
                ok( model.a === true);
                ok( model.b === false);
                model.a = false;
                model.b = true;
                horn.updateDOM( $('#root'));
                ok( $('#div0').text() === 'false');
                ok( $('#div1').text() === 'false');
        }});
    });

test(
    "Model Tests - Single node doing the whole job non JSON.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<span data-horn="/propName">true</span>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "propName");
                var model = horn.bind();
                model = horn.bind();
                ok( isObject( model));
                ok( model.propName === true);
        }});
    });

test(
    "Model Tests - Single node doing the whole job JSON.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<span data-horn-json="/propName">0</span>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "propName");
                var model = horn.bind();
                model = horn.bind();
                ok( isObject( model));
                ok( model.propName === 0);
        }});
    });




test(
    "ABBR - ABBR node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><abbr data-horn="key" title="alternative">value</abbr></div>')}
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
                nodes:  $('<div data-horn="/"><abbr data-horn="key" title="12">value</abbr></div>')}
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
                nodes:  $('<div data-horn="/">baskdfhjdshfds h<abbr id="grabMe" data-horn="key" title="true">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "key");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('#grabMe').attr( 'title') === 'false');
        }});
    });

test(
    "ABBR - ABBR node for value, but with JSON.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/">baskdfhjdshfds h<abbr id="grabMe" data-horn="key" data-horn-json="." title="false">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === false);
                model.key = false;
                horn.updateDOM();
        }});
    });




test(
    "Population - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><span class="key" data-horn="key">-1</span></div>'),}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( horn.isAttached( $('.key')));
                ok( isObject( model));
                ok( model.key === -1);
                model.key = 13;
                horn.updateDOM();
                ok( $('.key').text() === '13');
        }});
    });

test(
    "Population - testing the correct nodes are reruned from populate, in the correct order.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><span class="key1" data-horn="key1">a</span><span class="key2" data-horn="key2">b</span></div>'),}
            ],
            callback: function( horn ) {
                var model = horn.bind();
                ok( horn.isAttached( $('.key1')));
                ok( horn.isAttached( $('.key2')));
                ok( isObject( model));
                ok( model.key1 === 'a');
                ok( model.key2 === 'b');
                model.key1 = 'b';
                model.key2 = 'a';
                var alteredNodes = horn.updateDOM();
                ok( alteredNodes.length === 2);
                ok( $('.key1').text() === 'b');
                ok( $('.key2').text() === 'a');
                ok( $(alteredNodes[ 0]).text() === 'b');
                ok( $(alteredNodes[ 1]).text() === 'a');

        }});
    });




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




test(
    "bindTo - Testing the population of a template with no type conversion nor pattern matching.",
    function() {
        ok( !isAttached( $('#newID')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div data-horn="/">' +
                            '    <div data-horn="a.b.c"><span data-horn="d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div data-horn="a.b.c"><span data-horn="d" id="xx"></span></div>' +
                            '</div>')}],
            callback: function( horn ) {
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                model.a.b.c.d = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    id: 'newID',
                    template: '#template'});
                ok( isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( isAttached( $('#newID')));
                try {
                    ok($( '#xx', $('#newID')).text() === 'updatedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !isAttached( $('#newID')));
            }});
    });

test(
    "bindTo - Testing the population of a template with no type conversion - no matching data a.",
    function() {
        ok( !isAttached( $('#newID')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div data-horn="/">' +
                            '    <div data-horn="a.b.c"><span data-horn="d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div data-horn="a.b.c"><span data-horn="d"></span></div>' +
                            '</div>')}],
            callback: function( horn ) {
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                model.a.b.c.e = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    id: 'newID',
                    template: '#template'});
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
    "bindTo - Testing the population of a template with no type conversion - no matching data b.",
    function() {
        ok( !isAttached( $('#newID')));
        dataTest( {
            nodes: [ {
                nodes:  $(  '<div data-horn="/">' +
                            '    <div id="grabber1" data-horn="a.b.c"><span id="grabber2" data-horn="d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div data-horn="a.b.c"><span data-horn="d"></span></div>' +
                            '</div>')}],
            callback: function( horn ) {
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                ok( horn.hasHornBinding( $('#grabber1')[0], '', true) === false);
                ok( isObject( horn.hasHornBinding( $('#grabber2')[0], '')));
                model.a.b.c.f = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    id: 'newID',
                    template: '#template'});
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
    "INPUT - INPUT node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><input data-horn="key" value="testValue"/></div>')}
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
                nodes:  $('<div data-horn="/"><input data-horn="key" value="12"/></div>')}
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
                nodes:  $('<div data-horn="/">baskdfhjdshfds h<input data-horn="key" id="grabMe" value="true"/>akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "key");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('#grabMe').val() === 'false');
        }});
    });




test(
    "TEXTAREA - TEXTAREA node for value, no type conversion.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/"><textarea data-horn="key">testValue</textarea></div>')}
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
                nodes:  $('<div data-horn="/"><textarea data-horn="key">12</textarea></div>')}
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
                nodes:  $('<div data-horn="/">baskdfhjdshfds h<textarea data-horn="key" id="grabMe">true</textarea>akdsjf kljdskf jdskf</div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "key");
                var model = horn.bind();
                ok( isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('#grabMe').val() === 'false');
        }});
    });

test(
    "unbind - unbind all by not defining an argument.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/d"><span id="x__" data-horn="[2]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                model.d[ 2] = true;
                horn.updateDOM();
                ok( horn.hornNodeValue( {node: $('#x__')}) === "true");
                horn.unbind();
                model.d[ 2] = false;
                horn.updateDOM();
                ok( horn.hornNodeValue( {node: $('#x__')}) === "true");
            }
        });
    });

test(
    "unbind - unbind all using regex.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/d"><span id="x__" data-horn="[2]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                model.d[ 2] = true;
                horn.updateDOM();
                ok( horn.hornNodeValue( {node: $('#x__')}) === "true");
                horn.unbind( {pattern: ".*"});
                model.d[ 2] = false;
                horn.updateDOM();
                ok( horn.hornNodeValue( {node: $('#x__')}) === "true");
            }
        });
    });

test(
    "unbind - unbind a single property.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="/d"><span id="x__" data-horn="[2]">false</span></div>')}
            ],
            callback: function( horn ) {
                setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                model.d[ 2] = true;
                horn.updateDOM();
                ok( horn.hornNodeValue( {node: $('#x__')}) === "true");
                horn.unbind( {path: "d[2]"});
                model.d[ 2] = false;
                horn.updateDOM();
                ok( horn.hornNodeValue( {node: $('#x__')}) === "true");
            }
        });
    });
