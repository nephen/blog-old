---
layout: post
title:  "linux下sublime text 2使用技巧"
categories: "work_lifes"
author: 吴兴章
tags: 工作生活
donate: true
comments: true
---
由于sublime的多平台性，以及也有比较多的插件可供使用，是我不得不将兴趣移植这个编辑器上面来。将查看代码而言，在linux下也可以通过wine安装sourceinsight，但是对于安装跟使用来说不是很方便，特别是有git项目的时候。

<br>
####安装
首先下载安装[文件](http://www.sublimetext.com/2)。将下载好的文件解压至/opt，然后创建链接文件。

```sh
$ ln -s /opt/Sublime\ Text\ 2/sublime_text /usr/bin/
```
下面解决不能输入中文的问题    
保存下面的代码到文件sublime_imfix.c(位于~目录，即主文件夹目录)

```c
#include <gtk/gtkimcontext.h>

void gtk_im_context_set_client_window (GtkIMContext *context,
         GdkWindow    *window)
{
 GtkIMContextClass *klass;
 g_return_if_fail (GTK_IS_IM_CONTEXT (context));
 klass = GTK_IM_CONTEXT_GET_CLASS (context);

 if (klass->set_client_window)
   klass->set_client_window (context, window);

 g_object_set_data(G_OBJECT(context),"window",window);

 if(!GDK_IS_WINDOW (window))
   return;

 int width = gdk_window_get_width(window);
 int height = gdk_window_get_height(window);
 if(width != 0 && height !=0)
   gtk_im_context_focus_in(context);
}
```
将上一步的代码编译成共享库libsublime-imfix.so，命令如下：

```sh
$ cd ~
$ gcc -shared -o libsublime-imfix.so sublime_imfix.c  `pkg-config --libs --cflags gtk+-2.0` -fPIC
$ sudo mv libsublime-imfix.so /usr/lib
```
创建/usr/bin/sublcn，输入

```sh
#!/bin/sh
LD_PRELOAD=/usr/lib/libsublime-imfix.so exec sublime_text "$@"
```
下面通过sublcn命令打开sublime text 2就可以输入中文了。

<br>
####查看代码
#####sublime快捷键
多行编辑： ctrl+左键 , Ctrl+Shift+L    
文件切换： ctrl+p     
替换 ： ctrl+shift+f    
函数查找 ctrl+p 然后输入@    
跳到指定行 ctrl+p 然后输入:    
跳到某个类某个方法 ctrl+p 输入 类名@函数名     
调出命令面板 ctrl+shift+p

#####ctags与cscope
下面就想通过sublime实现类似SI的功能，毕竟这个编辑器是比较强大的。具体方案为采用ctags和cscope插件。    
下面参考[sublime添加ctags实现代码跳转](http://www.cnblogs.com/cchun/p/3794018.html)进行安装。具体为：  

1. 下载[Package Control.sublime-package](http://sublime.wbond.net/Package%20Control.sublime-package)放入/home/username/.config/sublime-text-2/Installed Packages中，可以用如下命令行实现

	```sh
	$ cd /home/username/.config/sublime-text-2/Installed Packages
	$ wget http://sublime.wbond.net/Package%20Control.sublime-package
	```
2. 在sublime下快捷键Ctrl+Shift+P，输入install，选择Package Control: Install Package回车，可以点击Ctrl + `查看安装状态。如果要卸载插件， Ctrl+Shift+P 输入 remove， 选择Package Control: Remove Package 然后再选择已安装的插件， 回车即可卸载。
3. 现在开始安装ctags的插件，在package control中选择install package，搜索ctags就能找到ctags的插件，安装之。

	<img src="http://images.cnitblog.com/blog/78067/201305/06235328-cd602dc27fa04924b59c4bb16d33aedd.jpg">

	到这里ctags就安装好了，肯定无法使用，必须系统中有ctags才能用，安装ctags如下：

	```sh
	$ sudo apt-get install ctags 
	```
	这时在侧左栏的工程/项目文件上右键会看到CTags: Rebuild Tags菜单项就是可用的了，点击建立.tags文件完成后进行如下操作。 也可以用命令生成.tags文件

	```sh
	#=> 进入主目录
	$ ctags -R -f .tags
	```   
	这时再选中一个函数，右键打开Navigate to Definition菜单项并执行，当然这里可以用[快捷键](https://github.com/SublimeText/CTags)：  
	  
	Command          |               Key Binding    |   Alt Binding | Mouse Binding
	------------------|---------------------------------|---------------|-------------------
	rebuild_ctags          |         ctrl+t, ctrl+r
	navigate_to_definition      |    ctrl+t, ctrl+t    |ctrl+>       |ctrl+shift+left_click
	jump_prev                     |  ctrl+t, ctrl+b   | ctrl+<     |  ctrl+shift+right_click
	show_symbols               |     alt+s
	show_symbols (all files)     |   alt+shift+s
	show_symbols (suffix)        |   ctrl+alt+shift+s
4. ctags用官方的解释就是产生标记文件，帮助在文件中定位对象。其实就是你可以找到一个对象的定义处。更多请查看[Sublime之Ctags](http://ju.outofmemory.cn/entry/36068)

#####sublime部分插件
1. Terminal插件    
	Terminal插件可以允许在Sublime Text2中打开cmd命令窗口，很实用的一个插件，安装好该插件好，打开cmd命令窗口的快捷键是
	Ctrl+Shift+T。可在Preferences -> Package Setting找到README。
2. DocBlockr插件    
	用来生成注释块的插件，安装好之后直接输入"/*"，然后再按回车键，即可生成代码注释块。它会解析函数，变量，和参数，根据它们自动生成文档范式，你的工作就是去填充对应的说明。
3. SublimeCodeIntel插件        
	代码自动提示
4. Git插件       
	该插件基本上实现了git的所有功能。
5. MarkdownEditing插件        
	SublimeText是能够查看和编辑 Markdown 文件，但它会视它们为格式很糟糕的纯文本。这个插件通过适当的颜色高亮和其它功能来更好地完成这些任务。
6. Emmet插件      
	Emmet作为zen coding的升级版，对于前端来说，可是必备插件，如果你对它还不太熟悉，可以在其[官网](http://docs.emmet.io/)上看下具体的演示视频。

