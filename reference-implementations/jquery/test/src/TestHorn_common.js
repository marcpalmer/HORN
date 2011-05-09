module( "TestHorn - Horn Miscellany");

test(
    "Features - Test that features have been applied to the prototype.",
    function() {
        ok( isObject( Horn.prototype.features));
        var horn = new Horn();
        ok( isObject( horn.features));
    }
);

test(
    "Features - Test new Horn instances have features.",
    function() {
        var horn = new Horn();
        ok( isObject( horn.features));
    }
);

test(
    "Features - Test applied feature has INDICATOR_ROOT function.",
    function() {
        var horn = new Horn();
        ok( isFunction( horn.features.INDICATOR_ROOT));
    }
);

test(
    "Features - Test applied feature has INDICATOR_JSON function.",
    function() {
        var horn = new Horn();
        ok( isFunction( horn.features.INDICATOR_JSON));
    }
);

test(
    "Features - Test applied feature has INDICATOR_PATH function.",
    function() {
        var horn = new Horn();
        ok( isFunction( horn.features.INDICATOR_PATH));
    }
);

test(
    "Features - Test applied feature has ROOT_NODES function.",
    function() {
        var horn = new Horn();
        ok( isFunction( horn.features.ROOT_NODES));
    }
);




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
                ok( horn.opts.patternInfo.hasOwnProperty( 'notices.*can.*') === true);
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
                ok( horn.opts.patternInfo.hasOwnProperty( 'notices.*can.*') === false);
            }});
    });

test(
    "Horn.patternDefined() - Multiple comma separated patterns suppoerted.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( 'pattern', '        notices.*Can.*        ,         test.*.*      ', 'BooleanConverter');
                ok( horn.opts.patternInfo.hasOwnProperty( 'notices.*can.*') === false);
                ok( horn.opts.patternInfo.hasOwnProperty( 'test.*.*') === false);
            }});
    });



module( "TestHorn - Horn.isAdjustingPath()");

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( null) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( null) === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( undefined) === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( '') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( '') === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( ' ') === false);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( 'null') === true);
    });

test(
    "Horn.prototype.isAdjustingPath() - horn.isAdjustingPath( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( 'a') === true);
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



module( "TestHorn - Horn.prototype.splitEach()");

test(
    "Horn.prototype.splitEach() - that an empty string doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( "", "", function( token ) { passed = false; });
        ok( passed);
    });

test(
    "Horn.prototype.splitEach() - called on a single delimiter doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( " ", " ", function( token ) { passed = false; });
        ok( passed);
    });

test(
    "Horn.prototype.splitEach() - single token from a \"test\" string with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var count = 0;
        horn.splitEach( "    test     ", " ",
            function( token ) {
                count++;
                ok( token === "test");
            });
        ok( count === 1);
    });

test(
    "Horn.prototype.splitEach() - three tokens from \"  x    y     z\" with trimming as of default \" \" delimiter.",
    function() {
        var horn = new Horn();
        var count = 0;
        var expected = ['x', 'y', 'z'];
        horn.splitEach( "  x    y     z", " ",
            function( token ) {
                ok( expected[ count++] === token);
            });
    });

test(
    "Horn.prototype.splitEach() - three tokens from \"__x____y_____z_____\" with trimming with non default \"_\" delimiter.",
    function() {
        var horn = new Horn();
        var count = 0;
        var expected = ['x', 'y', 'z'];
        horn.splitEach( "__x____y_____z_____", "_",
            function( token ) {
                ok( expected[ count++] === token);
            });
    });

test(
    "Horn.prototype.splitEach() - that regex isn't supported.",
    function() {
        var horn = new Horn();
        horn.splitEach( "abc", ".",
            function( token ) {
                ok( token === "abc");
            });
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




module( "TestHorn - Horn.patternConvert()");

test(
    "patternConvert() - that it returns null if there are no matching patterns.",
    function() {

        var horn = new Horn();
        horn.metaInfo = [];

        var value = "value";
        var hornKey = "_hornKey";

        ok( horn.patternConvert( value, hornKey, false) === null);
    });

test(
    "patternConvert() - that coercing to Integers of non-json-supplied values with a match all regex pattern works as expected.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", ".*", "IntegerConverter");
                var model = horn.extract();
                ok( horn.patternConvert( "1", "_hornKey", false) === 1);
            }});
    });

test(
    "patternConvert() - that coercing to (negative) Integers of non-json-supplied values with a match all regex pattern works as expected.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", ".*", "IntegerConverter");
                var model = horn.extract();
                ok( horn.patternConvert( "-1", "_hornKey", false) === -1);
            }});
    });

test(
    "patternConvert() - no coercion if no matching regex against the value's hornKey.",
    function() {
        var node = $('<meta name="typeof noMatch" content="IntegerConverter" />');
        node.appendTo( $('head'));
        try {
            var horn = new Horn();
            horn.extract();

            ok( horn.patternConvert( "-1", "_hornKey", false) === null);
        } finally {
            node.remove();
        }
    });

test(
    "patternConvert() - that boolean values are coerced and parsed correctly.",
    function() {
        dataTest( {
            passConverters: true,
            callback: function( horn ) {
                horn.option( "pattern", ".*truth.*", "BooleanConverter");
                var model = horn.extract();
                ok( horn.patternConvert( "true",   "_ourtruth", false) === true);
                ok( horn.patternConvert( "tRuE",   "_ourtruth", false) === true);
                ok( horn.patternConvert( "TRUE",   "_ourtruth", false) === true);
                ok( horn.patternConvert( "false",  "_ourtruth", false) === false);
                ok( horn.patternConvert( "FaLsE",  "_ourtruth", false) === false);
                ok( horn.patternConvert( "FALSE",  "_ourtruth", false) === false);
            }});
    });



module( "TestHorn - Horn.option( ... )");

test(
    "Horn.option( ... ) - Setting pattern.",
    function() {
        dataTest( {
            callback: function( horn ) {
                horn.option( "pattern", "a", "b");
                ok( horn.opts.patternInfo.hasOwnProperty( 'a') === true);
                ok ( horn.opts.patternInfo.a.converterName === 'b');
            }});
    });

test(
    "Horn.option( ... ) - Replacing pattern.",
    function() {
        dataTest( {
            callback: function( horn ) {
                horn.option( "pattern", "a", "b");
                horn.option( "pattern", "a", "c");
                ok ( horn.opts.patternInfo.a.converterName === 'c');
            }});
    });

test(
    "Horn.option( ... ) - Setting converter.",
    function() {
        dataTest( {
            callback: function( horn ) {
                horn.option( "converter", "a", "b");
                ok ( horn.opts.converters.a === 'b');
            }});
    });

test(
    "Horn.option( ... ) - Replacing converter.",
    function() {
        dataTest( {
            callback: function( horn ) {
                horn.option( "converter", "a", "b");
                horn.option( "converter", "a", "c");
                ok ( horn.opts.converters.a === 'c');
            }});
    });

test(
    "Horn.option( ... ) - Setting arbitrary property.",
    function() {
        dataTest( {
            callback: function( horn ) {
                horn.option( "sausages", "tasty");
                ok ( horn.opts.sausages === 'tasty');
            }});
    });