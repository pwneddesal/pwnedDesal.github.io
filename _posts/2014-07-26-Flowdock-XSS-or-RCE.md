---
title: Flowdock XSS or RCE(malicious file upload)
date: 2014-07-26 00:00:00 +02:00
categories:
- XSS
- Malicious file upload
layout: post
excerpt: One day I accidentally uploaded a `.pdf` filetype on https://www.flowdock.com/oauth/applications
  page. it was sucessfuly uploaded. So I tried to upload some arbitary filetype, But
  flowdock rejected it. Flowdock backlisted all arbirtary content-type such as.....
comments: true
---

One day I accidentally uploaded a .pdf filetype on https://www.flowdock.com/oauth/applications page. it was successfully uploaded. So I tried to upload some arbitrary filetype, But flowdock rejected it. Flowdock backlisted all arbitrary content-type such as text/HTML, application/x-asp, application/x-perl. … etc.. and flowdock also checked the signature of a file that used to identify if the file is a real image or not.

**Error message when I tried to upload a shell!**

![ohh](http://2.bp.blogspot.com/-P21qQh5Oytc/U9NgEyXweRI/AAAAAAAAAPg/EnoMY0H5CXw/s1600/1.png)


**If we want to upload our shell or HTML-XSS PoC, we need to upload a real image that contains our XSS/RCE payload. I changed the EXIF header of the image and upload the file.**

![ohh](http://1.bp.blogspot.com/-gsbzUjnYGmY/U9NgGaYF46I/AAAAAAAAAPo/hB4MN-rQCBc/s1600/2.png)

### RESULT:

![ohh](http://2.bp.blogspot.com/-mnaUU_-6PTU/U9NgG4o4c-I/AAAAAAAAAP0/oDSsBwRqDTM/s1600/3.png)

![ohh](http://1.bp.blogspot.com/-bpdH-nN4tYk/U9NgKLSwt1I/AAAAAAAAAP8/hGoi7rihJN0/s1600/4.png)
## YEHH!
