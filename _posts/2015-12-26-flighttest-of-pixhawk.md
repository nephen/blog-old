---
layout: post
title:  "pixhawk试飞报告"
categories: "drons_lifes"
author: 吴兴章
tags: 工作生活
donate: true
comments: true
update: 2016-04-12 01:59:43
---
本文将一个新手学习px4入门，装机，PID调节过程，以及试飞注意事项陈述如下：

<br>
#器件准备

硬件一套，包括DJI F450机架、Pixhawk 2.4.6 mini飞控、好盈乐天20A电调、1045正反桨、银燕电机2216、天地飞6通道遥控器。详情见淘宝链接里的[套餐方案](https://item.taobao.com/item.htm?spm=a1z10.5-c.w4002-8717792970.38.rv3aHa&id=41190426449)。

这些是PX4自动驾驶仪的元件要求：   

- 1x Pixhawk 或者 FMU + IO Kit (Pixhawk 和FMU + IO是一样的)
- 1x u-blox GPS模块
- 1x RC 接收器
- 1x 无线数传
- 多块3300 mAh LiPo电池，至少能提供25A/30A电流。最好是买几个相同的电池为了保持直升飞机更换电池的重量恒定。

<br>
#装机

 这里有多达200页的超详细图文[教程](http://pan.baidu.com/s/1gdnUmZ5)，一步一步教您装机，学不会都很难！       
 更多查询EXUAV-mini测评报告[产品介绍](http://www.moz8.com/forum.php?mod=viewthread&tid=43424&extra=p)、[产品开箱](http://www.moz8.com/forum.php?mod=viewthread&tid=43476&ex)、[飞控接线与安装](http://www.moz8.com/forum.php?mod=viewthread&tid=43479&extra=page%3D1)、飞行测试（视频来源：EXUAV）如下

 <embed src="http://cloud.video.taobao.com/play/u/2228740069/e/1/t/3/p/2/27399435.swf" quality="high" width="100%" height="100%" align="middle" allowScriptAccess="never" allowFullScreen="true" type="application/x-shockwave-flash"></embed>        

<!--more-->
 pix4 mini主要装机图文概览（注：图片来源于模友之吧，如有不妥，请提出）：      
 <input type="button" value="显示图片" onclick="showme()" />
<div id="showpic" style="display:none">
 <hr>
<center><p>`前排插针` </p></center>
 <img src="/images/前排插针.png">
 <hr>
<center><p>` 后排插针` </p></center>
<img src="/images/后排插针.png">
<hr>
<center><p>`蜂鸣器`</p></center>
<img src="/images/buzzer.jpg">
<hr>
<center><p>`PM 电源电压电流计` </p></center>
<img src="/images/pm.jpg">
<hr>
 <center><p>`PPM 转接板` </p></center>
<img src="/images/ppm.png">
<hr>
<center><p>` 安全开关` </p></center>
<img src="/images/safeswitch.png">
<hr>
<center><p>` 迷你OSD` </p></center>
<img src="/images/osd.jpg">
<hr>
<center><p>` GPS 和罗盘` </p></center>
<img src="/images/gpsmag.jpg">
<hr>
<center><p>` 数传` [使用说明](http://planner.ardupilot.com/wiki/common-3dr-radio-version-2/)</p></center>
<img src="/images/3dr.png">
<hr>
<center><p>` b6平衡充` </p></center>
<img src="/images/b6.jpg">
<hr>
<center><p>`电机转向`</p></center>
<center><a href="https://pixhawk.org/_detail/airframes/quadrotor_x_assignment.png?id=platforms%3Amulticopters%3Astart"><img src="/images/quadrotor_x_assignment.png"></a></center>
<hr>
<center><p>` 电机实际连接图：装浆的时候按住浆不动，按照上图所示电机转向旋转电机即可` </p></center>
<img src="/images/mainout.jpg">
<hr>
<center><p>` 装机完成` </p></center>
<img src="/images/finished.jpg">
</div> 

你也可以看如下的视频教程：
分为几个视频    
第一个为安装（分电板焊接，电机香蕉头焊接，整机组装，飞控以及配件的安装）    
第二个为遥控器设置（混控，失控保护设置）    
第三个为地面站使用（固件刷写，reset，校准）
<embed src="http://player.youku.com/player.php/sid/XMTI2MjA2MTI4NA==/v.swf" allowFullScreen="true" quality="high" width="100%" height="100%" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>    
关于APM版的pixhawk参考[泡泡老师教程](http://www.moz8.com/thread-41095-1-1.html)，注意电压电流校准，及低电压报警设置，不然会飞不久自动降落。

>`注意`：   

>- 上电测试：检查焊点的极性(黑色/红色)。卸载螺旋桨，准备新的电池到室外去。不要压在四轴上，连接电池，随时准备拔掉电池。四个电机将同时响。这个测试的目的是确保在装配没有导致短路或反极性。
>- 连接电机：根据上面电机转向的图片，经过转向测试后连接电机。
>- 电源线路连接：详细请见[Powering the Pixhawk](http://planner.ardupilot.com/wiki/common-powering-the-pixhawk/)
>- 主控板接口说明：详情见[pixhawk模块](https://pixhawk.org/modules/pixhawk#connectors)

<!--more-->
<br>
#安装QGC

QGroundControl地面站简称QGC，通过[官网](http://qgroundcontrol.org/downloads)[下载](https://github.com/mavlink/qgroundcontrol/releases/)安装，普通用户应该下载稳定版本，如果是开发人员，可以参考[这里](http://www.nephen.com/2015/12/%E5%88%9D%E5%AD%A6PX4%E4%B9%8B%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA#%E5%9C%B0%E9%9D%A2%E6%8E%A7%E5%88%B6%E7%AB%99qgc)安装daily build版本。

<br>
#更新固件&校准

按照下面[视频](https://www.youtube.com/embed/91VGmdSlbo4)里的步骤进行。
<iframe src="https://www.youtube.com/embed/91VGmdSlbo4" height="394" width="700" class="vshare__none" allowfullscreen="" frameborder="0" scrolling="no"></iframe>

这里注意的有：   

方位角都设为0, gps的方向与主控方向相同。

<img src="/images/3apm.png">

<br>
#系统提示

请观看下面的[视频](https://www.youtube.com/embed/4R3XEESGdI8)了解如何锁定,解除系统。注意音频和视觉信号。

<iframe width="700" height="394" src="https://www.youtube.com/embed/4R3XEESGdI8" frameborder="0" allowfullscreen></iframe>

<br>
#测试手动模式

试飞的第一步就是测试手动（直通）模式。就是直接通过遥控器控制飞行器，所有的飞行都必须这一步。   

##**电池连接**   

当系统进入手动状态时，动力只有通过USB将无法驱动伺服系统。你必须连接一个电池，飞行模式才能正常运行。

##**手动模式**

确保你已经完成了遥控器的校准。   
按照如下方式进入手动模式：   

- 开启QGC(可选)
- 打开遥控器
- 给px4供电
- 连接px4 USB(可选)
- 按下安全开关直到快速闪动
- 将遥控器的油门杆打到右下角
- 你能听得px4代表armed的声音警报
- 移动油门杆可以看到电机转动

<br>
#手机控制(可选)
可以自己买一个蓝牙从机模块如hc-06，按照串口的连接方式连接到pixhawk的数传接口TELEM1，注意蓝牙的波特率设为57600，然后下载手机端地面站如[飞鱼地面站](http://fir.im/fishDroneGCS)或[playUAV](http://www.playuav.com/article/53)进行蓝牙连接即可。如果只是想查看地面站信息，这样可以省掉一个数传哦。

连接方式如下图：   

<img src="/images/hc06.jpg">

<br>
#PID调节(可选)
调参请装至QGC界面参数窗口！    
![pidtune](/images/pidtune.png) 
或者找到System Parameters > SYS_AUTOSTART，如果为4011，则找到/src/Firmware/ROMFS/px4fmu_common/init.d里的4011_dji_f450进行更改，当然也可自行添加，例子如下：     

```sh
#!nsh
#
# @name DJI Flame Wheel F450
#
# @type Quadrotor x
#
# @output AUX1 feed-through of RC AUX1 channel
# @output AUX2 feed-through of RC AUX2 channel
# @output AUX3 feed-through of RC AUX3 channel
#
# @maintainer Lorenz Meier <lorenz@px4.io>
#

sh /etc/init.d/4001_quad_x

if [ $AUTOCNF == yes ]
then
	param set MC_ROLL_P 7.0
	param set MC_ROLLRATE_P 0.15
	param set MC_ROLLRATE_I 0.05
	param set MC_ROLLRATE_D 0.01
	param set MC_PITCH_P 7.0
	param set MC_PITCHRATE_P 0.15
	param set MC_PITCHRATE_I 0.05
	param set MC_PITCHRATE_D 0.01
	param set MC_YAW_P 2.8
	param set MC_YAWRATE_P 0.3
	param set MC_YAWRATE_I 0.1
	param set MC_YAWRATE_D 0.0
	# DJI ESCs do not support calibration and need a higher min
	param set PWM_MIN 1230
fi

# Transitional support: ensure suitable PWM min/max param values
if param compare PWM_MIN 1075
then
	param set PWM_MIN 1230
fi
```

##**介绍**

PX4 multirotor_att_control应用程序执行一个外循环的方向控制器，相关参数为：    

 - 翻滚角(MC_ROLL_P)
 - 俯仰角(MC_PITCH_P)
 - 航向角(MC_YAW_P)

和一个内部循环，有三个独立的控制角度变化率PID控制器：   

 - 翻滚角率(MC_ROLLRATE_P, MC_ROLLRATE_I, MC_ROLLRATE_D)
 - 俯仰角率(MC_PITCHRATE_P, MC_PITCHRATE_I, MC_PITCHRATE_D)
 - 航向角率(MC_YAWRATE_P, MC_YAWRATE_I, MC_YAWRATE_D)     

外部循环的输出是机体的目标速率（eg. 如果四轴目标角度为0，而目前左右倾斜30度，那么控制输出将可以是这样的：翻滚速率为60度每秒）。内部速率控制回路改变电机输出，这样四轴能按所需的角速度旋转。

这些参数的大小实际上有一个直观的意义，eg. 如果MC_ROLL_P的值为6.0，四轴将补偿的角度偏差值为0.5弧度(30度)，那么目标角速率将为3 弧度/秒。然后如果内环MC_ROLLRATE_P的值为0.1，最后输出给翻滚角的油门控制量将为3 * 0.1 = 0.3。这意味着它将降低电机一边30%的速度，增加另一边30%速度来诱导角动量回到水平。   

这里还有一个MC_YAW_FF参数，它控制用户输入反馈给航向速率控制器的灵敏度。0代表非常慢的控制，只有航向位置错误的时候控制器才会响应，1代表灵敏的控制，但是可能有些过调，由于控制器移动航向迅速，导致很难保持航向为0。   

##**第一步：准备**

首先，把所有的参数设为初始值：   

1. 设置MC_XXX_P为0(ROLL, PITCH, YAW)
2. 设置所有的MC_XXXRATE_P, MC_XXXRATE_I, MC_XXXRATE_D为0，除了MC_ROLLRATE_P 和 MC_PITCHRATE_P。
3. 设置MC_ROLLRATE_P 和 MC_PITCHRATE_P为一个比较小的值，比如. 0.02
4. 设置MC_YAW_FF为0.5   

所有的参数应该慢慢的增大，每次增大20%到30%，甚至最后10%，注意：参数过大会导致非常危险的震荡，即使只有理想参数的1.5到2倍。   

##**第二步：稳定横滚和俯仰率**

`P调优`    
参数：MC_ROLLRATE_P, MC_PITCHRATE_P   

如果四轴是对称的，那么ROLL和PITCH的值应该相等，否则应该独立的调整。    

把四轴拿到手上，然后增大油门到大约50%，这样四轴重量可以视为0。使它在翻滚角或者俯仰角方向倾斜，观察起反应。它应该温和的转动，但是它不会回到水平。如果出现震荡，把RATE_P调小。一旦控制响应缓慢但正确，增加RATE_P直到它开始振荡。然后减小RATE_P直到它只有轻微摆动或不再摆动（大约减少10%）,稍微有点过调。典型的值大约是0.1。   

`D调优`   
参数：MC_ROLLRATE_D, MC_PITCHRATE_D   

假设P参数是一个使电机震荡的状态，RATE_P略小。慢慢的增大RATE_D，从0.01开始，直到震荡停止之前。如果电机出现颠簸，RATE_D太大了，减小它。通过RATE_P和RATE_D可以调优四轴的响应。典型值为0.01到0.02。      

在QGC中，可以绘出roll和pitch的变化速率图(ATTITUDE.rollspeed/pitchspeed)。它不能震荡，可以有10%到20%的过调。    

`I调优`   

如果横滚速率和俯仰速率没有达到设定值，但有一个偏移量，加上MC_ROLLRATE_I和MC_PITCHRATE_I参数。从MC_ROLLRATE_P值的5-10%开始调。   

##**第三步：稳定横滚和俯仰角度**    

`P调优`   
参数：MC_ROLL_P, MC_PITCH_P     

1. 设置 MC_ROLL_P 和 MC_PITCH_P到一个比较小的值，比如. 3   

把四轴拿到手上，然后增大油门到大约50%，这样四轴重量可以视为0。使它在翻滚角或者俯仰角方向倾斜，观察起反应。它应该缓慢回到水平。如果出现震荡，调整P。只要控制响应缓慢但正确，继续增大P直到出现震荡。最优的响应是10-20%的过调。得到稳定的响应后重新调整RATE_P, RATE_D参数。    

在QGC上位机里，你能绘出roll和pitch的图像(ATTITUDE.roll/pitch)及control(ctrl0,ctrl1)。姿态角如果过调不能超过10-20%。    

##**第四步：稳定航向速率**  

`P调优`   
参数：MC_YAWRATE_P。   

1. 设置MC_YAWRATE_P为一个比较小的值，比如. 0.1   

把四轴拿到手上，然后增大油门到大约50%，这样四轴重量可以视为0。然后绕Z轴旋转，观察其响应。电机的声音听起来改变了，系统有阻止旋转的趋势。响应将大大低于横滚和俯仰，这是可以的。如果出现震荡或者颠簸，调小RATE_P。如果很小的移动出现很大的响应（大油门和小油门时），减小RATE_P。典型值为0.2到0.3。    

航向速率控制如果非常强烈甚至震荡，会恶化横滚和俯仰的响应。扭转横滚、俯仰和偏航检查总反应。   

##**第五步：稳定航向角**

`P调优`   
参数：MC_YAW_P。    

1. 设置MC_YAW_P为一个比较小的值，比如1。   

把四轴拿到手上，然后增大油门到大约50%，这样四轴重量可以视为0。然后绕Z轴旋转，观察其响应。它应该慢慢回到起始方向。如果出现震荡，调小P。只要控制响应缓慢但正确，继续增大P，直到响应稳定，但是不震荡。典型值是2到3。   

可以在QGC里查看ATTITUDE.yaw。航向角过调不能超过2-5%(比姿态角要小)。

`反馈调优`   
参数：MC_YAW_FF。   

这个参数不是关键，可以在飞行时调整，在最差情况下是偏航角响应迟缓或太快。调整FF参数得到一个合适的响应。有效范围为0到1。典型值为0.8到0.9。（如果用于航拍，建议将值调小以得到更加圆滑的反应）     

可以在QGC里查看ATTITUDE.yaw。航向角过调不能超过2-5%(比姿态角要小)。

<hr>
#飞行注意事项及效果
<center><p>起飞阶段</p></center>

![taoff](/images/taoff.jpg) 

飞行log分析：http://logs.uaventure.com/view/dgz379gyc72broL4k6TQHL    
apm数据分析：http://ardupilot.org/dev/docs/using-mavexplorer-for-log-analysis.html    
简单来说命令就是：MAVExplorer.py *.BIN    
或者使用FlightPlot：https://github.com/DrTon/FlightPlot   

官方测试：

<iframe width="560" height="315" src="https://www.youtube.com/embed/RF0wnQv3aAc" frameborder="0" allowfullscreen></iframe>

<hr>
参考文献：[用户文档](https://pixhawk.org/users/start)/[用户教程](https://pixhawk.org/users/tutorials)/[快速学习](https://pixhawk.org/users/first_steps)/[多轴飞行器教程](https://pixhawk.org/platforms/multicopters/start)/[F450安装](https://pixhawk.org/platforms/multicopters/dji_flamewheel_450)/[PID调试](https://pixhawk.org/users/multirotor_pid_tuning)