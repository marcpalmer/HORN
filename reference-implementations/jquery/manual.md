---
title: HORN jQuery Reference Implementation 1.0 
layout: default
---

HORN jQuery Reference Implementation 1.0
========================================

This is a reference implementation of a parser and UI populator for the [HORN
Specification 1.0](http://horn.io/horn/spec/horn-specification-1.0.html). You must
markup your HTML with "indicators" according to the HORN Specification in
order for this library to function.

The jQuery reference implementation provides you with tools to [parse HORN data
from your DOM](http://horn.io/) and repopulate DOM nodes using that data, along with support for
type conversions when moving data between model and DOM, and cloning DOM
templates and populating them with data.

The horn-jquery.js file defines the Horn class which you instantiate and call
methods on. By default a single instance is created and automatically parses
your data.

You need to include a second JS file depending on whether you want to use CSS
or HTML5 indicators:

horn-jquery-1.0-css.js 

or

horn-jquery-1.0-html5.js 

For example you may include the CSS indicators and core HORN implementations like this:

{% highlight html %}
<html>
  <head>
      <script src="js/horn-jquery-1.0.js" type="text/javascript"/>
      <script src="js/horn-jquery-1.0-css.js" type="text/javascript"/>
  </head>
</html>
{% endhighlight %}

The data will be automatically parsed out by the default "horn" instance and accessible via:

{% highlight javascript %}
var yourModel = horn.model();
{% endhighlight %}

By default HORN jQuery reference implementation will parse the data and bind
to the DOM elements so that you can update the content of DOM nodes when you
change your model data so that the user sees changes. If your UI is read-only
then you can set the readOnly option before the code runs to extract the data.
Simply add this code to the &lt;head&gt; section of your page after including
the horn jquery JS file:

{% highlight javascript %}
horn.option('readOnly', true);
{% endhighlight %}

## Methods of the Horn class

### load(args) and bind(args)
The *load* and *bind* methods pull the data out of your DOM and into the model.

You do not need to call either of these methods if you are using the default
single-instance Horn. If you create new explicit Horn instances, you will need
to call one of these as appropriate.

The only difference between the two is that *load* does not bind the data to
the DOM nodes, so you cannot later call *updateDOM*. The *bind* call extracts
the data and also maintains a link to all the DOM nodes that stored the data,
so that you can update their display values when the model changes.

The methods take a single object parameter with two optional arguments:

* rootNodes - A list of jQuery nodes that are to be scanned for data
* selector - a jQuery selector string to choose the correct root nodes for scanning

Neither of these arguments is necessary, as by default the CSS/HTML5
implementations will determine which are the relevant nodes to scan. In some
applications however you may wish to control this if you encounter performance
problems or have niche requirements.

Example:

{% highlight javascript %}
var secondHorn = new Horn();
secondHorn.bind('#data-area');
{% endhighlight %}

You can call *load* or *bind* as many times as you like, and the data extracted will
be merged into the existing model, unless you call *reset* before.

The return value of *load* and *bind* is your data model object.

### updateDOM(rootNode)

Call this method to update your DOM with the data that is currently in your model.

This will look at the HORN-marked up nodes and resolve them to the data in the
model, and update their text or values as appropriate.

There is a single optional parameter you can pass in:

* rootNode (_Optional_) - The jQuery object representing the DOM node to update. Used to
  limit the scope of DOM traversal if performance is an issue.

The return value is a list of DOM nodes that were affected by the update. You
may for example wish to highlight the nodes that were updated as the result of
a user action.

Example:

{% highlight javascript %}
var model = horn.model();

// Update our data model
model.books[selectedBook].authors[authorIndex].firstName = newAuthorName;

// Tell HORN to update any DOM nodes that relate to model
// values that have changed
horn.updateDOM();
{% endhighlight %}


### unbind(pattern)

This method allows you to remove bindings from the model to DOM elements for a
given property path within the model. 

For example if a user deletes an entry in your UI, you will want to remove the
bindings for it so that Horn does not keep references to invalid DOM nodes.

The pattern you pass in is a regular expression.

Example:

{% highlight javascript %}
publisherDOMNode.remove();
horn.unbind('books[3].publishers[1]');
horn.model().books[3].publishers.splice(1, 1);
{% endhighlight %}

### model()

Returns the Horn data model that was extracted. You change values in this
model and can later call *updateDOM* to have these propagated back to the UI.

Example:

{% highlight javascript %}
$( function() {
    var ourModel = horn.model();
    if (ourModel.userHasRegistered != true) {
        window.alert('You must register first!');
    }
});
{% endhighlight %}

### bindTo(args)

This method will populate a DOM node and its descendents using this
information, pulling values in from the model and binding from the
model to the DOM nodes so that calls to *updateDOM* can re-populate the DOM
when data is changed.

It will also optionally clone a DOM node template first, and bind into that.

This is useful for UIs where the user can create new "entries" that follow a
DOM template. You update your model with the data, and then call this function
to create the on-screen representation.

Arguments:

* template (_Optional_) - A jQuery object or selector string, indicating DOM node to _clone_ and use as the target for binding
* node (_Optional_) - A jQuery object or selector to use as the target for binding, *without cloning first*
* path (_Optional_) - The property path to which the DOM node should be bound. The data at
  this path in the model will be used to populate the target DOM node. Alternatively use *data* to pass in data.
* data (_Optional_) - An object to use as the model to populate the node. Use this to populate with data that is not yet in the node. *updateDOM* functionality will not be available, call *bindTo* again instead.
* id (_Optional_) - The "id" attribute to set on a cloned template DOM node after cloning. Any id from the template is necessarily stripped out after cloning as duplicate ids are invalid in the DOM.

Example:

{% highlight javascript %}
$( function() {
    $('.addButton').click( function() {
        var ourModel = horn.model();
        var newIdx = ourModel.books.length;
        ourModel.books[newIdx] = { saved: false };
        
        var domNode = horn.bindTo( { 
            template:'#bookEntryTemplate', 
            path:'books['+newIdx+']' 
        });
        
        $(domNode).appendTo($('#bookList')).show();
    });
});
{% endhighlight %}

### option(optionName) and option(optionName, value)

Call this to get/set an option on the HORN parser instance. Valid options are:

* readOnly - Setting this to true prevents the auto-loader for the single
  "horn" instance from binding to DOM nodes, causing it to call load() instead
  of bind()
* defaultModel - A default model object to apply before parsing. Any data from
  the page will be merged with this.
* converter - An object that implements the convert() function to perform
  mapping to and from DOM and model. See horn-converters JS file for an
  example.

### reset()

This method will reset the Horn internal model and state, ready for re-parsing.

## Defining Type Conversions

Conversion of the text found in the page to and from native JS types is
possible using the converters mechanism. This is performed when the data is
first loaded from the page, and also when updating the DOM to contain modified
values from the model.

You can register your own named converter functions, and specify property path
patterns in your model that should have a given converter applied.

By default, *Integer* and *Boolean* converters are supplied.

The *Integer* converter will map to/from text and native JavaScript integers.

The *Boolean* converter maps "true" to boolean true, and anything else to false and vice versa.

### Implementing a custom converter

To implement a custom converter you must pass a function to *hornConverter.add*:

{% highlight javascript %}
hornConverter.add( "Date", function( args ) {
    return args.type === 'fromText' ?
        $.datepicker.parseDate( DATE_FORMAT, args.value) :
        ($.datepicker.formatDate( DATE_FORMAT, args.value));
}});
{% endhighlight %}

This example registers a Date converter that uses jQuery UI functions to parse or format a date value.

The converter functions are passed a map of arguments containing:

* value - the value to convert from
* path - the property path of the value within the model
* type - the operation type, either 'fromText' or 'toText'
* node - the DOM node that is bound to the property path

### Telling HORN which model values should be converted

Once you have added your custom converter, you can tell HORN which property
paths should have the converter applied.

To do this you just call *pattern*:

{% highlight javascript %}
hornConverter.pattern( ".*Date", "Date");
hornConverter.pattern( ".*Count", "Integer");
hornConverter.pattern( "books*.authors.total", "Integer");
hornConverter.pattern( "books*.publicDomain", "Boolean");
{% endhighlight %}

The first argument is a regular expression matching the property paths you
want to have the converter applied to, and the second argument is the name of
the converter.

