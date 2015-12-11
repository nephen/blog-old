---
layout: default
title: About
---

## Blog platform
This is my blog based Jekyll theme,handsome theme like [[jekyllthemes]](http://jekyllthemes.org/)[[hexo.io/themes]](https://hexo.io/themes/)

You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](http://jekyllrb.com/) or [jekyllcn.com](http://jekyllcn.com/)

You can find the source code for the Jekyll new theme at [jekyll-new](https://github.com/jglovier/jekyll-new),the source code for Jekyll at [jekyll](https://github.com/jekyll/jekyll)

You can find the source code for this blog theme if you like it at [nephen.github.io](http://www.github.com/nephen/nephen.github.io)

More personal information please look up the [contact](/contact) page

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
       
