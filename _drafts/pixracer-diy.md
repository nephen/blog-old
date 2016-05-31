---
layout: post
title:  "初学pixracer之diy硬件"
categories: "drons_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2016-05-31 16:29:55 Utk
---
>`通知`：**如果你对本站无人机文章不熟悉，建议查看[无人机学习概览](/arrange/drones)！！！**   

#原理图及pcb制作
参考[pixracer](https://pixhawk.org/modules/pixracer)进行定制。

#原料购买
[mpu9250](https://www.1688.com/chanpin/-6D70752D39323530.html)/[LP5907-Q1](https://detail.tmall.com/item.htm?id=521474279154&cm_id=140105335569ed55e27b&abbucket=20)

#bootloader下载
从官网下载源码并进行编译上传，上传方法可以参考[pix方法](https://pixhawk.org/dev/bootloader_update)。

```sh
~ $ git clone https://github.com/PX4/Bootloader.git
~ $ cd Bootloader
~ $ make px4fmuv4_bl
~ $ st-flash write px4fmuv4_bl.bin 0x8000000
```

##dfu下载

参考文章：[dfu-util](http://www.seeedstudio.com/wiki/Dfu-util)/[build-dfu](http://dfu-util.sourceforge.net/build.html)
