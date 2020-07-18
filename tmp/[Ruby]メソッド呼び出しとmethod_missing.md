---
title: "メソッド呼び出しとmethod_missing"
createdAt: "2019-10-31"
updatedAt: "2019-10-31"
canPublish: true
tag: redis, ruby
---

## [Ruby] メソッド呼び出しと method_missing

Ruby で特定のクラスのインスタンスに対してメソッドを呼び出した時、まずはクラスに存在しているインスタンスメソッドから探す。
そのクラスに該当のインスタンスメソッドがなければ、継承チェーンを上ってインスタンスメソッドを探す。
例えば下記のようなクラスがあったとする。

```ruby
class Neko
  def nyaa
    "Miaumiau"
  end
end
```

Neko#nyaa が呼び出される画像
Object#object_id が呼び出される画像
BasicObject#method_missing が呼び出される画像

Neko クラスをオープンして `#method_missing` を定義する

```ruby
class Neko
  def method_missing(nakigoe)
    [:wanwan, :uho].include?(nakigoe) ? nakigoe.to_s : super
  end
end
```

#wanwan の画像
