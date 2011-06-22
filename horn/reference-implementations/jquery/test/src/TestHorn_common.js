module( "horn-jquery-1.0.js - horn miscellany");

test(
    "that we have the expected global (window) horn property.",
    function() { ok( window.horn instanceof Horn ); });




module( "horn-jquery-1.0.js - horn functions");

test(
    "compare - test common expected positives and negatives.",
    function() {
        var horn = new Horn();
        var ref = {};
        ok( horn.compare( 0, 0) === true);
        ok( horn.compare( "a", "a") === true);
        ok( horn.compare( true, true) === true);
        ok( horn.compare( false, false) === true);
        ok( horn.compare( 0, "0") === false);
        ok( horn.compare( false, "false") === false);
        ok( horn.compare( 0, "0") === false);
        ok( horn.compare( "Case", "case") === false);
        ok( horn.compare( {}, {}) === false);
        ok( horn.compare( [], []) === false);
        ok( horn.compare( ref, ref) === true);
        ok( horn.compare( 0.5, .5) === true);
    }
);




test(
    "contains - returns false for empty, null and undefined collections.",
    function() {
        var horn = new Horn();
        ok( horn.contains( [], 0) === false);
        ok( horn.contains( {}, 0) === false);
        ok( horn.contains( null, 0) === false);
        ok( horn.contains( undefined, 0) === false);
    }
);

test(
    "contains - returns true for - desired item as only item in collection.",
    function() {
        var horn = new Horn();
        ok( horn.contains( [0], 0) === true);
    }
);

test(
    "contains - returns true for - desired item as last item in collection.",
    function() {
        var horn = new Horn();
        ok( horn.contains( [1,0], 0) === true);
    }
);

test(
    "contains - returns true for - desired item as first item in collection.",
    function() {
        var horn = new Horn();
        ok( horn.contains( [0,1], 0) === true);
    }
);

test(
    "contains - returns true for - desired item as medial item in collection.",
    function() {
        var horn = new Horn();
        ok( horn.contains( [1,0,1], 0) === true);
    }
);

test(
    "contains - returns false for - desired item not in collection.",
    function() {
        var horn = new Horn();
        ok( horn.contains( ["0"], 'a') === false);
    }
);

test(
    "contains - false for a collection comparing the desired item if loosley compared.",
    function() {
        var horn = new Horn();
        ok( horn.contains( ["0"], 0) === false);
    }
);




test(
    "copyInto - That a test property isn't copied inappropriately.",
    function() {
        var dest = {};
        var src = {a:1};
        var horn = new Horn();
        horn.copyInto( {src: src, dest: dest});
        ok( !dest.hasOwnProperty( 'a'));
    }
);

test(
    "copyInto - That properties existing in the destination are copied from the source if existing and not undefined.",
    function() {
        var dest = {a:2};
        var src = {a:1};
        var horn = new Horn();
        horn.copyInto( {src: src, dest: dest});
        ok( dest.hasOwnProperty( 'a'));
        ok( dest.a === 1);
    }
);




test(
    "definesProperty - false for an empty collection.",
    function() {
        ok( new Horn().definesProperty( {}, "key") === false);
    }
);

test(
    "definesProperty - true for an object defining the property.",
    function() {
        ok( new Horn().definesProperty( {key: 'value'}, "key") === true);
    }
);

test(
    "definesProperty - true for existing array indices using String index as property name.",
    function() {
        ok( new Horn().definesProperty( [1], "0") === true);
    }
);

test(
    "definesProperty - true for existing array indices using Number index as property name.",
    function() {
        ok( new Horn().definesProperty( [1], 0) === true);
    }
);




test(
    "each - ranging over various array containers.",
    function() {
        $.each( [
            { col: [] },
            { col: [0] },
            { col: [1, 2] },
            { col: ["1", 2, false] },
            { col: ["cheeses"] },
            { col: [[0], [1]] }
        ], function( i, n ) {
            var result = [];
            new Horn().each( n.col, function( j, o) { result.push( o); });
            ok( arrayCompare( result, n.col) === true);
        })
    }
);

test(
    "each - ranging over an object container - and that we don't deep visit items.",
    function() {
        var eachData = {
            a: {
                z: -1
            },
            b: 2,
            c: true,
            d: "false"};
        var result = [];
        new Horn().each( eachData, function( i, n) {
            ok( n !== 'z');
            ok( n !== -1);
            ok( new Horn().compare( eachData[ i], n) === true);
        });
    }
);

test(
    "each - null containers shouldn't call the callback .",
    function() {
        new Horn().each( null, function( i, n) { ok( false); });
    }
);

