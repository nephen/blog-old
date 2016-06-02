---
layout: post
title:  "初学pixracer之diy硬件"
categories: "drons_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2016-06-02 13:55:38 Utk
---
>`通知`：**如果你对本站无人机文章不熟悉，建议查看[无人机学习概览](/arrange/drones)！！！**   

<br>
#原理图及pcb制作
参考[pixracer](https://pixhawk.org/modules/pixracer)进行定制。

<br>
#原料购买
[mpu9250](https://www.1688.com/chanpin/-6D70752D39323530.html)/[LP5907-Q1](https://detail.tmall.com/item.htm?id=521474279154&cm_id=140105335569ed55e27b&abbucket=20)

<br>
#bootloader编译
从官网下载源码并进行编译上传，上传方法可以参考[pix方法](https://pixhawk.org/dev/bootloader_update)。

```sh
~ $ git clone https://github.com/PX4/Bootloader.git
~ $ cd Bootloader
~ $ make px4fmuv4_bl
```
对下载方案做一些总结，对应如下。

##jlink下载
jtag上面如接口图如下, 仿真器上没有缺口的那端为GND

![](http://img.my.csdn.net/uploads/201211/27/1354020256_4862.png)

安装jlink[驱动](https://www.segger.com/jlink-software.html)

```sh
~ $ JLinkExe
J-Link> connect
J-Link> ?
J-Link> S
J-Link> 4000
J-Link> loadbin px4fmuv4_bl.bin 0x8000000
```

##windows stlink下载
将stm32f4discovery作为stlink下载器，板子swd接线如下, 板子上有CN2的那端为VDD_TARGET
![](/images/swd.png)

![](/images/250px-Swd_header_discovery_board.png)

下载[STM32 ST-LINK utility](http://www.st.com/content/st_com/en/products/embedded-software/development-tool-software/stsw-link004.html?#)，安装完成后，查看设备管理器显示驱动如下。

<img src="/images/stlink.png">

打开STM32 ST-LINK Utility，点击 Target»Connect，如下

<img src="/images/stlink-con.png">

推荐下载固件之前进行清除，Target»Erase Chip    
然后下载固件Target»Program & Verify，导入编译好的px4fmuv4_bl.bin文件，点击start开始下载。

<img src="/images/fmuv4.png">

##linux stlink下载
连线方式如上面的windows stlink，其余参考[这里]()即可。    
stlink的下载方案是需要discovery的板子的，所以这里推荐使用Jlink进行下载。

##dfu下载

参考文章：[dfu-util](http://www.seeedstudio.com/wiki/Dfu-util)/[build-dfu](http://dfu-util.sourceforge.net/build.html)
