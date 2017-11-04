---
layout: post
title:  "mavlink-research"
categories: "work_lifes"
author: Lever
tags: 工作
comments: true
update: 2017-06-16 07:43:37 Utk
---
<br>
# 协议分析
mavlink包的构成如下图所示。 
<img src="http://qgroundcontrol.org/_detail/mavlink/mavlink-packet.png?id=mavlink%3Astart">
具体解释如下图所示。
<img src="/images/mavlink-protocol.png"
该协议完全存在两个特点：传输速度和安全性。它允许检查消息内容，它还允许检测丢失的消息，但是每个数据包只需要六个字节的开销。

在mavlink_helpers.h文件中，mavlink_parse_char描述了包解析的过程。
message_definitions下的xml文件可以对message进行定义，可以将xml文件通过MAVLink Generator生成c/c++等代码。

```sh
git clone https://github.com/mavlink/mavlink mavlink-generator
cd mavlink-generator
python generate.py
```

此外，MAVLink还生成串行化（打包）和反序列化（解包）消息的功能，[mavlink_msg_heartbeat_pack]/[mavlink_msg_heartbeat_encode]/[mavlink_msg_heartbeat_decode]。

# 资料查找
[mavlink start](http://qgroundcontrol.org/mavlink/start)