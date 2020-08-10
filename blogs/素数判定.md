---
title: "素数判定"
slug: prime-test
createdAt: "2019-09-30"
updatedAt: "2019-09-30"
canPublish: true
tags: math
---

http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=ALDS1_1_C&lang=jp

### 試し割り法

2 以上の自然数 N (2<=N) が素数であるとは、1 と N 以外に約数が存在しないということ。
素朴に計算した場合、 2<=i<=N-1 を満たす i が N を割り切れないことで判定できる。この時の計算量は O(N)。
2 で割り切れないなら全ての偶数で割り切れないので、 i % 2 == 1 という条件を付け加えると計算が半減するがやはり計算量は O(N) のままである。

`合成数 x は p<=√x を満たす素因子 p を持つ`という性質を利用して、O(√N)の計算量で素数判定を行うことができる。
2 <= i <= √N を満たす i が N を割り切れないことを割ってみればよい。
ここまでの 1 と N 以外に約数が存在しないことを試しに割って確認してみる方法を`試し割り法`と呼ぶ

```py
"""
n が素数かどうかの判定を行う関数
"""
def is_prime(n):
  if n == 2:
    return True
  for i in range(2, int(n**0.5)+1):
    if n % i == 0:
      return False
  return True
```

### エラストテネスの篩

試し割り法は特定の数値に関してのみ素数判定を行う場合には有効だが、複数数値に関して素数判定を行う場合には有効ではない判定したい数値の数だけ O(√N) の計算を行う。
素数判定を行いたい数値が複数の場合には、あらかじめ素数であることを確認できるリストを作っておくことが有効。
エラトステネスの篩を行う手順

1. 要素数を素数判定を行いたい最大値(N とする)+1、値を全て true の配列を用意する
2. 2 <= i <= √N を満たす i に関して、3 の操作を行う
3. i 自体を除く添字が i の倍数の値を false にする
4. 全ての操作を行うと、素数判定したい数値が配列の添字となるときの値が true ならば素数、false ならば合成数であることが分かる配列ができる

ここで √N までとしたのは、N が合成数ならば p <= √N を満たす素因子を持つという性質から。

```py
"""
n までの自然数が素数かどうか示す配列を作る関数
"""
def make_is_primes(n):
  is_primes = [True for i in range(n+1)]
  is_primes[0] = False
  is_primes[1] = False
  for i in range(2, int(n**0.5)+1):
    if is_primes[i]:
      j = i + i
      while j <= n:
        is_primes[j] = False
        j += i
  return is_primes
```

## 参考文献

- https://ja.wikipedia.org/wiki/素数
- [プログラミングコンテスト攻略のためのアルゴリズムとデータ構造](https://www.amazon.co.jp/dp/B00U5MVXZO/ref=as_li_ss_tl?_encoding=UTF8&btkr=1&linkCode=sl1&tag=nekootoko304-22&linkId=64095822228365e78343aa7bb6e060da&language=ja_JP)
- https://mathtrain.jp/eratosthenes
