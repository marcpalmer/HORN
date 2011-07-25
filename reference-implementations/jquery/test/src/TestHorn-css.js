module( "horn-jquery-css-1.0.js - Features");

test(
    "Test horn has hasRootIndicator function.",
    function() {
        ok( SMTestUtils.isFunction( horn.delegate().hasRootIndicator));
    }
);

test(
    "Test horn has hasJSONIndicator function.",
    function() {
        ok( SMTestUtils.isFunction( horn.delegate().hasJSONIndicator));
    }
);

test(
    "Test horn has pathIndicator function.",
    function() {
        ok( SMTestUtils.isFunction( horn.delegate().pathIndicator));
    }
);

test(
    "Test horn has rootNodes function.",
    function() {
        ok( SMTestUtils.isFunction( horn.delegate().rootNodes));
    }
);




module( "horn-jquery-css-1.0.js - feature functions");




test(
    "hasRootIndicator - simple affirmative.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="horn"><span class="_0">one</span></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasRootIndicator( $('#grab')) === true);
            }});
    });

test(
    "hasRootIndicator - simple affirmative with other class attribute values.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="value test horn rubbish crap _test"></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasRootIndicator( $('#grab')) === true);
            }});
    });

test(
    "hasRootIndicator - sanity false case.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab"></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasRootIndicator( $('#grab')) === false);
            }});
    });

test(
    "hasRootIndicator - case sensitivity.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="HoRn"></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasRootIndicator( $('#grab')) === false);
            }});
    });


test(
    "hasJSONIndicator - simple affirmative case.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="data-json"></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasJSONIndicator( $('#grab')) === true);
            }});
    });

test(
    "hasJSONIndicator - affirmative case with surrounding class attribute values.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="x _value data-json missing"></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasJSONIndicator( $('#grab')) === true);
            }});
    });

test(
    "hasJSONIndicator - case sensitivity.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="x _value data-Json missing"></div>')}
            ],
            callback: function() {
                ok( new HornCSSFeatures().hasJSONIndicator( $('#grab')) === false);
            }});
    });




test(
    "rootNodes - none on test document, empty collection returned.",
    function() {
        ok( new HornCSSFeatures().rootNodes().length === 0);
    });

test(
    "rootNodes - single rooted horn document.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab" class="horn"><span class="_0">one</span></div>')}
            ],
            callback: function() {
                var roots = new HornCSSFeatures().rootNodes();
                ok( roots.length === 1);
                ok( SMUtils.compare( roots.get(0), $('#grab')) === true );
            }});
    });

test(
    "rootNodes - forest test.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab1" class="horn"><span class="_0">one</span></div><div id="grab2" class="horn"><span class="_0">one</span></div><div id="grab3" class="horn"><span class="_0">one</span></div>')}
            ],
            callback: function() {
                var roots = new HornCSSFeatures().rootNodes();
                ok( roots.length === 3);
                ok( SMUtils.compare( roots.get(0), $('#grab1')) === true );
                ok( SMUtils.compare( roots.get(1), $('#grab2')) === true );
                ok( SMUtils.compare( roots.get(2), $('#grab3')) === true );
            }});
    });

test(
    "rootNodes - nested contexts, returns all roots.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="grab1" class="horn"><span class="_0">one</span><div id="grab2" class="horn"><span class="_0">one</span></div></div>')}
            ],
            callback: function() {
                var roots = new HornCSSFeatures().rootNodes();
                ok( roots.length === 2);
                ok( SMUtils.compare( roots.get(0), $('#grab1')) === true );
                ok( SMUtils.compare( roots.get(1), $('#grab2')) === true );
            }});
    });




test(
    "pathIndicator - simple positive/negative cases.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span id="grab1" class="_0">one</span></div>')}
            ],
            callback: function() {
                var features = new HornCSSFeatures();
                ok( features.pathIndicator( $('#grab1')) === "0");
                ok( features.pathIndicator( $('#grab1')) !== "_0");
                ok( features.pathIndicator( $('#grab1')) !== "-0");
            }});
    });

test(
    "pathIndicator - first returned from many.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span id="grab1" class="_0 _1 _2">one</span></div>')}
            ],
            callback: function() {
                var features = new HornCSSFeatures();
                ok( features.pathIndicator( $('#grab1')) === "0");
            }});
    });




module( "horn-jquery-css-1.0.js - horn functions");

// 0-0-0    0 = A
// 0-0-1    1
// 0-1-0    2
// 0-0-2    3
// 0-1-0    4
// 1-0-0    5
// 2-0-1    6
// 3-0-0-0  7
// 3-1-0-0  8

/*
<div class="horn">
    <span class="_0-0-0">0</span>
    <span class="_0-0-1">1</span>
    <span class="_0-1-0">2</span>
    <span class="_0-1-1">3</span>
    <span class="_1-0-0">4</span>
    <span class="_2-0-1">5</span>
    <span class="_2-1-0">6</span>
    <span class="_3-0-0-0">7</span>
    <span class="_3-1-0-0">8</span>
</div>
<div class="horn"><span class="_0-0-0">0</span><span class="_0-0-1">1</span><span class="_0-1-0">2</span><span class="_0-1-1">3</span><span class="_1-0-0">4</span><span class="_2-0-1">5</span><span class="_2-1-0">6</span><span class="_3-0-0-0">7</span><span class="_3-1-0-0">8</span></div>
*/

test(
    "adjustModelArray - notices[0,1,2]-/notices[1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><div class="_notices"><span class="_0">0</span><span class="_1">1</span><span class="_2">2</span></div></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( $.isArray( model.notices));
                ok( model.notices.length === 3);
                horn.adjustModelArray( {isInsert: false, path: "/notices[1]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["notices-0"].context[ b["notices-0"].key] === "0");
                ok( b["notices-1"].context[ b["notices-1"].key] === "2");
            }});
    });

