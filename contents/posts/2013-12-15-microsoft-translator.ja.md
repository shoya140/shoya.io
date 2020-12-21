---
title: PythonでMicrosoft Translator APIを使ってみる
category: 'development'
keywords: ['python', 'Microsoft Translator API', '自動翻訳']
---

自動翻訳APIであるMicrosoft Translator APIを導入してみました。

## 1. アプリケーションの登録

[Windows Azure Marketplace](https://datamarket.azure.com/developer/applications/)にアクセスしてアプリケーションを登録します。

Windows accountでのサインインを求められるので、持っていない場合は"新規登録"ボタンをクリックしてアカウントを作成します。

![ ](/img/blog_microsoft_translator01.png)

## 2. ライブラリのインストール

Python用のSDKがGitHubで公開されているので[リポジトリ](https://github.com/openlabs/Microsoft-Translator-Python-API)をcloneします。

```bash
$ git clone git@github.com:openlabs/Microsoft-Translator-Python-API.git
```

セットアップスクリプトを実行します.

```bash
$ cd Microsoft-Translator-Python-API
$ sudo python setup.py install
```

以上で導入は終わりです. 簡単ですね.

## 3. 実際に使ってみる

```python
from microsofttranslator import Translator
translator = Translator('<Your Client ID>', '<Your Client Secret>')
print translator.translate("Hello", "ja")
```

```bash
こんにちは
```

## 所感

自動翻訳APIは数多く存在しますが, 対応言語が多い・安定してサービスが継続されそうという理由で今回はMicrosoft Translator APIを選択しました。
(Google Translate APIの無料版v1は2011年12月1日をもってサービスを終了している)

連続してリクエストを送り続けるとエラーが返ってくることがあります。複数の文章を翻訳したいときは、一文ずつ送信するのではなく、文章を連結してひとつのリクエストにまとめて送信することで、この問題を解消することができます。
