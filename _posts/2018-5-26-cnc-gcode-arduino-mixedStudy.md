---
layout: post
title:  "cnc-gcode-arduino等混杂学习笔记"
categories: "work_lifes"
author: Lever
tags: 工作
donate: true
comments: true
update: 2017-06-17 18:41:03 Utk
---
<br>
# 前言
个人在学习3d打印的过程中遇到了一些疑惑，知道有一天，为感觉有了一定的收获，现决定把它记载下来，供大家参考，另外也为自己留一个备份。3d打印是一个很令人惊叹的东西，我有很强烈的欲望把它研究清楚，同时它对机械臂的规划与控制提供了一定的参考作用，而且有开源的资源可以学习，后续我将更好的巩固机械臂的相关技术技巧。

<!--more-->

<br>
# gcode文件的制作
gcode文件是3d打印的通用协议文件，可以看作是一门语言。那我现在有一个需求，就是让3d打印机能够打印出我给出的3d模型，应该做些什么呢？可想而知，需要给出该3D模型对应的gcode文件，该gcode文件将模型信息转化为路径，最后生成这些路径对应的gcode文件，目前已经存在这样的软件，即导入3D模型，即可生成gcode文件，可参考[cura](https://github.com/Ultimaker/Cura),该切片软件可以在windows、linux、osx多平台进行安装，该软件需要3d模型文件如stl等。最后将另存为生成的gcode文件导入[printrun](https://github.com/kliment/Printrun)中即可控制打印机运行。

那我还有一个问题？如果我不想打印3d模型，我只是想写几个字或者画个画呢？其实想对比而言，这里只是二维模型而已，3d打印模型是打完一层还有一层，而这个只需要打印一层即可。但是非常遗憾的是直接使用cura是无法将字或者图片转换为gcode的，我们这里需要另外一款软件，叫[inkspace](https://inkscape.org/zh/release/0.48.5/platforms/),建议下载这个版本，因为后面还需要装一个插件，inkspace是能够将图片字体等转换为路径，而插件[nkscape-unicorn](https://github.com/martymcguire/inkscape-unicorn)才是真正的将路径转换为gcode文件。
这里需要注意一下，网上还有一个插件叫做[gcodetools](https://github.com/cnc-club/gcodetools),但是这个插件转换成的插件含有曲线命令，如果打印机不支持圆弧曲线命令，那么还是需要使用unicorn的插件。关于unicon的插件使用方法可以参考[用inksacpe把图像转换成gcode文件](https://www.bilibili.com/video/av10491675/)以及[MINI CNC PLOTTER - ARDUINO BASED](http://www.instructables.com/id/Mini-CNC-Plotter-Arduino-Based/)。

<br>
# 固件相关命令的使用

1. 恢复默认设置
M502

2. 读取配置信息
M503

3. 设置机械臂长度参数

注：M366 机械臂臂长等参数 B200：主臂长200mm；S214.7：副臂长214.7mm；C40：光轴垂直投影和旋转中心的距离40mm；H58：笔夹中心线到副臂靠近笔夹侧旋转轴的距离58mm。

4. 解锁电机
M84(M18),注意：M17位打开电机

5. 大臂90度，小臂平衡杆-35度，输入指令：G93 X90 Y-35 Z0，这里设置当前位置位给定的角度，该给到的角度需要手扶定位到该位置。

6. M114查看XYZ值，如X58.87 Y100.00 Z50.75，这里是输出当前笛卡尔位置信息到串口。

7. G95 使用角度坐标模式(G94为不使用角度坐标模式)

8. 操作+Y触发限位开关，再操作+触发限位开关，记录下endsop值，如X136.20 Y-30.03

9. M368 +触发的值，如M368 X136.20 Y-30.03 Z0，手动设定原点

10. M500 保存参数到eeprom

11. G94 返回笛卡尔坐标系

12. G28，回到Home（限位开关到位置）

测试回到主臂90°，副臂-35°位置：G1 X58.87 Y100.00 Z50.75 F900

根据实际情况调整高度

1. G28 角度初始化后 可以运行到新坐标原点或其他点（如 G1 X0 Y0 F900）

2. 操作Z轴 慢慢下降 到达工作平面

3. 使用M114 命令查看当前Z坐标 如当前Z坐标为-50

4. 使用M503 查看M367 的Z值 如Z为-10

5. 将两个Z值相加 使用M367 保存新的Z值

6. 使用M500 保存EEPROM

7. 使用G28 重新初始化角度 现在Z轴0点已经在工作平台上了

可以使用G1 X0 Y0 Z0 F900 移动到原点位置来确定一下

