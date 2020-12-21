---
title: 科学技術計算のためのPython開発環境(2015)
category: 'development'
keywords: ['python', 'pyenv', '環境構築']
---

## 機能
* pyenv-virtualenvでバージョンと仮想環境を切り替えられる
* OpenCV3.0をPythonから利用できる
* Jupyter(iPython notebook)を起動できる

## pyenv-virtualenvの導入

[Homebrew](http://brew.sh/)でインストールする。

```bash
$ brew install pyenv-virtualenv
```

.zshrc(.bashrc)に下記の設定を追記する。

```bash
export PYENV_ROOT="${HOME}/.pyenv"
if [ -d "${PYENV_ROOT}" ]; then
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
fi
```

Pythonをインストール (例:3.5.10)

```bash
$ pyenv install 3.5.10
$ pyenv global 3.5.10
$ pyenv rehash
```

## OpenCVの導入

Homebrewでインストールする。

```bash
$ brew install opencv3 --with-contrib --with-python3 --without-python
```

現在のPythonが見ているところにpathを通す。<br/>新しい仮想環境を作る度に下記のコマンドを実行する。

```bash
# python2
$ echo /usr/local/opt/opencv3/lib/python2.7/site-packages > $(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")/opencv.pth

# python3
$ echo /usr/local/opt/opencv3/lib/python3.5/site-packages > $(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")/opencv.pth
```

numpyも一緒に入るけどpipで管理するものを使う

```bash
$ pip install numpy
```

## Jupyterなど定番ライブラリの導入

pipでインストールする

```bash
$ pip install numpy scipy pandas scikit-learn matplotlib jupyter
```

virtualenvの上でmatplotlibを使うための設定

```bash
$ echo backend : TkAgg > ~/.matplotlib/matplotlibrc
```

## 参考1 virtualenvの使い方

大体の場合はPythonのバージョン(2.7と3.5)を切り替えられるだけで十分だが、異なるバージョンのライブラリを使いたい時やテスト環境ではvirtualenvで仮想環境を用意する。

virtualenvの作成 (例:tutorialディレクトリ以下では3.5.0から作った3.5.0-tutorialを使用)

```bash
$ mkdir tutorial && cd tutorial
$ pyenv virtualenv 3.5.0 3.5.0-tutorial
$ pyenv local 3.5.0-tutorial
```

virtualenvの削除

```bash
$ pyenv uninstall 3.5.0-tutorial
```

## 参考2 OSX以外(Linux, Windows)での実行

scipyやOpenCVのセットアップで躓くことが多いのでminicondaを使っている。例えば下記のDockerfileからcontainerを作成してその上で実行する。(Python3系のcondaはOpenCVをサポートしていないので注意)

[shoya140/docker-image-ml](https://github.com/shoya140/docker-image-ml)

```Dockerfile
FROM centos
MAINTAINER shoya140

RUN yum update -y
RUN yum install -y git curl gcc zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl openssl-devel

RUN git clone git://github.com/yyuu/pyenv.git .pyenv
ENV PYENV_ROOT $HOME/.pyenv
ENV PATH $PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH

RUN pyenv install miniconda-3.18.3
RUN pyenv global miniconda-3.18.3
RUN pyenv rehash

RUN conda install numpy scipy pandas scikit-learn
RUN conda install -c https://conda.binstar.org/menpo opencv
```
