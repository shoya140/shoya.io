---
title: Mac起動後の画面が真っ暗
category: 'development'
keywords: ['Mac', 'ディスプレイ', '認識しない', '真っ暗', '起動']
---

MacBookPro Retina 15inch(2012)でディスプレイ関連のトラブルが度々発生しているので、備忘録として問題と解決策を記します。

## 問題

* 蓋を閉じてもスリープ状態にならない
* 外部ディスプレイを認識しない
* 起動後の画面が真っ暗

この問題が発生するとMacの電源を入れた時の画面が真っ暗で、何度か開け閉めするうちに画面が青くなってログイン画面が現れるようになります。
そのとき表示が別画面から本体の画面へ戻ってくるような挙動を示すことから、最後に接続したディスプレイの情報が残っていて悪さをしているのではないかと考えられます。

## 解決策

以下の手順によってこの問題を解決することができます。

**1.ディスプレイに関する設定ファイルを削除**

```bash
$ sudo rm /Library/Preferences/com.apple.windowserver.plist
$ rm ~/Library/Preferences/ByHost/com.apple.windowserver.*
```

**2.PRAMリセット**

PRAMと呼ばれる不揮発メモリに保存されたシステムの設定(指定起動ディスク、表示解像度、スピーカーの音量、その他の情報)を初期化します。

[OS X Mountain Lion: コンピュータのPRAMをリセットする](http://support.apple.com/kb/PH11243?viewlocale=ja_JP)

> 本体の電源を切り、option + command + P + Rボタンを押した状態で電源を入れます。
> 2度目の起動音が鳴るまでこれらのキーを押したままにします。

PRAMリセットがかかり、画面が正常に表示されます。

**3.SMCリセット**

PRAMリセットで解決しない場合は、照明や電源周りのトラブルである可能性があるため、SMCリセットを行います。

[Intel-based Macs：SMC (システム管理コントローラ) のリセット](http://support.apple.com/kb/ht3964?viewlocale=ja_JP)

> 本体の電源を切り、MagSafe電源アダプタをMacに接続します。
> shift + control + option キーを押しながら電源ボタンを押し続けます。
> 電源アダプタのLEDの色が変わったらボタンから手を離し、再度電源を入れます。