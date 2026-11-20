# incidents

RustSecJP が、Rust のサプライチェーン事件（悪意のある crate など）を **事件のまとまり（キャンペーン）単位** で整理するためのリポジトリです。

> **重要**: RustSecJP は非公式のコミュニティです。RustSec（Rust Secure Code WG）、Rust Project、Rust Foundation とは提携していません。
> **RUSTSEC-** から始まる助言 ID は発行しません。ここで発行するのは、複数の助言を束ねるための **キャンペーン番号（`RSJP-C-`）** だけです。

## 置いてあるもの

| 場所 | 中身 | 状態 |
|---|---|---|
| [`spec/campaign-id.md`](spec/campaign-id.md) | キャンペーン番号 `RSJP-C-YYYY-NNN` の仕様 | 草案 0.1 |
| [`spec/severity-score.md`](spec/severity-score.md) | 重要度の採点方式の試案（記録がたまってから作り直す。いまは記録に点数を付けない） | 試案 0.1 |
| [`campaigns/_template/`](https://github.com/RustSecJP/incidents/tree/main/campaigns/_template) | キャンペーン記録のひな形 | 草案 0.1 |
| [`campaigns/RSJP-C-2025-001/`](campaigns/RSJP-C-2025-001/index.md) | finch を装う crate と、認証情報を盗む sha-* 依存（5 crate） | 公開 |

## 方針

1. 検証できた情報だけを載せ、確信度（高・中・低）を明記します。
2. 自分たちで確認した部分と、他者の報告に拠る部分を分けて書きます。
3. マルウェアの現物や、動く悪性コードは載せません。ハッシュと説明だけを載せます。
4. 攻撃者の名指しはしません。帰属は「〜の報告によると」という引用にとどめます。
5. 誤りが見つかった場合は、履歴を残して訂正します。

## 悪意のある crate を見つけたら

このリポジトリは報告の窓口ではありません。疑わしい crate は crates.io へ報告してください。

## 草案について

仕様と基準書はどちらも草案です。重みや区分は、既存の助言に当てはめて確かめながら直していきます。指摘は Issues へお願いします。関わり方は [CONTRIBUTING.md](https://github.com/RustSecJP/incidents/blob/main/CONTRIBUTING.md) を見てください。

## ライセンス

文章と記録は CC BY 4.0、コードは MIT です。出典を示せば、引用・転載できます。詳しくは [LICENSE.md](LICENSE.md) を見てください。
