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
具体可参考[APM飞控浅析](http://www.360doc.com/content/15/0505/11/22888854_468188999.shtml#)

<br>
####ArduPilot编程库
这些[库](https://github.com/diydrones/ardupilot/tree/master/libraries)是和Copter, Plane and Rover共享的，具体的库及功能可见[原文](http://dev.ardupilot.com/wiki/apmcopter-programming-libraries/)。

- 核心库
 - AP_AHRS —— 使用DCM或扩展卡尔曼滤波姿态估计
 - AP_Common —— 所有草图和库所需要的核心包括
 - AP_math —— 各种数学函数尤其对向量操作有用
 - AC_PID —— PID控制器库
 - AP_InertialNav —— 惯性导航库，用于融合加速度计、gps和气压计的数据输入
 - AC_AttitudeControl —— 姿态控制库
 - AP_WPNav —— 航点导航库
 - AP_Motors —— 多轴和传统的直升机电机混合
 - RC\_Channel —— 这个库将更多的转换为PWM输入/输出，将来自APM_RC的数据转换为内部单位，如角度
 - AP\_HAL, AP\_HAL\_AVR, AP\_HAL_PX4 —— 这库实现“硬件抽象层”，这向高级别代码提供了一个相同的接口，以便它可更容易地移植到不同的板
- 传感器库
 - AP_InertialSensor —— 读取陀螺和加速度计数据，执行校准和以标准单位（度/秒，米/秒），向主代码和其它库提供数据
 - AP_RangeFinder —— 声纳和红外距离传感器接口库
 - AP_Baro —— 气压计接口库
 - AP_GPS —— gps接口库
 - AP_Compass —— 3轴罗盘接口库
 - AP_OpticalFlow —— 光学流量传感器接口库
- 其他库
 - AP\_Mount, AP\_Camera, AP_Relay —— 摄像头安装控件库，相机的快门控制库
 - AP_Mission —— 从EEPROM存储/检索任务的命令
 - AP_Buffer —— 与惯性导航使用的简单FIFO缓冲区

<!--more-->
<br>
####姿态控制
代码结构如图所示
<img src="/images/AC_CodeOverview_ManualFlightMode.png">
更新周期：400hz on Pixhawk, 100hz on APM2.x    

- 顶层的flight-mode.cpp的“update\_flight\_mode()” 函数被调用。此函数检查车辆的飞行模式(如，“control\_mode” 变量)，然后调用相应的\<flight mode>\_run()函数(如，自稳模式的“stabilize\_run”， 返回地面模式的“rtl\_run” 等等)。\<flight mode>\_run()函数能在相应的以control\_\<flight mode>.cpp命名的文件里找到(如，control\_stabilize.cpp, control_rtl.cpp等等)。
- \<flight mode>\_run函数是负责将用户的输入(如g.rc\_1.control\_in, g.rc\_2.control_in等等)转换为倾斜角度，旋转速度，爬升率等适合这种飞行模式的值。举个例子，AltHold将用户的滚动和俯仰输入转换成倾斜角（单位：度），偏航输入被转换成旋转速度（度每秒），油门输入被转换为一个爬升率（以厘米/秒）。
- \<flight mode>\_run函数最后一件必须做的事，将这些期望的角度，速率等传给姿态控制和/或位置控制库(都在 AC_AttitudeControl文件夹)。
- AC_AttitudeControl库提供5种可能的方式来控制车辆的姿态，最常见的3种描述如下：
 - angle\_ef\_roll\_pitch\_rate\_ef_yaw()：它接受一个地理坐标的俯仰角和翻滚角以及偏航率。举个例子，提供给这个函数的值为，俯仰角-1500、翻滚角-1000及偏航率500意味者使机器向左翻滚10度，向前俯仰15度以及向右旋转5度/秒。
 - angle\_ef\_roll\_pitch_yaw()：它接受一个地理坐标的俯仰角和翻滚角以及偏航角。像上面一样，除了提供500的偏航角意味着向东北方向选择5度。
 - rate\_bf\_roll\_pitch_yaw()：它接受地理坐标的俯仰速率和翻滚速率以及偏航速率。举个例子，roll = -1000, pitch = -1500, yaw = 500意味着向左边以10度/秒的速率翻转，向前以15度/秒的速率俯仰和绕z轴以5度/秒的速率旋转。

这些函数被调用之后是AC\_AttitudeControl::rate\_controller\_run()函数被调用。这将来自上面列出方法的输出转换成翻滚，俯仰和偏航输入，然后通过set\_roll, set\_pitch, set\_yaw and set\_throttle发给AP_Motors库。

- AC\_PosControl库允许车辆的三维位置控制。通常情况下仅使用简单的Z轴（即高度控制）方法，因为更复杂的三维位置的飞行模式（即游荡）利用AC_WPNav库。在任何情况下，该库的一些常用的方法包括：
 - set\_alt\_target\_from\_climb_rate()：这接受厘米/ 秒的爬升率和更新的绝对目标高度
 - set\_pos_target()：此接受3D位置矢量，这是一个距离家里厘米的偏移。

如果AC\_PosControl任何方法被调用，然后飞行模式代码也必须调用AC\_PosControl::update\_z\_controller()方法。这将运行z轴位置控制PID回路和发送低电平油门级到AP\_Motors库。如果有任何的XY轴的方法被调用，然后AC\_PosControl :: update\_xy_controller()必须被调用。

- AP\_Motors库拥有“电机混合”的代码。这个代码是负责把从AC\_AttitudeControl和AC_PosControl库接收的滚转，俯仰，偏航和油门值转换成绝对马达的输出（即，PWM值）。因此，上级库将利用这些功能：
 - set\_roll(), set\_pitch(), set\_yaw()：接受-4500〜4500范围内的滚动，俯仰和偏航值。这些不是期望的角度，甚至速率而只是一个值。例如，set_roll(-4500)意味着尽可能快的左转。
 - set_throttle()：接受0〜1000的范围内绝对油门值， 0 =电机关闭，1000 =全油门。

对于不同的机型有不同的类(quad, Y6, traditional helicopter)，而且每一个类有“output\_armed”函数，它是负责执行这些滚动，俯仰，偏航和油门值转换成PWM输出。此转换通常包括实施一个“稳定的补丁”，当输入请求是该机型的物理极限外它处理优先控制中的一个轴(如，对于四轴最大油门和最大侧倾是不可能的，因为一些电机必须小于另外一些电机才能导致角度倾斜)。在“output\_armed”函数的底部，有到hal.rcout->write()函数的调用，其传递所需的PWM值到AP_HAL层。

-  AP\_HAL库(硬件抽象层)为所有的板子提供一致的接口。尤其是hal.rc\_out\_write()函数将使从AP_Motors类收到指定的PWM出现相应的板的PWM引脚上。

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
参看文章：[官网](http://dev.ardupilot.com/wiki/apmcopter-code-overview/)/[串级pid](http://bbs.loveuav.com/thread-229-1-1.html)