test(
    "adjustModelArray - notices[0,1,2]+/notices[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><div class="_notices"><span class="_0">0</span><span class="_1">1</span><span class="_2">2</span></div></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( $.isArray( model.notices));
                horn.adjustModelArray( {isInsert: true, path: "/notices[0]"});
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["notices-1"].context[ b["notices-1"].key] === "0");
                ok( b["notices-2"].context[ b["notices-2"].key] === "1");
                ok( b["notices-3"].context[ b["notices-3"].key] === "2");
            }});
    });

test(
    "adjustModelArray - [0]-/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 1);
                ok( b["0"].context[ b["0"].key] === "0");
                horn.adjustModelArray( {isInsert: false, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 0);
            }});
    });

test(
    "adjustModelArray - [0,1]-/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                horn.adjustModelArray( {isInsert: false, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 1);
                ok( b["0"].context[ b["0"].key] === "1");
            }});
    });

test(
    "adjustModelArray - [0,1]+/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                horn.adjustModelArray( {isInsert: true, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["1"].context[ b["1"].key] === "0");
                ok( b["2"].context[ b["2"].key] === "1");
            }});
    });

test(
    "adjustModelArray - [0,1]-/[1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                horn.adjustModelArray( {isInsert: false, path: "/[1]"});
                ok( SMTestUtils.countOwnProps( b) === 1);
                ok( b["0"].context[ b["0"].key] === "0");
            }});
    });

test(
    "adjustModelArray - [0,1]+/[1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                horn.adjustModelArray( {isInsert: true, path: "/[1]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["2"].context[ b["2"].key] === "1");
            }});
    });

test(
    "adjustModelArray - [0,1,2]-/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2"].context[ b["2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "1");
                ok( b["1"].context[ b["1"].key] === "2");
            }});
    });

test(
    "adjustModelArray - [0,1,2]-/[1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2"].context[ b["2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[1]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "2");
            }});
    });

test(
    "adjustModelArray - [0,1,2]-/[2]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2"].context[ b["2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[2]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
            }});
    });

test(
    "adjustModelArray - [[0]]-/[0][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 1);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                horn.adjustModelArray( {isInsert: false, path: "/[0][0]"});
                ok( SMTestUtils.countOwnProps( b) === 0);
            }});
    });

test(
    "adjustModelArray - [[0]]+/[0][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 1);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                horn.adjustModelArray( {isInsert: true, path: "/[0][0]"});
                ok( SMTestUtils.countOwnProps( b) === 1);
                ok( b["0-1"].context[ b["0-1"].key] === "0");
            }});
    });

test(
    "adjustModelArray - [[0,1,2]]-/[0][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_0-2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["0-2"].context[ b["0-2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[0][0]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0-0"].context[ b["0-0"].key] === "1");
                ok( b["0-1"].context[ b["0-1"].key] === "2");
            }});
    });

test(
    "adjustModelArray - [[0,1,2]]-/[0][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_0-2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["0-2"].context[ b["0-2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[0][1]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "2");
            }});
    });

test(
    "adjustModelArray - [[0,1,2]]+/[0][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_0-2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["0-2"].context[ b["0-2"].key] === "2");
                horn.adjustModelArray( {isInsert: true, path: "/[0][1]"});
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-2"].context[ b["0-2"].key] === "1");
                ok( b["0-3"].context[ b["0-3"].key] === "2");
            }});
    });

test(
    "adjustModelArray - [[0,1,2]]-/[0][2]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_0-2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["0-2"].context[ b["0-2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[0][2]"});
                ok( SMTestUtils.countOwnProps( b) === 2);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
            }});
    });

