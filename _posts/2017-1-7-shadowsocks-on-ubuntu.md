---
layout: post
title:  "搬瓦工vps（BandwagonHost）和shadowsocks搭建vpn，访问google成功"
categories: "freedom_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2017-06-17 10:27:26 Utk
---
<br>
# shadowsocks服务器搭建
具体搭建过程参考[Centos搭建Shadowsocks的教程，并用浏览器成功访问Google](http://www.xxkwz.cn/1495.html)，    
其中服务器可以使用帮瓦工的服务器，这个服务器除了做shadowsocks服务器外，还可以做GIT、APPACHE等，其实就是一个Centos系统，所以性价比还是蛮高的。

<br>
# shadowsocks客户端设置
Windows的版本就不多说了，很多例子，上面的链接中也给出了，说明一下linux的系统，如Ubuntu。

1. 安装依赖选项，否则下面编译会出错。

    ```sh
    sudo apt-get install qrencode libbotan1.10-dev libqrencode-dev libzbar0 libappindicator1 libzbar-dev appindicator-0.1 libappindicator-dev
    ``` 
<!--more-->
2. 下载[libQtShadowsocks源码](https://github.com/shadowsocks/libQtShadowsocks/releases)，完成库的[编译](https://github.com/shadowsocks/libQtShadowsocks/wiki/Compiling)，因为后面的GUI会用到。
3. 下载[界面应用](https://github.com/shadowsocks/shadowsocks-qt5/releases)，然后进行编译，但是需要安装依赖项，第一步已经进行。然后进行安装即可。

    ```sh
    qmake INSTALL_PREFIX=/usr
    make
    sudo make install
    ```
4. 打开./ss-qt5，设置如下图所示。

    <img src="/images/shadowsocks.png">
5. 最后设置浏览器，跟Windows一样，这里就不多做介绍了，更多问题还是请访问[源网页](https://github.com/shadowsocks)。

<br>
# 购买
如未购买服务器，但想以开发价入手一个帐号，请联系我！
