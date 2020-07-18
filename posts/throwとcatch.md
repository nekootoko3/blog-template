---
title: "throw と catch"
createdAt: "2020-06-28"
updatedAt: "2020-06-28"
canPublish: true
tag: ruby
---

Ruby では大体のケースでは特定のスコープを抜けるためには、関数に切り出して return するか begin-raise-rescue をしている。
なので `throw` と `catch` を使う機会はあんまりないように思う。
実際にどういうケースで使っているのかを見てみる。

### throw と catch を上手く利用しているライブラリ

使われていたのは Rack ベースのアプリケーションで認証機能を提供している [warden](https://github.com/wardencommunity/warden) というライブラリ。
このライブラリは[devise](https://github.com/heartcombo/devise) の内部でも利用されている。

### 利用箇所

throw と catch が使われているのはそれぞれ下記のコード。

- throw 周辺のコード
  - [Warden::Proxy#authenticate!](https://github.com/wardencommunity/warden/blob/v1.2.8/lib/warden/proxy.rb#L134)

```rb
    def authenticate!(*args)
      user, opts = _perform_authentication(*args)
      throw(:warden, opts) unless user
      user
    end
```

- catch 周辺のコード
  - [Warden::Manager#call](https://github.com/wardencommunity/warden/blob/master/lib/warden/manager.rb#L34)

```rb
    def call(env) # :nodoc:
      return @app.call(env) if env['warden'] && env['warden'].manager != self

      env['warden'] = Proxy.new(env, self)
      result = catch(:warden) do
        env['warden'].on_request
        @app.call(env)
      end

      result ||= {}
      case result
      when Array
        handle_chain_result(result.first, result, env)
      when Hash
        process_unauthenticated(env, result)
      when Rack::Response
        handle_chain_result(result.status, result, env)
      end
    end
```

### コードの説明

throw は認証を行うコード中にあって、認証が失敗した場合に `throw(:warden)` が実行されている。
catch は rack ミドルウェアの内部で利用されているので、この warden よりも内側のミドルウェア・アプリケーションコード中で throw(:warden) が実行されたらここまでジャンプする。
なので、認証が失敗したら rack ミドルウェアまで戻ってきて認証失敗時の処理を行う。
認証が成功した場合には アプリケーションのコードが rack response を返すはずなので、そのレスポンスをそのまま外側のミドルウェアに渡す。

### まとめ

ジャンプしたいコードが大きく離れている場合には非常に有効な手段だと思った。
特に今回の例のように、Rack ミドルウェアとアプリケーションコード間でのジャンプに使うとよさそう。
