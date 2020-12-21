---
title: Dropbox Publicフォルダの終了に伴うブログ改修
category: 'development'
keywords: ['Dropbox', 'ブログ']
---

Dropboxには、ファイル/フォルダを選択して公開リンクを作成せずとも指定ディレクトリ以下をまるごと外部に公開できる「Publicフォルダ」という非常に機能があった。しかし、新規ユーザ、Dropbox Basicユーザの順にこの機能が制限され、2017年9月1日をもってDropbox Plusユーザも使用することができなくなってしまった。[Public フォルダ - Dropbox](https://www.dropbox.com/ja/help/files-folders/public-folder)

このブログはJekyllでビルドしてGitHub Pages上で公開していて、画像はなるべくGit管理に入れたくないという理由でPublicフォルダでホスティングしていた。今回、機能の終了に伴って8月末に少しだけブログを改修したので、その過程で得た知見を共有する。

## 公開リンクのURLを少し変えてファイルのホスティングを行う

公開リンクにブラウザでアクセスすると、通常はファイル/フォルダのダウンロードやコメントの投稿を行うためのWebページが表示される。ここで、URLの末尾にあるパラメータdl=0をraw=1に変更すると、Publicフォルダと同じようにブラウザ上でのレンダリングを実行することができる。実際には```https://dl.dropboxusercontent.com```にリダイレクトされているようなので、こちらに書き換えても大丈夫。[ファイルやフォルダのダウンロードを強制する/dropbox.com でレンダリングを実行する - Dropbox](https://www.dropbox.com/help/desktop-web/force-download) を参考にした。

```bash
# 通常の公開リンク; DropboxのWebページが表示される
https://www.dropbox.com/s/oxw7w2l72bpsato/dibtp.jpg?dl=0

# 強制的にダウンロードする
https://www.dropbox.com/s/oxw7w2l72bpsato/dibtp.jpg?dl=1

# ブラウザ上で直接レンダリングされる
https://www.dropbox.com/s/oxw7w2l72bpsato/dibtp.jpg?raw=1

# 同様にブラウザ上でレンダリングされる
https://dl.dropboxusercontent.com/s/oxw7w2l72bpsato/dibtp.jpg
```

この方法で従来通りWebサイト向けのファイルをホスティングすることができるが、ファイルひとつひとつを選択して公開リンクを作成するのは手間である。そこで、特に容量の大きなもののみにこの方法を使って、残りのほとんどは仕方なくGitリポジトリに加えることにした。

ところで、Jekyllを使ってWebサイトをGitHub Pages上で公開する際、そのsourceとoutputを管理する方法は複数存在する。(1)sourceをGitHubにPushしてGitHub上でビルドする。(2)outputのみをPushするリポジトリを作る。(3)Jekyllのoutputを/docs/にする設定を_config.ymlに書く。(4)sourceをmasterブランチで管理してgh-pagesブランチにoutputのみをコピーするRakefileを書く。(5)CIツールでPushを検知して自動デプロイする。の5つである。

(1)は独自のプラグインが実行できず(セキュリティ上safeオプションが付加されるため)、(2)はリポジトリを2個管理するのが面倒、という理由で8月末までは(3)を選択していたのだけれど、リポジトリの容量がsourceとoutputでほぼ2倍になってしまい、画像を入れると深刻な問題になるので、CIツールの練習をかねて(5)に移行してみた。

## Travis CIでJekyllブログをビルドする

検索するといろいろ情報がでてくる。GitHubのアクセストークンがTravisのログに残ってしまう方法がヒットするので、慎重に方法を選んだ。[Jekyll ブログの Travis CI 使って Github Page への配備する方法のメモ](https://cat-in-136.github.io/2015/04/jekyll-travis-ci-github-pages-deployment.html) が良さそうだった。手順は下記の通り。

1. [travis-ci.org](https://travis-ci.org/)にサインインして+ボタンからsourceのリポジトリを登録する。
2. [.travis.yml](https://github.com/shoya140/shoya.io/blob/master/.travis.yml)と[Rakefile](https://github.com/shoya140/shoya.io/blob/master/Rakefile)をリポジトリに追加する。
3. GitHubの[アクセストークンを発行する](https://github.com/settings/tokens/new)(scopeはpublic_repoにチェック)。
4. ```$ gem install travis```でtravisをローカルの環境にインストールする
5. ```$ travis encrypt -r ユーザ名/リポジトリ名 GH_TOKEN=トークン```を実行する。
6. .travis.ymlの```source:```を5の出力結果に置き換える。
7. git pushする。
