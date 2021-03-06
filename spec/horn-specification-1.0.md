---
title: HORN 1.0 Specification
layout: default
---

HORN - HTML Object RepresentatioN Specification 1.0                                                                     
===================================================                          
                                                                             
This is a specification for inlining model data into your HTML pages.

This means that your HTML can be used for the presentation of the view to the
site user, as well as being parsed out by machines - typically by JavaScript
in your page to build up the data model for your client code. This leverages
the power of the ideas from the microformats movement in a simple way for any
data schema.

By doing this, you save duplication of data and/or an AJAX round-trip on first
page load, and you have SEO-friendly data in your pages. The page your user
sees first is real semantic content.

Even more importantly, this means that your JS UI code is no longer fragile
with respect to design-related changes. You don't select nodes to find data,
you address your model directly.

In a nutshell, by clever use of CSS classes (or HTML5 data attributes for 
newer browsers) and adding where necessary a few &lt;span&gt; or other tags to your
markup, you can provide a rich data model to your JS code from your HTML
content.

*NOTE:* This specification only sets out how to embed your data in the HTML,
and is completely independent of any parser implementation that may extract
this data for use in client applications. There is a JavaScript reference
implementation provided for use in real sites.

## Overview

The basic premise of this specification is to use [microformat][microformats]-like techniques
to embed data in your HTML output that will be used by your scripting code
(JavaScript).

By using certain CSS classes or HTML5 data attributes in combination with
regular HTML tags, you can embed data that the user sees immediately on page
load that is also then used by the scripted code also. Your client-side data
model becomes part of the page.

Take a simple example: a page that displays a list of books, their titles and
authors - and you want the user to be able to edit and update this using
JavaScript.

With HORN you can have this HTML page render correctly without any Javascript
running, but when JavaScript does run, it has access to the array of books and
their fields - simply by calling a HORN function on page load.

Your UI can then allow the user to change data, maybe you will post it to the
server via AJAX and once confirmed, you can use HORN to automatically
re-populate the DOM nodes with the new data for that book.

This approach decouples your JavaScript from the HTML layout of the page, as
your code is not searching for DOM nodes in specific places to extract the
information it needs, the data goes back to where it originally came from.

Different data types can be parsed out of the HTML as required, with
declarative support for this in the reference implementation.

See the ["example" folder][examples] for a working example using the [jQuery reference
implementation][refimpl].

## Weaving data into your content

There are a few different ways to inline your data in your HTML:

* Literal text seen by the user and extracted as data 
* Literal text seen by the user with an alternative value used in the data model
* Literal JSON data objects 

To define data for the model, you need to have a name for it. All data is a
property of a named object in your model "graph".

You do this by adding indicators to DOM elements. 

### What are indicators?


Indicators tell HORN what to do with your DOM content that represents data.

Indicators are either special CSS classes or HTML5 data attributes, depending
on your application's preference for browser support.

There are three kinds of indicator in HORN:

1. Root object indicator - tells HORN the base property path to apply to data in descendent DOM nodes 
2. Property path indicator - tells HORN the property path to use for the data in the DOM node
3. Inline JSON indicator - tells HORN that the data is actually to be parsed from an inline JSON object

## Indicators in CSS

When you are not using HTML5, you define your indicators as CSS classes on a DOM element.
The class name you use defines the object/value name. The only other
requirement is that some ancestor in the DOM has the "horn" class, to indicate
that nodes under that should be scanned for data. This saves HORN parsers from
scanning your entire DOM which might be slow in some browsers on complex
pages, and tells them which DOM nodes begin new "root level" data objects,
rather than nested objects.

So, to begin the data definition for a single top-level book object:

{% highlight html %}
<div class="horn _book">
  ...
</div>
{% endhighlight %}

This HTML indicates that data for the "book" object will be defined within
this div and its descendent nodes. The underscore prefix indicates to HORN
that this is the name (minus the underscore) of your object and will be stored
as the "book" property in the root of your data model.

The rest of the examples in this specification use the CSS class indicators,
but will all work in HTML5 as-is, or can be modified to use <a href="#indicators_in_html5">HTML 5 Data Attributes</a>.

So now we need to add the title and author information:

{% highlight html %}
<div class="horn _book">
    <h1 class="_title">Presentation Zen</h1>
    <p>by <span class="_authors">Garr Reynolds</span>.</p>
</div>
{% endhighlight %}

The first CSS class on the div is "horn". This tells HORN that you are
starting a new root level object definition as mentioned in the previous
example, and "_book" tells it the name of this object is "book".

By using \_title and \_authors as classes, we are indicating HORN properties
"book.title" and "book.authors" - because they are in DOM nodes that are
descendants of the div with "horn" class. This is all you need to do to
indicate that the text inside the DOM node is a HORN value.

After applying the reference JavaScript implementation of HORN we would end up
with the equivalent of this data object accessible to our code:

