module( "TestHorn_HTML5 - HTML Detection");

test(
    'HTML Detection - <div data-horn="true"></div> triggers HTML5 mode.',
    function() {
        dataTest({
            nodes: [
                {
                    nodes: $('<div data-horn="true"></div>')
                }
            ],
            callback: function( horn ) {
                horn.extract();
                ok( horn.opts.html5 === true);
            }
        });
    });