---
title: AWSのGPUインスタンスでchainerとjupyter notebookを使う
category: 'development'
keywords: ['AWS', 'chainer']
---

AWSのアカウントを作成した状態から深層学習のための環境を作るまでの手順メモ

## インスタンスの作成

インスタンス->マーケットプレイス->「nvidia」で検索。<br/>インスタンスタイプはg2.2xlargeまたはg2.8xlargeを選択。

![ ](/img/blog_aws-chainer01.png)

## cuDNNのインストール(任意)

[NVIDIAのwebサイト](https://developer.nvidia.com/cudnn)でAccelerated Computing Developer Programに登録してダウンロード。登録が完了するまでに3日ほどかかる。ダウンロードしたものをインスタンス上で解凍して指定の位置に置く。

```bash
$ tar zxvf cudnn-6.5-linux-x64-v2.tgz
$ sudo cp lib* /opt/nvidia/cuda/lib64/
$ sudo cp cudnn.h /opt/nvidia/cuda/include/
```

## chainerとjupyterのセットアップ

```bash
$ sudo CUDA_PATH=/opt/nvidia/cuda pip install chainer
$ sudo yum install gcc atlas-devel lapack-devel blas-devel libpng-devel freetype-devel
$ sudo pip install scipy matplotlib pandas docopt scikit-learn jupyter
```

jupyter notebookを立ち上げてブラウザからアクセスできるようにする。

```bash
$ ipython
# 下記を実行して出力されたハッシュをコピー
from notebook.auth import passwd
passwd()

$ mkdir ~/.jupyter
$ vim ~/.jupyter/jupyter_notebook_config.py
# 下記の内容で保存
c = get_config()
c.NotebookApp.ip = '*'
c.NotebookApp.password = u'sha1:bcd259ccf...出力されたハッシュ'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 任意のポート(セキュリティグループの設定で開けておく)

$ jupyter notebook
```

SSL/HTTPSを使用する方法は[こちら](http://jupyter-notebook.readthedocs.io/en/latest/public_server.html)を参照。

## イメージの作成とイメージからのインスタンス作成

イメージ(テンプレート)の作成はインスタンスのメニュー>イメージの作成を選択して行う。同時にスナップショットも作成される。ここまでの作業を終えたものをイメージにしておけば、以後はそのイメージから同様のインスタンスを作成することができる。

![ ](/img/blog_aws-chainer02.png)

![ ](/img/blog_aws-chainer03.png)
