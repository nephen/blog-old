---
layout: post
title:  "ArduPilot之代码概述"
categories: "drons_lifes"
author: 吴兴章
tags: 工作生活
donate: true
comments: true
---
总体的代码结果图如下：
<img src="/images/AC_CodeOverview_AutoFlightModes.png">

<br>
####ArduPilot编程库
这些[库](https://github.com/diydrones/ardupilot/tree/master/libraries)是和Copter, Plane and Rover共享的，具体的库及功能见[原文](http://dev.ardupilot.com/wiki/apmcopter-programming-libraries/)。

<br>
####姿态控制
代码结构如图所示
<img src="/images/AC_CodeOverview_ManualFlightMode.png">
更新周期：400hz on Pixhawk, 100hz on APM2.x    
详情见[原文](http://dev.ardupilot.com/wiki/apmcopter-programming-attitude-control-2/)

<!--more-->
<br>
####添加新的参数

- [将一个参数添加到主代码](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-parameter/#adding_a_parameter_to_the_main_code)

	在[Parameters.h](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/Parameters.h)里添加新参数，注意数字是否超过；声明变量；将变量声明添加到 [Parameters.cpp](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/Parameters.cpp)；添加变量默认值到 [config.h](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/config.h)；

- [将参数添加到库](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-parameter/#adding_a_parameter_to_a_library)

	参数也可以添加到库，步骤见原文。

<br>
####添加一个新的飞行模式
当自己想用新的机架时，或者创建新的飞行模式是，可以添加一个新的飞行模式，步骤见[原文](http://dev.ardupilot.com/wiki/apmcopter-adding-a-new-flight-mode/)。

<br>
####[调度代码间歇运行](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/)

- [使用调度程序](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/#running_your_code_with_the_scheduler)：添加新函数到[scheduler_tasks](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L96)
- [运行代码为一个循环的一部分](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/#running_your_code_as_part_of_one_of_the_loops)：添加到固有函数，调度频率比较高：

 - [fast_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L990) : runs at 100hz on APM2, 400hz on Pixhawk
 - [fifty_hz_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L370) : runs at 50hz
 - [ten_hz_logging_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L341): runs at 10hz
 - [three_hz_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L405): runs at 3.3hz
 - [>one_hz_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L427) : runs at 1hz

<br>
####[添加一个新的MAVLink消息](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-mavlink-message/)

地面站之间传递数据和命令使用的是[MAVLink协议](http://en.wikipedia.org/wiki/MAVLink)，参考已有的[MAVLink messages](https://pixhawk.ethz.ch/mavlink/).。

<hr>
参看文章：http://dev.ardupilot.com/wiki/apmcopter-code-overview/