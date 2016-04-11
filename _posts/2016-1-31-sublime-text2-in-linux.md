---
layout: post
title:  "linux下sublime text 2使用技巧"
categories: "work_lifes"
author: 吴兴章
tags: 工作生活
donate: true
comments: true
update: 2016-04-12 01:59:43
---
由于sublime的多平台性，以及也有很多强悍的插件可供使用，是我不得不将兴趣移植这个编辑器上面来。将查看代码而言，在linux下也可以通过wine安装sourceinsight，但是对于安装跟使用来说不是很方便，特别是有git项目的时候。

<br>
#安装
首先下载安装[文件](http://www.sublimetext.com/2)。将下载好的文件解压至/opt，然后创建链接文件。

```sh
$ ln -s /opt/Sublime\ Text\ 2/sublime_text /usr/bin/
```
下面解决不能输入中文的问题    
保存下面的代码到文件sublime_imfix.c(位于~目录，即主文件夹目录)

<!--more-->
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
#查看代码
##sublime快捷键    
参考文章：[木木木](https://immmmm.com/all-about-sublime-text-2.html)

- 多行编辑： ctrl+左键 , Ctrl+Shift+L
- 文件切换： ctrl+p 搜索项目中的文件，支持模糊匹配
- ctrl+r：列出当前文件中的所有函数，同ctrl+p后按一个@符号一样，其实可以把ctrl+r理解成ctrl+p的快捷键
- 全局替换搜索 ： ctrl+shift+f
- 函数查找 ctrl+p 然后输入@，加上# 和 @ 分别为变量和函数，其实搜变量也能搜到函数
- 跳到指定行 ctrl+p 然后输入':'
- ctrl+f：当前文件中查找关键字
- 跳到某个类某个方法 ctrl+p 输入 类名@函数名
- 调出命令面板 ctrl+shift+p
- F11：全屏
- shift+F11：全屏免打扰模式，只编辑当前文件
- Ctrl+M 光标移动至括号内开始或结束的位置
- Ctrl+Shift+M 选择括号内的内容（按住-继续选择父括号）
- Ctrl+D 选中光标所占的文本，继续操作则会选中下一个相同的文本
- Alt+F3 选中文本按下快捷键，即可一次性选择全部的相同文本进行同时编辑。举个栗子：快速选中并更改所有相同的变量名、函数名等
- Alt+Shift+2 窗口两列显示
- Alt+Shift+8 窗口两行显示
- Ctrl+Enter 光标所在行后插入行
- Ctrl+Shift+Enter 光标所在行前插入行
- Ctrl+Shift+↑ 与上行互换
- Ctrl+Shift+↓ 与下行互换
- Ctrl+Shift+K 删除整行
- Ctrl+Shift+D 复制整行
- Ctrl+D 选中光标所在字符串 （按住继续选择下个相同字符串）
- Alt+F3 选中与光标处相同的全部词
- 重新打开关闭的标签：和Chrome浏览器一样，如果你不小心关闭了一个页面，你只要按下Shift+Cmd+T（Windows下按住Shift+Ctrl+T）就可以重新打开该页面。如果你连续按这样的组合键，你就可以按照关闭的顺序重新打开它们。
- 上下移动设置。快捷键为`ctrl + up\ctrl + down`。如默认为设置，需手动进行用户设置

	```sh
	{ "keys": ["ctrl+up"], "command": "scroll_lines", "args": {"amount": 1.0 } },
	{ "keys": ["ctrl+down"], "command": "scroll_lines", "args": {"amount": -1.0 } }
	```
- 标签页移动。ctrl + PgUp/PgDn
- 行首/尾。Home/End
- 复制至行首/尾。shift + Home/End
- 文章的首部/尾部。ctrl + Home/End
- 工程切换：ctrl + alt + o

	```sh
	{ "keys": ["ctrl+alt+o"], "command": "prompt_select_project" }
	```

##高亮设置
Sublime Text对于一些常见的扩展名的文件都能够识别并选择Sublime Text内置对应的高亮语法，但是对于一些使用频率比较少的扩展名文件就无法识别，Sublime Text打开此类文件后默认显示成普通文本，没有语法高亮。

- 打开文件后点击右下角的Plain Text，在出现的文件格式中选择open all with current extension as…  ->"需要显示的语法类型"。这样以后打开这个类型的文件就会自动进行语法高亮了。

##ctags与cscope
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

	也可以自定义热键。

	<img src="/images/ctags.png" alt="">

	输入如下：

	```
	[
	    {
	        "command": "navigate_to_definition",
	        "keys": ["ctrl+shift+period"]
	    },
	    {
	        "command": "jump_prev",
	        "keys": ["ctrl+shift+comma"]
	    }
	]
	```
4. ctags用官方的解释就是产生标记文件，帮助在文件中定位对象。其实就是你可以找到一个对象的定义处。更多请查看[Sublime之Ctags](http://ju.outofmemory.cn/entry/36068)
5. 搜索下载cscope插件。这里参考了[使用Sublime Text3+Ctags+Cscope替代Source Insight](https://www.zybuluo.com/lanxinyuchs/note/33551)。    
下载cscope

	```sh
	$ sudo apt-get install cscope
	```
在工程目录下执行命令

	```sh
	#=> R 表示把所有子目录里的文件也建立索引
	#=> b 表示cscope不启动自带的用户界面，而仅仅建立符号数据库
	#=> q 生成cscope.in.out和cscope.po.out文件，加快cscope的索引速度
	#=> k 在生成索引文件时，不搜索/usr/include目录
	$ cscope -Rbkq
	```
或者如下    
安装好Ctags和Cscope工具之后，可以在想要导入的工程的根路径下，通过下面命令建立Cscope索引数据库和.tags文件。

	```sh
	find . -name "*.h" -o -name "*.c" -o -name "*.cc" -o -name "*.S" -o -name "*.ch" -o -name "*.cpp" > cscope.files
	cscope -bkq -i cscope.files
	ctags -R -f .tags
	```
	热键：
	+ `Ctrl/Super + \`                 - Show Cscope options
	+ `Ctrl/Super + L``Ctrl/Super + S` - Look up symbol under cursor
	+ `Ctrl/Super + L``Ctrl/Super + D` - Look up definition under cursor
	+ `Ctrl/Super + L``Ctrl/Super + E` - Look up functions called by the function under the cursor
	+ `Ctrl/Super + L``Ctrl/Super + R` - Look up functions calling the function under the cursor
	+ `Ctrl/Super + Shift + [`         - Jump back
	+ `Ctrl/Super + Shift + ]`         - Jump forward

	进入cscope查找结果后，按回车即可进入结果相应页面。

##sublime部分插件
下面安装的这些插件可有可无，但是安装他们并熟练运用将成为你得力的助手。      
参考文章：[实用的sublime插件集合 – sublime推荐必备插件](http://www.xuanfengge.com/practical-collection-of-sublime-plug-in.html)/[Sublime插件：C语言篇](http://www.jianshu.com/p/595975a2a5f3)

>`Tip`:已安装插件具体请查看/home/username/.config/sublime-text-2/Packages

1. Terminal插件    
	Terminal插件可以允许在Sublime Text2中打开cmd命令窗口，很实用的一个插件，安装好该插件好，打开cmd命令窗口的快捷键是
	Ctrl+Shift+T。可在Preferences -> Package Setting找到README。
2. DocBlockr插件    
	用来生成注释块的插件，安装好之后直接输入"/*"，然后再按回车键，即可生成代码注释块。它会解析函数，变量，和参数，根据它们自动生成文档范式，你的工作就是去填充对应的说明。

	<img src="http://www.xuanfengge.com/wp-content/uploads/2013/12/basic.gif">

	<img src="http://www.xuanfengge.com/wp-content/uploads/2013/12/function-template.gif">
3. SublimeCodeIntel插件        
	代码自动提示
32. MarkDown Editing插件     
	支持Markdown语法高亮；支持Github Favored Markdown语法；自带3个主题。

	<img src="/images/markdownedit.png">
4. Git插件       
	该插件基本上实现了git的所有功能。设置git推送

	```sh
	git push --set-upstream origin master
	git config --global push.default simple
	#=> 先进行绑定
	git push -u origin master
	```

	<img src="http://www.xuanfengge.com/wp-content/uploads/2013/12/git.png">
6. Emmet插件      
	Emmet作为zen coding的升级版，对于前端来说，可是必备插件，如果你对它还不太熟悉，可以在其[官网](http://docs.emmet.io/)上看下具体的演示视频。

7. BracketHighlighter插件       
	可匹配[], (), {}, “”, ”, <tag></tag>，高亮标记，便于查看起始和结束标记

8. AutoFileName插件     
	自动完成文件名的输入，如图片选取

	<img src="http://www.xuanfengge.com/wp-content/uploads/2013/12/autofilename.gif">
9. FileDiffs插件      
	比较当前文件与选中的代码、剪切板中代码、另一文件、未保存文件之间的差别。可配置为显示差别在外部比较工具，精确到行。

	<img src="http://www.xuanfengge.com/wp-content/uploads/2013/12/diff.gif">
10. Git​Gutter插件      
	指示代码中插入、修改、删除的地方

	<img src="http://www.xuanfengge.com/wp-content/uploads/2013/12/cb42e7cddad0c04794b783742ee8f2085e95295a.png">
11. Alignment插件    
	选中并按ctrl+alt+a就可以使其按照等号对齐

	<img src="/images/align.gif">
12.  C Improved插件      
	更加人性化的C语言着色方案。
	设置如下：

	<img src="/images/cset.png">
	对比效果：

	<img src="/images/cimprove.png">
13.  CoolFormat插件     
	简单好用的代码格式化工具，相当于简化版的Astyle，默认ctrl+alt+shift+q格式化当前文件，ctrl+alt+shift+s格式化当前选中。

	<img src="/images/cool.gif">

	格式设置

	<img src="/images/coolset.png">
14. SublimeAStyleFormatter插件     
	国人做的Astyle Sublime版，蛮不错的。
	安装完成之后，下面这个配置一定要打开，即保存自动格式化，这个相比于CoolFormat要简单很多。

	配置

	<img src="/images/formate.png">

	<img src="/images/astyle.gif">
15. All Autocomplete插件      
	Sublime自带的可以对当前文件中的变量和函数名进行自动提示，但是AllAutocomplete可以对打开的所有文件的变量名进行提示，增强版的代码自动提示符。

	>Extend Sublime autocompletion to find matches in all open files of the current window
16. Markdown Extended + Monokai Extended插件     
	不错的Markdown主题，支持对多种语言的高亮

	<img src="/images/mono.png">
18. HexViewer插件     
	玩单片机的玩家都懂这个是很重要

	<img src="/images/hex.jpeg">
23. TableeEitor插件     
	Markdown中的表格书写体验真心不咋样，所有有人为这个开发了一个插件，具有较好的自适应性，会自动对齐，强迫症患者喜欢。

	<img src="/images/bg.gif">
23. TrailingSpaces插件      
	强迫症患者必备

	<img src="/images/space.jpg" alt="">
23. sublimelinter插件    
	sublimelinter是sublime的代码校验插件，它可以帮你找出错误或编写不规范的代码，支持 C/C++、CoffeeScript、CSS、Git Commit Messages、Haml、HTML、Java、JavaScript、Lua、Objective-J、Perl、PHP、Puppet、Python、Ruby 和 XML 语言。当需要对相应的语言进行代码校验的时候，就要下载相应的校验程序，例如：    
	- C/C++ - lint via `cppcheck`
  	- CoffeeScript - lint via `coffee -s -l`
  	- CSS - lint via built-in [csslint](http://csslint.net)
  	- Git Commit Messages - lint via built-in module based on [A Note About Git Commit Messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
  	- Haml - syntax check via `haml -c`
  	- HTML - lint via `tidy` (actually [tidy for HTML5](http://w3c.github.com/tidy-html5/))
  	- Java - lint via `javac -Xlint`
  	- JavaScript - lint via built in [jshint](http://jshint.org), [jslint](http://jslint.com), or the [closure linter (gjslint)](https://developers.google.com/closure/utilities/docs/linter_howto) (if installed)
  	- Lua - syntax check via `luac`
  	- Objective-J - lint via built-in [capp_lint](https://github.com/aparajita/capp_lint)
  	- Perl - lint via [Perl:Critic](http://perlcritic.com/) or syntax+deprecation check via `perl -c`
  	- PHP - syntax check via `php -l`
  	- Puppet - syntax check via `puppet parser validate`
  	- Python - native, moderately-complete lint
  	- Ruby - syntax check via `ruby -wc`
  	- XML - lint via `xmllint`
243. Search in Project插件     
	由于不是c文件的文件不能被ctags和cscope搜索到，所以建议安装这个插件。比较一下速度，选用了[pt](https://github.com/leonid-shevtsov/SearchInProject_SublimeText#installing-search-engines)引擎，需下载安装。快捷键为`Ctrl+Alt+Shift+F`，这种方法相对sublime 自身的全局搜索`Ctrl+Shift+F`要快一些。

	用户设置为

	```sh
	"search_in_project_engine": "the_platinum_searcher"
	```
	效果如下

	<img src="/images/screencast.gif" alt="">

<br>
#工程设置
建议参考[译:Sublime Text 2 项目设置](http://blog.jenux.me/?p=49)

```
{
	"folders":
	[
		{ // theme
			"path": "/C/wamp/www/wordpress/wp-content/themes/twentyeleven",
			"name": "Twenty Eleven Theme",
			"file_exclude_patterns":[
			"._*",
			"*.ico",
			"*.swf"
			],
			"folder_exclude_patterns": [
			"images"
			]
		},
		{ // plugins folder
			"path": "/C/wamp/www/wordpress/wp-content/plugins",
			"name": "Plugins Folder",
			"file_exclude_patterns":[
			"._*", // you need to specify this *again*
			"*.bak",
			"*.sample",
			"*.tar",
			"*.tgz",
			"*.zip"
			],
			"folder_exclude_patterns": [
			"akismet"//,
			// add any other plugins you wish to exclude
			]
		}
	],
	"settings":
	{
		"tab_size": 4
	}
	"build_systems":
	[
		{
			"name": "PX4: make all",
			"working_dir": "${project_path}",
			"file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
			"cmd": ["make"],
			"shell": true
		},
		{
			"name": "PX4: make and upload",
			"working_dir": "${project_path}",
			"file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
			"cmd": ["make upload px4fmu-v2_default -j8"],
			"shell": true
		},
		{
			"name": "PX4: make posix",
			"working_dir": "${project_path}",
			"file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
			"cmd": ["make posix"],
			"shell": true
		}
	]
}
```