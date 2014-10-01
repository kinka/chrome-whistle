Whistle
=======

Whistle is a chrome extension redirecting online static resources to local files. Using RegExp patterns, mapping directory or files to local workspace. We can edit sources in the Sources panel and save them directly to mapping workspace, no need to worry about missing when pages refreshed. However, we also need a proxy server transferring local files. So, I have another project [Whistle-Proxy](https://github.com/Kinka/whistle-proxy "Whistle-Proxy"), which is a chrome packaged app, acting as a http proxy webserver.
You can download it [here](/assets/whistle.crx).

![screenshot](/assets/whistle-screenshot.png)

How it works
============
As you can seen in the screenshot of whistle, the laucn button is for lanching proxy server whistle-proxy if installed. However, never mind, you do not have to use it.
Then follows the rules configuration. Now there are six lines. The left input is online static resource and the right one is local(in fact, whatever other resource is ok). And the checkbox is a switch, when it on of course redirecting is enabled.

How to write the rules? It is rather easy, because I just use **String.replace(online, local)**. For example,

__www.logger.im/static/(.*)__ as online and __127.0.0.1:8888/$1__ as local, 

and seeing __www.logger.im/static/js/app.js__ will redirect to __127.0.0.1:8888/js/app.js__.

Look, there is no protocol field. No matter http or https, it can be just redirected to local proxy in http, as my poor whistle-proxy hasn't support https yet.Of course, if you have your own server supports https protocol, just use it!


************************
If you have any suggestion or problem, please just tell [me](mailto:kinkabrain@gmail.com).
