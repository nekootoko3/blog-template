---
title: "pipelining でコマンド実行を速くしよう with Ruby"
createdAt: "2019-10-31"
updatedAt: "2019-10-31"
canPublish: true
tag: redis, ruby
---

redis は client/server モデルを採用している TCP サーバーなので複数のコマンドを実行したい時に、
コマンドを送る・結果を受け取る・次のコマンドを送る...とやっていたら全てのコマンドが完了するのに単純化して `RTT(Round Trip Time) * リクエスト数` の時間がかかる。
これは `パイプライニング(Pipelining)` によって高速化できる。

## Pipelining

Pipelining とは、サーバーからのレスポンスを待たずに複数のリクエストを送り、最後にまとめてレスポンスを受け取るという手法である。

画像 - https://ja.wikipedia.org/wiki/HTTP%E3%83%91%E3%82%A4%E3%83%97%E3%83%A9%E3%82%A4%E3%83%B3#/media/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB:HTTP_pipelining2_ja.svg

wikipedia の顔像から分かるようにリクエスト毎にレスポンスを待たなくてよく全体の処理時間が短縮される。
pipelining で処理が早くなる理由としてレスポンスを待たなくてよくなること以外にも、`socket I/O` の回数を減らせる
`read()`・`write()` syscall は `kernel mode` で動作し、redis の処理は `user mode` で処理される。
pipelining を使わない時、毎リクエスト毎に 2 つのモードを行き来する必要があり、そのスイッチングコストが大きい。
それが pipelining を使うと、1 回の read()・write() だけで済むので、処理時間が短縮される。

注意点！
pipelining を使ってコマンドを送る際、1 回に送るコマンドを制限したほうがよい。
というのも最大で、コマンド分のレスポンスを追加でメモリに持っておく必要があるから。
10,000 くらいまでにしておくのがよさそう。

## Ruby 実装

100,000 の string 型をローカルの redis に set する。
redis には予め `flushall` をしておいて、実行時間も計測する。

### pipelining を使わない実装

実装

```ruby
require 'redis'

redis = Redis.new
100000.times do |n|
  redis.set("key_#{n}", "value_#{n}")
end
```

実行時間

```
real    0m5.038s
user    0m3.015s
sys     0m1.264s
```

### pipelining を使った実装

実装

```ruby
require 'redis'

redis = Redis.new
redis.pipelined do
  100000.times do |n|
    redis.set("key_#{n}", "value_#{n}")
  end
end
```

実行時間

```
real    0m1.857s
user    0m1.196s
sys     0m0.472s
```

## まとめ

複数のコマンドを redis に対して発行する場合には pipelining を使おう！
コマンドの数によっては 3 倍以上速くなる！

## 参照

- [Using pipelining to speedup Redis queries](https://redis.io/topics/pipelining)
- [HTTP パイプライン](https://ja.wikipedia.org/wiki/HTTP%E3%83%91%E3%82%A4%E3%83%97%E3%83%A9%E3%82%A4%E3%83%B3)

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=nekootoko304-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4048917358&linkId=7f4d4b79ecdfcc491bcca59fa2b4c46a"></iframe>
