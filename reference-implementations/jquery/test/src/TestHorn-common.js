module( "horn-jquery-1.0.js - horn miscellany");

test(
    "that we have the expected global (window) horn property.",
    function() { ok( window.horn instanceof Horn ); });

test(
    "test that all the public API methods are defined.",
    function() {
        var horn = new Horn();
        ok( SMUtils.isDefinedNotNull( horn.bind));
        ok( SMUtils.isDefinedNotNull( horn.blankModelEntries));
        ok( SMUtils.isDefinedNotNull( horn.bindTo));
        ok( SMUtils.isDefinedNotNull( horn.load));
        ok( SMUtils.isDefinedNotNull( horn.model));
        ok( SMUtils.isDefinedNotNull( horn.nodeForPath));
        ok( SMUtils.isDefinedNotNull( horn.option));
        ok( SMUtils.isDefinedNotNull( horn.reset));
        ok( SMUtils.isDefinedNotNull( horn.unbind));
        ok( SMUtils.isDefinedNotNull( horn.updateDOM));
    });




module( "horn-jquery-1.0.js - horn functions");




test(
    "toInternalPath - various paths.",
    function() {
        ok( Horn.toInternalPath( 'a') === 'a');
        ok( Horn.toInternalPath('a[10]') === 'a-10');
        ok( Horn.toInternalPath('[10]') === '10');
        ok( Horn.toInternalPath('[10][20]') === '10-20');
        ok( Horn.toInternalPath('x[1].y[2].z[3]') === 'x-1-y-2-z-3');
        ok( Horn.toInternalPath('x[1][2][3].y[2].z') === 'x-1-2-3-y-2-z');
    });




test(
    "toExternalPath - various paths.",
    function() {
        ok( Horn.toExternalPath( 'a') === 'a');
        ok( Horn.toExternalPath( 'a-10') === 'a[10]');
        ok( Horn.toExternalPath( '10') === '[10]');
        ok( Horn.toExternalPath( '10-20') === '[10][20]');
        ok( Horn.toExternalPath( 'x-1-y-2-z-3') === 'x[1].y[2].z[3]');
        ok( Horn.toExternalPath( 'x-1-2-3-y-2-z') === 'x[1][2][3].y[2].z');
    });




test(
    "containerFromToken - various.",
    function() {
        ok( $.isArray( Horn.containerFromToken( '0')));
        ok( $.isArray( Horn.containerFromToken( '1')));
        ok( $.isArray( Horn.containerFromToken( '01')));
        ok( $.isArray( Horn.containerFromToken( '22')));
        ok( $.isArray( Horn.containerFromToken( '32')));
        ok( $.isArray( Horn.containerFromToken( '102')));
        ok( !$.isArray( Horn.containerFromToken( 'a')));
        ok( !$.isArray( Horn.containerFromToken( '_a')));
        ok( !$.isArray( Horn.containerFromToken( '__a')));
        ok( !$.isArray( Horn.containerFromToken( '_0_a')));
    });




test(
    "hornNodeValue - get tests for various tags.",
    function() {
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
                    ok( Horn.hornNodeValue( {node: node}) === 'initialValue');
                } finally {
                    node.remove();
                    ok( SMUtils.isAttached( node) === false);
                }
            });
    });

test(
    "hornNodeValue - set tests for various tags.",
    function() {
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
                    ok( Horn.hornNodeValue( {node: node}) === 'initialValue');
                    Horn.hornNodeValue( {node: node, value: 'newValue'});
                    ok( Horn.hornNodeValue( {node: node}) === 'newValue');
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

        ok( Horn.isPathDefined( null) === false);
    });

test(
    "isPathDefined - horn.isPathDefined( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( Horn.isPathDefined( undefined) === false);
    });

test(
    "isPathDefined - horn.isPathDefined( '') === false.",
    function() {
        var horn = new Horn();

        ok( Horn.isPathDefined( '') === false);
    });

test(
    "isPathDefined - horn.isPathDefined( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( Horn.isPathDefined( ' ') === false);
    });

test(
    "isPathDefined - horn.isPathDefined( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( Horn.isPathDefined( 'null') === true);
    });

test(
    "isPathDefined - horn.isPathDefined( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( Horn.isPathDefined( 'a') === true);
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
    "pathToTokens - Check 'false' type values..",
    function() {
        ok( Horn.pathToTokens( undefined) === undefined);
        ok( Horn.pathToTokens( null) === undefined);
        ok( Horn.pathToTokens( ) === undefined);
        ok( Horn.pathToTokens( "") === undefined);
    });

test(
    "pathToTokens - Sanity check on documented example.",
    function() {
        ok( SMTestUtils.arrayCompare( Horn.pathToTokens( "-a-0-b-2-2"), ['a', '0', 'b', '2', '2']));
    });

test(
    "pathToTokens - Checking token lengths.",
    function() {
        ok( SMTestUtils.arrayCompare( Horn.pathToTokens( "-a0-0-b0b-21-222"), ['a0', '0', 'b0b', '21', '222']));
    });

test(
    "pathToTokens - Checking trailing dereference operators.",
    function() {
        ok( SMTestUtils.arrayCompare( Horn.pathToTokens( "-a----"), ['a']) === false);
    });

test(
    "pathToTokens - Checking leading dereference operators.",
    function() {
        ok( SMTestUtils.arrayCompare( Horn.pathToTokens( "-----a"), ['a']) === false);
    });

test(
    "pathToTokens - Checking extra dereference operators.",
    function() {
        ok( SMTestUtils.arrayCompare( Horn.pathToTokens( "-a--b-a"), ['a', 'b', 'a']) === false);
    });

test(
    "pathToTokens - Checking initial underscores are removed.",
    function() {
        ok( SMTestUtils.arrayCompare( Horn.pathToTokens( "_a-b-a"), ['a', 'b', 'a']) === true);
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
    "toRegularExpression - various",
    function() {
        ok( Horn.toRegularExpression( "a") === "a");
        ok( Horn.toRegularExpression( "a[0]") === "a\\[0\\]");
        ok( Horn.toRegularExpression( "a[0].y") === "a\\[0\\]\\.y");
        ok( Horn.toRegularExpression( "x.y") === "x\\.y");
        ok( Horn.toRegularExpression( "x.y") === "x\\.y");
        ok( Horn.toRegularExpression( "x.y*") === "x\\.y.*");
        ok( Horn.toRegularExpression( "x.*y") === "x\\..*y");
        ok( Horn.toRegularExpression( "*.*x.y") === ".*\\.*x\\.y");
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
        Horn.traverse( graph, f);
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
        Horn.traverse( graph, f, prefix);
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
    "get - unregistered converter is undefined",
    function() {
        ok( hornConverter.get( "") === undefined);
    });
