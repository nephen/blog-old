---
layout: post
title:  "无人机学习概览"
categories: "drons_lifes"
author: Lever
tags: 工作生活
comments: true
permalink: /arrange/drones
donate: true
editpage: true
id: 712e39e67bb1073341c6d0d408d742e3 
update: 2017-06-17 18:41:04 Utk
---

下面是对我自己写过的有关无人机的文章做一个简单的概述，让大家摸清学习的线索。观点难免有错误，欢迎在线编辑并提出意见。

<br>
# 平台说明
Software Version：[ardupilot](https://github.com/ArduPilot/ardupilot)/[PX4](https://github.com/PX4/Firmware)   
Hardware Version：[pixhawk 2.4.6](https://pixhawk.org/modules/pixhawk)   
Code Editor：

1. [sublime text 2](http://www.nephen.com/2016/01/sublime-text2-in-linux) （Ubuntu）   
2. [vim](/2017/06/vim-for-px4) （推荐）

说明一下，本站介绍的文章包含了两个软件平台，到底使用哪个具体文章里会有声明，另外，推荐使用vim编辑查看代码, 已经给出帮助链接。

<br>
# 交流合作
Gitter: [![Gitter](https://badges.gitter.im/nephen/YuningFly.svg)](https://gitter.im/nephen/YuningFly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)   
QQ/Wechat talk: <i>995168694/18682441907</i>   
这里也说明一下，gitter是一个开放的交流平台，可以使用网页、电脑客户端、手机APP，并且Linux下也可以使用，在这里全世界的开发人员聚集交流，欢迎大家加入这个平台。

<br>
# 文章梳理
在此之前，请务必分清楚**pixhawk，px4，ardupilot这些词之间的关系**。   

pixhawk为px4开发团队的第二代硬件版本，同样ardupilot也是一个开发团队，早在之前，ardupilot使用的是arduino的开源硬件，但由于硬件跟不上软件的速度，故现在的硬件采用px4团队的pixhawk硬件，底层驱动及nuttx操作系统定制也都是用的px4团队的，ardupilot团队只是在其基础上做了应用层的开发，从而成了今天的ardupilot，我们习惯叫做apm。   

`所以`，pixhawk的硬件可以跑两套固件代码，一套px4的原生firmware固件，一套是ardupilot的固件。

1. 如果你暂时只想了解怎么装机试飞，可查看[pixhawk试飞报告](/2015/12/flighttest-of-pixhawk)。
2. 如果你是研究px4源码的初学者，从[初学PX4之环境搭建](/2015/12/env-build-of-px4)开始，完成编译、下载、地面站安装、qt搭建等过程。然后熟悉[px4大体框架](/2015/12/general-structure-of-px4)，了解代码的大体构架。
3. 或者，如果你看的是ardupilot的源码，环境搭建这块可以看[ArduPilot开发入门学习](/2016/01/introduction-to-start-ArduPilot)。
3. 无论是ardupilot还是px4，都需要了解一下[Nuttx操作系统](/2015/12/RTOS-of-NuttX)以及在pixhawk上的[定制实现](/2015/12/RTOS-of-px4)，进而去理解操作系统的启动过程，及内置应用程序的实现等等。
4. 后面接触到的就是ardupilot的了，考虑到ardupilot只是对应用层做了修改，所以开发难度相对小一点，后期就是对ardupilot代码的梳理了。可见[ArduPilot之代码概述](/2016/01/code-overview-of-ArduPilot(Copter))。
5. 如果你跟我一样对飞控的算法学习感兴趣，建议查看[px4飞控算法](/2016/01/flight-control-algorithm-of-px4)，这里针对ardupilot和px4的姿态控制算法部分都做了些许的分析。
6. 最近看到PX4加进了crazyflie2.0这个新成员，本身就喜欢小家伙的我立马就开启深夜模式了，如果你也有兴趣请戳[diy之crazyfie2.0](/2016/09/crazyflie-diy)，欢迎一起探讨。
7. 如果还要写的话，我想就是基于飞控的应用开发了，再看吧，长路漫漫，一步一个脚印。
8. 有索取就应当学会付出，发现了某些丑陋的bug或者有些新功能等时，就多为开源做点贡献吧:sweat_smile:，什么？不会？有[教程](/2016/01/introduction-to-start-ArduPilot#1-2):grin:。

<br>
# 后序
本链接（**www.nephen.com/arrange/drones**）长期有效，并保持定期更新说明，也可以进入nephen(`来风`)网站，点击“`多轴`”栏目即可进入。   
<img src="/images/nephen.png">
