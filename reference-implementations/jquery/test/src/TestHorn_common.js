module( "horn-jquery-1.0.js - horn miscellany");

test(
    "that we have the expected global (window) horn property.",
    function() { ok( window.horn instanceof Horn ); });




module( "horn-jquery-1.0.js - horn functions");









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
        SMUtils.each( tagData,
            function( i, n ) {
                var node = $(n);
                try {
                    node.attr( "id", "_soonToBeRemoved");
                    $('body').append( node);
                    ok( SMUtils.isAttached( node) === true);
                    ok( horn.hornNodeValue( {node: node}) === 'initialValue');
                } finally {
                    node.remove();
                    ok( SMUtils.isAttached( node) === false);
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
        SMUtils.each( tagData,
            function( i, n ) {
                var node = $(n);
                try {
                    node.attr( "id", "_soonToBeRemoved");
                    $('body').append( node);
                    ok( SMUtils.isAttached( node) === true);
                    ok( horn.hornNodeValue( {node: node}) === 'initialValue');
                    horn.hornNodeValue( {node: node, value: 'newValue'});
                    ok( horn.hornNodeValue( {node: node}) === 'newValue');
                } finally {
                    node.remove();
                    ok( SMUtils.isAttached( node) === false);
                }
            });
    });










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
    "option : setting arbitrary (unsupported) option and retrieving.",
    function() {
        SMTestUtils.dataTest( {
            callback: function() {
                var horn = new Horn();
                var name = "d";
                var value = "x";
                horn.option( name, value);
                ok( horn.option( name) === value);
            }});
    });

test(
    "option : defaultModel",
    function() {
        SMTestUtils.dataTest( {
            callback: function() {
                var horn = new Horn();
                var model = {
                    notices: [],
                    newNotice: { title: 'testTitle' }
                };
                horn.option( "defaultModel", model);
                horn.bind();
                var extractedModel = horn.model();
                ok( extractedModel === model);

                ok( SMTestUtils.isObject( extractedModel));
                ok( SMTestUtils.isArray( extractedModel.notices));
                ok( extractedModel.notices.length === 0);
                ok( SMTestUtils.isObject( extractedModel.newNotice));
                ok( SMTestUtils.countOwnProps( extractedModel) === 2);
                ok( SMTestUtils.countOwnProps( extractedModel.newNotice) === 1);
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
        ok( SMTestUtils.arrayCompare( horn.pathToTokens( "-a-0-b-2-2"), ['a', '0', 'b', '2', '2']));
    });

test(
    "pathToTokens - Checking token lengths.",
    function() {
        var horn = new Horn();
        ok( SMTestUtils.arrayCompare( horn.pathToTokens( "-a0-0-b0b-21-222"), ['a0', '0', 'b0b', '21', '222']));
    });

test(
    "pathToTokens - Checking trailing dereference operators.",
    function() {
        var horn = new Horn();
        ok( SMTestUtils.arrayCompare( horn.pathToTokens( "-a----"), ['a']) === false);
    });

test(
    "pathToTokens - Checking leading dereference operators.",
    function() {
        var horn = new Horn();
        ok( SMTestUtils.arrayCompare( horn.pathToTokens( "-----a"), ['a']) === false);
    });

test(
    "pathToTokens - Checking extra dereference operators.",
    function() {
        var horn = new Horn();
        ok( SMTestUtils.arrayCompare( horn.pathToTokens( "-a--b-a"), ['a', 'b', 'a']) === false);
    });

test(
    "pathToTokens - Checking initial underscores are removed.",
    function() {
        var horn = new Horn();
        ok( SMTestUtils.arrayCompare( horn.pathToTokens( "_a-b-a"), ['a', 'b', 'a']) === true);
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
        var nodeData = function( node ) { return {a: 1}; };
        var expected = [];
        SMTestUtils.walk( $('html')[0], function( node ) { expected.push( node); } );
        var actual = [];
        new Horn().walkDOM( $('html'),
            function( node, path ) { actual.push( node); return true; } );
        ok( expected.length, actual.length);
    });




test(
    "walkDOM - count all visited nodes from html node downwards via two methods. ",
    function() {
        var nodeData = function( node ) { return {a: 1}; };
        var expected = [];
        SMTestUtils.walk( $('html')[0], function( node ) { expected.push( node); } );
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
    "reset - can be called with the default horn instance",
    function() {
        hornConverter.reset( horn);
    });

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
