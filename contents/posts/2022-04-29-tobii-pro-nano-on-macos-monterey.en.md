---
title: "How to use Tobii Pro Nano on macOS Monterey (12.3)"
category: 'development'
keywords: ["Tobii Pro Nano", "Eye Tracking", "Apple Silicon", "M1", "Mac", "Monterey"]
description: ""
eyecatch: /img/blog_tobii_nano_4.png
---

> **TL;DR**: Download the [driver for Mac](https://s3-eu-west-1.amazonaws.com/tobiipro.eyetracker.manager/downloadable-content/drivers/Nano/TobiiProNanoRuntime_1.5.4.0_x64_dmg/TobiiProNanoRuntime_1.5.4.0_x64.dmg) and execute an installer on an x86_64 terminal.<br>
> **Warning**: This is not an official instruction. Please proceed it at your own risk.

As of April 2022, [Tobii Pro Nano](https://www.tobiipro.com/product-listing/nano/) does not support macOS Monterey (on both Intel and Apple Silicon), and its driver cannot be installed using Tobii Eye Tracker Manager. However, I could find the driver manually and use Tobii Nano by reading the logs obtained from the [CLI mode of the application](https://developer.tobiipro.com/eyetrackermanager/etm-sdk-integration.html). This article introduces the procedure. Note that this method is unofficial and is valid until Tobii releases an update.

![ ](/img/blog_tobii_nano_1.png)

## 1. Run TobiiProEyeTrackerManager on Terminal to find the driver's link

Start Tobii Eye Tracker Manager in CLI mode according to [Tobii's documentation](https://www.tobiipro.com/product-listing/eye-tracker-manager/).

```
$ /Applications/TobiiProEyeTrackerManager.app/Contents/MacOS/TobiiProEyeTrackerManager
```

![ ](/img/blog_tobii_nano_2.png)

Then you will find a link to [nano.json](https://s3-eu-west-1.amazonaws.com/tobiipro.eyetracker.manager/downloadable-content/drivers/nano.json). In the json file, you can find links of several drivers. The link required for macOS is [TobiiProNanoRuntime_1.5.4.0_x64.dmg](https://s3-eu-west-1.amazonaws.com/tobiipro.eyetracker.manager/downloadable-content/drivers/Nano/TobiiProNanoRuntime_1.5.4.0_x64_dmg/TobiiProNanoRuntime_1.5.4.0_x64.dmg) at the time of writing this article.

## 2. Execute the install-driver on an x86_64 terminal

The dmg file consists of an installer. Execute it by double-click. if you are using Apple Silicon Mac, You need to run it on a Rosetta Terminal. I have successfully installed it with the following commands.

```
$ cd /Volumes/TobiiProNanoRuntime\ 1.5.4.0/
$ arch -x86_64 zsh
$ ./install-driver
```

![ ](/img/blog_tobii_nano_3.png)

## 3. Open TobiiProEyeTrackerManager and connect your Tobii Pro Nano

Once the driver installation is complete your Mac should recognize the Tobii Pro Nano, launch Tobii Eye Tracker Manager and try calibration and gaze visualization.

![ ](/img/blog_tobii_nano_4.png)
