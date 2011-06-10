module( "TestHorn - copyByDest");

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
    "Horn Miscellany - check that we have all the required window.Node values expected.",
    function() {
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
        horn.splitEach( "", function( token ) { passed = false; }, "");
        ok( passed);
    });

test(
    "Horn.prototype.splitEach() - called on a single delimiter doesn't yield a callback.",
    function() {
        var horn = new Horn();
        var passed = true;
        horn.splitEach( " ", function( token ) { passed = false; }, " ");
        ok( passed);
    });

test(
    "Horn.prototype.splitEach() - single token from a \"test\" string with trimming as of default \" \" delimiter.",
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
    "Horn.prototype.splitEach() - three tokens from \"  x    y     z\" with trimming as of default \" \" delimiter.",
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
    "Horn.prototype.splitEach() - three tokens from \"__x____y_____z_____\" with trimming with non default \"_\" delimiter.",
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
    "Horn.prototype.splitEach() - that regex isn't supported.",
    function() {
        var horn = new Horn();
        horn.splitEach( "abc",
            function( token ) {
                ok( token === "abc");
            }, ".");
    });




module( "TestHorn - Horn.removeProperty()");

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




module( "TestHorn - Form Elements");

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


module( "TestHorn - jQuery");

test(
    "jQuery - Sanity Testing typeof and instanceof.",
    function() {
        var node = $('<div></div>');
        ok( node instanceof jQuery );
        ok( typeof node === 'object' );
    });




module( "TestHorn - Testing that horn.option( 'defaultModel') works as expected.");

test(
    "Model Tests - defaultModel option.",
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