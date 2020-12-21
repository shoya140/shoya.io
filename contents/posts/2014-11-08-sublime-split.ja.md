---
title: Sublime Text3の画面をctrl+sp,vsで分割する[Mac]
category: 'development'
keywords: ['Sublime Text', '画面分割']
---

Sublimeの慣れないキーバインドに、「shift+option+command+数字」で画面を上下分割、「option+command+数字」で画面を左右分割にするものがある。Vimを使っていた名残でこれらの機能をsp(split)とvs(vsplit)に割り当てたいと思ったので、キーバインドを変更することにした。

デフォルトのキーバインドを変更するには、
1.「Key Bindings - Default」から対象のキーバインドを見つける。
2.「Key Bindings - User」にコピーしてキーの部分を書き換える。
の手順を踏めばいい。commandはsuper, controlはctrlと書く。

今回は「Key Bindings - User」に以下の設定を記入した。

```js
[
    {
        "keys": ["ctrl+v", "ctrl+s"],
        "command": "set_layout",
        "args":
        {
            "cols": [0.0, 0.5, 1.0],
            "rows": [0.0, 1.0],
            "cells": [[0, 0, 1, 1], [1, 0, 2, 1]]
        }
    },
    {
        "keys": ["ctrl+s", "ctrl+p"],
        "command": "set_layout",
        "args":
        {
            "cols": [0.0, 1.0],
            "rows": [0.0, 0.5, 1.0],
            "cells": [[0, 0, 1, 1], [0, 1, 1, 2]]
        }
    },
    {
        "keys": ["ctrl+s", "ctrl+s"],
        "command": "set_layout",
        "args":
        {
            "cols": [0.0, 1.0],
            "rows": [0.0, 1.0],
            "cells": [[0, 0, 1, 1]]
        }
    },
]
```

この設定で「control+v, control+s」で画面を左右分割、「control+s, control+p」で画面を上下分割、「control+s, control+s」で1画面に戻せる。3, 4つに分割する機会は少ないので今のところはそれぞれ2分割まで。現在の状態からさらに縦横に分割していくにはどうしたらいいんだろう...

もっと良い方法をご存じの方はぜひ教えてください。