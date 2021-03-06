---
title: "有効なエンドポイントを列挙したい"
slug: list-valid-endpoints-rails
createdAt: "2020-06-03"
updatedAt: "2020-06-03"
canPublish: true
tags: rails
---

叩かれなくなっているエンドポイントを見つけたい。
そのためにアクセスログとアプリケーションの有効なエンドポイントとを突き合わせるとよさそう。
そこで有効なエンドポイントの列挙方法を調べた。

### 実行するコードと出力

異なるアクセスログの形式に対応できるように 2 通りで出す。

### verb path の配列を取得するケース

```rb
Rails.application.routes.routes.reject(&:internal).collect do |route|
  next unless route.requirements[:controller] && route.requirements[:action]

  "#{route.verb} #{route.path.spec.to_s.sub(/\(.*\)/, "")}"
end.compact
```

これを実行すると下記のような配列が取得できる。
path 中の `:` から始まっているところは正規表現に置き換えてあげればよい。

```rb
=> ["GET /users/sign_in",
 "POST /users/sign_in",
 "DELETE /users/sign_out",
 "GET /users/password/new",
 "GET /users/password/edit",
...
 "PATCH /rails/conductor/action_mailbox/inbound_emails/:id",
...
 "POST /rails/active_storage/direct_uploads"]
```

### controller#action の配列を取得するケース

```rb
Rails.application.routes.routes.reject(&:internal).collect do |route|
  next unless route.requirements[:controller] && route.requirements[:action]

  "#{route.requirements[:controller]}##{route.requirements[:action]}"
end.compact
```

これを実行すると下記のような配列が取得できる

```rb
=> ["devise/sessions#new",
 "devise/sessions#create",
 "devise/sessions#destroy",
 "devise/passwords#new",
 "devise/passwords#edit",
...
 "active_storage/direct_uploads#create"]
```
