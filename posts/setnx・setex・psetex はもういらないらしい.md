---
title: "setnx・setex・psetexはもういらないらしい"
createdAt: "2019-10-08"
updatedAt: "2019-10-08"
canPublish: true
tag: redis
---

redis の `SET` のオプションで全て済むという話。
今まで redis で string を SET する時下記のように使い分けていた

- `SETNX`
  - key が存在しなければ SET、存在しているなら何もしない
    - `EXISTS + SET` を 1 つのコマンドで
- `SETEX`
  - key を ttl つきで設定する
    - `SET + expire` を 1 つのコマンドで
- `PSETEX`
  - SETEX とほとんど同じだが、ミリ秒で ttl を設定できる

それが全て下の SET のオプションで済んでしまう

- `NX`
  - `SETNX`
- `EX`
  - `SETEX`
- `PX`
  - `SETPX`
- `XX`
  - key が存在している場合にのみ SET する。`NX` と逆の操作

操作例

```redis
127.0.0.1:6379> SET neko otoko3 NX EX 100
OK
127.0.0.1:6379> GET neko
"otoko3"
127.0.0.1:6379> TTL neko
(integer) 89
127.0.0.1:6379> SET neko kawaii XX
OK
127.0.0.1:6379> GET neko
"kawaii"
127.0.0.1:6379> SET neko onna NX
(nil)
127.0.0.1:6379> GET neko
"kawaii"
```

## 参考

- https://redis.io/commands/set