test(
    "adjustModelArray - [[0,1,2]]-/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_0-2">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 3);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["0-2"].context[ b["0-2"].key] === "2");
                horn.adjustModelArray( {isInsert: false, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 0);
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 4);
                ok( b["0-0"].context[ b["0-0"].key] === "2");
                ok( b["0-1"].context[ b["0-1"].key] === "3");
                ok( b["1-0"].context[ b["1-0"].key] === "4");
                ok( b["1-1"].context[ b["1-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]+/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: true, path: "/[0]"});
                ok( SMTestUtils.countOwnProps( b) === 6);
                ok( b["1-0"].context[ b["1-0"].key] === "0");
                ok( b["1-1"].context[ b["1-1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1"].context[ b["2-1"].key] === "3");
                ok( b["3-0"].context[ b["3-0"].key] === "4");
                ok( b["3-1"].context[ b["3-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[1]"});
                ok( SMTestUtils.countOwnProps( b) === 4);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "4");
                ok( b["1-1"].context[ b["1-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[2]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[2]"});
                ok( SMTestUtils.countOwnProps( b) === 4);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[0][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[0][0]"});
                ok( SMTestUtils.countOwnProps( b) === 5);
                ok( b["0-0"].context[ b["0-0"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]+/[0][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: true, path: "/[0][0]"});
                ok( b["0-1"].context[ b["0-1"].key] === "0");
                ok( b["0-2"].context[ b["0-2"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[0][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[0][1]"});
                ok( SMTestUtils.countOwnProps( b) === 5);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[1][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[1][0]"});
                ok( SMTestUtils.countOwnProps( b) === 5);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[1][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[1][1]"});
                ok( SMTestUtils.countOwnProps( b) === 5);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[2][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[2][0]"});
                ok( SMTestUtils.countOwnProps( b) === 5);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]+/[2][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: true, path: "/[2][0]"});
                ok( SMTestUtils.countOwnProps( b) === 6);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-1"].context[ b["2-1"].key] === "4");
                ok( b["2-2"].context[ b["2-2"].key] === "5");
            }});
    });

test(
    "adjustModelArray - [[0,1],[2,3],[4,5]]-/[2][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0-0">0</span><span class="_0-1">1</span><span class="_1-0">2</span><span class="_1-1">3</span><span class="_2-0">4</span><span class="_2-1">5</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
                ok( b["2-1"].context[ b["2-1"].key] === "5");
                ok( SMTestUtils.countOwnProps( b) === 6);
                horn.adjustModelArray( {isInsert: false, path: "/[2][1]"});
                ok( SMTestUtils.countOwnProps( b) === 5);
                ok( b["0-0"].context[ b["0-0"].key] === "0");
                ok( b["0-1"].context[ b["0-1"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1"].context[ b["1-1"].key] === "3");
                ok( b["2-0"].context[ b["2-0"].key] === "4");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[0]"});
                ok( b["0"].context[ b["0"].key] === "1");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1-0"].context[ b["1-1-0"].key] === "3");
                ok( b["1-1-1"].context[ b["1-1-1"].key] === "4");
                ok( b["1-1-2"].context[ b["1-1-2"].key] === "5");
                ok( b["1-2"].context[ b["1-2"].key] === "6");
                ok( b["2"].context[ b["2"].key] === "7");
                ok( b["3"].context[ b["3"].key] === "8");
                ok( SMTestUtils.countOwnProps( b) === 8);
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[1]"});
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1-0"].context[ b["1-0"].key] === "2");
                ok( b["1-1-0"].context[ b["1-1-0"].key] === "3");
                ok( b["1-1-1"].context[ b["1-1-1"].key] === "4");
                ok( b["1-1-2"].context[ b["1-1-2"].key] === "5");
                ok( b["1-2"].context[ b["1-2"].key] === "6");
                ok( b["2"].context[ b["2"].key] === "7");
                ok( b["3"].context[ b["3"].key] === "8");
                ok( SMTestUtils.countOwnProps( b) === 8);
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]+/[2][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "4");
                ok( b["2-1-2"].context[ b["2-1-2"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: true, path: "/[2][1]"});
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-2-0"].context[ b["2-2-0"].key] === "3");
                ok( b["2-2-1"].context[ b["2-2-1"].key] === "4");
                ok( b["2-2-2"].context[ b["2-2-2"].key] === "5");
                ok( b["2-3"].context[ b["2-3"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
                ok( SMTestUtils.countOwnProps( b) === 9);
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2]"});
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2"].context[ b["2"].key] === "7");
                ok( b["3"].context[ b["3"].key] === "8");
                ok( SMTestUtils.countOwnProps( b) === 4);
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[3]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[3]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "4");
                ok( b["2-1-2"].context[ b["2-1-2"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "8");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[4]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[4]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "4");
                ok( b["2-1-2"].context[ b["2-1-2"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2][0]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0-0"].context[ b["2-0-0"].key] === "3");
                ok( b["2-0-1"].context[ b["2-0-1"].key] === "4");
                ok( b["2-0-2"].context[ b["2-0-2"].key] === "5");
                ok( b["2-1"].context[ b["2-1"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2][1]"});
                ok( SMTestUtils.countOwnProps( b) === 6);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1"].context[ b["2-1"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");


            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2][2]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2][2]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "4");
                ok( b["2-1-2"].context[ b["2-1-2"].key] === "5");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2][1][0]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2][1][0]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "4");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2][1][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2][1][1]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
            }});
    });

test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]+/[2][1][1]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "4");
                ok( b["2-1-2"].context[ b["2-1-2"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: true, path: "/[2][1][1]"});
                ok( SMTestUtils.countOwnProps( b) === 9);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-2"].context[ b["2-1-2"].key] === "4");
                ok( b["2-1-3"].context[ b["2-1-3"].key] === "5");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
            }});
    });


test(
    "adjustModelArray - [0,1,[2,[3,4,5],6],7,8]-/[2][1][2]",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">0</span><span class="_1">1</span><span class="_2-0">2</span><span class="_2-1-0">3</span><span class="_2-1-1">4</span><span class="_2-1-2">5</span><span class="_2-2">6</span><span class="_3">7</span><span class="_4">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var b = horn.state().bindings;
                ok( SMTestUtils.countOwnProps( b) === 9);
                horn.adjustModelArray( {isInsert: false, path: "/[2][1][2]"});
                ok( SMTestUtils.countOwnProps( b) === 8);
                ok( b["0"].context[ b["0"].key] === "0");
                ok( b["1"].context[ b["1"].key] === "1");
                ok( b["2-0"].context[ b["2-0"].key] === "2");
                ok( b["2-1-0"].context[ b["2-1-0"].key] === "3");
                ok( b["2-1-1"].context[ b["2-1-1"].key] === "4");
                ok( b["2-2"].context[ b["2-2"].key] === "6");
                ok( b["3"].context[ b["3"].key] === "7");
                ok( b["4"].context[ b["4"].key] === "8");
            }});
    });

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
    "bind -  no data expected, undefined returned.",
    function() {
        SMTestUtils.dataTest( {
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                ok( horn.bind() === undefined);
            }});
    });

test(
    "bind -  _0 - 'one'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0">one</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 1);
                ok( model[ 0] === 'one');
            }});
    });

test(
    "bind -  _1 - 2",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_1">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[1]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 2);
                ok( model[ 1] === 2);
            }});
    });

test(
    "bind -  _2 - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_2">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[2]");
                var data = horn.bind();
                ok( SMTestUtils.isArray( data));
                ok( data.length === 3);
                ok( data[ 2] === true);
            }});
    });

test(
    "bind -  _3-0 - 'three'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_0">three</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 1);



                ok( model[ 3][ 0] === 'three');
            }});
    });

test(
    "bind -  _3-1 - 4",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_1">4</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[3][1]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 2);

                ok( model[ 3][ 1] === 4);
            }});
    });

test(
    "bind -  _3-2 - false",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[3][2]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 3);

                ok( model[ 3][ 2] === false);
            }});
    });

