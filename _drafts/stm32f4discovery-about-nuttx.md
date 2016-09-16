---
layout: post
title:  "学习stm32f4discovery之nuttx"
categories: "drons_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2016-09-16 17:15:16 Utk
---
由于在学习开源飞控的时候接触到了nuttx操作系统，这款实时操作系统与之前接触的uCOSII和FreeRTOS不一样，它是类unix的，故想深入的了解下，这对理解飞控甚至对嵌入式系统的理解都会相当有帮助。而stm32f4discovery可以作为它的学习板，而且官方网站也提供了相应如学习资料，所以选择它作为一个学习的切入点。下面是我个人学习过程的一个小记录。

<br>
#资料查找
首先查找有关stm32f4discovery的资料，在意法半导体找到了[地址1](http://www.stmcu.org/search/?q=stm32f4discovery)/[地址2](http://www2.st.com/content/st_com/en/products/evaluation-tools/product-evaluation-tools/mcu-eval-tools/stm32-mcu-eval-tools/stm32-mcu-discovery-kits/stm32f4discovery.html)。

<br>
#nuttx下载
将nuttx进行编译，然后下载至stm32f4discovery中，注意这块板子只能通过st-link下载，不要试图通过J-link下载！！！。

<img src="/images/stlink2.png">

文档上已经说明，可以通过板载的st-link下载该mcu程序，同时板载的st-link下载其他板子的mcu程序(需要拔掉跳线帽cn3)。

<!--more-->
##st-link安装下载
下载[源代码](https://github.com/texane/stlink/releases)，然后进行如下的编译

```sh
#依赖项安装
$ sudo apt-get install build-essential pkg-config intltool cmake libusb-1.0 libusb-1.0.0-dev libgtk-3-dev
#编译
$ cd stlink-1.2.0/
$ ./autogen.sh
$ ./configure --with-gtk-gui
$ make
#install udev rules
$ cp 49-stlinkv*.rules /etc/udev/rules.d
#生效rules
$ udevadm control --reload-rules
$ udevadm trigger
```
最后生成的命令有st-flash, st-term, st-util, st-info，并添加命令路径到~/.profile: export PATH=/home/user_name/stlink-1.2.0/build:$PATH。

```sh
$ st-flash write px4fmuv4_bl.bin 0x8000000
```
如果上面方式失效，可以试下这种方式。

```sh
#首先打开gdb server
$ st-util
#然后打开另外的终端
$ arm-none-eabi-gdb -q px4discovery_bl.elf
( gdb ) target extended-remote localhost:4242
(gdb) load crazyflie_bl.elf 0x8000000
Loading section .text, size 0x2204 lma 0x10000000
Loading section .data, size 0x54 lma 0x10002204
Start address 0x8000000, load size 8792
Transfer rate: 38 KB/sec, 2930 bytes/write.
```

<br>
#参考资料
https://pixhawk.org/modules/stm32f4discovery     
http://idsearch2011www.mobile.howtomoneyguide.com/MZpAJCashh21XKH/Getting-started-ARM-cortex-M4-STM32-with-Eclipse-in-Linux-(1-4).html