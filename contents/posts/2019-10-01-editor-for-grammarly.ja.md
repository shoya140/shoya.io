---
title: Grammarlyのチェックを受けるためだけのエディタ
category: 'release'
keywords: ["Grammarly", "エディタ", "テキストエリア"]
description: "手元の文章をGrammarlyのスペル・文法チェックに素早くかけるために、専用のWebページを作ってブックマークしておくと便利なことに気がついた。"
eyecatch: /img/blog_grammarly.png
---

![ ](/img/blog_grammarly.png)

手元の文章を[Grammarly](https://grammarly.com)のスペル・文法チェックに素早くかけるために、専用のWebページを作ってブックマークしておくと便利なことに気がついた。GrammarlyのChrome拡張を入れて [https://shoya140.github.io/editor/](https://shoya140.github.io/editor/) にアクセスすると使えるので、ぜひ試してみてほしい。

[@shoya140/editor](https://github.com/shoya140/editor)で確認できるように、エディタは入力された情報を一切収集しない。せっかくなので @media (prefers-color-scheme: dark) {} を使ってダークモードをサポートしてみた。ブラウザのバージョン (Chromeだとv76+) によってはOSの設定に準拠して背景/文字色が変わる。