test(
    "bind -  _3-3-0 - 'five'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_0">five</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 4);

                ok( SMTestUtils.isArray( model[ 3][ 3]));
                ok( model[ 3][ 3].length === 1);

                ok( model[ 3][ 3][ 0] === 'five');
            }});
    });

test(
    "bind -  _3-3-1 - 6",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_1">6</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[3][3][1]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 4);

                ok( SMTestUtils.isArray( model[ 3][ 3]));
                ok( model[ 3][ 3].length === 2);

                ok( model[ 3][ 3][ 1] === 6);
            }});
    });

test(
    "bind -  _3-3-2 - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-3"><span class="_2">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[3][3][2]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 4);

                ok( SMTestUtils.isArray( model[ 3][ 3]));
                ok( model[ 3][ 3].length === 3);

                ok( model[ 3][ 3][ 2] === true);
            }});
    });

test(
    "bind -  _3-4-k - 'seven'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_k">seven</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 5);

                ok( SMTestUtils.isObject( model[ 3][ 4]));
                ok( model[ 3][ 4][ 'k'] === 'seven');
            }});
    });

test(
    "bind -  _3-4-l - 8",
    function() {
         SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_l">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[3][4].l");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 5);

                ok( SMTestUtils.isObject( model[ 3][ 4]));
                ok( model[ 3][ 4][ 'l'] === 8);
            }});
    });

test(
    "bind -  _3-4-m - false",
    function() {
         SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _3-4"><span class="_m">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[3][4].m");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);

                ok( SMTestUtils.isArray( model[ 3]));
                ok( model[ 3].length === 5);

                ok( SMTestUtils.isObject( model[ 3][ 4]));
                ok( model[ 3][ 4][ 'm'] === false);
            }});
    });

test(
    "bind -  _4-f - 'nine'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_f">nine</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( model[ 4][ 'f'] === 'nine');
            }});
    });

test(
    "bind -  _4-g - 10",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_g">10</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[4].g");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( model[ 4][ 'g'] === 10);
            }});
    });

test(
    "bind -  _4-h - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4"><span class="_h">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[4].h");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( model[ 4][ 'h'] === true);
            }});
    });

test(
    "bind -  _4-i-0 - 'eleven'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_0">eleven</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( SMTestUtils.isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 1);

                ok( model[ 4][ 'i'][0] === 'eleven');
            }});
    });

test(
    "bind -  _4-i-1 - 12",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_1">12</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[4].i[1]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( SMTestUtils.isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 2);

                ok( model[ 4][ 'i'][ 1] === 12);
            }});
    });

test(
    "bind -  _4-i-2 - false",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-i"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[4].i[2]");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( SMTestUtils.isArray( model[ 4][ 'i']));
                ok( model[ 4][ 'i'].length === 3);

                ok( model[ 4][ 'i'][ 2] === false);
            }});
    });

test(
    "bind -  _4-j-n - 'thirteen'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_n">thirteen</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( SMTestUtils.isObject( model[ 4][ 'j']));

                ok( model[ 4][ 'j'][ 'n'] === 'thirteen');
            }});
    });

test(
    "bind -  _4-j-o - 14",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_o">14</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "[4].j.o");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( SMTestUtils.isObject( model[ 4][ 'j']));

                ok( model[ 4][ 'j'][ 'o'] === 14);
        }});
    });

test(
    "bind -  _4-j-p - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _4-j"><span class="_p">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "[4].j.p");
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( model.length === 5);

                ok( SMTestUtils.isObject( model[ 4]));
                ok( SMTestUtils.isObject( model[ 4][ 'j']));

                ok( model[ 4][ 'j'][ 'p'] === true);
        }});
    });

test(
    "bind -  _a - 'one'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">one</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model[ 'a'] === 'one');
        }});
    });

test(
    "bind -  _b - 2",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_b">2</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "b");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.b === 2);
        }});
    });

test(
    "bind -  _d-0 - 'three'",
    function() {
    SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_0">three</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 1);
                ok( model.d[ 0] === 'three');
        }});
    });

test(
    "bind -  _d-1 - 4",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_1">4</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "d[1]");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 2);
                ok( model.d[ 1] === 4);
        }});
    });

test(
    "bind -  _d-2 - false",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 3);
                ok( model.d[ 2] === false);
        }});
    });

test(
    "bind -  _d-3-0 - 'five'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_0">five</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 4);
                ok( SMTestUtils.isArray( model.d[3]));
                ok( model.d[3].length === 1);
                ok( model.d[3][0] === 'five');
        }});
    });

test(
    "bind -  _d-3-1 - 6",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_1">6</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "d[3][1]");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 4);
                ok( SMTestUtils.isArray( model.d[3]));
                ok( model.d[3].length === 2);
                ok( model.d[3][1] === 6);
        }});
    });

test(
    "bind -  _d-3-2 - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-3"><span class="_2">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[3][2]");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 4);
                ok( SMTestUtils.isArray( model.d[3]));
                ok( model.d[3].length === 3);
                ok( model.d[3][2] === true);
        }});
    });

test(
    "bind -  _d-4-k - 'seven'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_k">seven</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));

                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 5);

                ok( SMTestUtils.isObject( model.d[ 4]));

                ok( model.d[ 4].k === 'seven');
        }});
    });

test(
    "bind -  _d-4-l - 8",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_l">8</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "d[4].l");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));

                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 5);

                ok( SMTestUtils.isObject( model.d[ 4]));

                ok( model.d[ 4].l === 8);
        }});
    });

test(
    "bind -  _d-4-m - false",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d-4"><span class="_m">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[4].m");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));

                ok( SMTestUtils.isArray( model.d));
                ok( model.d.length === 5);

                ok( SMTestUtils.isObject( model.d[ 4]));

                ok( model.d[ 4].m === false);
        }});
    });

test(
    "bind -  _e-f - 'nine'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_f">nine</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( model.e.f === 'nine');
        }});
    });

