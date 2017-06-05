---
layout: post
title:  "Moveit在ROS Kinetic上的搭建与调试"
categories: "work_lifes"
author: Lever
tags: 大学
comments: true
update: 2017-06-06 07:23:34 Utk
---
<br>
#环境搭建
参考[官网](http://wiki.ros.org/kinetic/Installation/Ubuntu)，注意这里需要采用Ubuntu15.10或者16.04。   
具体命令简写如下：

```sh
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
sudo apt-get update
sudo apt-get install ros-kinetic-desktop-full
sudo rosdep init
rosdep update
echo "source /opt/ros/kinetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
sudo apt-get install python-rosinstall
```

<!--more-->
#基础ROS操作教程
开始[基本操作](http://wiki.ros.org/ROS/Tutorials)。   

##基础环境
首先是配置ROS的[工作环境](http://wiki.ros.org/ROS/Tutorials/InstallingandConfiguringROSEnvironment)，创建新的工作空间。

```sh
rosws init ~/kinetic_workspace /opt/ros/kinetic
#如果rosws命令未找到，使用sudo apt-get install python-rosinstall命令即可
```

为new package创建目录。

```sh
mkdir ~/kinetic_workspace/sandbox
rosws set ~/kinetic_workspace/sandbox
source ~/kinetic_workspace/setup.bash
#建议将上一行命令加至~/.bashrc中
```
环境确认。

```sh
echo $ROS_PACKAGE_PATH
```

正常情况下会出现如下类似的结果。

```sh
/home/your_user_name/fuerte_workspace/sandbox:/opt/ros/fuerte/share:/opt/ros/fuerte/stacks
```

##ROS文件系统
下一步为[ROS文件系统](http://wiki.ros.org/ROS/Tutorials/NavigatingTheFilesystem)。

首先确保安装了ros-tutorials包。

```sh
sudo apt-get install ros-kinetic-ros-tutorials
```

对几个简单的概念做一个快速的浏览，

- Packages：包是最低级别的ROS软件组织，它包含了库、工具、可执行文件等。
- Manifest： 清单是对包的描述，它最重要的作用是定义包之间的依赖关系。
- Stacks：堆栈是构成更高级别库的包的集合。
- Stack Manifest： 这些就像正常的清单，但是是用于堆栈的。

包是具有manifest.xml文件的目录，堆栈是一个具有stack.xml文件的目录。

<img src="http://wiki.ros.org/ROS/Tutorials/rosbuild/NavigatingTheFilesystem?action=AttachFile&do=get&target=filesystem_layout.png">

文件系统工具，代码分布在许多ROS包和堆栈中。使用命令行工具（如ls和cd）导航可能非常乏味，这就是为什么ROS提供了帮助你的工具。   
rospack和rosstack允许您获取有关包和堆栈的信息。在本教程中，我们只讨论find选项，它返回包或堆栈的路径。实际用法如下：

```sh
$ rospack find [package_name]
$ rosstack find [stack_name]
```

roscd是rosbash套件的一部分。它允许您将目录（cd）直接更改为包或堆栈，使用roscd可以直接跳到工作目录。查看当前路径可以直接使用UNIX命令pwd，实际用法如下：

```sh
$ roscd [locationname[/subdir]]
```

roscd log将带您到ROS存储日志文件的文件夹。

rosls是rosbash套装的一部分。它允许您直接在包，堆栈或公共位置通过名称，而不是通过包路径使用，实际用法如下。

```sh
rosls [locationname[/subdir]]
```

注意：这些命令是支持Tab键补全的。

##创建ROS Package
这部分涵盖使用roscreate-pkg或catkin创建新软件包，以及使用rospack列出软件包依赖关系。

roscreate的用法：

```sh
roscreate-pkg [package_name]
roscreate-pkg [package_name] [depend1] [depend2] [depend3]
#eg: roscreate-pkg beginner_tutorials std_msgs rospy roscpp
```

创建了新的Package后，需要更新一下profile，以便ROS能够找到新的Package。

```sh
rospack profile
#是否成功可以通过如下的命令测试
rospack find beginner_tutorials 
```

查看新建的Package的依赖关系下所示，另外这个也可以在Mainefest里面查到。

```sh
rospack depends1 beginner_tutorials 
```

rospy是Python的客户端库， roscpp是C ++的客户端库。

##编译ROS Package
这部分涵盖了构建包的工具链。

一旦安装了所有的系统依赖关系，我们就可以构建我们刚刚创建的包。

rosmake可以编译一个也可以同时编译多个Package，用法如下：

```sh
rosmake [package1] [package2] [package3]
```

##理解ROS节点
这部分介绍ROS图形概念，并讨论使用roscore，rosnode和rosrun命令行工具。

ROS节点可以使用客户端库与其他的节点进行沟通，节点可以发布或订阅主题，也可以提供或使用服务。

ROS客户端库允许以不同编程语言编写的节点进行通信。

roscore是使用ROS时应该运行的第一件事。

运行命令如下：

```sh
roscore
#如果有权限问题，请留意下面的方法
sudo chown -R <your_username> ~/.ros
#如果本地主机配置出问题：
$ export ROS_HOSTNAME=localhost
$ export ROS_MASTER_URI=http://localhost:11311
```

rosnode显示有关当前运行的ROS节点的信息。 rosnode list命令列出这些活动节点，rosnode info命令返回有关特定节点的信息。

```sh
#注意运行该命令是，在另外一个开启的Terminal
rosnode list
rosnode info /rosout
```

rosrun允许您使用程序包名称直接运行程序包中的节点。用法跟示例如下：

```sh
rosrun [package_name] [node_name]
rosrun turtlesim turtlesim_node
```

ROS的一个强大的功能是，您可以从命令行重新分配名称。这时使用rosnode list可以看到运行的节点名称，如果还存在之前关闭的节点命令，意味着你是通过ctr + c关闭的，可以通过rosnode cleanup清除，如下：

```sh
rosrun turtlesim turtlesim_node __name:=my_turtle
rosnode cleanup
```

我们可以通过另外一个rosnode ping工具检验该节点是否跑起来了。

##理解ROS Topics
这部分介绍ROS主题以及使用rostopic和rqt_plot命令行工具。

简单的例子，在两个Termenal分别运行node，然后可以通过方向按键控制海龟的前进方向。

```sh
rosrun turtlesim turtlesim_node
rosrun turtlesim turtle_teleop_key
```

turtlesim\_node和turtle\_teleop\_key节点通过ROS Topic彼此通信。 turtle\_eleop\_key以topic的形式发布键击，而turtlesim以subscribes的形式接收键击信息。

rqt_graph创建了系统中发生了什么的动态图。rqt\_graph是rqt包的一部分。安装该应用程序如下：

```sh
sudo apt-get install ros-kinetic-rqt
sudo apt-get install ros-kinetic-rqt-common-plugins
```

使用如下命令可以看出键击控制乌龟的例子的关系动态图。

```sh
rosrun rqt_graph rqt_graph
#您可以使用帮助选项获取rostopic的可用子命令
rostopic -h
```

rostopic echo显示在一个topic上发布的数据。如下：

```sh
rostopic echo /turtle1/cmd_vel
#还是上面的例子，移动方向键后，可以看到有发布的信息出来，同时rqt_graph画面也更新了
```

rostopic list返回当前订阅和发布的所有主题的列表。如：

```sh
rostopic list -v
#这将显示要发布到和订阅的Topic的详细列表及其类型
```

可以使用rostopic type来确定在主题上发送的消息的类型。如下：

```sh
#用法
rostopic type [topic]
#例子
rostopic type /turtle1/cmd_vel
rosmsg show geometry_msgs/Twist
```

rostopic pub将数据发布到当前广告的topic。

```sh
rostopic pub [topic] [msg_type] [args]
rostopic pub -1 /turtle1/cmd_vel geometry_msgs/Twist -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, 1.8]'
#-1：此选项（破折号一）使rostopic只发布一个消息，然后退出
#此选项（双破折号）告诉选项解析器，以下参数都不是选项
#这些参数实际上是YAML语法
rostopic pub /turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, -1.8]'
#我们可以使用rostopic pub -r命令发布稳定的命令流
```

rostopic hz报告数据发布的速率。

```sh
rostopic hz /turtle1/pose
```

我们还可以使用rostopic类型与rosmsg show结合获取有关某个主题的深入信息。

```sh
rostopic type /turtle1/cmd_vel | rosmsg show
```

rqt_plot显示关于主题发布的数据的滚动时间图。

```sh
rosrun rqt_plot rqt_plot
#添加 /turtle1/pose/x   /turtle1/pose/y
```

##理解ROS服务和参数
服务是节点可以彼此通信的另一种方式。服务允许节点发送请求并接收响应。

```sh
rosservice list
```

list命令向我们显示turtlesim节点提供了九个服务：reset, clear, spawn, kill, turtle1/set_pen, /turtle1/teleport_absolute, /turtle1/teleport_relative, turtlesim/get_loggers, and turtlesim/set_logger_level. 

```sh
rosservice type /clear
#此服务为空，这意味着当进行服务调用时，不需要任何参数（即，在发出请求时不发送数据，而在接收响应时不接收数据）。
```

这里我们将调用没有参数，因为服务类型为空：

```sh
rosservice call [service] [args]
rosservice call /clear
```

再看看一个服务类型不为空的服务例子spawn。

```sh
rosservice type /spawn| rossrv show
    float32 x
    float32 y
    float32 theta
    string name
#这项服务让我们在给定的位置和方向产生一只新的乌龟。 name字段是可选的，所以让我们不要给我们的新龟一个名字，让turtlesim为我们创建一个。
rosservice call /spawn 2 2 0.2 ""
---
string name
```

rosparam允许您存储和操作ROS参数服务器上的数据。参数服务器可以存储整数，浮点数，布尔值，字典和列表。rosparam使用YAML标记语言进行语法。YAML看起来很自然：1是一个整数，1.0是一个浮点数，one是一个字符串，true是一个布尔值，[1，2，3]是一个整数列表，{a：b，c：d}表示字典。rosparam有很多可以在参数上使用的命令，如下所示：

```sh
rosparam set            set parameter
rosparam get            get parameter
rosparam load           load parameters from file
rosparam dump           dump parameters to file
rosparam delete         delete parameter
rosparam list           list parameter names
```

这里会改变红色通道的背景颜色，这改变了参数值，现在我们要调用clear服务使参数更改生效：

```sh
rosparam set /background_r 150
rosservice call /clear
```

现在让我们看看param服务器上其他参数的值。让我们得到绿色背景频道的值：

```sh
rosparam get /background_g 
```

我们还可以使用rosparam get /来向我们显示整个参数服务器的内容。

```sh
rosparam get /
```

您可能希望将其存储在一个文件中，以便您可以在另一时间重新加载它。

```sh
rosparam dump [file_name] [namespace]
rosparam load [file_name] [namespace]
#这里我们将所有参数写入文件params.yaml
rosparam dump params.yaml
#你甚至可以将这些yaml文件加载到新的命名空间
rosparam load params.yaml copy
rosparam get /copy/background_b
```

##手工创建一个ROS包
你的包有一个清单，ROS可以找到它。尝试执行命令:

```sh
rospack find foobar
```
另外是要创建CMakeLists，才能进行编译。

##使用rqt_console和roslaunch
这部分介绍使用rqt_console和rqt_logger_level进行调试的ROS，以及一次性启动多个节点的roslaunch。

rqt_console附加到ROS的日志框架以显示节点的输出。rqt_logger_level允许我们在节点运行时更改节点的详细级别（DEBUG，WARN，INFO和ERROR）。

使用方法如下：

```sh
rosrun rqt_console rqt_console
rosrun rqt_logger_level rqt_logger_level
#fatal具有最高优先级，debug具有最低优先级。通过设置记录器级别，您将获得该优先级或更高级别的所有消息。
```

roslaunch启动在启动文件中定义的节点。

```sh
#Usage
roslaunch [package] [filename.launch]
roscd beginner_tutorials
mkdir launch
cd launch
#现在让我们创建一个名为turtlemimic.launch的启动文件并粘贴以下内容
<launch>

  <group ns="turtlesim1">
    <node pkg="turtlesim" name="sim" type="turtlesim_node"/>
  </group>

  <group ns="turtlesim2">
    <node pkg="turtlesim" name="sim" type="turtlesim_node"/>
  </group>

  <node pkg="turtlesim" name="mimic" type="mimic">
    <remap from="input" to="turtlesim1/turtle1"/>
    <remap from="output" to="turtlesim2/turtle1"/>
  </node>

</launch>
#启动节点
roslaunch beginner_tutorials turtlemimic.launch
#两个turtlesim将启动，在一个新的终端发送rostopic命令：
rostopic pub /turtlesim1/turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, -1.8]'
#查看效果图
rqt_graph
```

##使用rosed在ROS中编辑文件
rosed是rosbash套装的一部分。它允许您使用软件包名称直接编辑软件包中的文件，而不必键入软件包的整个路径。

```sh
rosed [package_name] [filename]
rosed roscpp Logger.msg
```

这种方法您可以轻松地查看和可选地编辑包中的所有文件，而无需知道其确切的名称。

```sh
rosed [package_name] <tab><tab>
#更改默认编辑器
export EDITOR='nano -w'
export EDITOR='emacs -nw'
```

##创建ROS msg和srv
这部分将介绍如何创建和构建msg和srv文件以及rosmsg，rossrv和roscp命令行工具。

##初学URDF
从这里开始学习[URDF](http://wiki.ros.org/urdf/Tutorials)，首先构建一个模糊地看起来像R2D2的机器人的[视觉模型](http://wiki.ros.org/urdf/Tutorials/Building%20a%20Visual%20Robot%20Model%20with%20URDF%20from%20Scratch)。

```sh
#前提条件
sudo apt-get install ros-kinetic-urdf-tutorial
#会安装到/opt/ros/kinetic/share/urdf_tutorial
```

第一个简单的URDF例子，这是一个名为myfirst的机器人，它只包含一个关节（a.k.a. part），其视觉分量只是一个圆柱体.6米长，半径为.2米，视觉元素（圆柱）的原点在其几何的中心作为默认值。因此，一半的气缸在网格之下。运行如下

```sh
roscd urdf
roslaunch urdf_tutorial display.launch model:=urdf/01-myfirst.urdf
#或者直接在任意路径运行
roslaunch urdf_tutorial display.launch model:='$(find urdf_tutorial)/urdf/01-myfirst.urdf'
#请注意参数值周围的单引号
```

现在让我们来看看如何添加多个形状/关节，关节是根据父母和孩子来定义的。 URDF最终是一个具有一个根链路的树结构。这意味着腿的位置取决于base_link的位置。

```sh
roslaunch urdf_tutorial display.launch model:=urdf/02-multipleshapes.urdf 
#树状结果如下：
 <joint name="base_to_right_leg" type="fixed">
    <parent link="base_link"/>
    <child link="right_leg"/>
  </joint>
```

如果要更改原点坐标呢？

关节点Joint的原点是根据父节点的参考帧定义的，分析的时候其余的坐标都是相对关节点而言的。

```sh
roslaunch urdf_tutorial display.launch model:=urdf/03-origins.urdf 
```

怎么给自己的零件着色呢？

身体现在是蓝色的。通过添加第一个材质标签，我们定义了一种名为“蓝色”的新材料，红色，绿色，蓝色和alpha通道分别定义为0,0，.8和1。所有值可以在范围[0,1]内。对于第二条腿，我们可以通过名称来引用材料，因为它以前已经定义。没有人会抱怨，如果你重新定义它。您还可以使用纹理来指定用于对对象着色的图像文件。

如下：

```sh
roslaunch urdf_tutorial display.launch model:=urdf/04-materials.urdf 
```

更多：网格可以以多种不同的格式导入。 STL是相当普遍的，但引擎还支持DAE，它可以有自己的颜色数据，这意味着你不必指定颜色数据。网格也可以使用相对缩放参数或边界框大小来确定大小。

##使用URDF构建可移动机器人模型

这部分了解如何在URDF中定义[活动关节](http://wiki.ros.org/urdf/Tutorials/Building%20a%20Movable%20Robot%20Model%20with%20URDF)，关节三种其他重要类型的连接：固定，连续，旋转和棱柱。

```sh
roslaunch urdf_tutorial display.launch model:=urdf/06-flexible.urdf gui:=True
```

右和左夹爪接头被建模为旋转接头。这意味着它们以与连续关节相同的方式旋转，但是它们具有严格的限制。夹持臂是不同类型的接头...即棱柱形接头。这意味着它沿着一个轴移动，而不是围绕一个轴移动。这种平移运动允许我们的机器人模型延伸和缩回其夹持臂。此外，浮动接头不受约束，并且可以在三个维度中的任一个中移动。

当您在GUI中移动滑块时，模型在Rviz中移动。这是怎么做的？

首先GUI解析URDF并找到所有非固定关节及其限制，然后，它使用滑块的值来发布sensor_msgs / JointState消息。

##Anno URDF

```sh
rosrun tf static_transform_publisher 0.0 0.0 0.0 0.0 0.0 0.0 map my_frame 100
#note: in most cases, Linux runs on top of a case-sensitive file system, which means that file.STL is not the same as file.stl. Make sure base_3.stl is not actually base_3.STL. This is a common problem with urdfs and meshes created under Windows, and then copied to your Linux installation.
```

##关于Xacro

学习一些技巧，使用Xacro URDF以减少文件中的代码量。主要从三个方面入手：常量、简单数学、宏。在本教程中，我们将查看所有这些快捷方式，以帮助减少URDF文件的整体大小，并使其更易于阅读和维护。语法如下：

```sh
 rosrun xacro xacro model.xacro > model.urdf 
 ```

 您还可以在启动文件中自动生成urdf。这是方便的，因为它保持最新，不占用硬盘空间。但是，生成需要时间，因此请注意，启动文件可能需要较长时间才能启动。

 ```sh
<param name="robot_description"
  command="$(find xacro)/xacro '$(find pr2_description)/robots/pr2.urdf.xacro'" />
 ```

 在URDF文件的顶部，您必须指定一个命名空间，以便正确解析该文件。例如，这些是有效xacro文件的前两行：

 ```sh
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="firefighter">
 ```

 常量定义：它们可以在任何地方（假设有效的XML），任何级别，使用之前或之后定义。通常他们在顶部。我们使用美元符号和大括号来表示值，而不是在geometry元素中指定实际半径。

 ```sh
<xacro:property name="width" value=".2" />
<xacro:property name="bodylen" value=".6" />
 ```

您可以使用四个基本操作（+， - ，*，/），一元减号和括号在$ {}构造中构建任意复杂的表达式。不支持指数和模量。

```sh
<cylinder radius="${wheeldiam/2}" length=".1"/>
<origin xyz="${reflect*(width+.02)} 0 .25" />
```

宏定义部分：

```sh
<xacro:macro name="default_origin">
    <origin xyz="0 0 0" rpy="0 0 0"/>
</xacro:macro>
#使用：<xacro：$ NAME />的每个实例都将替换为xacro：macro标记的内容。
#注意，即使它不完全相同（两个属性已切换顺序），生成的XML是等效的。
#如果找不到具有指定名称的xacro，它将不会被展开，也不会产生错误。
<xacro:default_origin />
```

参数化宏：

```sh
<xacro:macro name="default_inertial" params="mass">
        <inertial>
                <mass value="${mass}" />
                <inertia ixx="1.0" ixy="0.0" ixz="0.0"
                     iyy="1.0" iyz="0.0"
                     izz="1.0" />
        </inertial>
</xacro:macro>
#调用的时候如下，参数化宏，以使它们不会每次都生成相同的确切文本，mass表示给其参数传递实参
<xacro:default_inertial mass="10"/>
#也可以使用整个块作为参数
<xacro:insert_block name="shape" />
```

要查看由xacro文件生成的模型，请运行以下命令：roslaunch urdf_tutorial xacrodisplay.launch model:=urdf/08-macroed.urdf.xacro

##解析PR2 Robot URDF

本教程解释了复杂机器人（如PR2）的顶级URDF Xacro文件的布局。完整的PR2 URDF宏文件可以在文件robots / pr2.urdf.xacro中的pr2_description包中找到。

包括用于单个机器人组件的包含xacro宏的文件。这就像在C中包含一个头文件：它设置了一堆定义，但实际上不调用它们。

##建立自己的Robot URDF

```sh
vi my_robot.urdf
check_urdf my_robot.urdf
```

现在我们有了基本的树结构，让我们添加适当的维度。包括关节的定位与旋转轴的设定。最后转换成PDF进行查看。

```sh
urdf_to_graphiz my_robot.urdf
evince test_robot.pdf
```

#Moveit
##安装
安装ROS Indigo，Jade或Kinetic。请确保您已遵循所有步骤并安装了最新版本的软件包。

```sh
rosdep update
sudo apt-get update
sudo apt-get dist-upgrade
#源安装需要wstool，catkin_tools和可选的clang-format
sudo apt-get install python-wstool python-catkin-tools clang-format-3.8
#创建新的工作空间
mkdir -p ~/ws_moveit/src
cd ~/ws_moveit/src
```

从catkin工作区的/ src目录中拉下所需的存储库和编译。

```sh
wstool init .
wstool merge https://raw.githubusercontent.com/ros-planning/moveit/kinetic-devel/moveit.rosinstall
wstool update
rosdep install --from-paths . --ignore-src --rosdistro kinetic
cd ..
catkin_make
source ~/ws_moveit/devel/setup.bash # or .zsh, depending on your shell
```

另外关于moveit的源码介绍看[这里](http://moveit.ros.org/about/source_code/)，为了完整性，以下两个回合是可以找到文档的地方：

- [moveit.ros.org](https://github.com/ros-planning/moveit.ros.org) - 这个主要网站
- [moveit_tutorials](https://github.com/ros-planning/moveit_tutorials) - 一步一步学习MoveIt的例子！
- [moveit_kinematics_tests](https://github.com/ros-planning/moveit_kinematics_tests) - 带测试的实验性repo

##RViz
基于GUI的界面可通过使用MoveIt! Rviz(ROS Visualizer)插件,该插件允许您设置机器人的工作场景，生成计划，可视化输出和直接与可视化的机器人交互。   

你应该已经完成​​了MoveIt！安装助手教程，如果没有，安装如下，Setup [Assistant](http://docs.ros.org/kinetic/api/moveit_tutorials/html/doc/setup_assistant/setup_assistant_tutorial.html)是一个图形用户界面，用于配置与MoveIt一起使用的任何机器人！   

```sh
roslaunch moveit_setup_assistant setup_assistant.launch
#当出现问题：ERROR: cannot launch node of type [moveit_ros_move_group/move_group]: can't locate node [move_group] in package [moveit_ros_move_group]时，重新source一下setup.sh文件
#点击Create New MoveIt! Configuration Package
#browse选择/opt/ros/kinetic/share/pr2_description/robots/pr2.urdf.xacro
#load files
```

注意：配置anno机械臂时，将package包文件夹robot_anno_v6移动到/opt/ros/kinetic/share或ws_moveit，然后加载/opt/ros/kinetic/share/robot_anno_v6/urdf/RobotAnnoV6.urdf文件进行配置。或者建立自己的catkin_ws，里面放自己的package。

在添加arm的时候，不要把forearm_cam_frame_joint加进去了！

安装配置完成后，继续进行[RViz Plugin](http://docs.ros.org/kinetic/api/moveit_tutorials/html/doc/ros_visualization/visualization_tutorial.html)。

```sh
mv ~/pr2_moveit_generated ~/kinetic_workspace/sandbox
#或者修改~/.bashrc文件，注意加在最末尾
export ROS_PACKAGE_PATH=$HOME/ws_moveit/src:$ROS_PACKAGE_PATH
#然后启动包
roslaunch pr2_moveit_generated demo.launch
#如有错误
sudo apt-get install ros-kinetic-moveit-ros-visualization
sudo apt-get install ros-kinetic-moveit-fake-controller-manager
sudo apt-get install ros-kinetic-moveit-planners-ompl
#重新更改配置
roslaunch abb_moveit_config setup_assistant.launch
```

在上面这个界面的使用过程中，可以移动手臂，并能追踪移动的整个轨迹过程。

您现在可以开始使用MoveIt！[在Gazebo中模拟机器人](http://picknik.io/moveit_wiki/index.php?title=PR2/Gazebo/Quick_Start)。

MoveIt! 设计用于真实和模拟机器人。这部分了解如何配置MoveIt！用于PR2上的控制器，还将学习如何将传感器集成到PR2上与MoveIt！

```sh
#前提条件
sudo apt-get install ros-kinetic-pr2-common
#以下编辑的内容见原网页记载
vi controllers.yaml
vi pr2_moveit_controller_manager.launch.xml
vi moveit_planning_execution.launch
roslaunch pr2_moveit_generated moveit_planning_execution.launch
```

上面的gazo包过时了，有些操作不一定可用，更多参考[gazebo_ros_pkgs](http://wiki.ros.org/gazebo_ros_pkgs)。

gazebo_ros_pkgs是一组ROS包，它们提供必要的接口来在机器人的Gazebo 3D刚体模拟器中模拟机器人。它使用ROS消息，服务和动态重新配置与ROS集成。

##Move Group Interface

首先看一个[轨迹视频](https://www.youtube.com/watch?v=4FSmZRQh37Q&feature=youtu.be)，下面仔细分析是怎么做到的？参考[Move Group Interface Tutorial](http://docs.ros.org/kinetic/api/moveit_tutorials/html/doc/pr2_tutorials/planning/src/doc/move_group_interface_tutorial.html)。

```sh
cd ~/ws_moveit/src
git clone https://github.com/ros-planning/moveit_tutorials.git
git clone https://github.com/PR2/pr2_common.git -b kinetic-devel
git clone https://github.com/davetcoleman/pr2_moveit_config.git
rosdep install --from-paths . --ignore-src --rosdistro kinetic
roslaunch pr2_moveit_config demo.launch
#如果出现节点问题，记得source
roslaunch moveit_tutorials move_group_interface_tutorial.launch
```

具体程序源码分析见[原文](http://docs.ros.org/kinetic/api/moveit_tutorials/html/doc/pr2_tutorials/planning/src/doc/move_group_interface_tutorial.html)，主要为Setup、Visualization、获取基本信息、Planning to a Pose goal、可视化计划、移动到姿势目标、规划联合空间目标、规划与路径约束、笛卡尔路径、添加/删除对象和附加/分离对象、双臂姿势目标。

##Move Group Python Interface

主用户是通过RobotCommander类进行交互，它为用户可能想要执行的大多数操作提供功能，特别是设置关节或姿势目标，创建运动计划，移动机器人，将对象添加到环境中以及从机器人附加/分离对象。

例程分析见如下，源码里面也有响应的代码解读。

```sh
cd ~/ws_moveit/src/moveit_tutorials
vi doc/pr2_tutorials/planning/scripts/move_group_python_interface_tutorial.py +43
```

这一部分跟上一部分的源码分析差不多，可以参考着进行分析，只是整个定义了一个python函数move_group_python_interface_tutorial，最后运行main函数即可，其中launch文件见~/ws_moveit/src/moveit_tutorials/doc/pr2_tutorials/planning/launch/move_group_python_interface_tutorial.launch。

```sh
chmod +x ~/ws_moveit/src/moveit_tutorials/doc/pr2_tutorials/planning/scripts/move_group_python_interface_tutorial.py
roslaunch pr2_moveit_config demo.launch
rosrun moveit_tutorials move_group_python_interface_tutorial.py
#需要安装commander相关的软件包，通过apt-cache search moveit可以查看到应该安装如下
sudo apt-get install ros-kinetic-moveit-commander
```

在Rviz中，可以看到如程序中安排的输出情况。

##Kinematic Model Tutorial

在本节中，将介绍通过C ++ API使用运动学。RobotModel和RobotState类是允许访问运动学的核心类。具体内容见[原网页](http://docs.ros.org/kinetic/api/moveit_tutorials/html/doc/pr2_tutorials/kinematics/src/doc/kinematic_model_tutorial.html)，这部分介绍到了IK和FK。

```sh
#例程原函数
vi ~/ws_moveit/src/moveit_tutorials/doc/pr2_tutorials/kinematics/src/kinematic_model_tutorial.cpp
```

对该CPP文件的编译参考[源码编译](http://moveit.ros.org/install/source/)，如果要运行该段程序，需要launch做的事情：

    - 将PR2 URDF和SRDF上传到param服务器。
    - 将kinematics_solver配置上传到ROS param服务器。

最后运行如下：

```sh
roslaunch moveit_tutorials kinematic_model_tutorial.launch
```

#rosserial_arduino

本部分介绍如何设置Arduino IDE来使用rosserial。rosserial提供了一个ROS通信协议，使用你的Arduino的UART工作。它允许您的Arduino成为一个完整的ROS节点，可以直接发布和订阅ROS消息，发布TF变换，并获得ROS系统时间。

我们的ROS绑定​​实现为Arduino库。像所有的Arduino库一样，ros_lib的工作原理是把它的库实现放到你的素描本的libraries文件夹中。

为了在你自己的代码中使用rosserial库，你必须先放

```sh
#include <ros.h>
#include <std_msgs/String.h>
```

##安装

```sh
sudo apt-get install ros-kinetic-rosserial-arduino
sudo apt-get install ros-kinetic-rosserial
```
前面的安装步骤创建ros_lib，它必须复制到Arduino构建环境中，以使Arduino程序与ROS交互。现在你已经从源代码或debs安装，所有你需要做的是将rosserial_arduino / libraries目录复制到你的Arduino sketchbook。

```sh
 cd /opt/arduino-1.6.7/libraries
rm -rf ros_lib
rosrun rosserial_arduino make_libraries.py .
```

重新启动IDE后，您应该看到ros_lib列在示例下：

<img src="http://wiki.ros.org/rosserial_arduino/Tutorials/Arduino%20IDE%20Setup?action=AttachFile&do=get&target=arduino_ide_examples_screenshot.png">

##hello world

我们将开始探索rosserial，为我们的Arduino创建一个“hello world”程序。选择示例-ros_lib-HelloWorld，进行编译上传，如果编译不通过，检查roslib创建的是否有问题。然后分别在各个窗口输入：

```sh
roscore
rosrun rosserial_python serial_node.py /dev/ttyACM0
rostopic echo chatter
#如果Arduino与ros通信想使用Arduino硬件的其它的Uart端口，可以更改vi /opt/arduino-1.6.7/libraries/ros_lib/ArduinoHardware.h +72为其他数字，默认为Uart0
```

#工业机器人
资料地址：[abb](http://wiki.ros.org/abb/Tutorials)/[首页](http://wiki.ros.org/Industrial/Tutorials)/[ABBgithub](https://github.com/ros-industrial/abb)/[roswiki](http://www.roswiki.com/index.php?c=thread&fid=9)