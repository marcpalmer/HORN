---
title: HORN Specification and Reference Implementations
layout: home
---

The HORN specification describes a way to weave your model data into HTML markup
such that it can be used for _both_ the presentation and data model in your
client (typically JavaScript) code.

Using special CSS classes or HTML5 attributes you indicate which parts of your
DOM are to be used as data.

There is a jQuery based reference implementation of the parser with DOM-node
re-population for full data round trip in your UI.

## Documentation

[HORN Specification 1.0](horn/spec/horn-specification-1.0.html)  
[Demo](horn/example/example.html)  

## Reference Implementations

Based on jQuery: [Download](https://github.com/marcpalmer/HORN/tree/master/reference-implementations/jquery) | [Test reports (for CSS indicators)](horn/reference-implementations/jquery/test/test.html) | [Test reports (for HTML5 indicators)](horn/reference-implementations/jquery/test/test_html5.html)  

## Download

You can download this project in either [zip](http://github.com/marcpalmer/HORN/zipball/master) or [tar](http://github.com/marcpalmer/HORN/tarball/master) formats.

You can also clone the project with Git by running:
{% highlight bash %}
$ git clone git://github.com/marcpalmer/HORN
{% endhighlight %}

## Applications and tools using HORN

[NoticeLocal](http://noticelocal.com)  
[Grails HORN Plugin](http://grails.org/plugin/horn]) - Resources and tags for Grails developers to use HORN

## Contributors / Contact

jQuery Reference Implementation: [Chris Denman](http://github.com/wangjammer7) (cjd@anyware.co.uk)  
Specification: [Marc Palmer](http://github.com/marcpalmer) ([Contact](http://www.anyware.co.uk/marc) [Twitter](http://twitter.com/wangjammer5))
Logo: [Patricia Furtado](http://pap-l.com) ([Twitter](http://twitter.com/patriciafurtado))