test(
    "bind -  _e-g - 10",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_g">10</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "e.g");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( model.e.g === 10);
        }});
    });

test(
    "bind -  _e-h - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e"><span class="_h">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "e.h");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( model.e.h === true);
        }});
    });

test(
    "bind -  _e-i-0 - 'eleven'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_0">eleven</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( SMTestUtils.isArray( model.e.i));
                ok( model.e.i.length === 1);
                ok( model.e.i[ 0] === 'eleven');
        }});
    });

test(
    "bind -  _e-i-1 - 12",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_1">12</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "e.i[1]");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( SMTestUtils.isArray( model.e.i));
                ok( model.e.i.length === 2);
                ok( model.e.i[ 1] === 12);
        }});
    });

test(
    "bind -  _e-i-2 - false",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "e.i[2]");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( SMTestUtils.isArray( model.e.i));
                ok( model.e.i.length === 3);
                ok( model.e.i[ 2] === false);
        }});
    });

test(
    "bind -  _e-j-n - 'thirteen'",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_n">thirteen</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( SMTestUtils.isObject( model.e.i));
                ok( model.e.i.n === 'thirteen');
        }});
    });

test(
    "bind -  _e-j-o - 14",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_o">14</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "e.i.o");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( SMTestUtils.isObject( model.e.i));
                ok( model.e.i.o === 14);
        }});
    });

test(
    "bind -  _e-j-p - true",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _e-i"><span class="_p">true</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "e.i.p");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.e));
                ok( SMTestUtils.isObject( model.e.i));
                ok( model.e.i.p === true);
        }});
    });

test(
    "bind - with pathStem supplied.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">value</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind({pathStem: "/a.b"});
                ok( SMTestUtils.isObject( model));
                ok( model.a.b.a === "value");
        }});
    });

test(
    "bind -  that integers can be expressed using hexadecimal notation.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class=" _a">0x10</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "a");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.a === 16);
        }});
    });

test(
    "bind -  that integers can be expressed using octal notation.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">0310667130</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "a");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.a === 52653656);
        }});
    });

test(
    "bind -  Split key definition using nested html.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _a"><div class="_b"><div class="_c"><span class="_d">-23</span></div></div></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "a.b.c.d");
                var model = horn.bind();
                ok( model.a.b.c.d === -23);
        }});
  });

test(
    "bind -  Embedded JSON Object with string property stored in object in root context.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _0"><span class="data-json">{"a": "hello"}</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( SMTestUtils.isObject( model[0]));
                ok( model[ 0].hasOwnProperty( 'a'));
                ok( model[ 0].a === 'hello');
        }});
  });

test(
    "bind -  Embedded JSON Object with integer property stored in array root context.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _0"><span class="data-json">{"a": 1}</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( SMTestUtils.isObject( model[ 0]));
                ok( model[ 0].a === 1);
        }});
  });

test(
    "bind -  Embedded JSON Object with boolean property stored in array root context.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _0"><span class="data-json">{"a": true}</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isArray( model));
                ok( SMTestUtils.isObject( model[ 0]));
                ok( model[ 0].a === true);
        }});
  });

test(
    "bind -  Embedded JSON Object with two properties.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key"><span class="data-json">{"a": true, "b": false}</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model.key));
                ok( model.key.a === true);
                ok( model.key.b === false);
        }});
  });

test(
    "bind -  Embedded JSON with nested filth.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key"><span class="data-json">{"a": [1], "b": {"c": false}}</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model.key));
                ok( SMTestUtils.isArray( model.key.a));
                ok( model.key.a.length === 1);
                ok( model.key.a[ 0] === 1);
                ok( SMTestUtils.isObject( model.key.b));
                ok( model.key.b.c === false);

        }});
  });

test(
    "bind -  Embedded JSON and type conversion.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key"><span class="data-json">{"a": 1}</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "key.a");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.key));
                ok( model.key.a === "1");
        }});
  });

test(
    "bind -  that two properties can exist in the same context.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_a">one</span><span class="_b">two</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model[ 'a'] === 'one');
                ok( model[ 'b'] === 'two');
        }});
    });




test(
    "bind -  Only nodes under rootNode are populated.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="root" class="horn"><div id="div0" class="_a">true</div></div><div id="root2" class="horn"><div id="div1" class="_b">false</div></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model;
                ok( SMUtils.isAttached( $('#root')));
                ok( SMUtils.isAttached( $('#root2')));
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "a|b");
                model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.a === true);
                ok( model.b === false);
                ok( SMUtils.contains( $('#div0').parents(), $('#root')), "sssss");
                model.a = false;
                model.b = true;
                ok( $('#div0').text() === 'true');
                ok( $('#div1').text() === 'false');
                horn.updateDOM( $('#root'));
                ok( $('#div0').text() === 'false');
                ok( $('#div1').text() === 'false');
        }});
    });

test(
    "bind -  Single node doing the whole job non JSON.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<span class="horn _propName">true</span>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "propName");
                var model = horn.bind();
                model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.propName === true);
        }});
    });

test(
    "bind -  Single node doing the whole job JSON.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<span class="horn _propName data-json">true</span>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.propName === true);
        }});
    });

test(
    "bind - ABBR node for value, no type conversion.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><abbr class="_key" title="alternative">value</abbr></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.key === 'alternative');
        }});
    });

test(
    "bind - ABBR node for value, converted to Integer.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><abbr class="_key" title="12">value</abbr></div>')}
            ],
            callback: function() {
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "bind - Simple nested in immediate parent.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _z"><div class="horn"><span class="_b">b</span></div><span class="_a">a</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( SMTestUtils.isObject( model.z));
                ok( model.z.hasOwnProperty( 'a'));
                ok( model.z.a === 'a');
                ok( model.b === 'b');
                ok( model.z.a.b === undefined);
                ok( model.z.b === undefined);
            }});
    });

