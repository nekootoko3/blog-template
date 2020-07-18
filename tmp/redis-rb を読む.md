---
title: "pipelining でコマンド実行を速くしよう with Ruby"
createdAt: "2019-10-31"
updatedAt: "2019-10-31"
canPublish: true
tag: redis, ruby
---

## redis-rb を読む

[redis-rb](https://github.com/redis/redis-rb)
cluster との接続ではない場合の set の実行までは読む

- `initialize`
  - 引数に cluster が存在するかどうかで client を分けている

```ruby
    @cluster_mode = options.key?(:cluster)
    client = @cluster_mode ? Cluster : Client
    @original_client = @client = client.new(options)
```

  - `super()` を実行してモニタ機能を利用できるようにする
- `set`

https://github.com/redis/redis-rb/blob/6b894f85954a82faa1f527d942ead9aade9c1ddc/lib/redis.rb#L45-L53


### モニターについて

モニターとは、1つの Mutex を利用するスレッドの同期機構
[Thread::Mutex](https://docs.ruby-lang.org/ja/latest/class/Thread=3a=3aMutex.html)の機能も提供されている

- Mutex の持ち主がスレッドである
- Mutex がロックの持ち主であるスレッドを覚えていて、そのスレッドが再度ロックしようとしてもブロックしない
- `synchronize` は、Mutex をロックをしていなければロックをして、ロックしていればそのままブロックを実行する。実行後にロックを解除する
- unlock は Mutex の持ち主であるスレッドだけができる
