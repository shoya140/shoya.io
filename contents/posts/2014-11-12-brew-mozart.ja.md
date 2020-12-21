---
title: HomebrewでOz開発環境を整える[Mozart2][Emacs]
category: 'development'
keywords: ['brew', '環境構築', 'Oz', 'Mozart', 'Emacs']
eyecatch: http://ecx.images-amazon.com/images/I/51iXhiKTamL.jpg
---

「コンピュータプログラミングの概念・技法・モデル」(ガウディ本)のサンプルコードを実行するためにOz言語の環境を整えた。Ozは開発環境であるMozartシステムやEmacsを必要とし、それらはウェブサイト上で無料で公開されているのだけれど、パッケージをダウンロードしてくるのが面倒なのですべてHomebrewで管理することにした。

```bash
# emacs
brew install emacs --japanese --cocoa --srgb --with-gnutls -v
brew linkapps

# homebrew-cask
brew tap caskroom/homebrew-cask
brew install brew-cask

# mozart
brew tap caskroom/homebrew-versions
brew install mozart2
```

## 補足

Emacsについてはインストール方法やパッチが様々のようなので、[Macで本家EmacsとHomebrew IMEパッチ版とEmacs Mac PortとAquamacsを比べてみる。 - たったのセブンクレジット](http://www.sevencredit.com/2014/07/02/580/)を参考にさせていただきインストールオプションを上記に選んだ。

homebrew-versionsに送ったpull requestが無事にmergeされたのでcaskroom/homebrew-caskをtapすることでmozart2.0.0がインストールできるようになった。(本家のhomebrew-caskでインストールできるMozartは安定版の1.4.0)

## 2014.12.04 追記

mozart2がhomebrew-caskではなくhomevrewで管理されるようになったので現在は以下のコマンドでインストールできます。

```bash
brew install emacs --japanese --cocoa --srgb --with-gnutls -v
brew install mozart2
```

## 動作確認

Mozart2.appを起動して2フレームのEmacsが起動すればOKです。

<div class="babylink-box" style="overflow: hidden; font-size: small; zoom: 1; margin: 15px 0; text-align: left;"><div class="babylink-image" style="float: left; margin: 0px 15px 10px 0px; width: 75px; height: 75px; text-align: center;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798113468/mrk1869-22/" rel="nofollow" target="_blank"><img style="border-top: medium none; border-right: medium none; border-bottom: medium none; border-left: medium none;" src="http://ecx.images-amazon.com/images/I/51iXhiKTamL._SL75_.jpg" width="59" height="75" /></a></div><div class="babylink-info" style="overflow: hidden; zoom: 1; line-height: 120%;"><div class="babylink-title" style="margin-bottom: 2px; line-height: 120%;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798113468/mrk1869-22/" rel="nofollow" target="_blank">コンピュータプログラミングの概念・技法・モデル(IT Architect' Archiveクラシックモダン・コンピューティング6) (IT Architects’Archive CLASSIC MODER)</a></div><div class="babylink-manufacturer" style="margin-bottom: 5px;">セイフ・ハリディ, ピーター・ヴァン・ロイ, Peter Van-Roy, Seif Haridi</div></div><div class="booklink-footer" style="clear: left"></div></div>