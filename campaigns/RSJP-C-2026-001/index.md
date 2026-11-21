# RSJP-C-2026-001: polymarket-client-sdk を装う crate と、Polymarket の認証情報を狙う一連の公開

| | |
|---|---|
| 番号 | `RSJP-C-2026-001` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2026-02-05 〜 2026-02-26（UTC） |
| 関係する crate | 9 つ（10 件の助言。すべて crates.io から削除済み） |
| 種類 | 名前の偽装（typosquat）と、依存に隠したペイロード |
| 盗むもの | 認証情報（Polymarket の秘密鍵を含む） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-001/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-001/iocs.csv) |

## 要約

予測市場 Polymarket の公式 Rust クライアント `polymarket-client-sdk` の周りで、名前を似せた悪性の crate が 3 週間のうちに次々と公開されました。RustSec の助言によると、どれも認証情報を盗もうとしていました。`rpc-check` の最初の助言では、盗む対象として環境変数 `POLYMARKET_PRIVATE_KEY` が名指しされています。

助言は 10 件出ています。`rpc-check` は 2 回公開されて 2 回削除されたため、1 つの crate に 2 件の助言があります。2026-02-20 以降の助言 6 件は、本文で「進行中のキャンペーンの一部」と明記しています。それより前の 4 件には、この言葉はありません。この記録では、前の 4 件も根拠を示したうえで束ねますが、確信度は「中」にとどめます。

