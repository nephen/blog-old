---
layout: post
title:  "ArduPilot开发入门学习"
categories: "drons_lifes"
author: 吴兴章
tags: 工作生活
donate: true
comments: true
---
在学习px4的时候，了解到了ardupilot，如apm无操作系统，入门简单些，且看到它的资料比较多，易懂，故做如下学习记录，为px4打下基础。

<br>
####编译

Ubuntu用户可以参考[链接](http://dev.ardupilot.com/wiki/building-the-code-onlinux/)进行操作，可以从`Advanced`标签开始，注意安装`sudo apt-get install gawk make git arduino-core g++`，然后在相应的文件夹下(如：ArduCopter，参看[APM2.x](http://dev.ardupilot.com/wiki/supported-autopilot-controller-boards/#apm2x)，Copter 3.3或更新固件不再支持APM板)make即可(主目录下默认make所有)。同时还可以编译成在[pixhawk](http://dev.ardupilot.com/wiki/supported-autopilot-controller-boards/#pixhawk)上运行的目标文件，参看这篇[文章](http://dev.ardupilot.com/wiki/building-px4-for-linux-with-make/)，编译`make px4-v2`，上传`make px4-v2-upload`，git更新后清除`make px4-clean`。有几个地方需要注意的:

<!--more-->
- 需要特定的[编译器](http://firmware.diydrones.com/Tools/PX4-tools/)，下载后解压`tar -xjvf gcc-arm-none-eabi-4_6-2012q2-20120614.tar.bz2`，然后编辑$HOME/.bashrc文件，加入`export PATH=$PATH:/home/your_username/bin/gcc-arm-none-eabi-4_6-2012q2/bin`，或者参考我之前写的[文章](http://www.nephen.com/2015/12/%E5%88%9D%E5%AD%A6PX4%E4%B9%8B%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/#%E4%BB%A3%E7%A0%81%E7%BC%96%E8%AF%91)。
- 权限：`sudo usermod -a -G dialout $USER`。
- 安装ccache加快编译速度。    

	```sh
	~ $ sudo apt-get install ccache
	~ $ cd /usr/lib/ccache
	~ $ sudo ln -s /usr/bin/ccache arm-none-eabi-g++
	~ $ sudo ln -s /usr/bin/ccache arm-none-eabi-gcc
	```    
然后将`export PATH=/usr/lib/ccache:$PATH`加入到~/.profile中。

<br>
####参与贡献

知识点：  

1. [创建分支并改变一些代码](http://dev.ardupilot.com/wiki/where-to-get-the-code/#making_a_branch_and_changing_some_code)：fork源仓库，克隆到本地，更改后推送到fork仓库。
2. [保持代码更新](http://dev.ardupilot.com/wiki/where-to-get-the-code/#rebase-based_workflow_keeping_your_code_up_to_date)：添加upstream远程官方库；更新`git fetch upstream`；重置当前的分支`git rebase upstream/master`；推送的fork库`git push origin master`
3. [提交分支到master](http://dev.ardupilot.com/wiki/submitting-patches-back-to-master/)：确保每次提交只是做了一件事情；简洁易懂的注释；[清理本地提交历史](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html)；推送到本地分支；[创建上拉请求](https://help.github.com/articles/using-pull-requests)；在`Pull Request`页面选择`New pull request`按钮；选择需要提交的分支然后点击`Click to create pull request for this comparison`（base branch 是远程官方分支, head branch 是自己要提交的分支，这样做可以在任意时间段进行提交）；每个参与者都会收到新请求消息；管理`pull requests`；查看`proposed changes`；`Pull request`谈论；一段时间后可以查看` long-running pull requests`    

补充知识点：   

1. [Git在子模块](http://dev.ardupilot.com/wiki/git-submodules/)：所有的子模块都放在modules/目录；[常见错误](http://dev.ardupilot.com/wiki/git-submodules/#common_errors)；

<br>
####代码库

原文参考[这里](http://dev.ardupilot.com/wiki/learning-the-ardupilot-codebase/)!!!   

1、ArduPilot的[基本框架](http://dev.ardupilot.com/wiki/learning-ardupilot-introduction/#basic_structure)分为5个主要部分：    

- vehicle目录
- AP_HAL (Hardware Abstraction Layer)：能使ArduPilot移植到不同的平台；目录为 libraries/AP_HAL；
- libraries
- tools目录
- 外部支持代码    

2、makefiles文件是在`mk/directory`目录里，为每个类型的支持定义编译规则，这里有一些辅助的make目标：

- make clean – clean the build for non-px4 targets
- make px4-clean – completely clean the build for PX4 targets
- make px4-cleandep – cleanup just dependencies for PX4 targets

3、探索自己的代码的第一步是使用库的example sketches。知道library API和约定在ArduPilot中的使用对理解代码是至关重要的。你可以看到这些example sketches：

- libraries/AP_GPS/examples/GPS_AUTO_test
- libraries/AP_InertialSensor/examples/INS_generic
- libraries/AP_Compass/examples/AP_Compass_test
- libraries/AP_Baro/examples/BARO_generic
- libraries/AP_AHRS/examples/AHRS_Test

[理解example sketch代码](http://dev.ardupilot.com/wiki/learning-ardupilot-the-example-sketches/#understanding_the_example_sketch_code)：

- 每个使用AP_HAL特性的文件都需要声明一个hal引用，hal的实体在AP_HAL_XXX库里，最常用的hal函数：     
 + hal.console->printf() and hal.console->printf_P() to print strings (use the _P to use less memory on AVR)
 + hal.scheduler->millis() and hal.scheduler->micros() to get the time since boot
 + hal.scheduler->delay() and hal.scheduler->delay_microseconds() to sleep for a short time
 + hal.gpio->pinMode(), hal.gpio->read() and hal.gpio->write() for accessing GPIO pins
 + I2C access via hal.i2c
 + SPI access via hal.spi
- setup()函数在板子启动的时候被调用一次，它实际的调用来在每块板子的HAL，所有main函数是在HAL里的，其后就是loop()函数的调用，sketch的主要工作体现在loop()函数里，注意这两个函数只是冰山一角；
- `AP_HAL_MAIN()`是一个HAL宏，用来产生必要的代码声明C++主要函数，以及一些板级的初始化代码，位于`AP_HAL_XXX_Main.h`。

4、[理解ArduPilot线程](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#understanding_ardupilot_threading)：APM1 and APM2不支持线程，所以要做一个简单的定时器和回调；有很多您需要了解的ArduPilot线程相关的关键概念：

- [定时器回调函数](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#the_timer_callbacks)：在AP_HAL里每个平台提供了一个1 khz 计时器；可以这样注册定时器回调函数(来自MS5611 barometer driver)：

	```c
	hal.scheduler->register_timer_process(AP_HAL_MEMBERPROC(&AP_Baro_MS5611::_update));
	```
- [HAL特定线程](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#hal_specific_threads)：创建一些线程支持基本的操作，这些线程提供了一种调度慢任务而不打断主飞行任务的方法，比如px4上的一些（用USB连接pixhawk，波特率为57600，命令ps，能看到一些固有的线程）：
 + The UART thread, for reading and writing UARTs (and USB)
 + The timer thread, which supports the 1kHz timer functionality described above
 + The IO thread, which supports writing to the microSD card, EEPROM and FRAM

- [驱动程序特定线程](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#driver_specific_threads)：例程见AP_HAL_Linux/ToneAlarmDriver.cpp

- [ArduPilot驱动和不同平台的驱动](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#ardupilot_drivers_versus_platform_drivers)：举个例子，MPU6000传感器，non-PX4 平台使用AP_InertialSensor_MPU6000.cpp驱动，而PX4平台使用AP_InertialSensor_PX4.cpp驱动。

- [平台特定的线程和任务](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#platform_specific_threads_and_tasks)：在某些平台，一些基本的任务和线程将在开机的时候被创建。如PX4：

 - idle task – called when there is nothing else to run
 - init – used to start up the system
 - px4io – handle the communication with the PX4IO co-processor
 - hpwork – handle thread based PX4 drivers (mainly I2C drivers)
 - lpwork – handle thread based low priority work (eg. IO)
 - fmuservo – handle talking to the auxillary PWM outputs on the FMU
 - uavcan – handle the uavcan CANBUS protocol

	它们是由 [rc.APM script](https://github.com/diydrones/ardupilot/blob/master/mk/PX4/ROMFS/init.d/rc.APM)脚本创建，在启动的时候执行，一个学习启动更加有效的方法是无SD卡启动，因为[rcS script](https://github.com/diydrones/ardupilot/blob/master/mk/PX4/ROMFS/init.d/rcS)是在rc.APM之前执行的。可以用pixhawk启动后在nsh里做如下的练习：    

		tone_alarm stop
		uorb start
		mpu6000 start
		mpu6000 info
		mpu6000 test
		mount -t binfs /dev/null /bin
		ls /bin
		perf

<hr>
####参考文章
User Manual: http://copter.ardupilot.com/    
Developer Manual: http://dev.ardupilot.com/