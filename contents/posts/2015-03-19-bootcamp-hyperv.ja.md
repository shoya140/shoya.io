---
title: BootcampでWindows8.1を起動する際にHyper-Vが実行されない問題
category: 'development'
keywords: ['Bootcamp', 'Windows', 'Hyper-V']
---

Windows Phoneのエミュレータが起動できなくなる問題を発見したので報告します。

## エラー内容

![ ](/img/blog_bootcamp_hyperv01.png)

> ハイパーバイザーが実行されていないため、Windows Phone Emulatorを起動できません。ハードウェア対応仮想化が有効になっていないことが原因の可能性があります。コンピュータのBIOSを調べ、ハードウェア対応仮想化及びハードウェア対応保護機能が有効になっていることを確認してください。

Bootcamp上のWindows8.1において コントロールパネル > プログラムと機能 > Windowsの機能の有効化または無効化 で有効化状態にあるはずのHyper-Vが実行されていない。

## 解決策

![ ](/img/blog_bootcamp_hyperv02.png)

**Optionキーを押しながら電源を入れてWindowsを起動するのではなく、まずOSXを起動し、システム環境設定 > 起動ディスク でWindowsをデフォルトに設定してから再起動ボタンを押して起動する。**

そんなばかな...という感じだけれど、こちらの記事([If I reboot to Windows directly from Windows (bootcamp options), I cannot launch a vm in Hyper-V - Apple Support Communities](https://discussions.apple.com/thread/6666722?searchText=hyper-v))によるとOptionキーを押しながら起動する方法ではCSM-BIOS layerの設定が起動しないからとのこと。

手順通りにWindowsを起動すると、Hyper-Vが実行されてEmulatorの起動を確認できた。

![ ](/img/blog_bootcamp_hyperv03.png)