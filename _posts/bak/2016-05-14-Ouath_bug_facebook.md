---
title: Oauth security misconfiguration on facebook
date: 2016-05-14 00:00:00 +02:00
categories:
- Info Leakage
- OAUTH
- facebook
layout: post
excerpt: facebook oauth flaws
comments: true
thumbnail: japan.jpg
---

> OAuth is an open standard for authorization, commonly used as a way for Internet users to log in to third party websites using their Microsoft, Google, Facebook, Twitter, One Network etc. accounts without exposing their password.

Misconfigured OAuth setting could lead to Account take-over, CSRF attack and Token leakage(code and access token). Visit http://www.oauthsecurity.com for more list of OAUTH attacks. This blog post is about facebook Misconfigured OAuth setting that has a security impact on its users. The bugs were reported, and Facebook had mitigated the bugs Before I disclosed it.

## Quick Jump
* [Bypass moves oauth 2 redirect_uri](#x01-bypass-moves-oauth-2-redirecturi)
* [Leak mailchimp access_token via open redirector](#x02---leak-mailchimp-accesstoken-via-open-redirector)
* [Cross-site request forgery on OAuth Clients(Modifies Victim’s spotify playlist Via CSRF)](#x03---cross-site-request-forgery-on-oauth-clientsmodifies-victims-spotify-playlist-via-csrf)




## 0x01-Bypass moves(Facebook Aquisition) oauth 2 redirect_uri

I created an OAuth application which registered redirect_url is https://www.google.com/,  so it authorization_uri must not be
{% highlight text %} https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id=<client_id>&scope=<scope>&redirect_uri=https//yahoo.com

https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id=<client_id>&scope=<scope>&redirect_uri=facebook.com {% endhighlight %}

But when I changed the redirect_uri to this `https://www.google.com.ph` (appends .ph suffix domain on moves redirect_uri).  Surprisingly, it works :) Besides the redirect_uri can also be bypassed via ``/../../``. for example, if the redirect_uri is `https://www.google.com/app/url` change the redirect_uri to  ` https://www.google.com/app/url/../../ `

The flaw could be used to leak access_token of victim user to attacker's domain. 

According to the OAuth 2 documentation, the redirect_uri must be equal to registered redirect_uri
http://tools.ietf.org/html/rfc6819#page-62


## 0x02 - Leak mailchimp access_token via open redirector


Facebook sends email notification about saved link of the user every week. If the user clicks any link in his email notification, the browser will be redirected to facebook.com then redirect to the original link without the use of [Facebook linkshim](https://m.facebook.com/notes/facebook-security/link-shim-protecting-the-people-who-use-facebook-from-malicious-urls/10150492832835766/). It seems this is an Open redirector bug. 
{% highlight text %} https://www.facebook.com/saved/redirect/?user_id=100000169908395&object_id=1007549219269324&surface=saved_email_reminder&mechanism=clickable_content{% endhighlight%} The vulnerable parameter is `object_id`, we can get the `object_id` in https://www.facebook.com/saved/?cref=38 when we use using this endpoint  {% highlight text %} https://www.facebook.com/timeline/app/collection/item/curation/(used to delete saved link).{% endhighlight %}

### Exploitation

In the exploitation part, I used the open
redirect of facebook to leak access_token of MailChimp OAuth. Facebook Ads
Manager <https://www.facebook.com/ads/manage/?act=109060336> can import
MailChimp  customer data by using OAuth 2. I have found there is no
restriction of *redirect_uri* value in MailChimp OAuth (Covert Open redirect), so we can abuse the
open redirect vulnerability of facebook to leak the access_token of the victim user.

**Step of Reproduction**

*  Go to your profile then post a link (link to malicious site)
*  save the link by clicking the dropdown button on upper right of a post then click the `save link`.
*  now you need to use your `user_id` and the `object_id` of the link.
* The final open redirect PoC must be {% highlight text %}  https://www.facebook.com/saved/redirect/?user_id=100000169908395&object_id=910603298986679&surface=saved_email_reminder&mechanism=clickable_content {% endhighlight %}

* Use the `final open redirect PoC` as `redirect_uri` of mailchimp oauth 2 
i.e. {% highlight text %} https://login.mailchimp.com/oauth2/authorize?response_type=token&client_id=112041070777&redirect_uri=https%3A%2F%2Fwww.facebook.com%2Fsaved%2Fredirect%2F%3Fuser_id%3D100000169908395%26object_id%3D910603298986679%26surface%3Dsaved_email_reminder%26mechanism%3Dclickable_content {% endhighlight %}

<!--**video demo:** [facebook_oauth bug_x264_Segment_0_x264.mp4](https://trello-attachments.s3.amazonaws.com/55f04e12c197829570241a4c/57370b657cf0a4155fa203af/df77f826434f5d54984d70296dba29dd/facebook_oauth_bug_x264_Segment_0_x264.mp4)
-->
**Video Demostration**


<div class="video-container" >
<iframe width="480" height="360" src="https://www.youtube.com/embed/t3LUQTcJ-ZA" frameborder="0"> </iframe>
</div>

## 0x03 - Cross-site request forgery on OAuth Clients(Modifies Victim's spotify playlist Via CSRF), 


Facebook user can embed a spotify playlist on his facebook timeline by posting a spotify link such as this one {% highlight text %} https://play.spotify.com/album/31d6jaMCDe28dAmBv63bBY,{% endhighlight %}
on that embedded playlist, user has an option to add that playlist on his spotify account by using oauth 2, facebok uses spotify oauth 2 to do that action.


I have found that facebook uses the spotify oauth 2 without using the state parameter of the oauth, according to OAuth 2.0 Threat Model and Security Considerations and spotify oauth documentation, the state parameter is used to prevent CSRF attack on oauth(see http://tools.ietf.org/html/rfc6819#section-3.6 and https://developer.spotify.com/web-api/authorization-guide/ -'Your application requests authorization'). Because there is not csrf protection malicious user could make a csrf attack against facebook that updates victim's playlist.

### Hack Steps

* post the link on your timeline {% highlight text %} https://play.spotify.com/album/31d6jaMCDe28dAmBv63bBY) {% endhighlight %} to generate the embbed playlist then copy the authorization url of spotify. This is  the authorization url of spotify that uses by facebook {% highlight text %} https://accounts.spotify.com/en/authorize?client_id=9cc4aaeb43f24b098cff096385f00233&response_type=code&redirect_uri=https%3A%2F%2Fwww.facebook.com%2Fmusic%2Fspotify%2Fauth%2F&scope=user-library-modify+user-library-read&show_dialog=true {% endhighlight %}

* now removed the `&show_dialog=true` parameter of the authorization url so the final url will be {% highlight text %} https://accounts.spotify.com/en/authorize?client_id=9cc4aaeb43f24b098cff096385f00233&response_type=code&redirect_uri=https%3A%2F%2Fwww.facebook.com%2Fmusic%2Fspotify%2Fauth%2F&scope=user-library-modify+user-library-read {% endhighlight %}

* If the victim visits the PoC link, CSRF will be triggered

**video Demonstration**
csrfonouathfacebookandspotify.mp4?dl=0