test(
    "each - undefined containers shouldn't call the callback .",
    function() {
        new Horn().each( undefined, function( i, n) { ok( false); });
    }
);

test(
    "each - empty containers shouldn't call the callback .",
    function() {
        new Horn().each( [], function( i, n) { ok( false); });
    }
);

test(
    "each - empty containers shouldn't call the callback .",
    function() {
        new Horn().each( {}, function( i, n) { ok( false); });
    }
);

test(
    "each - simple values should not call the callback .",
    function() {
        new Horn().each( true, function( i, n) { ok( false); });
        new Horn().each( 0, function( i, n) { ok( false); });
    }
);

test(
    "each - string values should call the callback for each char.",
    function() {
        var result = [];
        new Horn().each( "string", function( i, n) { result.push( n);});
        ok( arrayCompare( result, [ "s", "t", "r", "i", "n", "g"]));
    }
);

test(
    "each - that the context is applied if supplied.",
    function() {
        new Horn().each( [0], function( i, n) { ok( this.x === true); }, {x: true});
    }
);




test(
    "toInternalPath - various paths.",
    function() {
        var horn = new Horn();
        ok( horn.toInternalPath( 'a') === 'a');
        ok( horn.toInternalPath('a[10]') === 'a-10');
        ok( horn.toInternalPath('[10]') === '10');
        ok( horn.toInternalPath('[10][20]') === '10-20');
        ok( horn.toInternalPath('x[1].y[2].z[3]') === 'x-1-y-2-z-3');
        ok( horn.toInternalPath('x[1][2][3].y[2].z') === 'x-1-2-3-y-2-z');
    });




test(
    "toExternalPath - various paths.",
    function() {
        var horn = new Horn();
        ok( horn.toExternalPath( 'a') === 'a');
        ok( horn.toExternalPath( 'a-10') === 'a[10]');
        ok( horn.toExternalPath( '10') === '[10]');
        ok( horn.toExternalPath( '10-20') === '[10][20]');
        ok( horn.toExternalPath( 'x-1-y-2-z-3') === 'x[1].y[2].z[3]');
        ok( horn.toExternalPath( 'x-1-2-3-y-2-z') === 'x[1][2][3].y[2].z');
    });




test(
    "hasPrefix - Sanity check on random string.",
    function() {
        var horn = new Horn();
        var val = "asakmfkdsj klasdjflkdlskfldksajflkdjs f8ds ufoas dfi";

        ok( horn.hasPrefix( val, val.substring(0, val.length - 5)) === true);
    });

test(
    "hasPrefix - Check reflexivity, ie. s.hasPrefix( s) === true.",
    function() {
        var horn = new Horn();
        var val = "abcdefghijklmnopqrstuvwxyz";

        ok( horn.hasPrefix( val, val) === true);
    });

test(
    "hasPrefix - Test regex not supported as expected.",
    function() {
        var val = "abcdefghijklmnopqrstuvwxyz";
        var horn = new Horn();

        ok( horn.hasPrefix( val, ".") === false);
    });

test(
    "hasPrefix - doesn't trim.",
    function() {
        var val = "  ";
        var horn = new Horn();

        ok( horn.hasPrefix( val, " ") === true);
    });




test(
    "hornNodeValue - get tests for various tags.",
    function() {
        var horn = new Horn();
        var tagData = [
            "<a>initialValue</a>",
            "<h3>initialValue</h3>",
            "<label>initialValue</label>",
            "<p>initialValue</p>",
            "<pre>initialValue</pre>",
            "<strong>initialValue</strong>",
            "<span>initialValue</span>",
            "<div>initialValue</div>",
            "<abbr title='initialValue'>displayValue</abbr>",
            "<input type='text' value='initialValue'>",
            "<input type='hidden' value='initialValue'>",
            "<textarea>initialValue</textarea>"];
        horn.each( tagData,
            function( i, n ) {
                var node = $(n);
                try {
                    node.attr( "id", "_soonToBeRemoved");
                    $('body').append( node);
                    ok( horn.isAttached( node) === true);
                    ok( horn.hornNodeValue( {node: node}) === 'initialValue');
                } finally {
                    node.remove();
                    ok( horn.isAttached( node) === false);
                }
            });
    });

