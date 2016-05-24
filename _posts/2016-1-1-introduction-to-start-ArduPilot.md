---
layout: post
title:  "ArduPilot开发入门学习"
categories: "drons_lifes"
author: Lever
tags: 工作生活
donate: true
comments: true
editpage: true
update: 2016-05-24 21:11:41 Utk
---
>`通知`：**如果你对本站无人机文章不熟悉，建议查看[无人机学习概览](/arrange/drones)！！！**

<br>
#编译pixhawk环境搭建
参考[原网页](http://ardupilot.org/dev/docs/building-px4-for-linux-with-make.html)进行说明，有两种搭建环境的方式。   

第一种为自动执行脚本(推荐)，较为方便，但有问题需解决。   

由于使用apt-get update时部分文件无法下载，导致脚本执行不完整，故可将ardupilot/Tools/scripts/install-prereqs-ubuntu.sh文件里的$APT_GET update行用#注释掉。   

然后操作如下：

```sh
~ $ sudo apt-get -qq -y install git
~ $ cd ~/src
#下载源代码
~ $ git clone https://github.com/ArduPilot/ardupilot.git
#修改脚本后运行
~ $ ardupilot/Tools/scripts/install-prereqs-ubuntu.sh -y
~ $ . ~/.profile
#编译Copter
~ $ cd ardupilot/ArduCopter
~ $ make px4-v2
#上传
~ $ make px4-v2 upload
```
第二种为手动搭建环境，这里只提出一些主要的注意事项。

- 需要特定的交叉编译器，更多参考搭建px4原生开发环境的[文章](/2015/12/env-build-of-px4#1-4)。

	```sh
	pushd .
	# => 卸载新版的gcc-arm-none-eabi
	~ $ sudo apt-get remove gcc-arm-none-eabi
	~ $ wget https://launchpadlibrarian.net/186124160/gcc-arm-none-eabi-4_8-2014q3-20140805-linux.tar.bz2
	# => 安装下载好的gcc-arm-none-eabi
	~ $ tar xjvf gcc-arm-none-eabi-4_8-2014q3-20140805-linux.tar.bz2
	~ $ sudo mv gcc-arm-none-eabi-4_8-2014q3 /opt
	~ $ exportline="export PATH=/opt/gcc-arm-none-eabi-4_8-2014q3/bin:\$PATH"
	~ $ if grep -Fxq "$exportline" ~/.profile; then echo nothing to do ; else echo $exportline >> ~/.profile; fi
	# => 使路径生效
	~ $ . ~/.profile
	popd
	```
- 安装ccache加快编译速度。    

	```sh
	~ $ sudo apt-get install ccache
	~ $ cd /usr/lib/ccache
	~ $ sudo ln -s /usr/bin/ccache arm-none-eabi-g++
	~ $ sudo ln -s /usr/bin/ccache arm-none-eabi-gcc
	```    
	然后将`export PATH=/usr/lib/ccache:$PATH`加入到~/.profile中。
- 安装make, gawk，genromfs等linux开发工具。
- 权限：`sudo usermod -a -G dialout $USER`。

<!--more-->

> `Tip`：编译过程中主要问题：   
>1、考虑更新子模块，所有的子模块都放在modules/目录
> 
> 	```sh
>	git submodule init
>	git submodule update --recursive
>	#或者一行就行
>	git submodule update --init --recursive
> 	```
> 2、如果以前编译正确，更新子模块后出现问题，`make px4-clean`后重新编译   
>
> 3、如果子模块更新的时候出现如下错误：   
>
>	```
>	fatal: 目标路径 'src/lib/ecl' 已经存在，并且不是一个空目录。
>	无法克隆 'https://github.com/PX4/ecl.git' 到子模组路径 'src/lib/ecl'
>	```
>直接删除src/lib/ecl即可。



<br>
#参与贡献

wiki知识点：  

1. [创建分支并改变一些代码](http://dev.ardupilot.com/wiki/where-to-get-the-code/#making_a_branch_and_changing_some_code)：fork源仓库，克隆到本地，更改后推送到fork仓库。
2. [保持代码更新](http://dev.ardupilot.com/wiki/where-to-get-the-code/#rebase-based_workflow_keeping_your_code_up_to_date)：添加upstream远程官方库；更新`git fetch upstream`，[fetch与pull的区别](http://blog.csdn.net/hudashi/article/details/7664457)；重置当前的分支`git rebase upstream/master`，这里可能有冲突需要解决；更新[子模块](https://git.kaarsemaker.net/git/blob/a9ce45430b380b982de6f6cf24a96849e4d2feed/po/zh_CN.po)；推送的fork库`git push origin master`
3. [提交分支到master](http://dev.ardupilot.com/wiki/submitting-patches-back-to-master/)：确保每次提交只是做了一件事情；简洁易懂的注释；[清理本地提交历史](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html)；推送到本地分支`git push -f origin master`；[创建上拉请求](https://help.github.com/articles/using-pull-requests)；在`Pull Request`页面选择`New pull request`按钮；选择需要提交的分支然后点击`Click to create pull request for this comparison`（base branch 是远程官方分支, head branch 是自己要提交的分支，这样做可以在任意时间段进行提交）；每个参与者都会收到新请求消息；管理`pull requests`；查看`proposed changes`；`Pull request`谈论；一段时间后可以查看` long-running pull requests`   

下面我以ardupilot这个开源项目为例子做一个实际的演示：

1. 下载源码并设置源，这一步只需进行一次就可以了。

	```sh
	#首先进入https://github.com/ArduPilot/ardupilot进行fork
	#然后如下下载源码
	~ $ git clone git@github.com:your_github_name/ardupilot.git
	#设置官方更新源，一般origin 默认已经设置
	~ $ git remote add upstream git@github.com:ArduPilot/ardupilot.git
	#查看设置源效果
	~ $ git remote -v
	#正常显示如下
	origin  git@github.com:your_github_name/ardupilot.git (fetch)
	origin  git@github.com:your_github_name/ardupilot.git (push)
	upstream        https://github.com/diydrones/ardupilot.git (fetch)
	upstream        https://github.com/diydrones/ardupilot.git (push)
	```

2. 更改代码并推送到fork库。

	```sh
	#首先添加更改的文件， .代表添加所有更改的文件
	~ $ git add .
	#查看添加状况
	~ $ git status
	#添加更改注释
	~ $ git commit -m "your comment"
	#推送到fork库
	~ $ git push origin master
	```

3. 保持与官方源代码同步，这一步一般与步骤2结合，保证推送到fork库时是在最新的代码上进行的更改。

	```sh
	~ $ git fetch upstream master
	#重置当前的分支
	~ $ git rebase upstream/master
	#一般这里都需要更新子模块
	~ $ git submodule update --init --recursive
	#查看更新结果
	~ $ git status
	#如果更新后产生了冲突，先解决冲突再按照步骤2进行add/commit
	```

4. 在`Pull Request`页面选择`New pull request`按钮；选择需要提交的分支然后点击`Click to create pull request for this comparison`（base branch 是远程官方分支, head branch 是自己要提交的分支，这样做可以在任意时间段进行提交）

	<img src="/images/newpull.png">

<br>
#代码库

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
- setup()函数在板子启动的时候被调用一次，它实际的调用来自每块板子的HAL，所有main函数是在HAL里的，其后就是loop()函数的调用，sketch的主要工作体现在loop()函数里，注意这两个函数只是冰山一角；
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
	这些的源代码在[PX4Firmware/src/drivers](https://github.com/diydrones/PX4Firmware/tree/master/src/drivers)里，如果你看了mpu6000驱动，你会看到这么一行：

		hrt_call_every(&_call, 1000, _call_interval, (hrt_callout)&MPU6000::measure_trampoline, this);
	它跟AP_HAL里的hal.scheduler->register_timer_process()是等效的，用在操作迅速的常规事件里，如SPI设备驱动。或者你还可以看到hmc5883驱动里的

		work_queue(HPWORK, &_work, (worker_t)&HMC5883::cycle_trampoline, this, 1);
	而这个适用于速度慢一点的设备，比如IIC。
- [AP_Scheduler系统](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#the_ap_scheduler_system)：AP_Scheduler 库的作用是在主线程里面划分时间片；可以通过例子[ AP_Scheduler/examples/Scheduler_test.cpp](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_Scheduler/examples/Scheduler_test/Scheduler_test.cpp)学习，这个文件里边有一个表单：

	```c
	static const AP_Scheduler::Task scheduler_tasks[] PROGMEM = {
	 { ins_update, 1, 1000 },
	 { one_hz_print, 50, 1000 },
	 { five_second_call, 250, 1800 },
	};
	```
	函数后面的第一个数字是调用频率，它的单位由ins.init()调用控制，这个例子使用的是RATE_50HZ，即20ms，所以ins_update()调用是20ms一次，one_hz_print()调用是1s一次，five_second_call为5s一次。第三个数字是函数预计花费的最长时间。另一个关键点是 ins.wait_for_sample()函数的调用，它是ArduPilot驱动调度的节拍器，它阻塞主函数的执行直到一个新的IMU采集的到来，而阻塞的时间是由ins.init()控制的。 AP_Scheduler tables必须有如下的属性：
	- 它们不能被阻塞，除非ins.update()被调用；
	- 在飞行中不能执行睡眠函数；
	- 它们应该有可预测的最坏情况时间；   
	
	现在可以在Scheduler_test例子里做练习了。 比如做如下的事情：
	
		read the barometer
		read the compass
		read the GPS
		update the AHRS and print the roll/pitch

- [信号量](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#semaphores)：为了防止多个线程访问一个共享的数据结构而产生冲突，这里有三种原理方法：semaphores, lockless data structures and the PX4 ORB；查看libraries/AP_Compass/AP_Compass_HMC5883.cpp里的_i2c_sem变量，自己探索它的工作原理。

- [无锁的数据结构](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#lockless_data_structures)：ArduPilot两个无锁的数据结构的例子：
 - the _shared_data structure in libraries/AP_InertialSensor/AP_InertialSensor_MPU9250.cpp
 - the ring buffers used in numerous places. A good example is libraries/DataFlash/DataFlash_File.cpp

 	DataFlash_File中可以查看 _writebuf_head 和 _writebuf_tail两个变量。

- [PX4 ORB](http://dev.ardupilot.com/wiki/learning-ardupilot-threading/#the_px4_orb)：ORB是一种从系统的一部分到系统的另一部分提供数据的方式，它在一个多线程的环境中使用了发布/订阅模型。所有的定义都在[PX4Firmware/src/modules/uORB/topics](https://github.com/diydrones/PX4Firmware/tree/master/src/modules/uORB/topics)；例子有AP_HAL_PX4/RCOutput.cpp里的_publish_actuators()，你将看到它订阅了一个“actuator_direct”主题，它包含了每个电调的设定速度。    
另外的两种与px4驱动通信的机制为：
 - ioctl calls (see the examples in AP_HAL_PX4/RCOutput.cpp)
 - /dev/xxx read/write calls (see _timer_tick in AP_HAL_PX4/RCOutput.cpp)

5、[uart和控制台](http://dev.ardupilot.com/wiki/learning-ardupilot-uarts-and-the-console/)：ArduPilot HAL目前有5UARTs：

- uartA – the console (usually USB, runs MAVLink telemetry)
- uartB – the first GPS
- uartC – primary telemetry (telem1 on Pixhawk, 2nd radio on APM2)
- uartD – secondary telemetry (telem2 on Pixhawk)
- uartE – 2nd GPS

你可以任意使用，但最好是按它原来的方式，因为有现成的代码。有些UARTs有着双重角色，如SERIAL2_PROTOCOL参数使uartD用于MAVLink变为用于Frsky telemetry。可以参看这个例子 [libraries/AP_HAL/examples/UART_test](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_HAL/examples/UART_test/UART_test.cpp)做练习。    
每个UART有一些基本的IO函数：

- printf – formatted print
- printf_P – formatted print with progmem string (saves memory on AVR boards)
- println – print and line feed
- write – write a bunch of bytes
- read – read some bytes
- available – check if any bytes are waiting
- txspace – check how much outgoing buffer space is available
- get_flow_control – check if the UART has flow control capabilities

6、[RC输入与输出](http://dev.ardupilot.com/wiki/learning-ardupilot-rc-input-output/)：ArduPilot根据板类支持几种不同类型的RC输入：

- PPMSum – on PX4, Pixhawk, Linux and APM2
- SBUS – on PX4, Pixhawk and Linux
- Spektrum/DSM – on PX4, Pixhawk and Linux
- PWM – on APM1 and APM2
- RC Override (MAVLink) – all boards

	其中SBUS 和 Spektrum/DSM都是串口协议。

RC输出是ArduPilot控制伺服系统和电机，RC输出默认为50 hz PWM值，但是可以更高，通常在400hz。

- [AP_HAL RCInput对象](http://dev.ardupilot.com/wiki/learning-ardupilot-rc-input-output/#ap_hal_rcinput_object)(hal.rcin)

	它提供目前板上收到的低级的访问通道值。例子为[libraries/AP_HAL/examples/RCInput/RCInput.cpp](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_HAL/examples/RCInput/RCInput.cpp)。
- [AP_HAL RCOutput](http://dev.ardupilot.com/wiki/learning-ardupilot-rc-input-output/#ap_hal_rcoutput_object)(hal.rcout)

	hal.rcin 和 hal.rcout 对象都是低级函数，所有用户配置都是通过RC_Channel，例子在 [libraries/RC_Channel/examples/RC_Channel/RC_Channel.cpp](https://github.com/diydrones/ardupilot/blob/master/libraries/RC_Channel/examples/RC_Channel/RC_Channel.cpp)。
- [RC_Channel_aux](http://dev.ardupilot.com/wiki/learning-ardupilot-rc-input-output/#the_rc_channel_aux_object)

	位于libraries/RC_Channel，是RC_Channel的子类，可以由用户指定附加属性。

7、[存储和eeprom管理](http://dev.ardupilot.com/wiki/learning-ardupilot-storage-and-eeprom-management/)

- [AP_HAL::Storage](http://dev.ardupilot.com/wiki/learning-ardupilot-storage-and-eeprom-management/#the_ap_halstorage_library)：hal.storage API有三个主要的函数：
 - init() to start up the storage subsystem
 - read_block() to read a block of bytes
 - write_block() to write a block of bytes

	提倡使用API，只有在使用新板子或debug的时候才用hal.storage。可用存储的大小 [AP_HAL/AP_HAL_Boards.h](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_HAL/AP_HAL_Boards.h)里的宏HAL_STORAGE_SIZE定义。所以如果你想使用动态存储只能使用Posix IO。

- [StorageManager库](http://dev.ardupilot.com/wiki/learning-ardupilot-storage-and-eeprom-management/#the_storagemanager_library)

	详情见[libraries/StorageManager/StorageManager.cpp](https://github.com/diydrones/ardupilot/blob/master/libraries/StorageManager/StorageManager.cpp)，在板子上做测试的时候注意备份好配置文件。

- [DataFlash库](http://dev.ardupilot.com/wiki/learning-ardupilot-storage-and-eeprom-management/#the_dataflash_library)

	用于板载logs；也提供API从log文件里边取回数据；例子 [libraries/DataFlash/examples/DataFlash_test/DataFlash_test.cpp](https://github.com/diydrones/ardupilot/blob/master/libraries/DataFlash/examples/DataFlash_test/DataFlash_test.cpp)，或者在loop()里可以看到：

		DataFlash.get_log_boundaries(log_num, start, end);

- [Posix IO](http://dev.ardupilot.com/wiki/learning-ardupilot-storage-and-eeprom-management/#posix_io)

	一个很好的例子是AP_Terrain库,其中包含地形数据；是否支持可以从 [AP_HAL_Boards.h](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_HAL/AP_HAL_Boards.h)查看HAVE_OS_POSIX_IO macro，还可以定义数据的存储位置；这个操作比较耗时，特别在飞行过程中不宜使用；可以看这个例子 [libraries/AP_Terrain/TerrainIO.cpp](https://github.com/diydrones/ardupilot/blob/master/libraries/AP_Terrain/TerrainIO.cpp)学会怎么使用Posix IO。

<hr>
#上位机安装
由于我使用的是Ubuntu, 所以我会想办法使Mission Planner上位机能在linux平台上运行，在pixhawk的官网上也发现了这样的[文章](https://pixhawk.org/users/ground_control_stations/start#apm_mission_planner)以及谷歌搜到的[文章](http://www.rcgroups.com/forums/showthread.php?t=2179591)。

这里[mono](https://github.com/diydrones/MissionPlanner/blob/master/README.md)[版本](http://download.mono-project.com/sources/mono/)下载，参考[Install Mono on Linux](http://www.mono-project.com/docs/getting-started/install/linux/)安装mono

```sh
~ $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
# => If for some reason you want to pin an older version of Mono rather than updating to the latest, you can modify the Debian repository to “wheezy/snapshots/X.XX.X” instead of “wheezy”. For example, “wheezy/snapshots/3.10.0” will lock you to that version.
~ $ echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
~ $ echo "deb http://download.mono-project.com/repo/debian wheezy-apache24-compat main" | sudo tee -a /etc/apt/sources.list.d/mono-xamarin.list
~ $ sudo apt-get update
~ $ sudo apt-get install mono-runtime
~ $ sudo apt-get install mono-complete festival
# => The package mono-devel should be installed to compile code.
# => The package mono-complete should be installed to install everything - this should cover most cases of “assembly not found” errors.
# => The package referenceassemblies-pcl should be installed for PCL compilation support - this will resolve most cases of “Framework not installed: .NETPortable” errors during software compilation.
# => The package ca-certificates-mono should be installed to get SSL certificates for HTTPS connections. Install this package if you run into trouble making HTTPS connections.
# => 或者单独安装，这样比较省硬盘
# => festival 用于MP的语言输出
~ $ sudo apt-get install mono-runtime libmono-system-windows-forms4.0-cil libmono-system-xml-linq4.0-cil libmono-system-management4.0-cil libmono-system-web4.0-cil libmono-corlib4.5-cil libmono-system-numerics4.0-cil festival
~ $ mono MissionPlanner.exe
```

If the .NET program does run well under Mono then running it with Mono would be a better choice. You can extract the executables from the MSI using something like 7zip.

It's like this:

Program -> Mono (Framework) -> System

Versus

Program -> .NET (Framework) -> WINE -> System

然后下载Mission Planner的[ZIP版本](http://ardupilot.com/downloads/?did=83)，解压运行即可。

```sh
~ $ wget http://ardupilot.com/wp-content/plugins/download-monitor/download.php?id=83
```



对于apm_planner2可以选择安装[linux版](http://ardupilot.com/downloads/?did=111)

```sh
~ $ wget http://firmware.diydrones.com/Tools/APMPlanner/apm_planner2_latest_ubuntu_trusty64.deb
~ $ sudo dpkg -i apm_planner2_latest_ubuntu_trusty64.deb
```

<hr>
#参考文章
User Manual: http://copter.ardupilot.com/    
Developer Manual: http://dev.ardupilot.com/