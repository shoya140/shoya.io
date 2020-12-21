---
title: JINS MEMEのセンサデータをグラフ表示・csv出力するアプリを作りました
category: 'release'
keywords: ['JINS MEME', 'MEMELogger', 'センシング']
eyecatch: /img/blog_memelogger_ios_dev_01.png
---

![ ](/img/blog_memelogger_ios_dev_01.png)

[JINS MEME Advent Calendar 2015](http://qiita.com/advent-calendar/2015/jinsmeme) 3日目の記事です。昨日の記事は@hatoneさんによる [JINE MEME iOSアプリ開発入門 -公式サンプルアプリを動かす-](http://hatone.hateblo.jp/entry/2015/12/01/162235)でした。サンプルアプリが動いたら、次はセンサから得られるデータについてもっと詳しく見てみたいはず！今日はセンサデータをグラフ表示したり保存する方法について紹介します。記事の前半は作ったものの紹介で後半は実装の工夫です。

## 背景

センサを使って何か面白いものを作るならデータの観察は欠かせません。そこで、観察に便利な**波形のモニタリング**と**ラベル付データの記録**機能を持ったアプリを作って[GitHub](https://github.com/shoya140/MEMELogger-iOS-developers)と[AppStore](https://itunes.apple.com/us/app/memelogger/id1073074817)で公開しました。GitHub版はREADMEに従ってAPP_IDとAPP_SECRETを書いたKey.hを作成してから実行してみてください。

## 機能

* アプリ上でセンサデータをグラフ表示できる
* オフライン解析のためにデータを記録できる

## 実装

**グラフ描画** 直近のデータを配列として保持しておき、UIBezierPathで連結することで描画しています。上限下限や色などはStoryboard上で変えられるようにIBInspectableを設定しました。

```swift
@IBDesignable class GraphView: UIView {
    @IBInspectable var maximumValue: Double = 1000.0{
        didSet {
            self.setNeedsDisplay()
        }
    }
    .
    .
    .
}
```

**データの記録** 開発者がデータの読み書きに使えるDocumentDirectory以下にテキストファイルを作成し、```memeRealTimeModeDataReceived(data: MEMERealTimeData!)```が呼ばれる度にそのデータを追記しています。また、iTunesやiFunBoxを使ってデータを取り出せるように```プロジェクト名-info.plist```にKey:```Application supports iTunes file sharing``` Value:```YES```をセットしました。

**まばたきのアニメーション** [PaintCode](http://www.paintcodeapp.com/)を使ってPathの位置を変数で変えられる目の画像を作成しました。PaintCodeから出力されたStyleKitをimportして、目の開閉や虹彩の位置とともにdraw~を呼び出して描画しています。

![ ](/img/blog_memelogger_ios_dev_02.png)

その他の細かい実装についてはリポジトリをご参照ください。

## まとめ

JINS MEMEのデータを観察する際に役立つアプリを作って公開しました。ご活用ください。[JINS MEME Advent Calendar2015](http://qiita.com/advent-calendar/2015/jinsmeme) 明日は古川さんとのことでとても楽しみです！

* [https://github.com/shoya140/MEMELogger-iOS-developers](https://github.com/shoya140/MEMELogger-iOS-developers)
