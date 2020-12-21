---
title: Windowsの設定(普段Mac使ってる人向け)
category: 'development'
keywords: ['Windows', '環境構築']
---

Windows上に開発環境を構築することが時々あるのでその作業メモ。

## SharpKeysでWindowsキーをコントロールキーにリマップ

[SharpKeys](http://www.randyrants.com/category/sharpkeys/)

MacBook内臓のキーボードやApple Magic Keyboardのcommandキーを押すとWindowsキーが反応する。コピー・ペーストやアプリを閉じる操作をMacと同じキーで行いたいのでキーリマップソフトウェアを使って変更する。いろいろ試してみたところSharpKyesが良さそうな感じ。(キーリマップソフトウェアにはレジストリを書き換えるものとシステムに常駐するものがあって、SharpKeysは前者。)

## gnupackでcygwin環境を構築する

[gnupack Users Guide](http://gnupack.osdn.jp/docs/UsersGuide.html)

gnupackとはインストール不要のcygwin環境。展開して.exeを起動するとそのディレクトリにあるhome/をホームディレクトリとしてLinuxディストリビューション同等の機能が使用できる。VimやEmacsも入っている。以下はおすすめの設定。

**openコマンドでファイルを開く**

cygstartというコマンドがMacターミナルのopenに相当するようなので.bashrcに追記。

```bash
alias open='cygstart'
```

**sublコマンドでAtomを起動する**

Atomのインストール先をPathに追加することで可能。.bashrcに下記を追記。

```bash
export PATH=$HOME\\AppData\\Local\\atom:$PATH
# 他のエディタも同様
# export PATH=C:\\Program\ Files\\Sublime\ Text\ 3:$PATH
```

**gnupackとMinicondaを一緒に使う**

[Miniconda](http://conda.pydata.org/miniconda.html)とはPythonの主要ライブラリを簡単に管理できるツールであるAnacondaの最小構成版。インストールが済むとシステムかユーザ以下(選択可能)に新しいPythonが入ってWindowsの環境変数にそのPathが追記される。gnupack上のcygwinはこの環境変数を読まないので、Pathを手動で追加する必要がある。下記を.bashrcに追記。Miniconda3のところはインストールしたPythonのバージョンに合わせる。

```bash
export PATH=C:\\Users\\YOUR_USER_NAME\\Miniconda3\\:$PATH
export PATH=C:\\Users\\YOUR_USER_NAME\\Miniconda3\\Scripts\\:$PATH
export PATH=C:\\Users\\YOUR_USER_NAME\\Miniconda3\\Library\\bin:$PATH
```

他にも便利な設定が見つかったら追記していく予定。
