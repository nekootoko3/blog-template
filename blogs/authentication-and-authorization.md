---
title: "認証と認可"
slug: authentication-and-authorization
createdAt: "2019-10-24"
updatedAt: "2019-10-24"
canPublish: true
tags: web
---

### 認証と認可

- 認証 Authentication
  - id・password、二段階認証などでユーザーが誰なのか(ユーザーの一意識別子)を特定する処理
- 認可 Authorization
  - **誰が**` 誰に``何の権限を与えるか `
    - `誰が`の部分で`認証`も含まれる
    - e.g. 誰が(Facebook ユーザー)誰に(Wantedly)何の権限を与える(Facebook の名前・年齢)
      - ユーザーが Facebook 認証 -> Facebook に登録している名前・年齢の情報を Wantedly が使うことを認める

### ref

- https://qiita.com/TakahikoKawasaki/items/f2a0d25a4f05790b3baa#%E8%AA%8D%E8%A8%BC%E3%81%A8%E8%AA%8D%E5%8F%AF
- [単なる OAUTH 2.0 を認証に使うと、車が通れるほどのどでかいセキュリティー・ホールができる](https://sakimura.org/2012/02/1487/)
- [非技術者のための OAUTH 認証(?)と OPENID の違い入門](https://www.sakimura.org/2011/05/1087/)