test(
    "bind - INPUT node for value, no type conversion.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><input class="_key" value="testValue"/></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.key === 'testValue');
        }});
    });

test(
    "bind - INPUT node for value, converted to Integer.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><input class="_key" value="12"/></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "bind - TEXTAREA node for value, converted to Integer.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><textarea class="_key">12</textarea></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "key");
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.key === 12);
        }});
    });

test(
    "bind - Testing HornPatternConverter.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key">12</div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var passed = false;
                var hpc = new HornPatternConverter( {horn: horn});
                var converter = function( args ) {
                    passed = args.value === "12";
                };
                hpc.add( "conv.erter", converter);
                hpc.pattern( "key", "conv.erter");
                horn.bind();
                ok( passed);
        }});
    });

test(
    "bind - out of order array creation",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _1">a</div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                horn.bind();
                ok( SMTestUtils.isArray( horn.model()));
                ok( horn.model().length === 2);
                ok( horn.model()[ 1] === "a");
           }});
    });

test(
    "bind - out of order array creation - nested",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_1-2-3">a</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                horn.bind();
                ok( SMTestUtils.isArray( horn.model()));
                ok( horn.model().length === 2);
                ok( horn.model()[1].length === 3);
                ok( horn.model()[1][2].length === 4);
                ok( horn.model()[1][2][3] === "a");
           }});
    });

test(
    "bind - out of order array creation - nested 2",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_0_2">0</span><span class="_0-1-2">3</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                horn.bind();
                ok( SMTestUtils.isArray( horn.model()));
           }});
    });






test(
    "bindTo - Testing the population of a template with no type conversion nor pattern matching.",
    function() {
        ok( !SMUtils.isAttached( $('#newID')));
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn">' +
                            '    <div class="_a-b-c"><span class="_d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div class="_a-b-c"><span class="_d"></span></div>' +
                            '</div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                model.a.b.c.d = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    id: 'newID',
                    template: '#template'});
                ok( SMTestUtils.isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( SMUtils.isAttached( $('#newID')));
                try {
                    ok($( '._d', $('#newID')).text() === 'updatedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !SMUtils.isAttached( $('#newID')));
            }});
    });

test(
    "bindTo - Testing the population of a template with no type conversion - no matching data a.",
    function() {
        ok( !SMUtils.isAttached( $('#newID')));
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn">' +
                            '    <div class="_a-b-c"><span class="_d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div class="_f-b-c"><span class="_d"></span></div>' +
                            '</div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                model.a.b.c.d = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    id: 'newID',
                    template: '#template'});
                ok( SMTestUtils.isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( SMUtils.isAttached( $('#newID')));
                try {
                    ok($( '._d', $('#newID')).text() !== 'updatedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !SMUtils.isAttached( $('#newID')));
            }});
    });

test(
    "bindTo - Testing the population of a template with no type conversion - no matching data b.",
    function() {
        ok( !SMUtils.isAttached( $('#newID')));
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn">' +
                            '    <div id="grabber1" class="_a-b-c"><span id="grabber2" class="_d">value</span></div>' +
                            '</div>' +
                            '<div id="template">' +
                            '    <div class="_a-b-c"><span class="_f"></span></div>' +
                            '</div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                ok( horn.hasHornBinding( $('#grabber1')[0], '', true) === false);
                ok( SMTestUtils.isObject( horn.hasHornBinding( $('#grabber2')[0], '')));
                model.a.b.c.f = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    id: 'newID',
                    template: '#template'});
                ok( SMTestUtils.isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( SMUtils.isAttached( $('#newID')));
                try {
                    ok($( '._d', $('#newID')).text() !== 'upda  tedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !SMUtils.isAttached( $('#newID')));
            }});
    });

test(
    "bindTo - Real word case of populating html template from a given data structure - rootNode passed.",
    function() {
        ok( !SMUtils.isAttached( $('.terms')));
        SMTestUtils.dataTest( {
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
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                ok( SMUtils.isAttached( $('.terms')));
                var date = new Date();
                horn.option( "defaultModel", {
                    place:          'where',
                    time:           'time',
                    title:          1,
                    contact:        'contact',
                    description:    'moredetails'
                });
                ok( $('._place').val() === '');
                ok( $('._time').val() === '');
                ok( $('._title').val() === '');
                ok( $('._contact').val() === '');
                ok( $('._description').val() === '');
                horn.bindTo( {node: $('#newNotice')});
                ok( $('._place').val() === 'where');
                ok( $('._time').val() === 'time');
                ok( $('._title').val() === '1');
                ok( $('._contact').val() === 'contact');
                ok( $('._description').val() === 'moredetails');
        }});
        ok( !SMUtils.isAttached( $('.terms')));

    });

test(
    "bindTo - bindTo with pathStem argument supplied.",
    function() {
        ok( !SMUtils.isAttached( $('#newID')));
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn _a-b-c-d">value</div>' +
                            '<div id="template">' +
                            '    <div class="_b-c-d" id="xx"></div>' +
                            '</div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( model.a.b.c.d === 'value');
                model.a.b.c.d = 'updatedValue';
                var populatedTemplate = horn.bindTo( {
                    pathStem: '/a',
                    id: 'newID',
                    template: '#template'});
                ok( SMTestUtils.isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                ok( SMUtils.isAttached( $('#newID')));
                try {
                    ok($( '#xx', $('#newID')).text() === 'updatedValue');
                } finally {
                    $('#newID').remove();
                }
                ok( !SMUtils.isAttached( $('#newID')));
            }});
    });

test(
    "bindTo - attaching cloned template to newly defined model location.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div id="template"><div class="_key" id="xx"></div></div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                horn.option( "defaultModel", {});
                var model = horn.bind();
                ok( model.key === undefined);
                model.a = {key: 'value'};
                var populatedTemplate = horn.bindTo( {
                    pathStem: '/a',
                    id: 'newID',
                    template: '#template'});
                ok( SMTestUtils.isJQueryObject( populatedTemplate));
                $(populatedTemplate).appendTo( $('body'));
                try {
                    ok($( '#xx', $('#newID')).text() === 'value');
                } finally {
                    $('#newID').remove();
                }
            }});
    });




