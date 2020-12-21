---
title: Sublime Text3でLaTeXをコンパイルする[Mac]
category: 'development'
keywords: ['Sublime Text', 'LaTeX', 'Tex']
---

Sublime Textにはcommand+bでコードを実行する機能(Build System)がある。今回はビルドできるファイルにLaTeXを加えてみた。Sublime TextでLaTeXを扱う方法、調べたらLaTeXToolsとかを入れていろいろ頑張る方法が出てくるのだけれど、既にMacTeXの環境(ターミナルからplatexコマンドなどが使える状態)があるのならもっと簡単に構築できると思う。

![ ](/img/blog_sublime_latex_01.png)

## 手順

1. Tools>Build System>New Build System...を選択してBuild Systemを作成する。

2. 新規ファイルが開かれるので、下記の設定を記入して保存する。ファイル名がメニューバーに表示されるBuild Systemの名前になる。保存場所はデフォルトで ~/Library/Application Support/Sublime Text 3/Packages/User になる。

```bash
{
  "shell": false,
  "cmd":[
    "/bin/sh", "-c", "/usr/texbin/platex $file_base_name.tex && /usr/texbin/pbibtex $file_base_name.aux && /usr/texbin/platex $file_base_name.tex && /usr/texbin/dvipdfmx -p a4 $file_base_name.dvi && /usr/bin/open $file_base_name.pdf"
  ],
  "selector": "source.tex"
}
```

## 補足

LaTeXからPDFを作成するには、複数回のコンパイルが必要になる。標準で提供されている仕組みではBuild Systemに複数のコマンドを登録することができないので、上記のような黒魔術を使用する。Macの場合は"shell"をfalseに、"cmd"にshとその引数として実行したいコマンドを&&で続けていけばうまく動作するらしい。Windowsの場合は書き方がやや異なる。[Multiple commands in Sublime Build System](http://blog.pcitron.fr/2013/02/08/multiple-command-in-sublime-build-system/)を参考に設定した。