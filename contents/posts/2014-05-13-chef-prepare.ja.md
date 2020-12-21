---
title: Chefのknife solo prepareで404
category: 'development'
keywords: ['chef', 'vagrant', 'prepare', '404', 'error']
---

## 問題

Chefでknife solo prepareがうまく実行されない。Chef 11.14.0.alpha.2のwgetで404が返ってくるのが問題。

```bash
shoya@tornado$ knife solo prepare dev_debian
Bootstrapping Chef...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15934  100 15934    0     0   2238      0  0:00:07  0:00:07 --:--:--  9674
Downloading Chef 11.14.0.alpha.2 for debian...
downloading https://www.opscode.com/chef/metadata?v=11.14.0.alpha.2&prerelease=false&nightlies=false&p=debian&pv=6&m=x86_64
  to file /tmp/install.sh.2565/metadata.txt
trying wget...
ERROR 404
Unable to retrieve a valid package!
Please file a bug report at http://tickets.opscode.com
Project: Chef
Component: Packages
Label: Omnibus
Version: 11.14.0.alpha.2

Please detail your operating system type, version and any other relevant details
Metadata URL: https://www.opscode.com/chef/metadata?v=11.14.0.alpha.2&prerelease=false&nightlies=false&p=debian&pv=6&m=x86_64
Generating node config 'nodes/dev_debian.json'...
```

## 解決

[Knife-solo prepare fails - stackoverflow](http://stackoverflow.com/questions/23591190/knife-solo-prepare-fails)

opscode(version 11.14.0.alpha.2)側の問題なので、オプションでchefのバージョンを指定してあげるといいよとの回答。

```bash
shoya@tornado$ knife solo prepare dev_debian --bootstrap-version 11.12.0
Bootstrapping Chef...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15934  100 15934    0     0   2345      0  0:00:06  0:00:06 --:--:-- 14026
Downloading Chef 11.12.0 for debian...
downloading https://www.opscode.com/chef/metadata?v=11.12.0&prerelease=false&nightlies=false&p=debian&pv=6&m=x86_64
  to file /tmp/install.sh.2608/metadata.txt
trying wget...
url    https://opscode-omnibus-packages.s3.amazonaws.com/debian/6/x86_64/chef_11.12.0-1_amd64.deb
md5    e3cefe75258f5d737b729ed549cadfc5
sha256    3707bb7781317ce2928378564b95675291b9c3daa10a879bc77bea1333c83a9b
downloaded metadata file looks valid...
downloading https://opscode-omnibus-packages.s3.amazonaws.com/debian/6/x86_64/chef_11.12.0-1_amd64.deb
  to file /tmp/install.sh.2608/chef_11.12.0-1_amd64.deb
trying wget...
Comparing checksum with sha256sum...
Installing Chef 11.12.0
installing with dpkg...
Selecting previously unselected package chef.
(Reading database ... 39953 files and directories currently installed.)
Unpacking chef (from .../chef_11.12.0-1_amd64.deb) ...Setting up chef (11.12.0-1) ...
Thank you for installing Chef!

```

新しいバージョンが提供されるまではこれが応急処置みたい。
