---
layout: post
title:  "学习stm32f4discovery之nuttx"
categories: "drons_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2016-04-27 01:42:47 Utk
---
由于在学习开源飞控的时候接触到了nuttx操作系统，这款实时操作系统与之前接触的uCOSII和FreeRTOS不一样，它是类unix的，故想深入的了解下，这对理解飞控甚至对嵌入式系统的理解都会相当有帮助。而stm32f4discovery可以作为它的学习板，而且官方网站也提供了相应如学习资料，所以选择它作为一个学习的切入点。下面是我个人学习过程的一个小记录。

#资料查找
首先查找有关stm32f4discovery的资料，在意法半导体找到了[地址1](http://www.stmcu.org/search/?q=stm32f4discovery)/[地址2](http://www2.st.com/content/st_com/en/products/evaluation-tools/product-evaluation-tools/mcu-eval-tools/stm32-mcu-eval-tools/stm32-mcu-discovery-kits/stm32f4discovery.html)。

#nuttx下载
将nuttx进行编译，然后下载至stm32f4discovery中。
##st-link安装
首先下载[源代码](https://github.com/texane/stlink/releases)，然后进行如下的编译

```sh
$ mkdir build && cd build
$ cmake -DCMAKE_BUILD_TYPE=Debug ..
$ make
```
最后生成的命令有st-flash, st-term, st-util, st-info，并添加命令路径到~/.profile: export PATH=/home/nephne/stlink-1.2.0/build:$PATH。

jtag上面如接口图如下, 仿真器上没有缺口的那端为GND

![](http://img.my.csdn.net/uploads/201211/27/1354020256_4862.png)

![](http://img2.ph.126.net/EQv6vqNyDmKOyVN0o-QZOw==/6608630031911242241.png)

板子swd接线如下, 板子上有CN2的那端为VDD_TARGET
![](/images/swd.png)