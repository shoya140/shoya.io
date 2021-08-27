---
title: "Google ColabでDropboxのコードを実行する"
category: "development"
keywords: ["Google Colab", "Dropbox", "Sync", "Deep Learning"]
description: "Google Colab Pro+の登場によってページを離れてもノートブックを実行し続けられるようになり、計算資源としてのColabの活用が現実的になりました。試行錯誤した結果、ローカル開発環境で書いたコードを送って実行する方法が自分の中で確立したので、その手順と経緯を記します。"
eyecatch: /img/blog_colab_dropbox_integration_01.png
---

![ ](/img/blog_colab_dropbox_integration_01.png)

Google Colab Pro+の登場によってページを離れてもノートブックを実行し続けられるようになり、計算資源としてのColabの活用が現実的になりました。試行錯誤した結果、ローカル開発環境で書いたコードを送って実行する方法が自分の中で確立したので、その手順と経緯を記します。

![ ](/img/blog_colab_dropbox_integration_02.png)

## Dropboxを使ってコードを送る手順

ローカル開発環境でプロジェクトのフォルダを作成したら、Dropboxのコンテキストメニューから共有リンクを作成します。リンクの/sh/の後にdl/を追加するとフォルダの中身をzip形式でダウンロードできるようになるので、編集したリンクをwgetで取得します。

自分は普段、データセット:プロジェクトが1:Nになる形で開発することが多いので、データセットをプロジェクト外に置いてシンボリックリンクを貼るようにしています。そこで、Colab上でもデータセットとプロジェクトは分けて、別々にwget・unzipします。データセットは頻繁に更新しないため一度ダウンロードするだけでよく、wgetには-nc、unzipには-nをつけています。どちらも、存在する場合には上書きしないオプションです。

```ipynb
!wget -nc -O dataset.zip https://www.dropbox.com/sh/dl/...
!unzip -n -d dataset dataset.zip
```

プロジェクトは書き換えて再実行を度々行うので、wget・unzipに上書きを許可します。ローカル開発環境で貼っているシンボリックリンクはColab上のディレクトリ構成で上書きします。必要なパッケージをインストールして、目的のコードを実行します。

```ipynb
!wget -O proj.zip https://www.dropbox.com/sh/dl/...
!unzip -o -d proj proj.zip

!ln -fs /content/dataset /content/proj/data/input

!pip install -r requirements.txt

!python /content/proj/code/script/train.py
```

自分はproj/data/以下をinput (rawデータ)、working (特徴量、学習済みモデル、ログ)、output (論文用の実験結果と図) に分けて管理しています。workingやoutputはそこまで重くないのでproj以下に入れていますが、Colab上での結果を残したい場合はGoogle Driveをマウントしてリンクを貼っても良いと思います。

## この方法に至るまでの経緯

コード編集↔Colabで実行のサイクルを高速で回したいなぁと思って、最初に試したのはすべてGoogle Driveに保存してColabでマウントする方法でした。しかし、Mac (PC) のGoogle Driveアプリケーションがアップデートされてファイルストリームを推奨する形になり、それらはMac上ではSambaの外部ドライブとして扱われるためかパーミッションが変わったりgit管理できなかったりするので断念しました。ストリームを切った場合は選択同期ができず、アプリケーションが度々応答しなくなるので、今のところはGoogle Driveでプロジェクトのコードを管理するのは難しいと思っています。Google DriveをCyberduck経由のsyncで使う方法も試してみたのですが、消したファイルが不可視ファイルとして残るのが気になりました。

Dropboxの共有リンクには末尾に?dl=0がついており、?dl=1に変更するとファイルを直接ダウンロードすることができます。しかしこの機能はフォルダには適用されません。/shの後に/dlをつけるとフォルダでもzipファイルとしてダウンロードできるのは偶然見つけた機能でした。したがって将来的には使えなくなる可能性があります。

この方法を採用する一番の利点は取り回しの良さだと思います。実態はbashコマンド群なので、まとめてスクリプトにすれば、AWS・GCP・研究室の計算機など場所に関係なく実行することができます。データの容量や保管ポリシーが許す場合に限りますが、しばらくはこの方法でやってみる予定です。