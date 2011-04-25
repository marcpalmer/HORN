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

/*
                                    'Key' - 'Value'         Structure
    [
        "one",                      _0 - 'one'              [S
        2,                          _1 - 2                  [I
        true,                       _2 - true               [B
        [
            "three",                _3-0 - 'three'          [[S
            4,                      _3-1 - 4                [[I
            false,                  _3-2 - false            [[B
            [
                "five",             _3-3-0 - 'five'         [[[S
                6,                  _3-3-1 - 6              [[[I
                true],              _3-3-2 - true           [[[B
            {
                k:  "seven",        _3-4-k - 'seven'        [[{:S
                l:  8,              _3-4-l - 8              [[{:I
                m:  false}],        _3-4-m - false          [[{:B
        {
            f:  "nine",             _4-f - 'nine'           [{:S
            g:  10,                 _4-g - 10               [{:I
            h:  true,               _4-h - true             [{:B
            i:  [
                "eleven",           _4-i-1 - 'eleven'       [{:[S
                12,                 _4-i-2 - 12             [{:[I
                false],             _4-i-3 - false          [{:[B
            j:  {
                n:  "thirteen",     _4-j-n - 'thirteen'     [{:{:S
                o:  14,             _4-j-o - 14             [{:{:I
                p:  true            _4-j-p - true           [{:{:B
            }
        }
    ]

    {
        a:  "one",                  _a - 'one'              {:S
        b:  2,                      _b - 2                  {:2
        c:  true,                   _c - true               {:B
        d:  [
                "three",            _d-0 - 'three'          {:[S
                4,                  _d-1 - 4                {:[I
                false,              _d-2 - false            {:[B
                [
                    "five",         _d-3-0 - 'five'         {:[[S
                    6,              _d-3-1 - 6              {:[[I
                    true],          _d-3-2 - true           {:[[B
                {
                    k:  "seven",    _d-4-k - 'seven'        {:[{:S
                    l:  8,          _d-4-l - 8              {:[{:I
                    m:  false}]],   _d-4-m - false          {:[{:B
        e:  {
                f:  "nine",         _e-f - 'nine'           {:{:S
                g:  10,             _e-g - 10               {:{:I
                h:  true,           _e-h - true             {:{:B
                i:  [
                    "eleven",       _e-i-1 - 'eleven'       {:{:[S
                    12,             _e-i-2 - 12             {:{:[I
                    false],         _e-i-3 - false          {:{:[B
                j:  {
                    n:  "thirteen", _e-j-n - 'thirteen'     {:{:{:S
                    o:  14,         _e-j-o - 14             {:{:{:I
                    p:  true        _e-j-p - true           {:{:{:B
                }
            }
    }
*/

test(
    "Model Tests - _0 - 'one'",
    function() {
        dataTest( {
            nodes: [ {
                nodes:  $('<div data-horn="true"><span data-hornPath="0">one</span></div>')}
            ],
            callback: function( horn ) {
                var model = horn.extract();
                ok( isArray( model));
                ok( model.length === 1);
                ok( model[ 0] === 'one');
            }});

    });