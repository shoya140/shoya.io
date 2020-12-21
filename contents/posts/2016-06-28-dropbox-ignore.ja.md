---
title: Dropboxへアップロードしたくないディレクトリをignoreする
category: 'note'
keywords: ['Dropbox']
---

Dropboxで同期しているディレクトリの中に、ローカルで必要だけどわざわざアップロードしたくないものはないだろうか。Dropboxの「[選択型同期の競合](https://www.dropbox.com/ja/help/1946)」という機能を使えば多少面倒ではあるがこれらのディレクトリをアップロードの対象から外すことができる。

[選択型同期の競合について (Dropbox ヘルプセンター)](https://www.dropbox.com/ja/help/1946)

僕はこの機能を使って.git以下やnode\_modulesなどの大量にファイルが作成されるディレクトリを同期させないようにしている。また、実験で記録したデータとその解析を行うプロジェクトは1対多になることがよくあるので、プロジェクト以下に実験データへのエイリアスを作成して、このエイリアスを同期の対象から外している。これによってプロジェクトからは相対パスで実験データを読み込むことができ、実験データはDropbox上で必要以上に複製されない(オリジナルのみが同期)という環境を作っている。

[.gitignoreライクな選択同期を望む声は多い](https://www.dropboxforum.com/hc/en-us/community/posts/201289669-Ignore-folder-without-selective-sync-)。これが実現してくれるととても助かる。