test(
    "blankModelEntries - returns expected blank String model entries, with and without path - all blank node values",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn"><span class="_a"></span><div class="_b"><span class="_0"></span><span class="_1"></span><div class="_c"><span class="_d"></span><div class="_e"><span class="_0"></span><span class="_1"></span></div></div></div></div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                horn.bind();
                ok( SMTestUtils.arrayCompare(
                    ["a", "b[0]", "b[1]", "b.c.d", "b.c.e[0]", "b.c.e[1]"],
                    horn.blankModelEntries()));
                ok( SMTestUtils.arrayCompare(
                    ["b[0]", "b[1]", "b.c.d", "b.c.e[0]", "b.c.e[1]"],
                    horn.blankModelEntries( {path: "b"})));
                ok( SMTestUtils.arrayCompare(
                    ["b[0]", "b[1]", "b.c.d", "b.c.e[0]", "b.c.e[1]"],
                    horn.blankModelEntries( {path: "b", inspectDOM: true})));
            }});
    }
);

test(
    "blankModelEntries - returns expected blank String model entries, with and without path - mixed node values",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn"><span class="_a"></span><div class="_b"><span class="_0">zz</span><span class="_1"></span><div class="_c"><span class="_d"></span><div class="_e"><span class="_0">xxx</span><span id="_x" class="_1"></span></div></div></div></div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                horn.bind().x = "";
                ok( SMTestUtils.arrayCompare( ["a", "b[1]", "b.c.d", "b.c.e[1]"],
                        horn.blankModelEntries()));
                ok( SMTestUtils.arrayCompare( ["b[1]", "b.c.d", "b.c.e[1]"],
                        horn.blankModelEntries( {path: "b"})));
                Horn.hornNodeValue( {node: $('#_x'), value: "a"});
                ok( SMTestUtils.arrayCompare( ["b[1]", "b.c.d"],
                        horn.blankModelEntries( {path: "b", inspectDOM: true})));
            }});
    }
);




test(
    "nodeForPath - bind a graph, nodeForPath for known path has expected ID",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="horn"><span class="_a"></span><div class="_b"><span class="_0">zz</span><span class="_1"></span><div class="_c"><span class="_d"></span><div class="_e"><span class="_0">xxx</span><span id="xqs" class="_1">ourValue</span></div></div></div></div>')}],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( $(horn.nodeForPath( "b.c.e[1]")).attr( 'id') === 'xqs');
            }});
    }
);




test(
    "reset - the model is cleared upon reset and the 'readOnly' option is reset.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                horn.reset();
                ok( horn.model() === undefined);
                ok( horn.option( "readOnly") === false);
            }
        });
    });




test(
    "unbind - unbind all by not defining an argument.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                model.d[ 2] = true;
                horn.updateDOM();
                ok( Horn.hornNodeValue( {node: $('._2')}) === "true");
                horn.unbind();
                model.d[ 2] = false;
                horn.updateDOM();
                ok( Horn.hornNodeValue( {node: $('._2')}) === "true");
            }
        });
    });

test(
    "unbind - unbind all using regex.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                model.d[ 2] = true;
                horn.updateDOM();
                ok( Horn.hornNodeValue( {node: $('._2')}) === "true");
                horn.unbind( {pattern: ".*"});
                model.d[ 2] = false;
                horn.updateDOM();
                ok( Horn.hornNodeValue( {node: $('._2')}) === "true");
            }
        });
    });

test(
    "unbind - unbind a single property.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _d"><span class="_2">false</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "d[2]");
                var model = horn.bind();
                ok( model.d[ 2] === false);
                model.d[ 2] = true;
                horn.updateDOM();
                ok( Horn.hornNodeValue( {node: $('._2')}) === "true");
                horn.unbind( {path: "d[2]"});
                model.d[ 2] = false;
                horn.updateDOM();
                ok( Horn.hornNodeValue( {node: $('._2')}) === "true");
            }
        });
    });




test(
    "updateDOM - TEXTAREA node for value, converted to Boolean, repopulated and checked.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn">baskdfhjdshfds h<textarea class="_key" >true</textarea>akdsjf kljdskf jdskf</div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "key");
                var model = horn.bind();
                ok( SMUtils.isAttached( $('._key')));
                ok( SMTestUtils.isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('._key').val() === 'false');
        }});
    });

test(
    "updateDOM - ABBR node for value, converted to Boolean, repopulated and checked.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn">baskdfhjdshfds h<abbr class="_key" title="true">value</abbr> akdsjf kljdskf jdskf</div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model;
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "key");

                model = horn.bind();
                ok( SMUtils.isAttached( $('._key')));
                ok( SMTestUtils.isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('._key').attr( 'title') === 'false');
        }});
    });

test(
    "updateDOM - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "key");

                var model = horn.bind();
                ok( SMUtils.isAttached( $('._key')));
                ok( SMTestUtils.isObject( model));
                ok( model.key === -1);
                model.key = 13;
                horn.updateDOM();
                ok( $('._key').text() === '13');
        }});
    });

test(
    "updateDOM - testing the correct nodes are returned and in the correct order.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key1">a</span><span class="_key2">b</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMUtils.isAttached( $('._key1')));
                ok( SMUtils.isAttached( $('._key2')));
                ok( SMTestUtils.isObject( model));
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

test(
    "updateDOM - integer from horn, extracted, modified in model, repopulated and checked.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><span class="_key">-1</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "IntegerConverter", "key");

                var model = horn.bind();
                ok( SMUtils.isAttached( $('._key')));
                ok( SMTestUtils.isObject( model));
                ok( model.key === -1);
                model.key = 13;
                horn.updateDOM();
                ok( $('._key').text() === '13');
        }});
    });

