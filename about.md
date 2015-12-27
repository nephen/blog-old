---
layout: default
permalink: /about/
---

## Blog platform
This is my website <a href="http://indexed.webmasterhome.cn/?domain=www.nephen.com" target="_blank"><img src="http://images.webmasterhome.cn/images/indexed_cn.gif" width="80" height="15" border="0" align="absmiddle" alt="收录查询"></a> based Jekyll theme,handsome theme like [[jekyllthemes]](http://jekyllthemes.org/)[[hexo.io/themes]](https://hexo.io/themes/)

You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](http://jekyllrb.com/) or [jekyllcn.com](http://jekyllcn.com/)

You can find the source code for the Jekyll new theme at [jekyll-new](https://github.com/jglovier/jekyll-new),the source code for Jekyll at [jekyll](https://github.com/jekyll/jekyll)

You can find the source code for this blog theme if you like it at [nephen.github.io](http://www.github.com/nephen/nephen.github.io)

More personal information please look up the [contact](/contact) page

<hr>
## Simple development tutorial

```bash
# => Use Git and public article in folder _post
$ git clone git@github.com:nephen/nephen.github.io
```

```bash
apt (Debian or Ubuntu)
# => Set up Jekyll
$ sudo apt-get install ruby-full
$ gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/
$ gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org
# 请确保只有 ruby.taobao.org , please see <https://ruby.taobao.org>
```

```bash
$ sudo gem install bundler
```

```bash
$ sudo gem install jekyll
$ cd nephen.github.io
$ touch Gemfile
$ echo source 'https://ruby.taobao.org' > Gemfile
$ echo gem 'github-pages' >> Gemfile
$ bundle install
$ bundler exec jekyll server
# => Now browse to http://localhost:4000
```
The more info about [Blogging with Jekyll](https://help.github.com/articles/using-jekyll-with-pages/)

<hr>
##Contributing
1. Fork it (http://www.github.com/nephen/nephen.github.io)
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

<hr>
##TODO

- 锚定位与脚本产生冲突。
- 归档应该增加分类功能。

<hr>
##Notices
`您可以自由地：`

分享 — 在任何媒介以任何形式复制、发行本作品 

演绎 — 修改、转换或以本作品为基础进行创作 

只要你遵守许可协议条款，许可人就无法收回你的这些权利。

`惟须遵守下列条件：`

1. 署名 — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. 
2. 非商业性使用 — 您不得将本作品用于商业目的。 
3. 相同方式共享 — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original. 

即，任何人可以自由阅读、复制、发行，或通过信息网络传播本作品，或创作演绎作品。但必须 **保留作者署名**（吴兴章），以及指向该原文（www.nephen.com）的**链接** ，并不可用于商业用途 ；若在该作品基础上进行演绎，则必须使用**相同的协议** （署名-非商业性使用-相同方式共享 3.0）进行发布。

详情请见[署名-非商业性使用-相同方式共享（CC BY-NC-SA）3.0 ](http://creativecommons.org/licenses/by-nc-sa/3.0/cn/deed.zh)

<hr>
<div id="donate" class="target">
##Donate

如果您认为本网站的文章质量不错，读后觉得收获很大，预期工资涨幅能超过30%，不妨小额赞助我一下，让我有动力继续写出高质量的文章。

支付宝：18682441907(at)163.com [记得将(at)改回@哦]

如果你有手机支付宝，请打开支付宝App，使用“扫一扫”付款。</p>
<center><img src="/assets/alipay.png"/></center>
</div>

<hr>
##Wechat
My lab's WeChat Subscription, welcome attention~

<center><img src="/assets/wechat.png"/></center>