---
title: Jekyllのカテゴリ内で「次の記事」ボタンを設置する
category: 'development'
keywords: ['カテゴリ', '次の記事', '前の記事', 'jekyll']
---

Jekyllではpage.previous, page.next要素に前の記事/次の記事が格納されているので、前の記事/次の記事へ誘導するボタンがすぐに作れる。しかしこの前の記事/次の記事はタグやカテゴリを無視して時系列に引っ張ってくるので、あるカテゴリ内で前へ前へといった誘導ができない。

例えばこのブログでは<strike>日本語の記事をblog, 英語の記事をen/blogというカテゴリで管理しているので、</strike>(統合しました)英語の記事を読んでいる間は英語の記事だけを取得したいと思う。

調べたところDavid Straußさんがプラグインを作成されていて、結構良さそう。

[Category Aware Previous And Next For Jekyll Posts](http://stravid.com/en/category-aware-previous-and-next-for-jekyll-posts/)

これを少し改良して使うことにした。

```ruby
module Jekyll
  class CategoryAwareNextGenerator < Generator

    safe true
    priority :high

    def generate(site)
      site.categories.each_pair do |category_name, posts|
        posts.sort! { |a, b| b <=> a }

        posts.each do |post|
          position = posts.index post

          if position && position < posts.length - 1
            category_previous = posts[position + 1]
          else
            category_previous = nil
          end

          if position && position > 0
            category_next = posts[position - 1]
          else
            category_next = nil
          end

          post.data["#{category_name}_previous"] = category_previous unless category_previous.nil?
          post.data["#{category_name}_next"] = category_next unless category_next.nil?
        end
      end
    end
  end
end
```

改良点は2点。

* オリジナルは次の記事のみを取得していたので、前も記事を取得するようにした。
* 前の記事で"時系列的に過去"を呼びたいので、前の記事/次の記事の関係を逆にした。

_plugins/以下にcategory_next.rbなどと名前をつけて置いておけば

```ruby
# 前の記事
page.CATEGORYNAME_previous
# 次の記事
page.CATEGORYNAME_next
```

が取得できる
