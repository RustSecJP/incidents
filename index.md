---
title: ホーム
---
<div class="hero" data-no-toc markdown="0">
  <h1>Rust の供給網の事件を、<br>事件のまとまりで読む。</h1>
  <p class="lead">悪意のある crate は、1 つの攻撃が複数の crate にまたがります。RustSecJP incidents は、ばらばらに出る助言を事件ごとに束ね、Rust 専用の物差しで重要度を示します。</p>
  <div class="btns">
    <a class="btn pri" href="{{ '/calculator/' | relative_url }}">重要度を計算してみる</a>
    <a class="btn" href="{{ '/campaigns/' | relative_url }}">キャンペーンを見る</a>
  </div>
</div>

<div class="cards" markdown="0">
  <a class="card" href="{{ '/campaigns/' | relative_url }}">
    <span class="tag">記録</span>
    <h3>キャンペーン</h3>
    <p>複数の crate にまたがる攻撃を、根拠と確信度つきで 1 つにまとめた記録。</p>
  </a>
  <a class="card" href="{{ '/spec/severity-score.html' | relative_url }}">
    <span class="tag">草案 0.1</span>
    <h3>RSJP Score</h3>
    <p>「安全な Rust だけで踏めるか」「ビルド時に動くか」などを軸にした、0.0〜10.0 の重要度。</p>
  </a>
  <a class="card" href="{{ '/spec/campaign-id.html' | relative_url }}">
    <span class="tag">草案 0.1</span>
    <h3>キャンペーン番号</h3>
    <p><code>RSJP-C-YYYY-NNN</code>。既存の助言を置き換えず、束ねるためだけの番号。</p>
  </a>
  <a class="card" href="{{ site.repo_url }}/issues?q=is%3Aissue+is%3Aopen+label%3A%E8%A8%98%E4%BA%8B%E5%80%99%E8%A3%9C">
    <span class="tag">募集中</span>
    <h3>記事の候補</h3>
    <p>これから書く題材の一覧。出典の追加や誤りの指摘を歓迎します。</p>
  </a>
</div>

## 方針

1. 検証できた情報だけを載せ、確信度（高・中・低）を明記します。
2. 自分たちで確認した部分と、他者の報告に拠る部分を分けて書きます。
3. マルウェアの現物や、動く悪性コードは載せません。ハッシュと説明だけを載せます。
4. 攻撃者の名指しはしません。帰属は「〜の報告によると」という引用にとどめます。
5. 誤りが見つかった場合は、履歴を残して訂正します。

## 悪意のある crate を見つけたら

<div class="note" markdown="1">
ここは報告の窓口ではありません。疑わしい crate は、先に [crates.io](https://crates.io/policies) へ報告してください。ここでの公開は、削除と RustSec の助言が出た後にします。
</div>

## このサイトについて

RustSecJP は**非公式**のコミュニティです。RustSec（Rust Secure Code WG）、Rust Project、Rust Foundation とは提携していません。**RUSTSEC-** から始まる助言 ID は発行しません。

仕様と採点方式はどちらも草案です。意見は [Issues]({{ site.repo_url }}/issues) へお願いします。
