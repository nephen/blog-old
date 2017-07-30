---
layout: post
title:  "初学crazyflie2.0之diy硬件"
categories: "drons_lifes"
author: nephen
tags: 工作生活
donate: true
comments: true
update: 2017-07-30 10:15:11 Utk
---
<br>
# JLinkGDBServer调试
添加JLink到STM32F405RG，确保Vsupply接口存在电压。打开服务器端，这是arm-none-eabi-gdb调试的后台，如下。

<!--more-->

```sh
JLinkGDBServer -if SWD -device STM32F405RG

SEGGER J-Link GDB Server V5.12g Command Line Version

JLinkARM.dll V5.12g (DLL compiled May 27 2016 17:03:38)

-----GDB Server start settings-----
GDBInit file:                  none
GDB Server Listening port:     2331
SWO raw output listening port: 2332
Terminal I/O port:             2333
Accept remote connection:      yes
Generate logfile:              off
Verify download:               off
Init regs on start:            off
Silent mode:                   off
Single run mode:               off
Target connection timeout:     0 ms
------J-Link related settings------
J-Link Host interface:         USB
J-Link script:                 none
J-Link settings file:          none
------Target related settings------
Target device:                 STM32F405RG
Target interface:              SWD
Target interface speed:        1000kHz
Target endian:                 little

Connecting to J-Link...
J-Link is connected.
Firmware: J-Link ARM V8 compiled Nov 28 2014 13:44:46
Hardware: V8.00
S/N: 20121126
Feature(s): RDI,FlashDL,FlashBP,JFlash
Checking target voltage...
Target voltage: 3.31 V
Listening on TCP/IP port 2331
Connecting to target...Connected to target
Waiting for GDB connection...
```

<br>
# 开始GDB调试
注意如下，在用户目录下面创建.gdbinit文件。   
To enable execution of this file add
	add-auto-load-safe-path /home/nephne/src/Bootloader/.gdbinit
line to your configuration file "/home/nephne/.gdbinit".

编写`工程目录`下面的.gdbinit文件。

```sh
target remote :2331
set mem inaccessible-by-default off 
monitor speed auto
monitor endian little
monitor reset
monitor flash device = STM32F405RG
monitor flash breakpoints = 1 
monitor flash download = 1 
load
monitor reg sp = (0x08000000)
monitor reg pc = (0x08000004)
break main
layout src
# 可以使用next 1000运行到断点main处
```

运行命令如下，即可运行gdb的相关命令，如next，step，continue等等，其中layout src为显示源代码窗口。

```sh
arm-none-eabi-gdb build_crazyflie_bl/crazyflie_bl.elf
```

<br>
# 下载代码
更新bootloader除了使用JLink也可以使用dfu-util工具。

```sh
sudo dfu-util -d 0483:df11 -a 0 -s 0x08000000 -D crazyflie_bl.bin

GNU gdb (GNU Tools for ARM Embedded Processors) 7.6.0.20140731-cvs
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "--host=i686-linux-gnu --target=arm-none-eabi".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /home/nephne/src/Bootloader/crazyflie_bl.elf...done.
reset_handler () at ../../cm3/vector.c:67
67		for (src = &_data_loadaddr, dest = &_data;
Select auto target interface speed (2000 kHz)
Target endianess set to "little endian"
Resetting target
Selecting device: STM32F405RG
Flash breakpoints enabled
Flash download enabled
Loading section .text, size 0x2204 lma 0x8000000
Loading section .data, size 0x54 lma 0x8002204
Start address 0x8000000, load size 8792
Transfer rate: 8585 KB/sec, 4396 bytes/write.
Writing register (SP = 0x20020000)
Writing register (PC = 0x080018BD)
Breakpoint 1 at 0x8000b40: file main_f4.c, line 687.
(gdb) 
```
如果想在下载时看到灯闪烁，需要修改bootloader源码，因为买的开发板与原版crazyflie原理图还是有差异的。

```c
 #
 # Submodule management
 #
diff --git a/hw_config.h b/hw_config.h
index dd271d3..234f7d0 100644
--- a/hw_config.h
+++ b/hw_config.h
@@ -511,8 +511,8 @@
 
 # define OSC_FREQ                       8
-# define BOARD_PIN_LED_ACTIVITY         GPIO0
-# define BOARD_PIN_LED_BOOTLOADER       GPIO2
+# define BOARD_PIN_LED_ACTIVITY         GPIO5
+# define BOARD_PIN_LED_BOOTLOADER       GPIO5
diff --git a/main_f4.c b/main_f4.c
index 4b25c99..289e655 100644
--- a/main_f4.c
+++ b/main_f4.c
@@ -636,7 +636,7 @@ flash_func_read_sn(uint32_t address)
 }
 void
-led_on(unsigned led)
+led_off(unsigned led)
 {
        switch (led) {
        case LED_ACTIVITY:
@@ -650,7 +650,7 @@ led_on(unsigned led)
 }
 
 void
-led_off(unsigned led)
+led_on(unsigned led)
 {
        switch (led) {
        case LED_ACTIVITY:
@@ -709,6 +709,9 @@ main(void)
```