RustSec の助言では、どの crate にも依存する crate は無く（`tracings` に依存する仲間の `tracing_checks` を除く）、ダウンロード数は最大でも 155 回でした。後半の crate は、公開から 1〜20 時間ほどで削除されています。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`polymarket-clients-sdk`、`polymarket-client-sdks`、`polymarkets-client-sdk`、`polymarkets-rs-clob-client`、`clob-sdk`、`rpc-check`、`tracing-check`、`tracings`、`tracing_checks` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(polymarket-clients-sdk|polymarket-client-sdks|polymarkets-client-sdk|polymarkets-rs-clob-client|clob-sdk|rpc-check|tracing-check|tracings|tracing_checks)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(polymarket-clients-sdk|polymarket-client-sdks|polymarkets-client-sdk|polymarkets-rs-clob-client|clob-sdk|rpc-check|tracing-check|tracings|tracing_checks)-[0-9]'
```

本物の `polymarket-client-sdk` と `tracing` は、この事件の対象ではありません。名前が 1 文字しか違わないので、見比べるときは注意してください。`rpc-check` は、どちらの時期に公開された版も悪性です（どちらの助言も、修正された版は無いとしています）。

見つかった場合は、その crate を使ったコードを動かした環境にあった認証情報を、漏れたものとして入れ替えてください。特に、Polymarket のウォレットの秘密鍵（環境変数 `POLYMARKET_PRIVATE_KEY` や、ローカルのファイルに置いたもの）は、新しい鍵に替えて、資産を移してください。ペイロードがインストール時に動くのか、使ったときに動くのかは、公開された情報からは分かりません。

## 関係する crate

| 助言の順 | crate | 役割 | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|---|
| 1 | `polymarket-clients-sdk` | `polymarket-client-sdk` を装う（`clients`） | 2026-02-05 に 6 版 | 59 | [RUSTSEC-2026-0010](https://rustsec.org/advisories/RUSTSEC-2026-0010.html) | GHSA-382q-fpqh-29f7 |
| 2 | `polymarket-client-sdks` | `polymarket-client-sdk` を装う（`sdks`） | 2026-02-09 に 1 版 | 33 | [RUSTSEC-2026-0011](https://rustsec.org/advisories/RUSTSEC-2026-0011.html) | GHSA-p5vf-5754-x7p3 |
| 3 | `rpc-check`（1 回目） | `POLYMARKET_PRIVATE_KEY` を盗む | 2026-02-15 に 3 版 | 155 | [RUSTSEC-2026-0014](https://rustsec.org/advisories/RUSTSEC-2026-0014.html) | なし |
| 4 | `polymarkets-client-sdk` | `polymarket-client-sdk` を装う（`polymarkets`） | 2026-02-19 に 1 版。約 1 時間で削除 | 0 | [RUSTSEC-2026-0015](https://rustsec.org/advisories/RUSTSEC-2026-0015.html) | なし |
| 5 | `polymarkets-rs-clob-client` | `polymarket-client-sdk` の周りを装う | 2026-02-19 に 1 版。約 20 時間で削除 | 実利用の形跡なし | [RUSTSEC-2026-0016](https://rustsec.org/advisories/RUSTSEC-2026-0016.html) | なし |
| 6 | `clob-sdk` | `polymarket-client-sdk` の周りを装う | 2026-02-20 に 1 版。約 4 時間で削除 | 実利用の形跡なし | [RUSTSEC-2026-0017](https://rustsec.org/advisories/RUSTSEC-2026-0017.html) | なし |
| 7 | `rpc-check`（2 回目） | 同じ名前で再び公開 | 2026-02-20 以降に 6 版 | 実利用の形跡なし | [RUSTSEC-2026-0018](https://rustsec.org/advisories/RUSTSEC-2026-0018.html) | なし |
| 8 | `tracing-check` | 名前の偽装 | 2026-02-24 に 1 版。約 4 時間で削除 | 実利用の形跡なし | [RUSTSEC-2026-0019](https://rustsec.org/advisories/RUSTSEC-2026-0019.html) | GHSA-5pmp-jpcf-pwx6 |
| 9 | `tracings` | ペイロードの本体 | 2026-02-26 に 1 版。約 9 時間で削除 | 実利用の形跡なし | [RUSTSEC-2026-0027](https://rustsec.org/advisories/RUSTSEC-2026-0027.html) | なし |
| 9 | `tracing_checks` | `tracings` に依存する。自分はペイロードを持たない | 2026-02-26 に 1 版。約 9 時間で削除 | 実利用の形跡なし | [RUSTSEC-2026-0028](https://rustsec.org/advisories/RUSTSEC-2026-0028.html) | なし |

公開日、版の数、ダウンロード数、削除までの時間は、RustSec の助言の記載によります。「実利用の形跡なし」は、助言の「no evidence of actual downloads / usage」の訳です。GHSA の番号は 3 件にしかありません（自分で確認）。

`polymarkets-rs-clob-client` と `clob-sdk` は、名前に本物の crate 名を含みません。本物の `polymarket-client-sdk` のリポジトリ名が `polymarket/rs-clob-client` であること（自分で確認）から、リポジトリ名や「CLOB（中央指値注文板）」という用語に寄せた名前だと考えられますが、これは推測です。`tracing-check`、`tracings`、`tracing_checks` が何を装ったのか（たとえば `tracing`）も、助言には書かれていません。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2026-02-05 | `polymarket-clients-sdk` が 6 版公開される | RustSec の助言 |
| 2026-02-06 | Socket が crates.io チームに通報。crate は削除され、公開した利用者は無効化される（削除の日時は書かれていない） | crates.io チーム |
| 2026-02-06 | RUSTSEC-2026-0010 が追加・割り当てられ、GitHub の助言も公開される | 自分で確認 |
| 2026-02-09 | `polymarket-client-sdks` が公開される | RustSec の助言 |
| 2026-02-13 | 個人の研究者が通報。crate は削除され、公開した利用者は無効化される。RUSTSEC-2026-0011 が追加・割り当てられる | crates.io チーム、RustSec の助言、自分で確認 |
| 2026-02-13 | crates.io チームが、通知方針の変更の記事の中で上の 2 つを報告 | crates.io チーム |
| 2026-02-15 | `rpc-check` が 3 版公開される | RustSec の助言 |
| 2026-02-19 | `polymarkets-client-sdk` が公開され、crates.io チームのメンバーが docs.rs のビルド待ちの列で見つけて、約 1 時間で削除する | RustSec の助言 |
| 2026-02-19 | 個人の研究者が通報した `rpc-check`（1 回目）の助言が出る。RUSTSEC-2026-0014 と 0015 が同じコミットで割り当てられる | RustSec の助言、自分で確認 |
| 2026-02-19 〜 02-20 | `polymarkets-rs-clob-client` が公開され、約 20 時間後に削除される。助言（0016）で初めて「進行中のキャンペーン」と書かれる | RustSec の助言、自分で確認 |
| 2026-02-20 | `clob-sdk` が公開され、約 4 時間後に削除される | RustSec の助言 |
| 2026-02-20 以降 | `rpc-check` が同じ名前で再び公開され、6 版出る | RustSec の助言 |
| 2026-02-24 | 2 回目の `rpc-check` の助言 RUSTSEC-2026-0018 が出る。通報は、個人の研究者から Rust のセキュリティ対応ワーキンググループへ | RustSec の助言、自分で確認 |
| 2026-02-24 | `tracing-check` が公開され、約 4 時間後に削除される | RustSec の助言 |
| 2026-02-26 | `tracings` と `tracing_checks` が公開され、約 9 時間後に削除される。通報は、個人の研究者から Rust のセキュリティ対応ワーキンググループへ | RustSec の助言 |
| 2026-03-02 | `tracing-check` の GitHub の助言が公開される | 自分で確認 |
| 2026-03-17 | 10 件の助言に `malicious` の分類が足される | 自分で確認 |
| 2026-11-20 | 9 つとも crates.io の索引に無いこと、`polymarket-client-sdk` と `tracing` は残っていることを確認 | 自分で確認 |

前の事件（[RSJP-C-2025-001](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-001/index.md)）では、助言が出るまでに約 2 か月かかりました。この事件では、どの助言も、助言に書かれた日付（多くは通報か削除の日）と同じ日か、UTC で翌日に `advisory-db` に追加されています（自分で確認）。最初の版の公開から助言までは、長いものでも約 4 日（0011、0014、0018）です。

### `rpc-check` に助言が 2 件ある理由

2 件の助言の本文を比べると、対象の版が違います。

- RUSTSEC-2026-0014（助言の日付 2026-02-19）: 2026-02-15 に公開された 3 版。
- RUSTSEC-2026-0018（助言の日付 2026-02-24）: 2026-02-20 以降に公開された 6 版。

1 回目の削除（助言の日付から 02-19 ごろと考えられます）の翌日から、同じ名前でまた公開されたことになります。助言には削除の日時そのものは書かれていません。`advisory-db` の履歴では、2 件目は 1 件目のファイルを書き換えず、新しいファイルとして足されています。そのコミットの題は「Another day, another polymarket crate.」、プルリクエストの題は「Add `rpc-check`... again?」でした（自分で確認）。2 回目を公開した利用者が 1 回目と同じかどうかは、公表されていません。

## 手口

この節は、RustSec の助言と crates.io チームの記事の短い記載によります。詳しい解析は公開されておらず、RustSecJP は検体を入手していません。自分では確認していません。

- **名前の偽装**: `polymarket-client-sdk` に 1 文字足す（`clients`、`sdks`、`polymarkets`）。後半は、本物の名前から離れた `clob-sdk`、`rpc-check`、`tracing-check` などに移った。
- **盗むもの**: `polymarket-clients-sdk`、`polymarket-client-sdks`、`polymarkets-client-sdk` は「ローカルのファイルから認証情報を盗もうとした」。`rpc-check`（1 回目）は「環境変数 `POLYMARKET_PRIVATE_KEY` から認証情報を盗もうとした」。それ以外の助言は「利用者の認証情報」「Polymarket の認証情報」を外部へ送る、とだけ書いている。
- **ペイロードを依存に分ける**: `tracing_checks` 自身はペイロードを持たず、`tracings` に依存してそこから悪性のコードを持ち込んだ。
- **削除されてもすぐに出し直す**: 2026-02-19〜02-26 の 1 週間に 7 件の助言が出ている。`rpc-check` は、削除の翌日に同じ名前で公開された。

送り先の通信先、動く時点（インストール時か、ビルド時か、関数を呼んだときか）、検体のハッシュは、どれも公開されていません。

## 9 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `polymarkets-rs-clob-client`、`clob-sdk`、`rpc-check`（2 回目）、`tracing-check`、`tracings`、`tracing_checks` | 6 件の助言が、本文で「進行中のキャンペーンの一部（part of an ongoing campaign）」と明記している | 他者の報告（RustSec の助言。本文は自分で読んだ） | 高 |
| `tracing_checks` → `tracings` | 依存関係。`tracings` に依存するのは `tracing_checks` だけだった | 他者の報告（RustSec の助言） | 高 |
| `polymarket-clients-sdk`、`polymarket-client-sdks`、`polymarkets-client-sdk` ↔ 上の 6 つ | 3 つとも同じ crate（`polymarket-client-sdk`）を 1 文字違いで装い、同じく認証情報を盗もうとした。`polymarkets-client-sdk` の助言は「Polymarket の認証情報を盗むことにとても熱心に見えるこの攻撃者」と書き、同じ攻撃者を前提にしている。2 件目のプルリクエストは 1 件目を「別物だが似ている」としている | 他者の報告（RustSec の助言）と、自分で確認した状況からの判断 | 中 |
| `rpc-check`（1 回目） ↔ 上の 6 つ | 盗む対象に `POLYMARKET_PRIVATE_KEY` を名指ししている。同じ名前の 2 回目は、キャンペーンの一部と明記されている。助言は `polymarkets-client-sdk` と同じ日に、同じコミットで番号が割り当てられた | 他者の報告（RustSec の助言）と、自分で確認した状況からの判断 | 中 |

最初の 4 件（0010、0011、0014、0015）の本文には、「キャンペーン」という言葉がありません。crates.io チームの 2026-02-13 の記事も、0010 と 0011 を並べて挙げているだけで、同じ事件だとは書いていません。この 4 件を束ねたのは RustSecJP の判断で、確信度を「中」にしているのは、このためです。

どの crate についても、**公開した利用者が同じかどうかは公表されていません**。crates.io チームの記事は、0010 と 0011 について「公開した利用者は無効化された」と書いているだけです。

### 束ねなかったもの: `tracing-ethers`（RUSTSEC-2026-0040）

`tracing-ethers` は 2026-03-09 に 9 版公開され、約 5 日後に削除されました。RustSec の助言によると、SSH の鍵を `vercel[.]app` 上のアプリへ送ろうとしていました。名前（`tracing-`）と時期は近いものの、助言は Polymarket にもキャンペーンにも触れていません。盗むものも、Polymarket の鍵ではなく SSH の鍵です。調べた範囲では、この事件と結びつける出典は見つかりませんでした。「時期が近い」「名前が似ている」だけでは束ねない決まり（仕様 §5）に従い、この記録には含めません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-001/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crate の名前 | 上の表の 9 つ | すべて | RustSec の助言 |
| 狙われる環境変数 | `POLYMARKET_PRIVATE_KEY` | `rpc-check`（1 回目） | RustSec の助言 |

公開した利用者の名前、送り先の通信先、検体のハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **crate の名前を 1 文字ずつ確かめる**: 本物は `polymarket-client-sdk` です。`s` を 1 つ足しただけの名前が 3 回使われました。crates.io のページで、リポジトリが `polymarket/rs-clob-client` を指しているか、ダウンロード数と公開日が不自然でないかを見ます。
- **秘密鍵を環境変数やファイルに置いたまま、知らない crate を試さない**: `POLYMARKET_PRIVATE_KEY` は名指しで狙われました。試すときは、鍵の無い環境（コンテナなど）を使います。
- **公開されたばかりの版をすぐに使わない**: 後半の crate は、公開から 1 日以内に削除されています。
- **依存の依存も見る**: `tracing_checks` には悪性のコードが無く、依存の `tracings` にありました。`cargo tree` で、見慣れない名前が増えていないかを確かめます。
- **同じ名前でも安心しない**: `rpc-check` は、削除の翌日に同じ名前でまた公開されました。一度消えた名前が戻ってきても、同じものとは限りません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 9 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 10 件、crates.io の索引に無いこと） | 高 |
| 10 件の RustSec の番号と GHSA の番号の対応（GHSA は 3 件のみ） | 自分で確認（助言の本文、OSV、GitHub の助言データベース） | 高 |
| 助言が追加・割り当てられた日 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 6 件の助言が「進行中のキャンペーンの一部」と明記している | 自分で確認（助言の本文） | 高 |
| `rpc-check` は 2 回公開され、2 件の助言はそれぞれ別の版を対象にしている | 他者の報告（RustSec の助言）。履歴は自分で確認 | 高 |
| 公開日、版の数、ダウンロード数、削除までの時間、通報者 | 他者の報告（RustSec の助言、crates.io チーム） | 高 |
| 盗むもの（ローカルのファイル、`POLYMARKET_PRIVATE_KEY`） | 他者の報告（RustSec の助言） | 中 |
| 最初の 4 件（0010、0011、0014、0015）が同じキャンペーンに属する | 自分で確認した状況からの判断 | 中 |
| `polymarkets-rs-clob-client` と `clob-sdk` が本物のリポジトリ名や用語に寄せた名前である | 自分で確認した状況からの推測 | 低 |

## 分かっていないこと

- **9 つを公開した利用者が同じかどうか**。どの出典も、利用者の名前や一致を公表していません。
- **最初の 4 件が、本当に後の 6 件と同じキャンペーンかどうか**。RustSec が「キャンペーン」と書き始めたのは 0016（2026-02-20）からです。
- **送り先と、ペイロードが動く時点**。解析は公開されていません。
- **盗むものが crate ごとに違うのか**。助言では、前半の 3 つは「ローカルのファイル」、`rpc-check`（1 回目）は「環境変数」と書き分けられています。中身が違ったのか、書き方が違うだけなのかは分かりません。
- **`tracing-check`、`tracings`、`tracing_checks`、`rpc-check` が何を装ったのか**。助言には書かれていません。
- **`polymarket-clients-sdk` と `polymarket-client-sdks` が削除された時刻**。crates.io チームは通報の日（02-06、02-13）だけを書いています。
- **自動生成と見られる記事の記述**。一部の脆弱性まとめサイトが、`tracing-check` は `build.rs` で環境変数を送った、`polymarket-client-sdks` は AWS の認証情報や SSH の鍵、ブラウザのデータを探した、などと書いています。どれも出典や検体の解析を示しておらず、RustSec の助言とも合わないため、この記録では採っていません。
- **検知した企業の解析**。0010 は Socket が見つけて通報しましたが、Socket のブログにこの事件の解析記事は見つかりませんでした（2026-11-20 に検索）。
- **OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV で 9 つの crate を調べたところ、返ってきたのは RUSTSEC と GHSA の番号だけで、`MAL-` で始まる番号はありませんでした。

## 出典

**一次情報**

- crates.io チーム「[crates.io: an update to the malicious crate notification policy](https://blog.rust-lang.org/2026/02/13/crates.io-malicious-crate-update/)」（2026-02-13）
- RustSec の助言: [RUSTSEC-2026-0010](https://rustsec.org/advisories/RUSTSEC-2026-0010.html)、[0011](https://rustsec.org/advisories/RUSTSEC-2026-0011.html)、[0014](https://rustsec.org/advisories/RUSTSEC-2026-0014.html)、[0015](https://rustsec.org/advisories/RUSTSEC-2026-0015.html)、[0016](https://rustsec.org/advisories/RUSTSEC-2026-0016.html)、[0017](https://rustsec.org/advisories/RUSTSEC-2026-0017.html)、[0018](https://rustsec.org/advisories/RUSTSEC-2026-0018.html)、[0019](https://rustsec.org/advisories/RUSTSEC-2026-0019.html)、[0027](https://rustsec.org/advisories/RUSTSEC-2026-0027.html)、[0028](https://rustsec.org/advisories/RUSTSEC-2026-0028.html)
- 束ねなかった助言: [RUSTSEC-2026-0040](https://rustsec.org/advisories/RUSTSEC-2026-0040.html)（`tracing-ethers`）
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `e0d57bea`、`e7a94dcc`、`b5be603a`、`020871da`、`c3ed6855`、`e4b00cda`、`93a91720`、`bb50265d`、`a52e9cdd`。番号の割り当て: `5c34c4b1`、`6e465286`、`fad1dc06`、`839a622a`、`9dad93ab`、`d6d510ca`、`f373f465`、`e6b2161b`）と、プルリクエスト [#2642](https://github.com/rustsec/advisory-db/pull/2642)、[#2669](https://github.com/rustsec/advisory-db/pull/2669)

**検知した企業の解析**

- 見つかりませんでした。

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 9 つの crate が無く、`polymarket-client-sdk` と `tracing` はあること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、9 つの crate の番号の対応を引いたこと。
- crates.io の API で、`polymarket-client-sdk` のリポジトリが `github.com/polymarket/rs-clob-client` であること。

## 更新履歴

- 2026-11-20: 初版
