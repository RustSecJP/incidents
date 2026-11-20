# incidents

**Rust 専用の重要度の物差し（RSJP Score）を作る**ためのリポジトリです。そのための材料として、Rust のサプライチェーン事件と脆弱性を、日本語で記録しています。

> **重要**: RustSecJP は非公式のコミュニティです。RustSec（Rust Secure Code WG）、Rust Project、Rust Foundation とは提携していません。
> **RUSTSEC-** から始まる助言 ID は発行しません。

## なぜ Rust 専用の物差しが要るのか

CVSS は、攻撃者が外から直接突ける欠陥を想定した点数です。Rust でよく問題になる次の 2 つは、うまく表せません。

- **unsound な欠陥**（安全な Rust だけで未定義動作が起きるもの）: 危なさが「どう呼ぶか」で大きく変わります。CVSS では、ほとんどが低く出るか、点が付きません。
- **悪意のある crate**: どれも最高点近くになり、事件どうしの違いが分かりません。依存に入れるだけで動くのか、特定の API を呼んだときだけ動くのかの差も出ません。

RSJP Score は、Rust に固有の事情を軸にして点数を出します。たとえば、安全な Rust だけで踏めるか、ビルド時に動くか、どれだけ依存されているか、といった軸です。

## 置いてあるもの

| 場所 | 中身 | 状態 |
|---|---|---|
| [`spec/severity-score.md`](spec/severity-score.md) | RSJP Score の仕様と、[計算ツール](https://rustsecjp.github.io/incidents/calculator.html) | 試案 0.1 版 |
| [`campaigns/`](https://rustsecjp.github.io/incidents/campaigns/) | 事件のまとまり（キャンペーン）ごとの記録。複数の crate にまたがる攻撃を `RSJP-C-YYYY-NNN` の番号で束ねる | 公開中 |
| [`advisories/`](https://rustsecjp.github.io/incidents/advisories/) | RustSec の助言の日本語版。原文の訳に、確かめ方と直し方を足したもの | 公開中 |
| [`spec/campaign-id.md`](spec/campaign-id.md) | キャンペーン番号の仕様 | 0.1 版 |

## これからの進め方

1. **材料を集める**: キャンペーン記録と、助言の日本語版を増やします。候補は [Issues](https://github.com/RustSecJP/incidents/issues) にあります（ラベル「記事候補」「日本語版」）。
2. **物差しを当ててみる**: 集めた記録と助言に RSJP Score を当て、CVSS との違いと、重みの妥当さを確かめます（[#13](https://github.com/RustSecJP/incidents/issues/13)、[#14](https://github.com/RustSecJP/incidents/issues/14)）。
3. **作り直す**: 結果をもとに、軸と重みを直して版を上げます。それまでは、記録に点数は付けません。

## 方針

1. 確かめた情報だけを載せ、確信度（高・中・低）を書きます。
2. 自分たちで確かめた部分と、ほかの報告に拠る部分を分けて書きます。
3. マルウェアの現物や、動く悪性コードは載せません。ハッシュと説明だけを載せます。
4. 攻撃者の名指しはしません。帰属は「〜の報告によると」という引用にとどめます。
5. 誤りが見つかったら、履歴を残して訂正します。

## 悪意のある crate を見つけたら

このリポジトリは報告の窓口ではありません。疑わしい crate は crates.io へ報告してください。

## 関わり方

意見、誤りの指摘、記事の候補は [Issues](https://github.com/RustSecJP/incidents/issues) へお願いします。詳しくは [CONTRIBUTING.md](https://github.com/RustSecJP/incidents/blob/main/CONTRIBUTING.md) を見てください。

## ライセンス

文章と記録は CC BY 4.0、コードは MIT です。出典を示せば、引用・転載できます。詳しくは [LICENSE.md](LICENSE.md) を見てください。