<br>
# 更新固件
更新固件，官网的方式为：

```sh
make crazyflie_default upload
```
但我的板子连接不上串口，改写源代码Firmware/Tools/px_uploader.py如下。

```sh
@@ -450,10 +450,10 @@ class uploader(object):
                         msg = "Firmware not suitable for this board (board_type=%u board_id=%u)" % (
                                 self.board_type, fw.property('board_id'))
                         print("WARNING: %s" % msg)
-                        if args.force:
-                                print("FORCED WRITE, FLASHING ANYWAY!")
-                        else:
-                                raise IOError(msg)
+                        #if args.force:
+                        print("FORCED WRITE, FLASHING ANYWAY!")
+                        #else:
+                        #        raise IOError(msg)
                 if self.fw_maxsize < fw.property('image_size'):
                         raise RuntimeError("Firmware image is too large for this board")
 # Spin waiting for a device to show up
 try:
@@ -563,10 +564,12 @@ try:
                             portlist += glob.glob(pattern)
             else:
                     portlist = patterns
 
-            for port in portlist:
-
-                    #print("Trying %s" % port)
+       
+            for port in patterns:
+                   port = "/dev/serial/by-id/pci-Bitcraze_AB_Crazyflie_BL_0-if00"
+                    print("Trying %s" % port)
 
                     # create an uploader attached to the port
                     try:
```
其中/dev/serial/by-id/pci-Bitcraze_AB_Crazyflie_BL_0-if00为串口id，是在 usb_cinit(void) 函数里被设定的，如下，具体见usb_strings的定义，有# define USBMFGSTRING "Bitcraze AB"。

```c
usbd_dev = usbd_init(&otgfs_usb_driver, &dev, &config, usb_strings, NUM_USB_STRINGS,
                              usbd_control_buffer, sizeof(usbd_control_buffer));

static const char *usb_strings[] = { 
        USBMFGSTRING, /* Maps to Index 1 Index */
        USBDEVICESTRING,
        "0",
};

# define USBMFGSTRING                   "Bitcraze AB"
# define USBDEVICESTRING                "Crazyflie BL"
```

最后更新固件成功后为：

```sh
Found board c,0 bootloader rev 5 on /dev/serial/by-id/pci-Bitcraze_AB_Crazyflie_BL_0-if00
WARNING: Firmware not suitable for this board (board_type=12 board_id=5)
FORCED WRITE, FLASHING ANYWAY!
ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff type: ÿÿÿÿ
idtype: =FF
vid: ffffffff
pid: ffffffff
coa: //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=

sn: 002a00343432470d33363638
chip: 10016413
family: STM32F40x
revision: Z
flash 1032192

Erase  : [====================] 100.0%
Program: [====================] 100.0%
Verify : [====================] 100.0%
Rebooting.
```

启动过程，如果固件加载ok，会启动px4主流程，Bootloader里面见main_f4.c，可用JLink调试是否运行至此。

```c
        /* try to boot immediately */
        jump_to_app();
```

<br>
# 串口调试
串口连接为PC10:E_TX1, PC11:E_RX1，连接usb转串口设备如下，当然我的外围设备都失败了。
关于引脚定义查找px4 board.h里面的源码：

```c
/* E_TX1 / E_RX1 */
#define GPIO_USART3_RX  GPIO_USART3_RX_2
#define GPIO_USART3_TX  GPIO_USART3_TX_2
```

串口显示如下：
```sh
sercon: Registering CDC/ACM serial driver
sercon: Successfully registered the CDC/ACM serial driver
nsh: mount: mount failed: No such file or directory
nsh: mkfatfs: mkfatfs failed: No such file or directory
ERROR [mtd] failed to initialize EEPROM driver
WARN  [param] selected parameter default file /fs/microsd/params
WARN  [param] open failed '/fs/microsd/params'
WARN  [modules__systemlib] failed to open param file: /fs/microsd/params
WARN  [param] Param export failed.
nsh: rgbled: command not found
nsh: blinkm: command not found
  BAT_N_CELLS: curr: 0 -> new: 3
WARN  [modules__systemlib] failed to open param file: /fs/microsd/params
WARN  [param] Param export failed.

NuttShell (NSH)
nsh> \0x1b
```
