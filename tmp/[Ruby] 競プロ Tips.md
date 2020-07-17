### 多次元配列

多次元配列を作るときは `Array.new(x) { Array.new(y) }` を使う。
`Array.new(x, Array.new(y))` でも多次元配列自体は作れるが、Array#new の 2 つ目のパラメーターとして与えられたデフォルトは同じオブジェクトを参照してしまう。
詳細は下記(rubydoc の sample)

When sending the second parameter, the same object will be used as the value for all the array elements:

```rb
a = Array.new(2, Hash.new)
# => [{}, {}]

a[0]['cat'] = 'feline'
a # => [{"cat"=>"feline"}, {"cat"=>"feline"}]

a[1]['cat'] = 'Felix'
a # => [{"cat"=>"Felix"}, {"cat"=>"Felix"}]
```

If multiple copies are what you want, you should use the block version which uses the result of that block each time an element of the array needs to be initialized:

```rb
dp = Array.new(x) { Array.new(y) }
```

### べき乗

大きな値でべき乗する時は `Integer#pow` を使う。
解答で 10**9+7 で割った余りなどを求められている時にはほぼ必須。
https://github.com/wantedly/yashima/issues/7653#issuecomment-612847975
