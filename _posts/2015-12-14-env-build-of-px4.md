---
layout: post
title:  "初学PX4之环境搭建"
categories: "drons_lifes"
author: Lever
tags: 工作生活
donate: true
comments: true
editpage: true
update: 2017-06-16 07:43:37 Utk
---
>[消息](http://px4.io/px4-website-relaunched-online/)：pixhawk网站搬迁至[px4.io](http://px4.io) !!!     

<br>
# 前言
前段时间linux崩溃了，桌面进去后只有背景，折腾好久没搞定，为了节省时间索性重装了系统，同时也借这个机会从头记载一下作为初学者的学习过程。主要是按PX4的官网初学者教程进行，把其中遇到的一些初学者容易遇到的问题罗列出来，由于对于国内这方面的资料相对缺乏，希望能给大家提供一些帮助，也算是自我学习的一个整理。

如果你还不是很了解关于飞行器的这个项目PX4，建议迅速跳到PX4的[官网](https://pixhawk.org/start?id=start)一探究竟。简单来说，PX4是一个软、硬件开源项目（遵守BSD协议），目的在于为学术、爱好和工业团体提供一款低成本高性能的高端的自驾仪。这个项目源于 [ETH Zurich (苏黎世联邦理工大学)的计算机视觉与几何实验室](http://cvg.ethz.ch/)的[PIXHAWK项目](http://pixhawk.ethz.ch/)、并得到了[自主系统实验室](http://www.asl.ethz.ch/)和 [自动控制实验室](http://control.ee.ethz.ch/)的支持 ，以及一些出色的个人([Contact and Credits](https://pixhawk.org/credits))也参与其中，包括 [3D Robotics](http://store.diydrones.com/category_s/63.htm) 和 [international 3DR distributors](http://diydrones.com/profiles/blogs/list-of-all-diy-drones)的成员。

<br>
# 前期准备
为了让大家能与我的学习保持同步，先介绍一下在搭建这个PX4环境前我已经做好的工作：

1. 硬件一套，包括DJI F450机架、Pixhawk 2.4.6 mini飞控、好盈乐天20A电调、1045正反桨、银燕电机2216、天地飞6通道遥控器。详情见淘宝链接里的[套餐方案](https://item.taobao.com/item.htm?spm=a1z10.5-c.w4002-8717792970.38.rv3aHa&id=41190426449)。
2. 软件环境，使用的最新发行版[Ubuntu 15.10](http://www.ubuntu.org.cn/download/desktop)操作系统。

<!--more-->
<br>
# 工具链安装
在准备工作做好并对PX4有了一定的了解后，从[开发者快速入门教程](https://pixhawk.org/dev/quickstart)开始PX4的环境搭建，对于`Linux`这里直接跳到了[工具链](http://dev.px4.io/starting-installing-linux.html)的安装。按照教程说的命令去执行就可以了，只要你的网速够好，相信很快就能完成任务。说明一下这里做了哪些事情：

1. 更新软件包列表并安装所有PX4构建目标的依赖。
2. ubuntu自带的串口调制解调器严重的影响到了机器人串口相关的使用，可以没有任何副作用的卸载掉。
3. 安装模拟工具CLANG 3.5。
4. 添加当前用户到组”dialout“(如果这步没做，会导致很多用户权限问题)。

	```sh
	~ $ sudo usermod -a -G dialout $USER
	```

>`Tip`:如果你是Windows用户，可以点击[视频教程](https://www.youtube.com/watch?v=MBJhVrvWomY)，但是不推荐使用Windows进行开发。

<br>
# 代码编译
然后就到了编译代码的阶段，那么首先得弄到代码，按照[这个](http://dev.px4.io/starting-building.html)里面的步骤去做就好了，经测试ubuntu 14.04编译没有出现问题，建议安装[ninja](http://dev.px4.io/starting-installing-linux-boutique.html#ninja-build-system)，它编译的速度比make要快。   

想必有不懂Git是个啥的童鞋，那就看看这个[Git教程-廖雪峰的官方网站](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/)/[git BOOK](https://git-scm.com/book/zh/v2)吧，保证有帮助。比如我们的项目可以这么做：

```sh
# => 本地创建文件夹，并关联远程仓库
~ $ sudo apt-get install git-all
~ $ makedir YuningFly
~ $ cd YuningFly
~/YuningFly $ git init
~/YuningFly $ git add *
~/YuningFly $ git commit -m "Commit message"
~/YuningFly $ git remote add origin git@github.com:username/repository
~/YuningFly $ git push -u origin master
```

关于下载代码这块，通过ssh支持的原生git协议下载速度最快，但是要先生成SSH keys，更多见[教程](https://help.github.com/articles/generating-ssh-keys/)，例如如采用原生git协议下载开源代码可以用

```sh
~ $ git clone git@github.com:PX4/Firmware.git
```

--------------
<center><h4>`--------------ubuntu15.10 issues!!!--------------`</h4></center>

如果你跟我一样用的是ubuntu 15.10，需要进行arm-none-eabi重新安装，默认是最新版，换成4.8版本，官网上的解决办法见[地址](http://dev.px4.io/starting-installing-linux-boutique.html#toolchain-installation)，当然你也可以采用我下面的办法。    

首先了解见[博文](http://www.veryarm.com/296.html)，然后去GNU官方下载地址：[https://launchpad.net/gcc-arm-embedded/+download](https://launchpad.net/gcc-arm-embedded/+download)下载`gcc-arm-none-eabi-4_8-2014q3-20140805-linux.tar.bz2`，或者直接使用命令

```sh
wget https://launchpadlibrarian.net/186124160/gcc-arm-none-eabi-4_8-2014q3-20140805-linux.tar.bz2
```
然后进入下载文件夹，进行如下操作：

```sh
pushd .
# => 卸载新版的gcc-arm-none-eabi
~ $ sudo apt-get remove gcc-arm-none-eabi
# => 安装下载好的gcc-arm-none-eabi
~ $ tar xjvf gcc-arm-none-eabi-4_8-2014q3-20140805-linux.tar.bz2
~ $ sudo mv gcc-arm-none-eabi-4_8-2014q3 /opt
~ $ exportline="export PATH=/opt/gcc-arm-none-eabi-4_8-2014q3/bin:\$PATH"
~ $ if grep -Fxq "$exportline" ~/.profile; then echo nothing to do ; else echo $exportline >> ~/.profile; fi
# => 使路径生效
~ $ . ~/.profile
popd
```

如果PC是ubuntu 64位系统，arm-none-eabi是直接下载人家编译好的32位的话，还需要一个东东：

```sh
sudo apt-get install lsb-core
```
测试安装如下，如果出现如下信息，交叉编译环境搭建就没有什么问题了

```sh
~/src/Firmware$ arm-none-eabi-g++ -v
Using built-in specs.
COLLECT_GCC=arm-none-eabi-g++
COLLECT_LTO_WRAPPER=/opt/gcc-arm-none-eabi-4_8-2014q3/bin/../lib/gcc/arm-none-eabi/4.8.4/lto-wrapper
Target: arm-none-eabi
Configured with: /home/build/work/GCC-4-8-build/src/gcc/configure --target=arm-none-eabi --prefix=/home/build/work/GCC-4-8-build/install-native --libexecdir=/home/build/work/GCC-4-8-build/install-native/lib --infodir=/home/build/work/GCC-4-8-build/install-native/share/doc/gcc-arm-none-eabi/info --mandir=/home/build/work/GCC-4-8-build/install-native/share/doc/gcc-arm-none-eabi/man --htmldir=/home/build/work/GCC-4-8-build/install-native/share/doc/gcc-arm-none-eabi/html --pdfdir=/home/build/work/GCC-4-8-build/install-native/share/doc/gcc-arm-none-eabi/pdf --enable-languages=c,c++ --enable-plugins --disable-decimal-float --disable-libffi --disable-libgomp --disable-libmudflap --disable-libquadmath --disable-libssp --disable-libstdcxx-pch --disable-nls --disable-shared --disable-threads --disable-tls --with-gnu-as --with-gnu-ld --with-newlib --with-headers=yes --with-python-dir=share/gcc-arm-none-eabi --with-sysroot=/home/build/work/GCC-4-8-build/install-native/arm-none-eabi --build=i686-linux-gnu --host=i686-linux-gnu --with-gmp=/home/build/work/GCC-4-8-build/build-native/host-libs/usr --with-mpfr=/home/build/work/GCC-4-8-build/build-native/host-libs/usr --with-mpc=/home/build/work/GCC-4-8-build/build-native/host-libs/usr --with-isl=/home/build/work/GCC-4-8-build/build-native/host-libs/usr --with-cloog=/home/build/work/GCC-4-8-build/build-native/host-libs/usr --with-libelf=/home/build/work/GCC-4-8-build/build-native/host-libs/usr --with-host-libstdcxx='-static-libgcc -Wl,-Bstatic,-lstdc++,-Bdynamic -lm' --with-pkgversion='GNU Tools for ARM Embedded Processors' --with-multilib-list=armv6-m,armv7-m,armv7e-m,armv7-r
Thread model: single
gcc version 4.8.4 20140725 (release) [ARM/embedded-4_8-branch revision 213147] (GNU Tools for ARM Embedded Processors) 
```

<center><h4>`--------------ubuntu15.10 issues!!!--------------`</h4></center>

make成功后如下：

<img src="/images/makeokay.png" style="max-width:100%;"/>


一般情况下，make出现**主要问题**有：

- arm-none-eabi路径不对   
	按如上arm-none-eabi重新安装设置即可。
- arm-none-eabi-g++命令存在但报错找不到文件   
	安装32位的运行库。
	
	```sh
	sudo apt-get install libc6:i386 libgcc1:i386 libstdc++5:i386 libstdc++6:i386 lib32z1 lib32ncurses5
	```
- 没有更新Git子模块
	
	```sh
	~ $ git submodule init
	~ $ git submodule update --recursive
	#或者只要一行命令
	~ $ git submodule update --init --recursive
	```
- 子模组问题    
	无法在子模组路径 'mavlink/include/mavlink/v2.0' 中检出 '914eafd83851c499302aeb6f702da9069006f8f0'，一般删掉mavlink目录重新update就好了。或者先git submodule sync --recursive同步，再git submodule update --init --recursive更新。

- 需要重新编译   
	如果之前编译是可以的，更新后不能编译，试着删除根目录build_*文件夹，然后重新编译。 
- 找不到/usr/bin/arm-none-eabi-objcopy，或者其它的也可以用类似的方法   

	```sh
	sudo ln -s /opt/gcc-arm-none-eabi-4_8-2014q3/bin/arm-none-eabi-objcopy /usr/bin/
	```


>如果连接不上github，可以先试试这个连通站点
>
>```sh
>~ $ ssh -T git@github.com
>```
>`注意`：如果你想跟进项目，但不知道怎么参与贡献，建议参考APM的[文档](http://dev.ardupilot.com/wiki/where-to-get-the-code/)，更多请参考[这里](http://www.nephen.com/2016/01/introduction-to-start-ArduPilot#1-2)。

使用`make px4fmu-v2_default upload`即可将固件上传到pixhawk，这个过程可能需要重新插拔USB线，上传完成如下：

<img src="/images/upload.png" style="max-width:100%;"/>

这里要做的事情主要是：

1. 克隆PX4软件到本地，
2. make编译，
3. 连接USB到无人机硬件，上传固件

<br>
# 软件在环测试（SITL）
在直接到硬件之前，建议将模拟运行作为下一步。这个东西看起来很高端，有点摸不着头脑，以前没接触过，也觉得很深奥。跳到[这里](http://dev.px4.io/simulation-sitl.html)，看看赋予它的概念：软件在环仿真运行的主机上的完整系统，并模拟自动驾驶仪。SITL还可以参考Ardupilot的[文档](http://dev.ardupilot.com/wiki/sitl-simulator-software-in-the-loop/)。它通过本地网络连接到模拟器。启动运行如下：

<img src="/assets/sitl.png" style="max-width:100%;"/>

下面请将想办法给大家介绍清楚这个东西是什么，怎么用到PX4上，用到它有什么作用：

*建议：如果有比较棘手的问题，可以在[这里](https://gitter.im/PX4/Firmware)提问，好多不解的问题可以少走很多路。比如：*

<img src="/images/gitter.png" style="max-width:100%;"/>

可以先了解PX4仿真的一些[概念](https://pixhawk.org/dev/simulation/start)。PX4平台支持软件在环和硬件在环仿真。不同的是，使用SITL时，完整的模拟运行在主机（台式机、笔记本电脑），没有自动驾驶仪的硬件连接。这是测试新的算法和控制的最优办法，但它忽略了类似的硬件时间消耗或类似于堆栈大小的限制的事情。硬件在环仿真解决了这个问题，但是它的建立过程比较费时，因为硬件需要启动和刷新固件。软件在环仿真又分两种：标准软件在环仿真和ROS软件在环仿真。官方推荐使用标准软件在环仿真。标准软件在环仿真在单一的应用程序里以线程的形式最小依赖运行每个控制器和估算器。

下面是具体该怎么[操作](https://pixhawk.org/dev/simulation/native_sitl)，最新的文档请到[这里](http://dev.px4.io/simulation-sitl.html)，建议参考[这篇](https://pixhawk.org/dev/hil/jmavsim)，但是新的QGC已经不需要这些步骤了，可以自动连接。

1. 安装依赖项。

	```sh
	# => 原网页为sudo apt-get install ant，经测试应该为如下
	～ $ sudo apt-get install ant openjdk-7-jdk openjdk-7-jre
	```

2. 启动、编译目标。

	```sh
	~ $ make posix_sitl_default jmavsim
	```

3. 起飞。

	```sh
	pxh> commander takeoff
	```
	完成之后如图：

	<img src="/images/takeoff.png" style="max-width:100%;"/>

	仿真时需要用到地面站QGroundControl( for short)，然后进行QGC 的[安装](https://github.com/mavlink/qgroundcontrol)，由于它的篇幅较大，可以给它开启新的一节。

<br>
# 地面控制站QGC
QGC的官网是[http://qgroundcontrol.org](http://qgroundcontrol.org)，可以从这里下载比较稳定的[安装包](https://github.com/mavlink/qgroundcontrol/releases/)解压，建议下载daily build的，里面有一些新的功能后面要用到，但是还是得安装Qt，如果不安装Qt，打开QGC会有缺少动态链接库的问题，从[这里](http://download.qt.io/official_releases/qt/5.5/5.5.1/qt-opensource-linux-x64-5.5.1.run.mirrorlist)可以看到中国地区下载镜像可以选择[这个](http://mirror.bit.edu.cn/qtproject/archive/qt/5.5/5.5.1/qt-opensource-linux-x64-5.5.1.run)或者[这个](http://mirrors.hust.edu.cn/qtproject/archive/qt/5.5/5.5.1/qt-opensource-linux-x64-5.5.1.run)，这样下载比较快一些，下载完成后进行如下操作。

```sh
~ $ chmod 777 qt-opensource-linux-x64-5.5.1.run
~ $ ./qt-opensource-linux-x64-5.5.1.run
# => 建议将目标文件夹选为$HOME/Qt($HOME为用户目录，替换为如/home/nephne)
# => 相关依赖项的安装如下：
~ $ sudo apt-get install espeak libespeak-dev libudev-dev libsdl1.2-dev
# => Qt配置如下：
# => 更换qt源，默认为qt4
~ $ export QT_SELECT=qt5
~ $ qtchooser -print-env
QT_SELECT="qt5"
QTTOOLDIR="/home/nephne/Qt/5.5/gcc_64/bin"
QTLIBDIR="/usr/lib/x86_64-linux-gnu"
# => 更改文件/usr/lib/x86_64-linux-gnu/qtchooser/5.conf 第一行为：/home/$USER/Qt/5.5/gcc_64/bin(将$USER替换为用户名字)
~ $ sudo vi /usr/lib/x86_64-linux-gnu/qtchooser/5.conf 
# => 我的如下：
~ $ cat /usr/lib/x86_64-linux-gnu/qtchooser/5.conf 
/home/nephne/Qt/5.5/gcc_64/bin
/usr/lib/x86_64-linux-gnu
~ $ qmake -v
QMake version 3.0
Using Qt version 5.5.1 in /opt/Qt5.5.1/5.5/gcc_64/lib
# => 如果出现如上的结果就可以进入解压后的QGC目录运行了
~ $ cd ${QGC_dir}
# => 运行如下的脚本文件，这个里边加载了动态库，如果你的Qt安装目录跟我的不一样，那样还得修改脚本
~ $ ./qgroundcontrol-start.sh
```

界面如下：

<img src="/images/qgc.png" style="max-width:100%;"/>

这里再回归到软件在环仿真上面来。当进行到上一节的commander takeoff命令后，打开QGC，点击又上角的Default UDP Link即可连接模拟器中的无人机，这样就可以通过地面在对模拟器中的无人机进行控制和数据分析，建议：QGC可支持操纵杆，如果想要手动输入，需要把系统置于手动飞行模式 (e.g. POSCTL, position control)。注意：需要下载daily build版的QGC
才能启动操纵杆。启动操纵杆如下：

<img src="/images/stick.png" style="max-width:100%;"/>


操纵杆如下：

<img src="/images/sticks.png" style="max-width:100%;"/>

界面如下：

<img src="/images/sitl.png" style="max-width:100%;"/>

<br>
# Gazebo仿真
这是另外一种[软件仿真](http://dev.px4.io/simulation-gazebo.html)，是一个自主机器人3D仿真环境。它能够作为一个完整的机器人仿真套件或脱机用于机器人。其中Plugin是自行编译的，过程如下：

<img src="/images/gazebo.png" style="max-width:100%;"/>

[安装过程](https://github.com/px4/sitl_gazebo)如下:

```bash
# => 安装Gazebo 6仿真器(ubuntu 15.10)<http://gazebosim.org/tutorials?tut=install_ubuntu&ver=6.0&cat=install>
~ $ wget -O /tmp/gazebo6_install.sh http://osrf-distributions.s3.amazonaws.com/gazebo/gazebo6_install.sh; sudo sh /tmp/gazebo6_install.sh
# => 运行
~ $ gazebo
# => 安装protobuf 库
~ $ sudo apt-get install libprotobuf-dev libprotoc-dev protobuf-compiler libeigen3-dev
# => 编译Gazebo插件
# => 克隆gazebo plugins repository到~/src/sitl_gazebo
~ $ git clone https://github.com/PX4/sitl_gazebo.git
# => 在仓库的顶层建立Build文件夹
~ $ mkdir Build 
# => 把build目录添加到gazebo plugin path，e.g.添加如下到我的.profile 文件
# Set the plugin path so Gazebo finds our model and sim
export GAZEBO_PLUGIN_PATH=${GAZEBO_PLUGIN_PATH}:$HOME/src/sitl_gazebo/Build
# Set the model path so Gazebo finds the airframes
export GAZEBO_MODEL_PATH=${GAZEBO_MODEL_PATH}:$HOME/src/sitl_gazebo/models
# Disable online model lookup since this is quite experimental and unstable
export GAZEBO_MODEL_DATABASE_URI=""
# => 还需要添加仓库的主目录
# Set path to sitl_gazebo repository
export SITL_GAZEBO_PATH=$HOME/src/sitl_gazebo
# => 使生效
~ $ source ~/.profile 
# => 进入Build目录执行make
~ $ cd ~/src/sitl_gazebo/Build
~ $ cmake ..
# => 生成sdf文件
~ $ make sdf
# => 构建 gazebo plugins
~ $ make
# => 现在可以运行gazebo了
～$ gazebo
```

下面可以按照[教程](http://dev.px4.io/simulation-gazebo.html)进入仿真。

```sh
~ $ cd ~/src/Firmware
~ $ make posix_sitl_default gazebo
```

<br>
# QtCreator IDE建立工程
>参考文章：[旧版本](https://pixhawk.org/dev/project_setup)/[新版本](http://dev.px4.io/starting-building.html#qt-creator-on-linux)

Qt Creator是最友好的变体，因此是官方唯一支持的IDE。除非你是Eclipse 或 Sublime方面的专家，否则不推荐使用！

安装完qmake后，还要安装qtcreator，ubuntu下如下操作：

```sh
~ $ sudo apt-get install qtcreator
```

常见功能如下：
<img src="/images/qtcreator.png">

打开Qt Creator之前, 应该创建[project](https://cmake.org/Wiki/CMake_Generator_Specific_Information#Code::Blocks_Generator)文件:

```sh
$ cd ~/src/Firmware
$ mkdir ../Firmware-build
$ cd ../Firmware-build
$ cmake ../Firmware -G "CodeBlocks - Unix Makefiles"
#可以发现Firmware-build目录生成了一些文件
```

Ubuntu用户只要导入主文件夹里的CMakeLists.txt文件就可以了，打开qtcreator，通过`File -> Open File or Project -> 选择CMakeLists.txt`    
构建目录选择src/Firmware-build

<img src="/images/qtb.png">

出现如下现象时点击完成即可

<img src="/images/qtcmake.png">

点击项目进入配置，配置页面见下图，详细配置见原文视频

<img src="/images/qtbuild.png">

<img src="/images/qt_set.png">

配置完成后，点击左下角的运行，编译输出如下
<img src="/images/buildout.png">

连接USB到pixhawk，点击`应用程序输出`栏的绿色按钮`重新执行此运行配置`即可进行上传，输出如下
<img src="/images/binout.png">

如果你比较喜欢使用Sublime Text，请按照[linux下sublime text 2使用技巧](/2016/01/sublime-text2-in-linux)安装使用，然后进入工程目录，执行命令即可。

```sh
$ cscope -Rbkq
$ ctags -R -f .tags
$ sublime_text Firmware.sublime-project
```
编译代码快捷键为：Ctrl + B

<br>
# 总结
教程到这里，基本的环境算是搭建好了，接下来应该就是各个模块的学习了，欢迎参考接下来的其它文章。

<hr>
# 参考文献

- [dev.px4.io](http://dev.px4.io/)
- [px4.io](http://px4.io/)
- [pixhawk.org](https://pixhawk.org/choice)
- [dev.ardupilot.com](http://dev.ardupilot.com/)
- [planner.ardupilot.com](http://planner.ardupilot.com/)
- [copter.ardupilot.com](http://copter.ardupilot.com/)
- [travis-ci.org](https://travis-ci.org/)
- [exbot资源分享](http://blog.exbot.net/archives/1169)
