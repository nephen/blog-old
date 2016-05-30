---
layout: post
title:  "ArduPilot之代码概述"
categories: "drons_lifes"
author: Lever
tags: 工作生活
donate: true
comments: true
editpage: true
update: 2016-05-30 13:44:44 Utk
---
>`通知`：**如果你对本站无人机文章不熟悉，建议查看[无人机学习概览](/arrange/drones)！！！**

代码调用关系可使用[doxygen](http://www.stack.nl/~dimitri/doxygen/manual/starting.html)工具，cmake中使用[doxygen](http://blog.csdn.net/shyanyang/article/details/42715297)，总体的代码结果图如下：
<img src="/images/AC_CodeOverview_AutoFlightModes.png">
具体可参考[APM飞控浅析](http://www.360doc.com/content/15/0505/11/22888854_468188999.shtml#)

<br>
#ArduPilot编程库
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
#姿态控制
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
#添加新的参数
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
#添加一个新的飞行模式
当自己想用新的机架时，或者创建新的飞行模式时，可以添加一个新的飞行模式，步骤可见[原文](http://dev.ardupilot.com/wiki/apmcopter-adding-a-new-flight-mode/)。

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
#[调度代码间歇运行](http://dev.ardupilot.com/wiki/code-overview-scheduling-your-new-code-to-run-intermittently/)

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
#[添加一个新的MAVLink消息](http://dev.ardupilot.com/wiki/code-overview-adding-a-new-mavlink-message/)

地面站之间传递数据和命令使用的是[MAVLink协议](http://en.wikipedia.org/wiki/MAVLink)，参考已有的[MAVLink messages](https://pixhawk.ethz.ch/mavlink/)。

<br>
#makefie分析
对于make语法不是很熟悉的可以参考[make manual](http://www.gnu.org/software/make/manual/make.html)/[ 详解Makefile 函数的语法与使用](http://www.cnblogs.com/sky1991/archive/2012/11/15/2771348.html)/[跟我一起写makefile](http://www.chinaunix.net/old_jh/23/408225.html)。    
>【make中命令行前面加上减号】   
就是，忽略当前此行命令执行时候所遇到的错误。   
而如果不忽略，make在执行命令的时候，如果遇到error，会退出执行的，加上减号的目的，是即便此行命令执行中出错，比如删除一个不存在的文件等，那么也不要管，继续执行make。   
【make中命令行前面加上at符号@】    
就是，在make执行时候，输出的信息中，不要显示此行命令。    
而正常情况下，make执行过程中，都是会显示其所执行的任何的命令的。如果你不想要显示某行的命令，那么就在其前面加上@符号即可。   
【FOO ?= bar】   
只有当FOO变量未定义是，才可以赋值。   
【=/: =/::=】   
=为可递归等于，另外两种则不可以。    
【+ =/！ = 】    
附加在已有的变量上，后者可以执行命令并将结果赋给左边变量。    
更多参考：http://blog.csdn.net/crylearner/article/details/17271195

- 确定MK_DIR    
进入ArduCopter里的[Makefile](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/Makefile)文件可知，它直接调用了../mk/apk.mk文件。    
在[apk.mk](https://github.com/diydrones/ardupilot/blob/master/mk/apm.mk)文件里，第一行代码是返回系统的类型。   

	```sh
	# => The uname command with no parameters should tell you the operating system name. I'd use that, then make conditionals based on the return value.

	# => Example

	UNAME := $(shell uname)

	ifeq ($(UNAME), Linux)
	# do something Linux-y
	endif
	ifeq ($(UNAME), Solaris)
	# do something Solaris-y
	endif
	```
根据系统的类型确定不同的工作目录MK_DIR，findstring的用法如下：    

	```sh
	$(findstring find,in)
	# => Searches in for an occurrence of find. If it occurs, the value is find; otherwise, the value is empty. You can use this function in a conditional to test for the presence of a specific substring in a given string. Thus, the two examples,

	$(findstring a,a b c)
	$(findstring a,b c)
	# => produce the values ‘a’ and ‘’ (the empty string), respectively.
	```
其中的[cygpath](https://cygwin.com/cygwin-ug-net/cygpath.html)用于转换Unix和Windows的格式路径，选项信息如下：

	```
	-m, --mixed           like --windows, but with regular slashes (C:/WINNT)
	-w, --windows         print Windows form of NAMEs (C:\WINNT)
	```
根据gnu make定义，gnu make 会自动将所有读取的makefile路径都会加入到[MAKEFILE_LIST](https://www.gnu.org/software/make/manual/html_node/Special-Variables.html)变量中，而且是按照读取的先后顺序添加。例如：

	```sh
	#If a makefile named Makefile has this content:

	name1 := $(lastword $(MAKEFILE_LIST))

	include inc.mk

	name2 := $(lastword $(MAKEFILE_LIST))

	all:
	        @echo name1 = $(name1)
	        @echo name2 = $(name2)
	#then you would expect to see this output:

	#name1 = Makefile
	#name2 = inc.mk
	```
格式：$(patsubst <pattern>,<replacement>,<text>)    
名称：模式字符串替换函数——[patsubst](https://www.gnu.org/software/make/manual/html_node/Text-Functions.html)   
功能：查找<text>中的单词（单词以“空格”、“Tab”或“回车”“换行”分隔）是否符合模式<pattern>，如果匹配的话，则以<replacement>替换。这里，<pattern>可以包括通配符“%”，表示任意长度的字串。如果<replacement>中也包含“%”，那么，<replacement>中的这个“%”将是<pattern>中的那个“%”所代表的字串。（可以用“\”来转义，以“\%”来表示真实含义的“%”字符）   
返回：函数返回被替换过后的字符串。    
示例：    
$(patsubst %.c,%.o,x.c.c bar.c)     
把字串“x.c.c bar.c”符合模式[%.c]的单词替换成[%.o]，返回结果是“x.c.o bar.o”     
而dir是提取路径   

	```sh
	$(dir src/foo.c hacks)
	#produces the result ‘src/ ./’.
	```
所以$(patsubst %/,%,$(dir $(lastword $(MAKEFILE_LIST))))返回了当前的mk路径，到这里也就得出了 `MK_DIR` 信息。    

- 环境变量    
添加环境变量environ.mk，进入分析变量。    
GIT_VERSION := $(shell git rev-parse HEAD | cut -c1-8)为提取commit号的前八个字符作为版本号。   
SRCROOT			:=	$(realpath $(dir $(firstword $(MAKEFILE_LIST))))通过判断是否有libraries来获取当前make的真实路径，不存在则返回为空。   
查找SKETCHBOOK的位置：
 - wildcard通配符，如：列出该目录下所有的C文件为$(wildcard *.c)。
 - 此位置为该项目的根目录。
 - 如果是在win平台，转换为win格式的路径。

	`提示`：关于make的一些控制函数如[error和warning](http://blog.chinaunix.net/uid-23929712-id-2650467.html)。   
根据源文件路径判断SKETCH名称：SKETCH:=$(lastword $(subst /, ,$(SRCROOT)))，其中subst是将源文件路径中所有的/替换为空格。   
建立BUILDROOT目录：根据编译目标$(MAKECMDGOALS)建立相关目录，如果编译目标不匹配，建立临时目录。   
根据编译参数确定HAL_BOARD类型。
- 添加configure.mk   
如果编译参数是configure，则添加。
- help目标选项   
直接显示help的相关信息。
- 添加公共编译组件   
 - target.mk：编译目标，默认default为help。[foreach](http://www.cnblogs.com/lengbingshy/p/3936116.html)语法及使用：USED_BOARDS := $(foreach board,$(BOARDS), $(findstring $(board), $(MAKECMDGOALS)))。使用foreach/eval/define/call更加快速的定义了目标。[.PHONY](http://www.cnblogs.com/chenyadong/archive/2011/11/19/2255279.html)伪目标etags。添加modules.mk（进行模块更新检查; cd $(dirname "$0")为进入执行命令的目录；shell里-d为目录，-f为文件，[更多](http://zhidao.baidu.com/link?url=KNNKz9I4gegfiwuM7XyaCDqDnvgzrWffqFyNMnrD5E89iJnxdz-OKDJCCI_wJs2_t4y99WPExEKA5PF8F0QVeq)；set -x是交互形式执行脚本，告诉你脚本做了些什么；）/mavgen.mk。
 - sketch_sources.mk：确定SRCSUFFIXES文件后缀；判断编译目录`MAKE_INC`是否为空；addprefix为添加前缀；SKETCHSRCS为编译目录的cpp文件；SKETCHCPP为编译目录的SKETCH.cpp文件；SKETCHOBJS为build目录里的cpp文件然后替换为.o文件；LIBRARIES的值赋给LIBTOKENS，匹配板子加入`AP_HAL_PX4`的库；更新包含sketchbook的各种库及文件，其中notdir为去掉目录仅留名字；使用’FORCE’和’.PHONY : clean’效果相同。使用’.PHONY’更加明确高效，但不是所有的’make’都支持；这样许多makefile中使用’FORCE’；生成build目录并建立make.flags文件；建立公共规则头文件，$@表示规则目标名字，dir为提取文件目录。
- 编译选项判断   
如果不为clean，则继续。
- 单板配置    
根据HAL_BOARD选择配置。
- 配置PX4   
如果上一步为PX4，则进行配置。
 - 添加find_tools.mk：寻找编译工具，使用`FIND_TOOL` =$(firstword $(wildcard $(addsuffix /$(1),$(TOOLPATH))))快速查找；使用CCACHE如果安装了的话；查找awk。关于一些[预定义的变量](http://www.gnu.org/software/make/manual/html_node/Implicit-Variables.html)：
	<img src="http://img.blog.csdn.net/20130729161414015?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDk3OTAzMA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center">
 - 添加px4_targets.mk：确定`PX4FIRMWARE_DIRECTORY`/`NUTTX_ROOT`/`NUTTX_SRC`/`PX4NUTTX_DIRECTORY`/`UAVCAN_DIRECTORY`等路径；获取`NUTTX_GIT_VERSION`及`PX4_GIT_VERSION`版本；添加EXTRAFLAGS；更新`PX4_V2_CONFIG_FILE`配置文件；定义SKETCHFLAGS/WARNFLAGS/OPTFLAGS，其中-D表示为define，-I为添加库；确定PYTHONPATH路径；定义`PX4_MAKE`及`PX4_MAKE_ARCHIVES`,有几个知识点，The ‘-n’, ‘-t’, and ‘-q’ options do not affect recipe lines that begin with ‘+’ characters or contain the strings ‘$(MAKE)’ or ‘${MAKE}’, it does not apply if the MAKE variable is referenced through expansion of another variable. In the latter case you must use the ‘+’ token to get these special effects.，这里包含了编译PX4原生代码的`$(PX4_ROOT)/Makefile.make`， $(MAKE) -C表示进入指定文件夹执行；添加`HASHADDER_FLAGS`；生成`module_mk`；最后建立px4的相关目标，如px4-v2，注意：px4-v2的依赖条件中包含了$(SKETCHCPP)，从这里调用该工程下的源文件；`.NOTPARALLEL`新语法：Makefile中，如果出现目标“.NOPARALLEL”，则所有命令按照串行方式执行，即使存在make的命令行参数“-j”。但在递归调用的字make进程中，命令可以并行执行。此目标不应该有依赖文件，所有出现的依赖文件将被忽略。
 - 上一步中涉及到了`config_px4fmu-v2_APM.mk`；在这里又调用了px4_common.mk，这是一个很重要的东西；如定义了`ROMFS_ROOT`，定义了`BUILTIN_COMMANDS`，其中strip为去除空格；
- px4原生代码编译   
想要了解更详细的px4原生代码编译，还的看看`$(PX4_ROOT)/Makefile.make`，这个makefile是由cmake产生的；     
大概的框架可以查看根目录下makefiles文件夹里的README.txt文件。

<br>
#程序入口主函数
我们看源代码的时候，特别喜欢从main函数开始，顺着思路开始往下理。下面我就以ArduCopter工程里的px4-v2编译目标为例子，一步一步剖析main函数。   
总的来说，这里的main函数就是[ArduCopter.cpp](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L658)里的`AP_HAL_MAIN_CALLBACKS(&copter);`，它实际上是一个宏定义，传进来的参数为类对象的引用，通过在[AP_HAL_Main.h](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_HAL/AP_HAL_Main.h#L49)里的定义可知原型为：

```C++
#define AP_HAL_MAIN_CALLBACKS(CALLBACKS) extern "C" { \
    int AP_MAIN(int argc, char* const argv[]); \
    int AP_MAIN(int argc, char* const argv[]) { \
        hal.run(argc, argv, CALLBACKS); \
        return 0; \
    } \
    }
```
而这里的[AP_MAIN](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_HAL/AP_HAL_Main.h#L11)也是一个宏，如下：

```C++
#if CONFIG_HAL_BOARD == HAL_BOARD_PX4 || CONFIG_HAL_BOARD == HAL_BOARD_VRBRAIN
#define AP_MAIN __EXPORT ArduPilot_main
#endif
```
所以它实际上是这样的：

```C++
#define AP_HAL_MAIN_CALLBACKS(CALLBACKS) extern "C" { \
    int __EXPORT ArduPilot_main(int argc, char* const argv[]); \
    int __EXPORT ArduPilot_main(int argc, char* const argv[]) { \
        hal.run(argc, argv, CALLBACKS); \
        return 0; \
    } \
    }
```
将这个宏替换到ArduCopter.cpp里的`AP_HAL_MAIN_CALLBACKS(&copter);`它就变成了：

```C++
int __EXPORT ArduPilot_main(int argc, char* const argv[]);
int __EXPORT ArduPilot_main(int argc, char* const argv[]) {
        hal.run(argc, argv, &copter);
        return 0;
    }
```
因此实际上这个工程的main函数就是ArduCopter.cpp里的ArduPilot_main函数。在这个main函数所在的CPP文件创建了不同的[线程](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/ArduCopter.cpp#L96)以供调用。    
那么这里可能又牵扯到了一个问题，ArduPilot_main函数又是怎么调用的呢？   
如果像以前我们经常使用的单片机裸机系统，入口函数就是程序中函数名为main的函数，但是这个工程里边名字不叫main，而是ArduPilot_main，所以这个也不像裸机系统那样去运行`ArduPilot_main`那么简单。区别在于这是跑的Nuttx操作系统，这是一个类Unix的操作系统，它的初始化过程是由`脚本`去完成的。    
注意一个重要的词——`脚本`，如果你对Nuttx的启动过程不是很熟悉，可以查看我先前写的一些[文章](/2015/12/初学PX4之操作系统#系统启动)。而在这里需要注意两个脚本，一个是ardupilot/mk/PX4/ROMFS/init.d里的rcS，另一个是rc.APM，这个脚本在rcS里得到了调用，也就是说，rcS就是为Nuttx的启动文件。    
那么到底调用ArduPilot_main的地方在哪里呢？   
查看[rc.APM](https://github.com/diydrones/ardupilot/blob/master/mk/PX4/ROMFS/init.d/rc.APM#L494)的最低端：

```sh
echo Starting ArduPilot $deviceA $deviceC $deviceD
if ArduPilot -d $deviceA -d2 $deviceC -d3 $deviceD start
then
    echo ArduPilot started OK
else
    sh /etc/init.d/rc.error
fi
```
其中ArduPilot是一个内嵌的应用程序，由编译生成的builtin_commands.c可知，这个应用程序的入口地址就是`ArduPilot_main`。其实也只有这个ArduPilot_main应用是APM编写的，其余的应用基本上都是px4底层自带的。

```c++
{"ArduPilot", SCHED_PRIORITY_DEFAULT, 4096, ArduPilot_main},
{"px4flow", SCHED_PRIORITY_DEFAULT, CONFIG_PTHREAD_STACK_DEFAULT, px4flow_main},
```
这样的命令有很多，在rcS里就开始调用的比如rgbled就是的。至于这些内置的命令是怎么生成的，就要了解PX4原生的编译过程了，由上一节的介绍，查看px4_targes.mk。

```sh
PX4_MAKE = $(v)+ GIT_SUBMODULES_ARE_EVIL=1 ARDUPILOT_BUILD=1 $(MAKE) -C $(SKETCHBOOK) -f $(PX4_ROOT)/Makefile.make EXTRADEFINES="$(SKETCHFLAGS) $(WARNFLAGS) $(OPTFLAGS) "'$(EXTRAFLAGS)' APM_MODULE_DIR=$(SKETCHBOOK) SKETCHBOOK=$(SKETCHBOOK) CCACHE=$(CCACHE) PX4_ROOT=$(PX4_ROOT) NUTTX_SRC=$(NUTTX_SRC) MAXOPTIMIZATION="-Os" UAVCAN_DIR=$(UAVCAN_DIR)
```
其中-f $(PX4_ROOT)/Makefile.make显示了makefile使用了PX4项目根目录的Makefile.make文件，拜读这里即可查出真相，真相在根目录下makefiles文件夹里的[firmware.mk](https://github.com/diydrones/PX4Firmware/blob/5a52d3eec8eca7e72eb8dde7956140e111914c96/makefiles/firmware.mk#L383)里。其实px4的代码使用的是Cmake，所以通过查看根目录下的CMakeLists.txt可知，真正产生builtin_commands.c的是px4_impl_nuttx.cmake里的px4_nuttx_generate_builtin_commands函数。同理，nuttx操作系统的ROMFS是由px4_nuttx_add_romfs函数产生的。    

接着继续分析main函数里的一些特征及其所做的事情。    
由上面分析可知，main函数及为：   

```c++
int __EXPORT ArduPilot_main(int argc, char* const argv[]) {
        hal.run(argc, argv, &copter);
        return 0;
    }
```
其中hal定义为const AP_HAL::HAL& hal = AP_HAL::get_HAL();，而：   

```c++
const AP_HAL::HAL& AP_HAL::get_HAL() {
    static const HAL_PX4 hal_px4;
    return hal_px4;
}

class HAL_PX4 : public AP_HAL::HAL {
public:
    HAL_PX4();
    void run(int argc, char* const argv[], Callbacks* callbacks) const override;
};
```
故hal.run函数即为HAL_PX4里面的run方法，这个main函数主要运行的是这个方法。这个方法能在HAL_PX4_Class.cpp中找到。在这个方法中有：   

```c++
            daemon_task = px4_task_spawn_cmd(SKETCHNAME,
                                             SCHED_FIFO,
                                             APM_MAIN_PRIORITY,
                                             APM_MAIN_THREAD_STACK_SIZE,
                                             main_loop,
                                             NULL);
```
所以这里又调用了main_loop函数，在main_loop函数中，主要分析两点：   

```c++
g_callbacks->setup();
while (!_px4_thread_should_exit) {
g_callbacks->loop();
}
```
setup()函数在板子启动的时候被调用一次，它实际的调用来自每块板子的HAL，所有main函数是在HAL里的，其后就是loop()函数的调用，sketch的主要工作体现在loop()函数里，注意这两个函数只是冰山一角。这段话摘自[理解example sketch代码](/2016/01/introduction-to-start-ArduPilot#1-3)。    
setup、loop函数可以在ArduCopter.cpp中分别找到，其中setup函数里有scheduler.init(&scheduler_tasks[0], ARRAY_SIZE(scheduler_tasks));，这样在这个应用函数里又启动了调度任务:   

```c++
const AP_Scheduler::Task Copter::scheduler_tasks[] = {
    SCHED_TASK(rc_loop,              100,    130),
    SCHED_TASK(throttle_loop,         50,     75),
    SCHED_TASK(update_GPS,            50,    200),
#if OPTFLOW == ENABLED
    SCHED_TASK(update_optical_flow,  200,    160),
#endif
    SCHED_TASK(update_batt_compass,   10,    120),
    SCHED_TASK(read_aux_switches,     10,     50),
    SCHED_TASK(arm_motors_check,      10,     50),
    SCHED_TASK(auto_disarm_check,     10,     50),
    SCHED_TASK(auto_trim,             10,     75),
    SCHED_TASK(update_altitude,       10,    140),
    SCHED_TASK(run_nav_updates,       50,    100),
```
所以apm的源码就是在px4的原生代码上以一个应用的接口加入了自己的调度任务，总的来说就是在px4上加了自己的应用。而在loop函数里开展了主要的循环fast_loop函数，如下：   

```c++
// Main loop - 400hz
void Copter::fast_loop()
{

    // IMU DCM Algorithm
    // --------------------
    read_AHRS();

    // run low level rate controllers that only require IMU data
    attitude_control.rate_controller_run();
    
#if FRAME_CONFIG == HELI_FRAME
    update_heli_control_dynamics();
#endif //HELI_FRAME

    // send outputs to the motors library
    motors_output();

    // Inertial Nav
    // --------------------
    read_inertia();

    // check if ekf has reset target heading
    check_ekf_yaw_reset();

    // run the attitude controllers
    update_flight_mode();

    // update home from EKF if necessary
    update_home_from_EKF();

    // check if we've landed or crashed
    update_land_and_crash_detectors();

#if MOUNT == ENABLED
    // camera mount's fast update
    camera_mount.update_fast();
#endif

    // log sensor health
    if (should_log(MASK_LOG_ANY)) {
        Log_Sensor_Health();
    }
}
```
在这里边进行姿态解算，PID控制等等，那么分析到这里我想完过飞行器的同学就大致清楚了。   
在这个工程里有一个重要的类叫Copter，大部分函数都是该类的方法，如`void Copter::arm_motors_check()`，以后用的一些全局变量基本上都属于这个类里面的。   

下面看一下一些简单的应用，以电机解锁为例子，玩过飞行器的同胞就知道，油门拉杆按右下角几秒就可以解锁，一般都是这样设置的，看看代码都是怎么实现的：   
首先解锁的函数为[arm_motors_check](https://github.com/diydrones/ardupilot/blob/master/ArduCopter/motors.cpp#L14)，调用次数为10hz。代码很简单，从中可以看出，2s后如果检查通过就可以解锁，当飞行器不属于手动控制模式时，拉杆打左下角2s即可上锁。

<br>
#例程学习
对于ardupilot代码的学习，由于工程比较庞大，建议先对库里边的例程进行熟悉，以达到熟悉整个工程的目的。   
下面将AP_HAL_PX4的例程作为一个讲解的示范。

- 首先编译工程，进入例程目录ardupilot/libraries/AP_HAL_PX4/examples/simple，然后进行编译下载make px4-v2-upload即可。
- 连接USB，打开串口界面，使用命令行参考[这里](/2015/12/RTOS-of-px4#1-6)，可以看到有输出"hello world"，然后是“*”循环输出。如下图

	![helloworld](/images/hellosimple.png)
- 查看源代码如下，很容易理解。AP_HAL_MAIN()为宏替换，替换完成后即可知道是main函数，启动该main函数的应用程序为ArduPilot，此应用在rc.APM脚本将要完成时启动，如下。

	```c++
	void setup() {
		hal.console->println("hello world");
	}

	void loop()
	{
		hal.scheduler->delay(1000);
		hal.console->println("*");
	}

	AP_HAL_MAIN();
	```
	```sh
	#脚本部分
	echo Starting ArduPilot $deviceA $deviceC $deviceD
	if ArduPilot -d $deviceA -d2 $deviceC -d3 $deviceD start
	then
	    echo ArduPilot started OK
	else
	    sh /etc/init.d/rc.error
	fi
	```

多次调试发现，hal.console->println或者hal.console->printf及cliSerial->printf函数为usb串口输出，即hal.console为控制台输出，而单独的printf函数为串口5输出。   
由Copter::setup()函数的cliSerial = hal.console;可知，cliSerial为hal.console的别名。

>编译library例程的时候出现如下类似问题：
>
>	```sh
>	make[3]: *** No rule to make target '/home/nephne/src/ardupilot/libraries/AP_Compass/Compass.h', needed by '/home/nephne/src/ardupilot/libraries/AP_AHRS/examples/AHRS_Test/AHRS_Test.cpp.o'.  Stop.
>```
>
>解决办法为删除AHRS_Test.cpp.d文件重新编译。

<hr>
参看文章：[官网](http://dev.ardupilot.com/wiki/apmcopter-code-overview/)/[串级pid](http://bbs.loveuav.com/thread-229-1-1.html)