test(
    "updateDOM - INPUT node for value, converted to Boolean, repopulated and checked.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn">baskdfhjdshfds h<input class="_key" value="true"/>akdsjf kljdskf jdskf</div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                SMTestUtils.setPatternConverter( horn, "BooleanConverter", "key");
                var model = horn.bind();
                ok( SMUtils.isAttached( $('._key')));
                ok( SMTestUtils.isObject( model));
                ok( model.key === true);
                model.key = false;
                horn.updateDOM();
                ok( $('._key').val() === 'false');
        }});
    });

test(
    "updateDOM - TEXTAREA node for value, no type conversion.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn"><textarea class="_key">testValue</textarea></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                ok( SMTestUtils.isObject( model));
                ok( model.key === 'testValue');
        }});
    });

test(
    "updateDOM - works on a single node",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="horn _key">aValue</div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = horn.bind();
                var node;
                ok( SMTestUtils.isObject( model));
                ok( model.key === 'aValue');
                model.key = "a";
                node = $('._key');
                horn.updateDOM( node);
                ok( Horn.hornNodeValue( {node: node}) === "a");
        }});
    });


test(
    "walkDOM - div/span test.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="_a"><span id="b">adsfadsfds</span></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var count = 0;
                var expected = [
                    ["a", $('._a')]
                ];
                var f = function( node, path ) {
                    ok(path === expected[ count][ 0], "path");
                    count+=1;
                };
                horn.walkDOM( $('._a'), f);
            }
        });
    });




test(
    "walkDOM - more involved tag nesting.",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $('<div class="_a"><div class="_aa"><span id="a"></span></div><div class="_ab"><span id="b"></span></div></div><div class="_b"><div class="_ba"><span id="c"></span></div><div class="_bb"><span id="d"></span></div></div>')}
            ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var count = 0;
                var expected = [
                    ["a", $('._a')],
                    ["a-aa", $('._aa')],
                    ["a-aa", $('#a')],
                    ["a-ab", $('._ab')],
                    ["a-ab", $('#b')]
                ];
                var f = function( node, path ) {
                    ok(path === expected[ count][ 0], "path");
                    ok(SMUtils.compare( node, expected[ count][ 1]), "node");
                    count+=1;
                    return true;
                };
                horn.walkDOM( $('._a'), f);
                ok( count === expected.length);
            }
        });
    });

test(
    "hornConverter - matching pattern for unknown converter",
    function() {
        SMTestUtils.dataTest( {
            nodes: [ { nodes:  $('<div class="horn _value">12</div>')} ],
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                hornConverter.reset( horn);
                hornConverter.pattern( "*", "unknownConverter");
                var model = horn.bind();
                ok( model.value === "12");
            }
        });
    });

test(
    "option(defaultModel) - Checking that it is copied on use and left untouched after binds.",
    function() {
        ok( !SMUtils.isAttached( $('.test')));
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="test horn _key">value</div>')}
            ],
            callback: function() {
                var defaultModel = {key2: true, key3: [0]};
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model;
                ok( SMUtils.isAttached( $('.test')));
                horn.option( "defaultModel", defaultModel);

                model = horn.bind();

                ok( SMUtils.isDefinedNotNull( model));
                ok( model.key === "value");
                ok( model.key2 === true);
                ok( SMTestUtils.isArray(model.key3));
                ok( SMTestUtils.arrayCompare( model.key3, defaultModel.key3));

                ok( !SMUtils.isDefinedNotNull( defaultModel.key));
                ok( defaultModel.key2 === true);
                ok( SMTestUtils.arrayCompare( defaultModel.key3, [0]));
        }});
        ok( !SMUtils.isAttached( $('.test')));
    });

test(
    "option(defaultModel) - Testing array as defaultModel root context.",
    function() {
        ok( !SMUtils.isAttached( $('.test')));
        SMTestUtils.dataTest( {
            nodes: [ {
                nodes:  $(  '<div class="test horn _3">value</div>')}
            ],
            callback: function() {
                var model;
                var defaultModel = [true, [0], ""];
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                ok( SMUtils.isAttached( $('.test')));
                horn.option( "defaultModel", defaultModel);
                model = horn.bind();

                ok( SMUtils.isDefinedNotNull( model));
                ok( SMTestUtils.isArray( model));
                ok( model.length === 4);
                ok( model[ 0] === true);
                ok( SMTestUtils.isArray( model[ 1]));
                ok( SMTestUtils.arrayCompare( model[ 1], [0]));
                ok( model[ 2] === "");
                ok( model[ 3] === "value");

                ok( defaultModel.length === 3);
                ok( defaultModel[ 0] === true);
                ok( SMTestUtils.isArray( defaultModel[ 1]));
                ok( SMTestUtils.arrayCompare( defaultModel[ 1], [0]));
                ok( defaultModel[ 2] === "");

                ok( defaultModel !== model);
        }});
        ok( !SMUtils.isAttached( $('.test')));
    });

test(
    "option : defaultModel",
    function() {
        SMTestUtils.dataTest( {
            callback: function() {
                var horn = new Horn();
                horn.delegate( new HornCSSFeatures());
                var model = {
                    notices: [],
                    newNotice: { title: 'testTitle' }
                };
                horn.option( "defaultModel", model);
                horn.bind();
                var extractedModel = horn.model();
                ok( extractedModel !== model);
                ok( SMTestUtils.isObject( extractedModel));
                ok( SMTestUtils.isArray( extractedModel.notices));
                ok( extractedModel.notices.length === 0);
                ok( SMTestUtils.isObject( extractedModel.newNotice));
                ok( SMTestUtils.countOwnProps( extractedModel) === 2);
                ok( SMTestUtils.countOwnProps( extractedModel.newNotice) === 1);
                ok( extractedModel.newNotice.title === 'testTitle');
            }});
    });
