---
title: "Unsupported reboot option reboot-fastboot"
category: 'development'
keywords: ["Android"]
description: ""
---

When I tried to install a customized Android 10 to Pixel 3a, the following error occurred.

```bash
$ export ANDROID_PRODUCT_OUT=`pwd`; fastboot flashall -w
--------------------------------------------
Bootloader Version...: b4s4-0.1-5613380
Baseband Version.....: g670-00011-190411-B-5457439
Serial Number........: XXXXXXXXXX
--------------------------------------------
Checking 'product'                                 OKAY [  0.057s]
Setting current slot to 'a'                        OKAY [  0.372s]
Sending 'boot_a' (65536 KB)                        OKAY [  1.850s]
Writing 'boot_a'                                   OKAY [  0.349s]
Sending 'dtbo_a' (8192 KB)                         OKAY [  0.320s]
Writing 'dtbo_a'                                   OKAY [  0.095s]
Sending 'vbmeta_a' (4 KB)                          OKAY [  0.120s]
Writing 'vbmeta_a'                                 OKAY [  0.066s]
Rebooting into fastboot                            FAILED (remote: 'Unsupported reboot option reboot-fastboot')
fastboot: error: Command failed
```

I could solve this problem by installing a bootloader with the same build version and running flashall again. Corresponding bootloaders are included in factory images availabe in [this page](https://developers.google.com/android/images).
