---
title:
  Scriptless attack—Use Unobtrusive scripting in malicious way(Bypassing XSS
  Mitigations Via Script Gadgets)
date: 2016-07-25 00:00:00 +02:00
categories:
  - XSS
  - CSRF
  - Jquery
layout: post
excerpt: Stored on-site request forgery
comments: false
---

> 13/06/2017: This attack was coined as [Bypassing XSS Mitigations Via Script Gadgets](https://www.youtube.com/watch?v=p07acPBi-qw)

Probably You have experienced a situation which your context based XSS payload,composed of javascript command; event handlers and HTML tags, is removed by XSS filters but not the data-_ attributes. The XSS filter only returns some HTML tag (`<b>`, `<a>` or `<i>` ) and tag's data-_ attributes.

## Unobtrusive scripting support for jQuery

Unobtrusive javascript is an approach of separating behavior from presentation or HTML. jQuery, a javascript framework, uses HTML 5 data-\* attribute as a way of passing data into javascript.

Crafted context based XSS payload w/ data-\* attribute could allow an attacker to call a limited javascript function. for instance, a `data-confirm` attribute executes a javascript confirm box.

### Abuse predefined data-\* attributes of Jquery

As I said before, javascript and event handlers of context based XSS payload are removed by an XSS filters but not data-_ attributes. Lucky there are predefined data-_ attributes that we could use.
The XSS filters would be bypassed through the combination of data-method, data-params, data-URL and data-remote. These data attributes can send an HTTP Request including its CSRF token to the Origin (an on-site request forgery).

Just like CSRF attack, The attack can force the user to perform state-changing requests like transferring funds, changing their email address, and so forth. But The HTTP request is coming from the same origin.

**"data-url" and "data-remote": Send AJAX request to the given url after change event on element**

```
<input type="checkbox" name="task" id="task" value="1" data-url="/tasks/1" data-remote="true" data-method="post">

```

**"data-params": Add additional parameters to the request**

```
<a data-remote="true" data-method="post" data-params="param1=Hello+server" href="/test">AJAX action with POST request</a>
```

I used `<a>` tag since XSS filters refuses `<input>`,`<form>` HTML tag, My final payload would be this

{% highlight html %}
<a data-remote="true" data-method="post" href="https://victim.com/change_email/"data-params="post_data_param_its_value">CSRF OF THE WIND</a>
{% endhighlight %}

When a victim clicks our injected `<a>` tag, the browser sends a POST HTTP request including the CSRF token that changes the email address of victim's account.
