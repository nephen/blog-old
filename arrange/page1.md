---
layout: default
permalink: /page1/
---

<p>Linux安装软件记录</p>
全景图：hugin /图片masaic：<a href="http://www.misterhowto.com/index.php?category=Computers&subcategory=Graphics&article=make_mosaic_with_metapixel">metapixel</a>（<a href="http://www.linuxdiyf.com/bbs/thread-193632-1-1.html">参考</a>）/图片集合器：<a href="http://www.enricoros.com/opensource/fotowall/">Fotowall</a>(<a href="http://www.enricoros.com/oldblog/tag/fotowall/">教程</a>)/拼图：<a href="http://www.shapecollage.com/">SHAPE COLLAGE</a>     
Shutter是一款功能丰富的截图软件。你可以对特定区域、窗口、整个屏幕甚至是网站截图 - 并为其应用不同的效果，比如用高亮的点在上面绘图，然后上传至一个图片托管网站，一切尽在这个小窗口内。     
Scrot是一个命令行下使用的截图工具，支持全屏、窗口、选取、多设备、缩略图、延时，甚至可以截图完毕之后指定某程序打开截好的图片。如scrot -cd 20  ~/abc.png   
gcc的版本过高，需要进行[降级](http://blog.sina.com.cn/s/blog_6cee149d010129bl.html)。

```sh
~ $ sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 40
# => 这里“40” 是优先级，值越大优先级越高
~ $ sudo update-alternatives --config gcc
有 2 个候选项可用于替换 gcc (提供 /usr/bin/gcc)。

  选择       路径            优先级  状态
------------------------------------------------------------
  0            /usr/bin/gcc-5     60        自动模式
- 1            /usr/bin/gcc-4.8   40        手动模式
  2            /usr/bin/gcc-5     60        手动模式

要维持当前值[*]请按<回车键>，或者键入选择的编号：2
update-alternatives: 使用 /usr/bin/gcc-5 来在手动模式中提供 /usr/bin/gcc (gcc)
```

<p>邮件收发</p>
我要发邮件，可是不知道怎么发了，于是做了这些东西

1. sudo apt-get install sendmail     
2. sudo apt-get install sharutils     
3. uuencode /home/nephne/下载/fireble/APP/Android/FireBLE_Passthrough.apk apk|mail -s mailtest 995168694@qq.com

<p>财务</p>
1.5w + 6500

<p>命令使用</p>
1. 查看文件夹大小 du -sh
2. 终端里ctrl+：可以选择粘贴；Shift+Ctrl+C:复制/Shift+Ctrl+V:粘贴；ctrl+a	移动到当前行首/ctrl+e	移动到当前行尾；ctrl+/清零；top时找到最耗时的程序按'K'然后再按9杀掉；按ctrl+shift+t可以在同一个窗口开启终端，w则关闭。
3. dpkg-query -l 'xxx' 查找安装包
4. shitf + ctrl + 箭头移动终端屏幕
5. gedit中按ctrl + shift + L 保存所有并自动匹配语言类型，atl + 上下箭头移动一行，shift + home选中一行，ctrl + end至文章末尾，首选项里可以更改制表符大小
6. sudo apt-get install tree，使用tree .查看文件结构。

<p>新发现</p>
1. 两个手指触摸触摸板即可滑动屏幕！！！