{% highlight javascript %}
{ 'book': { 'title':'Presentation Zen', 'authors':'Garr Reynolds' } }
{% endhighlight %}

Of course the most important part here is that this is also immediately
displayed to the user even without JS code loaded or running, and indexable by
search engines. When your JS code changes it later, it can feed straight back
into the DOM nodes.

Now let's say we want to show the genre, but internally this genre is
represented by a code or unique id - we use the HTML &lt;abbr&gt; tag:

{% highlight html %}
<div class="horn _book">
    <h1 class="_title">Presentation Zen</h1>
    <p>
        by <span class="_authors">Garr Reynolds</span> 
        in genre <abbr class="_genre" title="GENRE_BUSINESS">Business</abbr>.
    </p>
</div>
{% endhighlight %}

This is declaring that while the display value of the genre is "Business", the
value to put into "book.genre" is "GENRE_BUSINESS".

Next let's add the publication date. However for the sake of usability we may
be showing a short date to the user, but we still need the full date object
for our JS code to work with:

{% highlight html %}
<div class="horn _book">
    <h1 class="_title">Presentation Zen</h1>
    <p>
        Written by <span class="_authors">Garr Reynolds</span> 
        in genre <abbr class="_genre" title="GENRE_BUSINESS">Business</abbr>
        published <abbr class="_publishDate" title="10/02/2011">10 Feb</abbr>.
    </p>
</div>
{% endhighlight %}

Here, you will typically want the parser implementation to convert the date
string into a native JavaScript date. This is not something covered by the
HORN specification itself, but the [HORN 1.0 reference implementation allows
you to do this](/horn/reference-implementations/jquery/manual.html#converters).

Now we might also need to add some unique id information so that we can tally
up this object to the book in the database during AJAX calls. For this we use
in inline json mechanism:

{% highlight html %}
<div class="horn _book">
    <p class="data-json hidden">{ 'id':384855 }</p>
    <h1 class="_title">Presentation Zen</h1>
    <p>
        Written by <span class="_authors">Garr Reynolds</span> 
        in genre <abbr class="_genre" title="GENRE_BUSINESS">Business</abbr>
        published <abbr class="_publishDate" title="10/02/2011">last month</abbr>.
    </p>
</div>
{% endhighlight %}

Now this isn't something we necessarily want the user to see, so we may apply
a "hidden" CSS class to the content (this is not defined as part of the specification).

What this does is tell your HORN parser that the text nodes inside the &lt;p&gt; tag
with "data-json" are to be merged with the "current" object. Current object
means the object named by the nearest element with the "horn" class in DOM
ancestry terms.

So with all the above, we'd end up with a data model the equivalent of this
JSON data model:

{% highlight javascript %}
{ 
   'book': { 
        'title': 'Presentation Zen', 
        'authors': 'Garr Reynolds',
        'genre': 'GENRE_BUSINESS',
        'publishDate': new Date(234857489357),
        'id': 384855
    } 
}
{% endhighlight %}

How you access this is up to the parser implementation you use, but for
example the jQuery reference implementation you will use something like:

{% highlight javascript %}
var myModel = horn.model();
{% endhighlight %}

The [jQuery reference
implementation](/horn/reference-implementations/jquery/manual.html)
automatically extracts the data on page load by default.

### Property path indicators in CSS

For pre-HTML5 applications, the HORN specification uses CSS classes to
indicate root contexts and property paths. For HTML5 it uses data
attributes.

The constraints on valid characters in CSS classes mean that we have to use a
slightly awkward syntax to provide identifiable classes that can act as
property paths. 

Path indicators always start with an *underscore* but any nested property
access is expressed using a *minus* instead of a period. Array element
indexing is performed the same way, omitting the square braces and just using
the index number as a property. This works well because Javascript treats
arrays as objects.

<table>
    <tr><th>Property path</th><th>CSS class</th></tr>
    <tr><td>book</td><td>_book</td></tr>
    <tr><td>book.title</td><td>_book-title</td></tr>
    <tr><td>books[0]</td><td>_books-0</td></tr>
    <tr><td>books[0].title</td><td>_books-0-title</td></tr>
    <tr><td>books[3].authors[2].name.firstName</td><td>_books-3-authors-2-name-firstName</td></tr>
</table>

These show absolute property paths. In most common usage however you will use
property paths relative to the nearest ancestor's calculated path:

{% highlight html %}
<div class="horn _books">
    <div class="_0">
        <span class="_title">XML Complete</span><br/>
        by <span class="_author">by Steven Holzner</span><br/>
        <ol>
            <li>Publisher: <span class="_publisher">McGraw-Hill</span></li>
            <li>ISBN: <span class="_isbn">0-079-13702-4</span></li>
            <li>Pages: <span class="_pages">600</span></li>
            <li>Price: $<span class="_price">44.95</span></li>
            <li>Publication Date: <span class="_pubDate">01 December 1997</span></li>
        </ol>
    </div>
</div>
{% endhighlight %}

You can see here that inner elements have spans defining data properties which
will be set on books\[0].

## Indicators in HTML5

As you have seen, indicators for pre-HTML5 apps use special CSS class name
conventions. The HTML5 equivalents are as follows:

* data-horn - an absolute or relative property path 

* data-horn-json - as data-horn but also indicating that the value is a JSON
  literal.

Because there are less restrictions on the characters used in a regular HTML
attribute, we can have fewer constructs by supporting a leading "/" to
indicate whether a property path indicator is relative or "root" level, and we
can use regular JavaScript property and array notation:

Define a root level object: 

{% highlight html %}
<div data-horn="/books[3]">
..
</div>
{% endhighlight %}

Define a relative value: 

{% highlight html %}
<span data-horn="title">The Definitive Guide To Grails</span>
{% endhighlight %}

Or a relative inline JSON value:

{% highlight html %}
<span data-horn-json="metadata" class="hidden">{ something: 'here' }</span>
{% endhighlight %}

...and finally an absolute JSON value:

{% highlight html %}
<span data-horn-json="/books[3].metadata" class="hidden">{ something: 'here' }</span>
{% endhighlight %}

These attributes all define the property path for the value defined by this
DOM node, which will be parsed out of the document in the normal way (using
the rules defined in the next section). 

What is different here from CSS:

1. You can use full JavaScript property dereferencing notations, no
underscores or other tricks, and support for leading "/" to indicate
root-level property indicator.
2. You only need one of these attributes on any given DOM node, they are not
additive like the CSS classes can be.

## The rules: how HORN knows what is a value

HORN parsers apply some simple rules to determine whether or not a tag contains a
data value and what to do with it:

1. If a DOM element is marked as a HORN context root (has class "horn") and
has a property path (has class like "\_yourpropname"), a new root-level data
object will be declared.
2. If a DOM element is NOT marked as a HORN context root, and has only a
property path indicated:
   AND a) it has only text nodes as children, it will be used to set a property 
      (according to the path defined) on the "current" object.
   OR  b) if the tag is an &lt;abbr&gt; tag, the "title" attribute will be used to set
      the value.
   OR  c) Otherwise it will just be added to the current property path.
