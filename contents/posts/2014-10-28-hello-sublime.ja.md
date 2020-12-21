---
title: Sublime Text3導入メモ
category: 'development'
keywords: ['Sublime Text']
---

最近VimからSublime Text3に乗り換えました。この記事は導入方法についてのメモです。

## homebrew-caskからインストール

アプリケーションはAppStore > homebrew-cask > 手動で管理する主義なので、Sublime Textをhomebrew-caskからインストール。デフォルトのbrew caskからインストールできるSublime Textのversionは2なので注意。version3を追加する。

```bash
brew tap caskroom/homebrew-versions
brew cask install sublime-text-dev
```

## Package Control

プラグイン管理ツールであるPackage Controlをインストールする。<br/>
メニューバーから View > Show Consoleを開く。下記を入力して実行する。

```bash
import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

インストールが完了したらcommand+shift+p > install packageで起動できる。パッケージ名を検索して選択するとインストールされる。インストールしたパッケージリストは以下に作成される。

```bash
~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User/Package\ Control.sublime-settings
```

とりあえず入れたパッケージ

```bash
{
    "installed_packages":
    [
        "ColorPicker",
        "Gist",
        "Git",
        "HTML5",
        "Jekyll",
        "Markdown Preview",
        "SCSS",
        "Theme - itg.flat",
        "Theme - Soda"
    ]
}

```

参考: [Installation - Package Control](https://sublime.wbond.net/installation)

## 複数PC間での設定ファイル同期

```bash
~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User/
```に作成されるファイルをDropboxなどに入れてシンボリックリンクを貼れば良い。

1台目

```bash
cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
mkdir ~/Dropbox/Sublime
mv User ~/Dropbox/Sublime/
ln -s ~/Dropbox/Sublime/Use
```

2台目

```bash
cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
rm -r User
ln -s ~/Dropbox/Sublime/User
```

Gitで管理してgithubに置く場合はアクセスキーやトークンの取り扱いに注意。プライベートリポジトリ推奨。また下記のファイルは.gitignoreに書いて同期しないように設定する。

* Package Control.last-run
* Package Control.ca-list
* Package Control.ca-bundle
* Package Control.system-ca-bundle
* Package Control.cache/
* Package Control.ca-certs/

参考: [Syncing - Package Control](https://sublime.wbond.net/docs/syncing)

## ターミナルから起動

```bash
$ subl [ファイル名] # ファイル名を開く
$ subl . # カレントディレクトリを開く
```

## 利用者の声

@[tweet](https://twitter.com/shoya140/status/526782092554694658)