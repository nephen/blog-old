---
layout: post
title:  "初学ardupilot之应用开发"
categories: "drons_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2016-04-27 01:42:47 Utk
---
>`通知`：**如果你对本站无人机文章不熟悉，建议查看[无人机学习概览](/arrange/drones)！！！**   

#例程学习
对于ardupilot代码的学习，由于工程比较庞大，建议先对库里边如例程进行熟悉，以达到熟悉整个工程的目的。   
下面将AP_HAL_PX4的例程作为一个讲解的示范。

- 首先编译工程，进入例程目录ardupilot/libraries/AP_HAL_PX4/examples/simple，然后进行编译下载make px4-v2-upload即可。
- 连接USB，打开串口界面，可以看到有输出"hello world"，然后是“*”循环输出。如下图

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
