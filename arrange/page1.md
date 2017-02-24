---
layout: default
permalink: /page1/
---

Linux安装软件记录
--------

全景图：hugin /图片masaic：<a href="http://www.misterhowto.com/index.php?category=Computers&subcategory=Graphics&article=make_mosaic_with_metapixel">metapixel</a>（<a href="http://www.linuxdiyf.com/bbs/thread-193632-1-1.html">参考</a>）/图片集合器：<a href="http://www.enricoros.com/opensource/fotowall/">Fotowall</a>(<a href="http://www.enricoros.com/oldblog/tag/fotowall/">教程</a>)/拼图：<a href="http://www.shapecollage.com/">SHAPE COLLAGE</a>     
Shutter是一款功能丰富的截图软件。你可以对特定区域、窗口、整个屏幕甚至是网站截图 - 并为其应用不同的效果，比如用高亮的点在上面绘图，然后上传至一个图片托管网站，一切尽在这个小窗口内。     
Scrot是一个命令行下使用的截图工具，支持全屏、窗口、选取、多设备、缩略图、延时，甚至可以截图完毕之后指定某程序打开截好的图片。如scrot -cd 20  ~/abc.png   
gcc的版本过高，需要进行[降级](http://blog.sina.com.cn/s/blog_6cee149d010129bl.html)。   
微信安装见[地址](https://github.com/geeeeeeeeek/electronic-wechat/releases)，下载解压即可运行。

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

vps
--------

服务器地址/密码：ssh 23.106.149.209 -l root -p 22/bwh181224
git 密码：git1024

vim设置
--------

```sh
set number
set hlsearch
syntax on
if has("cscope")
        set csprg=/usr/bin/cscope
        set csto=0
        set cst 
        set nocsverb
        " add any database in current directory
        if filereadable("cscope.out")
                cs add cscope.out
        " else add database pointed to by environment
                elseif $CSCOPE_DB != ""
        cs add $CSCOPE_DB
        endif
        set csverb
endif

nmap <F5> :cs find 3 <C-R>=expand("<cword>")<CR><CR>

"https://github.com/airblade/vim-gitgutter/
let g:gitgutter_avoid_cmd_prompt_on_windows = 1 
set tags=./tags,./TAGS,tags,TAG,~/src/Firmware,~/src/Marlin/Marlin
set noet ft=cmake fenc=utf-8 ff=unix
```

邮件收发
--------

我要发邮件，可是不知道怎么发了，于是做了这些东西

1. sudo apt-get install sendmail     
2. sudo apt-get install sharutils     
3. uuencode /home/nephne/下载/fireble/APP/Android/FireBLE_Passthrough.apk apk|mail -s mailtest 995168694@qq.com

财务
--------

1.5w + 6500

命令使用
--------

1. 查看文件夹大小 du -sh
2. 终端里ctrl+：可以选择粘贴；Shift+Ctrl+C:复制/Shift+Ctrl+V:粘贴；ctrl+a	移动到当前行首/ctrl+e	移动到当前行尾；ctrl+/清零；top时找到最耗时的程序按'K'然后再按9杀掉；按ctrl+shift+t可以在同一个窗口开启终端，w则关闭。
3. dpkg-query -l 'xxx' 查找安装包
4. shitf + ctrl + 箭头移动终端屏幕
5. gedit中按ctrl + shift + L 保存所有并自动匹配语言类型，atl + 上下箭头移动一行，shift + home选中一行，ctrl + end至文章末尾，首选项里可以更改制表符大小
6. sudo apt-get install tree，使用tree .查看文件结构。

新发现
--------

1. 两个手指触摸触摸板即可滑动屏幕！！！

求职意向
--------

1. 飞控工程师，飞控研发工程师
深圳
1.5-2万/月
[深圳飞豹航天航空科技有限公司](http://jobs.51job.com/shenzhen/64575387.html)

2. 飞控算法工程师 15K-25K
深圳1-3年本科
[欧拉空间（EulerSpace）](http://bosszhipin.kanzhun.com/job_detail/1400301455.html?sid=aladingb)

目标指定
--------

[知乎](https://www.zhihu.com/question/27350902)、[九步确定你的人生目标和制定达到目标的计划](http://www.mifengtd.cn/articles/define_goal_destination_devise_a_plan_to_get_there.html) 、[如何设计你的2015年度计划](http://mp.weixin.qq.com/s?__biz=MjM5NTE5NzUwMA==&mid=202719328&idx=1&sn=b3c54f25b87c409ea535f6432006bdb4&scene=1&key=2f5eb01238e84f7e7be66069503c3f1d8126cb5367ec5075b7016b9199a56cb5d78351f177421855c4d829227fb332dd&ascene=0&uin=MTU5MTA4MDE1&devicetype=iMac+MacBookPro11%2C1+OSX+OSX+10.10.1+build%2814B25%29&version=11020012&pass_ticket=tEdoxraAYYq3oafv2Kq1bGduFs%2FvcJmYc4y6d2cIQjw%3D) 、[个人目标管理浅谈](http://learningtime.lofter.com/post/1f1d50_9297db)
