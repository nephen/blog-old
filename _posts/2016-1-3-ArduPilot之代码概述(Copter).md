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
参数可以是主代码的一部分，也可以是库的一部分。

- [将一个参数添加到主代码](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-parameter/#adding_a_parameter_to_the_main_code)

 - 在[Parameters.h](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/Parameters.h)里添加新参数，注意数字是否超过该区域；不可将参数插入中间，会打乱已有的次序；有“deprecated” or “remove” 备注的参数不要使用；
 - 声明变量，去掉“k\_param\_”前缀；
 - 将变量声明添加到 [Parameters.cpp](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/Parameters.cpp)的var\_info表，@Param ~ @User 注释将作为地面站里的参数说明；
 - 添加变量默认值到 [config.h](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/config.h)，现在可以在主代码里进行访问 g.my\_new_parameter即可；

- [将参数添加到库](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-parameter/#adding_a_parameter_to_a_library)

	参数也可以添加到库，以AP_Compass库作为例子进行说明。
 - 添加变量到Compass.h的类中，并在类定义之前定义初始值。
 - 添加变量到Compass.cpp的var_info表中，包括@Param ~ @Increment 注释，注意数字部分比上一个大一。

		```C++
		 // @Param: MY_NEW_P
		    // @DisplayName: My New Library Parameter
		    // @Description: The new library parameter description goes here
		    // @Range: -32768 32767
		    // @User: Advanced
		    AP_GROUPINFO("MY_NEW_P", 9, Compass, _my_new_lib_parameter, MY_NEW_PARAM_DEFAULT),

		```
		类内部可以使用_my_new_lib_parameter变量，由于是保护变量，类外使用需加上compass._my_new_lib_parameter。
 - 如果这个类是新定义的，类名应该添加到 Parameters.cpp的var_info中

		```c++
		 // @Group: COMPASS_
		    // @Path: ../libraries/AP_Compass/Compass.cpp
		    GOBJECT(compass,        "COMPASS_", Compass),
		```

<br>
####添加一个新的飞行模式
当自己想用新的机架时，或者创建新的飞行模式是，可以添加一个新的飞行模式，步骤可见[原文](http://dev.ardupilot.com/wiki/apmcopter-adding-a-new-flight-mode/)。

- 在defines.h为新的飞行模式宏定义，并将NUM_MODES加1。

	```c++
	// Auto Pilot modes
	// ----------------
	#define STABILIZE 0 // hold level position
	#define ACRO 1 // rate control
	#define ALT_HOLD 2 // AUTO control
	#define AUTO 3 // AUTO control
	#define GUIDED 4 // AUTO control
	#define LOITER 5 // Hold a single location
	#define RTL 6 // AUTO control
	#define CIRCLE 7 // AUTO control
	#define LAND 9 // AUTO control
	#define OF_LOITER 10 // Hold a single location using optical flow sensor
	#define DRIFT 11 // DRIFT mode (Note: 12 is no longer used)
	#define SPORT 13 // earth frame rate control
	#define FLIP 14 // flip the vehicle on the roll axis
	#define AUTOTUNE 15 // autotune the vehicle's roll and pitch gains
	#define POSHOLD 16 // position hold with manual override
	#define NEWFLIGHTMODE 17                // new flight mode description
	#define NUM_MODES 18
	```
- 创建control_<new flight mode>草图，类似于control_stabilize.cpp，新文件必须含有_init() 函数和 _run() 函数。

	```c++
	/// -*- tab-width: 4; Mode: C++; c-basic-offset: 4; indent-tabs-mode: nil -*-

	/*
 	- control_newflightmode.cpp - init and run calls for new flight mode
	 */

	// newflightmode_init - initialise flight mode
	static bool newflightmode_init(bool ignore_checks)
	{
	    // do any required initialisation of the flight mode here
	    // this code will be called whenever the operator switches into this mode

	    // return true initialisation is successful, false if it fails
	    // if false is returned here the vehicle will remain in the previous flight mode
	    return true;
	}

	// newflightmode_run - runs the main controller
	// will be called at 100hz or more
	static void newflightmode_run()
	{
	    // if not armed or throttle at zero, set throttle to zero and exit immediately
	    if(!motors.armed() || g.rc_3.control_in <= 0) {
	        attitude_control.relax_bf_rate_controller();
	        attitude_control.set_yaw_target_to_current_heading();
	        attitude_control.set_throttle_out(0, false);
	        return;
	    }

	    // convert pilot input into desired vehicle angles or rotation rates
	    //   g.rc_1.control_in : pilots roll input in the range -4500 ~ 4500
	    //   g.rc_2.control_in : pilot pitch input in the range -4500 ~ 4500
	    //   g.rc_3.control_in : pilot's throttle input in the range 0 ~ 1000
	    //   g.rc_4.control_in : pilot's yaw input in the range -4500 ~ 4500

	    // call one of attitude controller's attitude control functions like
	    //   attitude_control.angle_ef_roll_pitch_rate_yaw(roll angle, pitch angle, yaw rate);

	    // call position controller's z-axis controller or simply pass through throttle
	    //   attitude_control.set_throttle_out(desired throttle, true);
	}
	```
- 在 Copter.h中声明_init() 和 _run()函数。
- 在flight_mode.cpp的set_mode()函数中添加一个case来调用上面的初始化函数。

	```c++
	switch(mode) {
	        case ACRO:
	            #if FRAME_CONFIG == HELI_FRAME
	                success = heli_acro_init(ignore_checks);
	            #else
	                success = acro_init(ignore_checks);
	            #endif
	            break;

	        case NEWFLIGHTMODE:
	            success = newflightmode_init(ignore_checks);
	            break;
	    }
	```
- 在flight_mode.cpp的update_flight_mode()函数中添加一个case来调用上面的_run函数。

	```c++
	static void update_flight_mode()
	{
	    switch (control_mode) {
	        case ACRO:
	            #if FRAME_CONFIG == HELI_FRAME
	                heli_acro_run();
	            #else
	                acro_run();
	            #endif
	            break;
	        case NEWFLIGHTMODE:
	            success = newflightmode_run();
	            break;
	    }
	}
	```
- 在 flight_mode.cpp的print_flight_mode()函数里添加一个case来打印出飞行模式。

	```c++
	tatic void
	print_flight_mode(AP_HAL::BetterStream *port, uint8_t mode)
	{
	    switch (mode) {
	    case STABILIZE:
	        port->print_P(PSTR("STABILIZE"));
	        break;
	    case NEWFLIGHTMODE:
	        port->print_P(PSTR("NEWFLIGHTMODE"));
	        break;
	```
- 在Parameters.cpp中添加新的飞行模式到FLTMODE1 ~ FLTMODE6参数的@values列表中。

	```C++
	 // @Param: FLTMODE1
	    // @DisplayName: Flight Mode 1
	    // @Description: Flight mode when Channel 5 pwm is 1230, <= 1360
	    // @Values: 0:Stabilize,1:Acro,2:AltHold,3:Auto,4:Guided,5:Loiter,6:RTL,7:Circle,8:Position,9:Land,10:OF_Loiter,11:ToyA,12:ToyM,13:Sport,17:NewFlightMode
	    // @User: Standard
	    GSCALAR(flight_mode1, "FLTMODE1",               FLIGHT_MODE_1),

	    // @Param: FLTMODE2
	    // @DisplayName: Flight Mode 2
	    // @Description: Flight mode when Channel 5 pwm is >1230, <= 1360
	    // @Values: 0:Stabilize,1:Acro,2:AltHold,3:Auto,4:Guided,5:Loiter,6:RTL,7:Circle,8:Position,9:Land,10:OF_Loiter,11:ToyA,12:ToyM,13:Sport,17:NewFlightMode
	    // @User: Standard
	    GSCALAR(flight_mode2, "FLTMODE2",               FLIGHT_MODE_2),
	```
- 如果您希望在新的飞行模式出现在任务规划的HUD和飞行模式设置，可以在` Mission Planner’s Issue List`提出一个请求。

<br>
####[调度代码间歇运行](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/)

- [使用调度程序](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/#running_your_code_with_the_scheduler)：添加新函数到ArduCopter.cpp里的[scheduler_tasks](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L96)数组。

	```c++
	static const AP_Scheduler::Task scheduler_tasks[] PROGMEM = {
	    { update_GPS,            2,     900 },
	    { update_nav_mode,       1,     400 },
	    { medium_loop,           2,     700 },
	    { update_altitude,      10,    1000 },
	    { fifty_hz_loop,         2,     950 },
	    { run_nav_updates,      10,     800 },
	    { slow_loop,            10,     500 },
	    { gcs_check_input,	     2,     700 },
	    { gcs_send_heartbeat,  100,     700 },
	    { gcs_data_stream_send,  2,    1500 },
	    { gcs_send_deferred,     2,    1200 },
	    { compass_accumulate,    2,     700 },
	    { barometer_accumulate,  2,     900 },
	    { super_slow_loop,     100,    1100 },
	    { my_new_function,      10,     200 },
	    { perf_update,        1000,     500 }
	};
	```
	第一栏为函数名称，第二栏为一个以2.5ms为单位的数字，如1代表400hz，8代表50hz，第三栏为函数期待消耗多少毫秒。

- [运行代码为一个已有循环的一部分](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/#running_your_code_as_part_of_one_of_the_loops)：添加到固有函数，调度频率比较高：

 - [fast_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L990) : runs at 100hz on APM2, 400hz on Pixhawk
 - [fifty_hz_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L370) : runs at 50hz
 - [ten_hz_logging_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L341): runs at 10hz
 - [three_hz_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L405): runs at 3.3hz
 - [>one_hz_loop](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L427) : runs at 1hz

	假设要添加新代码，使它以10hz的频率调度运行，那么可以将代码加入ten_hz_logging_loop()函数中。

	```C++
	// ten_hz_logging_loop
	// should be run at 10hz
	static void ten_hz_logging_loop()
	{
	    if (g.log_bitmask & MASK_LOG_ATTITUDE_MED) {
	        Log_Write_Attitude();
	    }
	    if (g.log_bitmask & MASK_LOG_RCIN) {
	        DataFlash.Log_Write_RCIN();
	    }
	    if (g.log_bitmask & MASK_LOG_RCOUT) {
	        DataFlash.Log_Write_RCOUT();
	    }
	    if ((g.log_bitmask & MASK_LOG_NTUN) && mode_requires_GPS(control_mode)) {
	        Log_Write_Nav_Tuning();
	    }

	    // your new function call here
	    my_new_function();
	}
	```

<br>
####[添加一个新的MAVLink消息](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-mavlink-message/)

地面站之间传递数据和命令使用的是[MAVLink协议](http://en.wikipedia.org/wiki/MAVLink)，参考已有的[MAVLink messages](https://pixhawk.ethz.ch/mavlink/).。

<hr>
参看文章：[官网](http://dev.ardupilot.com/wiki/apmcopter-code-overview/)/[串级pid](http://bbs.loveuav.com/thread-229-1-1.html)