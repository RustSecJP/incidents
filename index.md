---
title: ホーム
---
<div class="hero" data-no-toc markdown="0">
  <h1>RustSecJP incidents</h1>
  <p class="lead">Rust のサプライチェーン事件（悪意のある crate など）を、事件のまとまり（キャンペーン）単位で整理する記録です。crate ごとに出る助言を 1 つの番号で束ね、束ねた根拠と確信度を示します。</p>
</div>

## キャンペーンの記録

新しい順に 3 件を載せています。

| 番号 | 題名 | 期間 | crate の数 |
|---|---|---|---|
| [`RSJP-C-2026-005`]({{ '/campaigns/RSJP-C-2026-005/' | relative_url }}) | greentic-setup と greentic-setup-dev に混入した PolinRider の亜種 | 2026-09-06〜09-07 | 2 |
| [`RSJP-C-2026-004`]({{ '/campaigns/RSJP-C-2026-004/' | relative_url }}) | arrayref など 3 つの正規 crate の乗っ取りと、proc-macro2 を装う proc-macro1 | 2026-08-18〜08-20 | 9 |
| [`RSJP-C-2026-003`]({{ '/campaigns/RSJP-C-2026-003/' | relative_url }}) | 同じ利用者が持っていた pretty-changelog-logger、microsoftsystem64、safe-agent-rs | 2026-03-24〜04-14 | 3 |

[すべての記録]({{ '/campaigns/' | relative_url }}) ・ [準備中の題材]({{ site.repo_url }}/issues?q=is%3Aissue+is%3Aopen+label%3A%E8%A8%98%E4%BA%8B%E5%80%99%E8%A3%9C)

## 仕様

- [キャンペーン番号 `RSJP-C` の仕様]({{ '/spec/campaign-id.html' | relative_url }})
- [重要度の採点方式の試案]({{ '/spec/severity-score.html' | relative_url }})（試案。記録が 10 件ほどたまってから、実例に合わせて作り直す予定で、いまは記録には点数を付けていません）

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

仕様と採点方式は、実際の記録に当てはめながら版を重ねていきます。意見は [Issues]({{ site.repo_url }}/issues) へお願いします。
