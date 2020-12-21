---
title: Sublime Text3の設定をGit+Dropboxで安全に同期する
category: 'development'
keywords: ['Sublime Text', 'Dropbox', 'git', '同期']
eyecatch: /img/blog_sublime_sync.png
---

[Sublime Text3導入メモ](/ja/posts/hello-sublime/)で設定ファイルをDropboxで同期する方法を書いたのだけれど、意図しないタイミングで設定が同期されてコンフリクトが頻繁に発生するので、設定をGitで管理することにした。

![ ](/img/blog_sublime_sync.png)

設定ファイルにはアクセスキーなども含まれており、変更履歴を外部に公開するのはよくない。そこで今回はDropbox上にリモートリポジトリを作成する。同期をGitとDropboxの2段階にすることで「**過去の状態に戻しやすくなる**」「**任意のタイミングで同期できる**」というメリットがある。

## 1台目の手順

まずはDropbox上にリモートリポジトリを作成する。

```bash
$ mkdir -p ~/Dropbox/Git && cd ~/Dropbox/Git
$ git init —bare sublime.git
```

次にSublimeの設定フォルダへ移動してgit initを実行。ignoreするファイルは[Syncing - Package Control](https://sublime.wbond.net/docs/syncing)を参考にした。Dropboxのシンボリックリンクにしている場合は元に戻してから行うこと。

```bash
$ cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User
$ subl .gitignore # 下記のファイルを.gitignoreに書く
	Package\ Control.last-run
	Package\ Control.ca-list
	Package\ Control.ca-bundle
	Package\ Control.system-ca-bundle
	Package\ Control.cache/
	Package\ Control.ca-certs/
$ git init
$ git remote add origin ~/Dropbox/Git/sublime.git
$ git add .
$ git commit -m "init"
$ git push origin master
```

## 2台目の手順

既存の設定フォルダを削除してからgit clone.

```bash
$ cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages
$ rm -rf User
$ git clone ~/Dropbox/Git/sublime.git User
```

以後は変更の度にcommitして、push/pullで同期すれば良い。設定ファイルのありかを毎回タイプするのは面倒なので、自分は下記のエイリアスを作成している。.zshrcや.bashrcに書いておけばcd_sublime_userで楽に移動できる。

```bash
alias cd_sublime_user="cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User"
```