test(
    "hornNodeValue - set tests for various tags.",
    function() {
        var horn = new Horn();
        var tagData = [
            "<a>initialValue</a>",
            "<h3>initialValue</h3>",
            "<label>initialValue</label>",
            "<p>initialValue</p>",
            "<pre>initialValue</pre>",
            "<strong>initialValue</strong>",
            "<span>initialValue</span>",
            "<div>initialValue</div>",
            "<abbr title='initialValue'>displayValue</abbr>",
            "<input type='text' value='initialValue'>",
            "<input type='hidden' value='initialValue'>",
            "<textarea>initialValue</textarea>"];
        horn.each( tagData,
            function( i, n ) {
                var node = $(n);
                try {
                    node.attr( "id", "_soonToBeRemoved");
                    $('body').append( node);
                    ok( horn.isAttached( node) === true);
                    ok( horn.hornNodeValue( {node: node}) === 'initialValue');
                    horn.hornNodeValue( {node: node, value: 'newValue'});
                    ok( horn.hornNodeValue( {node: node}) === 'newValue');
                } finally {
                    node.remove();
                    ok( horn.isAttached( node) === false);
                }
            });
    });




test(
    "isDefinedNotNull - null.",
    function() {
        ok( new Horn().isDefinedNotNull( null) === false);
    });

test(
    "isDefinedNotNull - undefined.",
    function() {
        ok( new Horn().isDefinedNotNull( undefined) === false);
    });

test(
    "isDefinedNotNull - {}.",
    function() {
        ok( new Horn().isDefinedNotNull( {}) === true);
    });

test(
    "isDefinedNotNull - false.",
    function() {
        ok( new Horn().isDefinedNotNull( false) === true);
    });




test(
    "indexOf - testing null, undefined, and empty containers and values.",
    function() {
        ok( new Horn().indexOf( null, null) === -1);
        ok( new Horn().indexOf( undefined, null) === -1);
        ok( new Horn().indexOf( [], null) === -1);

        ok( new Horn().indexOf( null, undefined) === -1);
        ok( new Horn().indexOf( undefined, undefined) === -1);
        ok( new Horn().indexOf( [], undefined) === -1);
    });

test(
    "indexOf - single entry array containing our target.",
    function() {
        ok( new Horn().indexOf( [0], 0) === 0); }
    );
test(
    "indexOf - our entry at last position of array.",
    function() {
        ok( new Horn().indexOf( [1, 0], 0) === 1); }
    );
test(
    "indexOf - first index returned from multiple, initial position target.",
    function() {
        ok( new Horn().indexOf( [0, 0], 0) === 0); }
    );
test(
    "indexOf - medial position target.",
    function() {
        ok( new Horn().indexOf( [1, 0, 1], 0) === 1); }
    );
test(
    "indexOf - that case is strictly compared for string/number.",
    function() {
        ok( new Horn().indexOf( [0, "1"], 1) === -1); }
    );
test(
    "indexOf - various container item type test.",
    function() {
        ok( new Horn().indexOf( [0, false, true, {}, "-1", -1], -1) === 5); }
    );




test(
    "isPathDefined - horn.isPathDefined( null) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isPathDefined( null) === false);
    });

test(
    "isPathDefined - horn.isPathDefined( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isPathDefined( undefined) === false);
    });

test(
    "isPathDefined - horn.isPathDefined( '') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isPathDefined( '') === false);
    });

test(
    "isPathDefined - horn.isPathDefined( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isPathDefined( ' ') === false);
    });

test(
    "isPathDefined - horn.isPathDefined( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isPathDefined( 'null') === true);
    });

test(
    "isPathDefined - horn.isPathDefined( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isPathDefined( 'a') === true);
    });




test(
    "isAttached - false for an unknown element.",
    function() {
        ok( new Horn().isAttached( $('#11li1l1i0o0o00')) === false);
    });

test(
    "isAttached - false for an attached element.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div id="grabMe">value</div>')}
            ],
            callback: function( horn ) {
                ok( new Horn().isAttached( $('#grabMe')) === true);
            }}
        );
    });

test(
    "isAttached - false after removing a previously attached element.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div id="grabMe">value</div>')}
            ],
            callback: function( horn ) {
                ok( new Horn().isAttached( $('#grabMe')) === true);
                $('#grabMe').remove();
                ok( new Horn().isAttached( $('#grabMe')) === false);
            }}
        );
    });

test(
    "isAttached - true after attaching a previously unattached element.",
    function() {
        ok( new Horn().isAttached( $('#grabMe')) === false);
        dataTest( {
            nodes: [ {
                nodes:  $('<div id="grabMe">value</div>')}
            ],
            callback: function( horn ) {
                ok( new Horn().isAttached( $('#grabMe')) === true);
            }}
        );
    });




test(
    "option : setting arbitrary (unsupported) option and retrieving.",
    function() {
        dataTest( {
            callback: function( horn ) {
                var name = "d";
                var value = "x";
                horn.option( name, value);
                ok( horn.option( name) === value);
            }});
    });

