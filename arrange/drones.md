---
layout: post
title:  "飞行器学习概览"
categories: "drons_lifes"
author: 吴兴章
tags: 工作生活
comments: true
update: 2016-04-13 17:14:43 Utk
---

下面是对我自己写过的有关飞行器的文章做一个简单的概述，让大家摸清学习的线索。

#平台说明
Software Version：[ardupilot](https://github.com/ArduPilot/ardupilot)/[PX4](https://github.com/PX4/Firmware)   
Hardware Version：[pixhawk 2.4.6](https://pixhawk.org/modules/pixhawk)   
IDE：[sublime text 2](http://www.nephen.com/2016/01/sublime-text2-in-linux) （Ubuntu）   
说明一下，本站介绍的文章包含了两个软件平台，到底使用哪个具体文章里会有声明，另外，推荐使用sublime text 2编辑查看代码, 已经给出帮助链接。

#学习交流
Gitter: [![Gitter](https://badges.gitter.im/nephen/YuningFly.svg)](https://gitter.im/nephen/YuningFly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)   
QQ talk: <i>995168694</i>   
这里也说明一下，gitter是一个开放的交流平台，可以使用网页、电脑客户端、手机APP，并且Linux下也可以使用，在这里全世界的开发人员聚集交流，欢迎大家加入这个平台。

#文章梳理
在此之前，请务必分清楚**APM，pixhawk，px4，ardupilot这些词之间的关系**。   

pixhawk为px4开发团队的第二代硬件版本，同样ardupilot也是一个开发团队，它的源码总称为APM，早在之前，ardupilot使用的是avr的硬件，但由于硬件跟不上软件的速度，故现在的硬件也采用px4团队的pixhawk，底层驱动及操作系统都是用的px4的，ardupilot团队只是在其基础上做了应用层的开发，从而成了今天的APM。   

`所以`，pixhawk的硬件可以跑两套固件代码，一套px4的原生firmware固件，一套是ardupilot的APM固件。

1. 如果你暂时只想了解怎么装机试飞，可查看[pixhawk试飞报告](/2015/12/flighttest-of-pixhawk)。
2. 如果想研究源码初学者，从[初学PX4之环境搭建](/2015/12/flighttest-of-pixhawk)开始，完成编译、下载、地面站安装等过程。然后熟悉[px4大体框架](/2015/12/general-structure-of-px4)，了解代码的大体构架。
3. 无论是APM还是px4，都需要了解一下[Nuttx操作系统](/2015/12/RTO-of-NuttX)以及在pixhawk上的[定制](/2015/12/RTOS-of-px4)，进而去理解操作系统的启动过程，及内置应用程序的实现等等。
4. 后面接触到的就是APM的了，考虑到APM只是对应用层做了修改，所以开发难度相对小一点，后期就是对APM代码的梳理了。可见[ArduPilot之代码概述](/2016/01/code-overview-of-ArduPilot(Copter))、[ArduPilot开发入门学习](/2016/01/introduction-to-start-ArduPilot)。
5. 如果你跟我一样对飞控的算法学习感兴趣，建议查看[px4飞控算法](/2016/01/flight-control-algorithm-of-px4)，这里针对APM和px4的姿态控制算法部分都做了些许的分析。
6. 如果还要写的话，我想就是基于飞控的应用开发了，再看吧，长路漫漫，一步一个脚印。

