module( "horn-jquery-1.0.js");

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
    "isAdjustingPath() - horn.isAdjustingPath( null) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( null) === false);
    });

test(
    "isAdjustingPath() - horn.isAdjustingPath( undefined) === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( undefined) === false);
    });

test(
    "isAdjustingPath() - horn.isAdjustingPath( '') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( '') === false);
    });

test(
    "isAdjustingPath() - horn.isAdjustingPath( ' ') === false.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( ' ') === false);
    });

test(
    "isAdjustingPath() - horn.isAdjustingPath( 'null') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( 'null') === true);
    });

test(
    "isAdjustingPath() - horn.isAdjustingPath( 'a') === true.",
    function() {
        var horn = new Horn();

        ok( horn.isAdjustingPath( 'a') === true);
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
    "removeProperty() - that we can remove a new object's property X.",
    function() {
        var horn = new Horn();

        ok( horn.removeProperty( {"a": "b"}, "a"));
    });

test(
    "removeProperty() - that we can't remove a property that doesn't exist.",
    function() {
        var horn = new Horn();
        var propertyName = "ajsdjfklsadjkfljlksadjfkljsdklfjlksadjf";
        var testObj = {};

        ok( testObj[ propertyName] === undefined);
        ok( !horn.removeProperty( testObj, propertyName));
    });

test(
    "removeProperty() - removal of known property is reported as have being removed and is actually removed.",
    function() {
        var testObj = {};
        ok( testObj.propertyName === undefined);

        var horn = new Horn();
        testObj.propertyName = "propertyValue";

        ok( horn.removeProperty( testObj, "propertyName") === true);
        ok( testObj.propertyName === undefined);
    });




test(
    "startsWith - Sanity check on random string.",
    function() {
        var horn = new Horn();
        var val = "asakmfkdsj klasdjflkdlskfldksajflkdjs f8ds ufoas dfi";

        ok( horn.startsWith( val, val.substring(0, val.length - 5)) === true);
    });

test(
    "startsWith - Check reflexivity, ie. s.startsWith( s) === true.",
    function() {
        var horn = new Horn();
        var val = "abcdefghijklmnopqrstuvwxyz";

        ok( horn.startsWith( val, val) === true);
    });

test(
    "startsWith - Test regex not supported as expected.",
    function() {
        var val = "abcdefghijklmnopqrstuvwxyz";
        var horn = new Horn();

        ok( horn.startsWith( val, ".") === false);
    });

test(
    "startsWith - doesn't trim.",
    function() {
        var val = "  ";
        var horn = new Horn();

        ok( horn.startsWith( val, " ") === true);
    });



test(
    "splitEach() - that an empty string doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( "", function( token ) { passed = false; }, "");
        ok( passed);
    });

test(
    "splitEach() - called on a single delimiter doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( " ", function( token ) { passed = false; }, " ");
        ok( passed);
    });

test(
    "splitEach() - single token from a \"test\" string with trimming as of default \" \" delimiter.",
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
    "splitEach() - three tokens from \"  x    y     z\" with trimming as of default \" \" delimiter.",
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
    "splitEach() - three tokens from \"__x____y_____z_____\" with trimming with non default \"_\" delimiter.",
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
    "splitEach() - that regex isn't supported.",
    function() {
        var horn = new Horn();
        horn.splitEach( "abc",
            function( token ) {
                ok( token === "abc");
            }, ".");
    });




test(
    "Form Elements - Testing jQuery Input element getter/setter.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $(' <input class=" " type="text" size="60" maxlength="64" id="pfBoardName" name="boardName" value="testValue" />')}
            ],
            callback: function( horn ) {
                ok( $('#pfBoardName').val() === 'testValue');
                $('#pfBoardName').val( 'newValue');
                ok( $('#pfBoardName').val() === 'newValue');
        }});
    });

test(
    "Form Elements - Testing jQuery TextArea element getter/setter.",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $(' <textarea class="span-10 text-field email-list" id="addresses" name="addresses" >testValue</textarea>')}
            ],
            callback: function( horn ) {
                ok( $('#addresses').val() === 'testValue');
                $('#addresses').val( 'newValue');
                ok( $('#addresses').val() === 'newValue');
        }});
    });




test(
    "jQuery - Sanity Testing typeof and instanceof.",
    function() {
        var node = $('<div></div>');
        ok( node instanceof jQuery );
        ok( typeof node === 'object' );
    });




test(
    "horn.option( 'defaultModel')",
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