---
title: Jekyllにはてなスター導入した
category: 'development'
keywords: ['jekyll', 'はてな']
---

承認欲求を満たすためにはてなスターを導入した。

<div class="hatena-star"><a href="{{ site.fullurl }}{{ page.url}}" style="display:none;">hatena</a></div>

手順は[はてなスター日記](http://d.hatena.ne.jp/hatenastar/20070707)の通りで、headなど任意の場所で以下のコードを読み込む。

```html
<script type="text/javascript" src="http://s.hatena.ne.jp/js/HatenaStar.js"></script>
<script type="text/javascript">
    Hatena.Star.Token = 'YOUR_TOKEN';
    Hatena.Star.EntryLoader.headerTagAndClassName = ['div','hatena-star'];
</script>
```

EntryLoader.headerTagAndClassNameにaタグを内包するDOMを指定すると、その場所にリンク先のはてなスターが表示される。

ページ内のどこでも設置できるようにしたかったので、ハイパーリンクを設置した上で文字はdisplay:none;で消すという黒魔術を使ってみた。

```html
<div class="hatena-star">
    <a href="PAGE_URL" style="display:none;">hatena</a>
</div>
```

はてなスターがあるとどのエントリが盛り上がっているか視覚的に分かって便利。

![ ](/img/blog_ss_hatena_star.png)
