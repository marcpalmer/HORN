---
title: HORN jQuery 1.0 Reference Implementation
layout: default
---

HORN 1.0 jQuery Reference implementation
========================================

The jQuery reference implementation provides you with tools to parse HORN data
from your DOM and repopulate DOM nodes using that data, along with support for
type transformations when moving data between model and DOM, and cloning DOM
templates and populating them with data.

The horn-jquery.js file defines the Horn class which you instantiate and call
methods on. By default a single instance is created and automatically parses
your data.

You need to include a second JS file depending on whether you want to use CSS
or HTML5 indicators:

horn-jquery-CSS.js 

or

horn-jquery-HTML5.js 

The data will be parsed out and accessible via:
{% highlight javascript %}
var yourModel = horn.model();
{% endhighlight }

By default HORN will parse the data and bind to the DOM elements so that you
can update the content of DOM nodes when you change your model data so that
the user sees changes. If your UI is read-only then you can set the readOnly
option before the code runs to extract the data. Simply add this code to the \<head> section of your page after including the horn jquery JS file:
    
{% highlight javascript %}
horn.option('readOnly', true);
{% endhighlight }
    
## Methods of the Horn class

### load(args) and bind(args)
The load and bind methods pull the data out of your DOM and into the model.

You do not need to call either of these methods if you are using the default
single-instance Horn. If you create new explicit Horn instances, you will need
to call one of these as appropriate.

The only difference between the two is that load() does not bind the data to
the DOM nodes, so you cannot later call updateDOM(). The bind() call maintains
a link to all the DOM nodes that stored the data, so that you can update their
display values when the model changes.

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

You can call load/bind as many times as you like, and the data extracted will
be merged into the existing model, unless you call reset() before.

The return value of load() and bind() is your data model object.

### updateDOM(args)

Call this method to update your DOM with the data that is currently in your model.

This will look at the HORN-marked up nodes and resolve them to the data in the
model, and update their text or values as appropriate.

There is a single optional argument you can pass in the args object:

* rootNode - The jQuery object representing the DOM node to update. Used to
  limit the scope of DOM traversal if performance is an issue.

The return value is a list of DOM nodes that were affected by the update. You
may for example wish to highlight the nodes that were updated as the result of
a user action.

### unbind(propertyPath)

This method allows you to remove bindings from the model to DOM elements for a
given property path within the model. 

For example if a user deletes an entry in your UI, you will want to remove the
bindings for it so that Horn does not keep references to invalid DOM nodes.

Example:

{% highlight javascript %}
publisherDOMNode.remove();
horn.unbind('books[3].publishers[1]');
horn.model().books[3].publishers.splice(1, 1);
{% endhighlight %}

### model()

Returns the Horn data model that was extracted. You change values in this
model and can later call updateDOM() to have these propagated back to the UI.

### option(optionName) and option(optionName, value)

Call this to get/set an option on the HORN parser instance. Valid options are:

* readOnly -
* converters -

### reset()

This method will reset the Horn internal model and state, ready for re-parsing.

## Definition of Type Conversions
