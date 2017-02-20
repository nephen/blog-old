---
layout: post
title:  "ROS学习进度简报"
categories: "work_lifes"
author: Lever
tags: 大学
comments: true
update: 2016-04-27 01:42:47 Utk
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

#操作教程
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

##URDF

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

你应该已经完成​​了MoveIt！安装助手教程，如果没有，安装如下，Setup Assistant是一个图形用户界面，用于配置与MoveIt一起使用的任何机器人！

```sh
roslaunch moveit_setup_assistant setup_assistant.launch
#点击Create New MoveIt! Configuration Package
#browse选择/opt/ros/kinetic/share/pr2_description/robots/pr2.urdf.xacro
#load files
```

默认自碰撞矩阵生成器在机器人上搜索可以安全地禁用碰撞检查的链接对，从而减少运动计划处理时间。点击Self-Collisions面板，然后Regenerate Default Collision Matrix。

虚拟关节表示机器人的基部在平面中的运动。点击Virtual Joints面板，Add Virtual Joint，命名为virtual_joint，child link为base_footprint，parent frame为odom_combined，关节类型为planar，最后点击保存。

规划组用于语义描述机器人的不同部分，例如定义手臂是什么，或末端执行器。点击Planning Groups面板进行设置，选择的时候右边会有颜色提示。

Setup Assistant允许您将某些固定姿势添加到配置中。例如，如果您想将机器人的某个位置定义为初始位置，这将有所帮助。注意姿态如何与特定组相关联。您可以为每个组保存单独的姿势。尝试移动所有关节。如果你的URDF的联合限制有问题，你应该可以立即看到它。

我们已经添加了PR2的左右夹子。现在，我们将这两个组指定为特殊组：末端效应器。将这些组指定为末端执行器允许在内部发生某些特殊操作。

被动接头突出部旨在允许指定可能存在于机器人中的任何被动接头。这告诉规划者他们不能（运动学）计划这些关节。被动关节的示例包括被动脚轮。

单击Configuration Files 窗格。为要生成的ROS包选择一个包含新配置文件集的位置和名称（例如，点击浏览，选择一个好的位置（例如您的家庭目录）。

Setup Assistant现在将生成并将一组启动和配置文件写入您选择的目录中。