test(
    "option : defaultModel",
    function() {
        dataTest( {
            callback: function( horn ) {
                var model = {
                    notices: [],
                    newNotice: { title: 'testTitle' }
                };
                horn.option( "defaultModel", model);
                horn.bind();
                var extractedModel = horn.model();
                ok( extractedModel === model);

                ok( isObject( extractedModel));
                ok( isArray( extractedModel.notices));
                ok( extractedModel.notices.length === 0);
                ok( isObject( extractedModel.newNotice));
                ok( countOwnProps( extractedModel) === 2);
                ok( countOwnProps( extractedModel.newNotice) === 1);
                ok( extractedModel.newNotice.title === 'testTitle');
            }});
    });




test(
    "pathToTokens - Check 'false' type values..",
    function() {
        var horn = new Horn();
        ok( horn.pathToTokens( undefined) === undefined);
        ok( horn.pathToTokens( null) === undefined);
        ok( horn.pathToTokens( ) === undefined);
        ok( horn.pathToTokens( "") === undefined);
    });

test(
    "pathToTokens - Sanity check on documented example.",
    function() {
        var horn = new Horn();
        ok( arrayCompare( horn.pathToTokens( "-a-0-b-2-2"), ['a', '0', 'b', '2', '2']));
    });

test(
    "pathToTokens - Checking token lengths.",
    function() {
        var horn = new Horn();
        ok( arrayCompare( horn.pathToTokens( "-a0-0-b0b-21-222"), ['a0', '0', 'b0b', '21', '222']));
    });

test(
    "pathToTokens - Checking trailing dereference operators.",
    function() {
        var horn = new Horn();
        ok( arrayCompare( horn.pathToTokens( "-a----"), ['a']) === false);
    });

test(
    "pathToTokens - Checking leading dereference operators.",
    function() {
        var horn = new Horn();
        ok( arrayCompare( horn.pathToTokens( "-----a"), ['a']) === false);
    });

test(
    "pathToTokens - Checking extra dereference operators.",
    function() {
        var horn = new Horn();
        ok( arrayCompare( horn.pathToTokens( "-a--b-a"), ['a', 'b', 'a']) === false);
    });

test(
    "pathToTokens - Checking initial underscores are removed.",
    function() {
        var horn = new Horn();
        ok( arrayCompare( horn.pathToTokens( "_a-b-a"), ['a', 'b', 'a']) === true);
    });



test(
    "removeProperty - that we can remove a new object's property X.",
    function() {
        var horn = new Horn();

        ok( horn.removeProperty( {"a": "b"}, "a"));
    });

test(
    "removeProperty - that we can't remove a property that doesn't exist.",
    function() {
        var horn = new Horn();
        var propertyName = "ajsdjfklsadjkfljlksadjfkljsdklfjlksadjf";
        var testObj = {};

        ok( testObj[ propertyName] === undefined);
        ok( !horn.removeProperty( testObj, propertyName));
    });

test(
    "removeProperty - removal of known property is reported as have being removed and is actually removed.",
    function() {
        var testObj = {};
        ok( testObj.propertyName === undefined);

        var horn = new Horn();
        testObj.propertyName = "propertyValue";

        ok( horn.removeProperty( testObj, "propertyName") === true);
        ok( testObj.propertyName === undefined);
    });




test(
    "reset - resets arbitrary set property.",
    function() {
        var horn = new Horn();
        var name = "d";
        var value = "x";
        horn.option( name, value);
        horn.reset();
        ok( horn.option( name) === undefined);
    });




test(
    "scope - that we do indeed get a new scope chain head (or not).",
    function() {
        var horn = new Horn();
        var fn = function() { return this.key; };
        var rv = horn.scope( fn, {key: 'value'})();
        ok( rv === 'value');

        horn = new Horn();
        fn = function() { return this.key; };
        rv = fn();
        ok( rv === undefined);
    });

test(
    "scope - that arguments passed are preserved.",
    function() {
        var fn = function( arg1, arg2, arg3 ) {
            ok( arg1 === undefined);
            ok( arg2 === true);
            ok( arg3 === "true");
        };
        new Horn().scope( fn)( undefined, true, "true");
    });




test(
    "splitEach - that an empty string doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( "", function( token ) { passed = false; }, "");
        ok( passed);
    });

test(
    "splitEach - called on a single delimiter doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( " ", function( token ) { passed = false; }, " ");
        ok( passed);
    });

test(
    "splitEach - single token from a \"test\" string with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var count = 0;
        horn.splitEach( "    test     ",
            function( token ) {
                count++;
                ok( token === "test");
            }, " ");
        ok( count === 1);
    });

