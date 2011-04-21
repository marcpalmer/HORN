HORN 1.0 jQuery Reference implementation
========================================

The jQuery reference implementation provides you with tools to parse HORN data
from your DOM and repopulate DOM nodes using that data, along with support for
type transformations when moving data between model and DOM.

The horn-jquery.js file defines the Horn class which you instantiate and call
methods on:

var horn = new Horn();
var data = horn.parse();

This implementation uses HORN CSS classe indicators to support all browsers.

Methods
=======

parse(options)
==============

The parse method takes an optional map of options to define how you would like
the parser to operate, and which type converters you wish to use.

The return value of the parse() function is the root of your data model.

Available options include:

* storeBackRefs - set this to true if you need to re-populate the UI from the
  horn model.

* converters - a map of type names to objects implementing toText and fromText
  functions (see below)

To define a custom type converter you can do the following:

var data = horn.parse({
	storeBackRefs:true,
	converters: {
		date: function() {
		    this.toText = function( value, key, pattern ) { ... };
		    this.fromText = function( value, key, pattern ) { ... };
		}
	}
});

These functions are called on demand - toText to go from model to DOM, and
fromText to go from DOM to model.

By default if no converter is found (see defining type conversions) a one to
one mapping of the string value is used.

populate()
==========

When .populate() is called, any values that have been changed in the model
returned by horn are extracted, converted using .toText() and the
appropriate converter and the value pushed to the screen elements.

There is currently no tracking of the removal of DOM nodes.


Definition Type Conversions
===========================

To assign a named converter to a given property path in your data model, you
use the <meta> tag in your <head> section:

<meta name="typeof .*Date" content="DateConverter" />
<meta name="typeof .*pages" content="IntegerConverter" />

This uses regex patterns to tell the HORN parser to match any property path
ending in "Date" or "pages" to use the appropriate converter.

The converter must be defined in the call to parse() as detailed earlier.