3. If a DOM element has the data-json indicator and a property path, the text
of the child nodes will be parsed as JSON and merged into the model relative
to the current property path.
4. If a DOM element has no HORN indicators on it, it is ignored.

## Complex data: nested objects and arrays

HORN fully supports object graphs and arrays.

To specify that an element is part of an array, you simply make the property
path include a numeric identifier that is the array index. HORN
implementations treat this as an array index and create a JS array to contain
the values or objects:

{% highlight html %}
<div class="horn _books">
    <div class="_0">
        <p class="data-json hidden">{ 'id':384855 }</p>
        <h1 class="_title">Presentation Zen</h1>
        <p>
            Written by <span class="_authors">Garr Reynolds</span> 
            in genre <abbr class="_genre" title="GENRE_BUSINESS">Business</abbr>
            published <abbr class="_publishDate" title="10/02/2011">last month</abbr>.
        </p>
    </div>

    <div class="horn _books-1">
        <p class="data-json hidden">{ 'id':384855 }</p>
        <h1 class="_title">Reality Check</h1>
        <p>
            Written by <span class="_authors">Guy Kawasaki</span> 
            in genre <abbr class="_genre" title="GENRE_BUSINESS">Business</abbr>
            published <abbr class="_publishDate" title="13/10/2010">last year</abbr>.
        </p>
    </div>
</div>
{% endhighlight %}

The above defines a "books" property in the model that will be an array with
two elements, 0 and 1.

To nest objects, for example a publisher information object, you simply nest
DOM nodes and apply property name indicators:

{% highlight html %}
<div class="horn _books-0">
    <p class="data-json hidden">{ 'id':384855 }</p>
    <h1 class="_title">Presentation Zen</h1>
    <p>
        Written by <span class="_authors">Garr Reynolds</span> 
        in genre <abbr class="_genre" title="GENRE_BUSINESS">Business</abbr>
        published <abbr class="_publishDate" title="10/02/2011">last month</abbr>.
    </p>
    <div class="_publisher">
        <h2 class="_name">New Riders</h2>
    </div>
</div>
{% endhighlight %}

This defines "books\[0].publisher.name" as "New Riders".

## Authors / Contact

[Chris Denman](http://github.com/wangjammer7) (cjd@anyware.co.uk)  
[Marc Palmer](http://github.com/marcpalmer) (marc@anyware.co.uk)


[microformats]: http://microformats.org/
[examples]: https://github.com/marcpalmer/HORN/tree/master/example
[refimpl]: https://github.com/marcpalmer/HORN/tree/master/reference-implementations