test(
    "splitEach - three tokens from \"  x    y     z\" with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var count = 0;
        var expected = ['x', 'y', 'z'];
        horn.splitEach( "  x    y     z",
            function( token ) {
                ok( expected[ count++] === token);
            }, " ");
    });

test(
    "splitEach - three tokens from \"__x____y_____z_____\" with trimming with non default \"_\" delimiter.",
    function() {
        var horn = new Horn();
        var count = 0;
        var expected = ['x', 'y', 'z'];
        horn.splitEach( "__x____y_____z_____",
            function( token ) {
                ok( expected[ count++] === token);
            }, "_");
    });

test(
    "splitEach - that regex isn't supported.",
    function() {
        var horn = new Horn();
        horn.splitEach( "abc",
            function( token ) {
                ok( token === "abc");
            }, ".");
    });

test(
    "splitEach - returning 'false' backs out.",
    function() {
        var horn = new Horn();
        var count = 0;
        var expected = ['x'];
        horn.splitEach( "__x____y_____z_____",
            function( token ) {
                ok( token === 'x');
                ok( count++ === 0);
                return false;
            }, "_");
    });




test(
    "traverse - sanity check a simple graph visitation with no path.",
    function() {
        var horn = new Horn();
        var graph = {a: "value", b: {c: [1]}};
        var count = 0;
        var expected = [
            ["-a",          "value",    graph, "a"],
            ["-b-c-0",      1,          graph.b.c, 0]
        ];
        var f = function( path, value, context, propName ) {
            ok(path === expected[ count][ 0]);
            ok(value === expected[ count][ 1]);
            ok(context === expected[ count][ 2]);
            ok(propName === expected[ count++][ 3]);
        };
        horn.traverse( graph, f);
    });

test(
    "traverse - more nested example with a path prefix.",
    function() {
        var horn = new Horn();
        var graph = {
            a: [
                "zero",
                1,
                {
                    b: "one"}],
            c: {
                d: [ true, [ false]]}};
        var count = 0;
        var expected = [
            ["-a-0",        "zero", graph.a,            0],
            ["-a-1",        1,      graph.a,            1],
            ["-a-2-b",      "one",  graph.a[2],         "b"],
            ["-c-d-0",      true,   graph.c.d,          0],
            ["-c-d-1-0",    false,  graph.c.d[1],       0]
        ];
        var prefix = "-test-path-0";
        var f = function( path, value, context, propName ) {
            ok(path === prefix + expected[ count][ 0], "path : " + path + " <> " + expected[ count][ 0]);
            ok(value === expected[ count][ 1], "value");
            ok(context === expected[ count][ 2], "context");
            ok(propName === expected[ count++][ 3], "propName");
        };
        horn.traverse( graph, f, prefix);
    });




test(
    "walkDOM - count all visited nodes from html node downwards via two methods. ",
    function() {
        var nodeData = function( node ) { return {a: 1}; }
        var expected = [];
        walk( $('html')[0], function( node ) { expected.push( node); } );
        var actual = [];
        new Horn().walkDOM( $('html'),
            function( node, path ) { actual.push( node); return true; } );
        ok( expected.length, actual.length);
    });




test(
    "walkDOM - count all visited nodes from html node downwards via two methods. ",
    function() {
        var nodeData = function( node ) { return {a: 1}; }
        var expected = [];
        walk( $('html')[0], function( node ) { expected.push( node); } );
        var actual = [];
        new Horn().walkDOM( $('html'),
            function( node, path ) { actual.push( node); return true; } );
        ok( expected.length, actual.length);
    });




module( "horn-converters-1.0.js");

test(
    "that we have the expected global (window) hornConverter property.",
    function() { ok( window.hornConverter instanceof HornPatternConverter ); });

test(
    "toRegularExpression - various",
    function() {
        ok( hornConverter.toRegularExpression( "a") === "a");
        ok( hornConverter.toRegularExpression( "a[0]") === "a\\[0\\]");
        ok( hornConverter.toRegularExpression( "a[0].y") === "a\\[0\\]\\.y");
        ok( hornConverter.toRegularExpression( "x.y") === "x\\.y");
        ok( hornConverter.toRegularExpression( "x.y") === "x\\.y");
        ok( hornConverter.toRegularExpression( "x.y*") === "x\\.y.*");
        ok( hornConverter.toRegularExpression( "x.*y") === "x\\..*y");
        ok( hornConverter.toRegularExpression( "*.*x.y") === ".*\\.*x\\.y");
    });

test(
    "get - unregistered converter is undefined",
    function() {
        ok( hornConverter.get( "") === undefined);
    });