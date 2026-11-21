# RSJP-C-2023-003: 利用者 `Kraded` が公開した、Windows でマルウェアを動かす名前の偽装 crate 12 個（2023年11月）

| | |
|---|---|
| 番号 | `RSJP-C-2023-003` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 公開日は不明 〜 2023-11-15（UTC。終わりは RustSec の助言の日付） |
| 関係する crate | 12 個（すべて crates.io から削除済み） |
| 種類 | 名前の偽装（typosquat） |
| ペイロード | Windows で任意のマルウェアを動かす（RustSec の助言による。詳しい解析は公開されていない） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-003/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-003/iocs.csv) |

## 要約

crates.io の利用者 `Kraded` が、Windows 向けの道具や Monero（暗号資産）関連の crateに名前を似せた crate を 12 個公開しました。RustSec の助言によると、これらは「Windows のホストで任意のマルウェアのペイロードを動かすための、名前の偽装のまとまり」でした。crate は削除され、利用者は使えなくされています。

この事件は 2023 年 11 月に処理されましたが、当時は公に知らされなかったようです。RustSec の助言が追加されたのは、約 2 年 4 か月後の 2026-03-26 です。当時の削除に関わった担当者が、手元のメモから過去の削除をまとめて登録したものです。そのため、**版、ダウンロード数、公開日、ペイロードの中身は、どれも記録が残っていないか、公開されていません。**

RustSec の助言は crate ごとに 1 件ずつ、計 12 件出ています。この記録では、同じ利用者が公開したことを根拠に、それらを 1 つのキャンペーンとして束ねます。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`lfest-main`、`lasso-rs`、`win-crypto`、`monero-api`、`monero-rpc-rs`、`win-base64-rs`、`acceptxmr-rs`、`registry-win`、`win_run_rs`、`windows-service-rs`、`libusb1-main`、`winx-rs` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(lfest-main|lasso-rs|win-crypto|monero-api|monero-rpc-rs|win-base64-rs|acceptxmr-rs|registry-win|win_run_rs|windows-service-rs|libusb1-main|winx-rs)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(lfest-main|lasso-rs|win-crypto|monero-api|monero-rpc-rs|win-base64-rs|acceptxmr-rs|registry-win|win_run_rs|windows-service-rs|libusb1-main|winx-rs)-'
```

助言には「版の情報もダウンロードの記録も、もう残っていない」とあります。どの版が悪性だったかは分からないので、**これらの名前の crate はどの版でも悪性とみなしてください。** これらの名前は、いまは crates.io にありません。

名前を似せた先と思われる本物の crate（`acceptxmr`、`lasso`、`lfest`、`libusb1-sys`、`monero-rpc`、`windows-service`、`winx`）は、この事件の対象ではありません。

見つかった場合は、その crate をビルドしたり動かしたりした Windows の環境を、マルウェアに感染した可能性があるものとして扱ってください。ペイロードが何をするのかは公表されていないため、その環境にあった認証情報も入れ替えるのが安全です。

## 関係する crate

| crate | 役割 | 名前を似せた先と思われる crate | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|---|
| `lfest-main` | 名前の偽装 | `lfest` | 不明 | 不明 | [RUSTSEC-2023-0106](https://rustsec.org/advisories/RUSTSEC-2023-0106.html) | なし |
| `lasso-rs` | 名前の偽装 | `lasso` | 不明 | 不明 | [RUSTSEC-2023-0107](https://rustsec.org/advisories/RUSTSEC-2023-0107.html) | なし |
| `win-crypto` | 名前の偽装 | （はっきりしない） | 不明 | 不明 | [RUSTSEC-2023-0109](https://rustsec.org/advisories/RUSTSEC-2023-0109.html) | なし |
| `monero-api` | 名前の偽装 | （はっきりしない） | 不明 | 不明 | [RUSTSEC-2023-0111](https://rustsec.org/advisories/RUSTSEC-2023-0111.html) | なし |
| `monero-rpc-rs` | 名前の偽装 | `monero-rpc` | 不明 | 不明 | [RUSTSEC-2023-0112](https://rustsec.org/advisories/RUSTSEC-2023-0112.html) | なし |
| `win-base64-rs` | 名前の偽装 | （はっきりしない） | 不明 | 不明 | [RUSTSEC-2023-0113](https://rustsec.org/advisories/RUSTSEC-2023-0113.html) | なし |
| `acceptxmr-rs` | 名前の偽装 | `acceptxmr` | 不明 | 不明 | [RUSTSEC-2023-0115](https://rustsec.org/advisories/RUSTSEC-2023-0115.html) | なし |
| `registry-win` | 名前の偽装 | （はっきりしない） | 不明 | 不明 | [RUSTSEC-2023-0116](https://rustsec.org/advisories/RUSTSEC-2023-0116.html) | なし |
| `win_run_rs` | 名前の偽装 | （はっきりしない） | 不明 | 不明 | [RUSTSEC-2023-0118](https://rustsec.org/advisories/RUSTSEC-2023-0118.html) | なし |
| `windows-service-rs` | 名前の偽装 | `windows-service` | 不明 | 不明 | [RUSTSEC-2023-0120](https://rustsec.org/advisories/RUSTSEC-2023-0120.html) | なし |
| `libusb1-main` | 名前の偽装 | `libusb1-sys` | 不明 | 不明 | [RUSTSEC-2023-0121](https://rustsec.org/advisories/RUSTSEC-2023-0121.html) | なし |
| `winx-rs` | 名前の偽装 | `winx` | 不明 | 不明 | [RUSTSEC-2023-0122](https://rustsec.org/advisories/RUSTSEC-2023-0122.html) | なし |

「名前を似せた先」は、名前から自分で推測したものです。RustSec の助言は、どの crate を装ったかを書いていません。公開日とダウンロード数は、助言に「もう残っていない」とあります。GHSA の番号は、2026-11-20 の時点で見つかりませんでした。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2023-11-15 より前（不明） | 12 個の crate が公開される | 公表されていない |
| 2023-11-15 | RustSec の助言の日付。助言は、crate が削除（yank）され、利用者が使えなくされたとする | RustSec の助言 |
| 2026-03-24〜03-25 | 外部の研究者が出した別の助言の PR（[#2740](https://github.com/rustsec/advisory-db/pull/2740)）をきっかけに、担当者が「2023 年ごろに約 20 の crate を削除したが、公に記録されていないかもしれない」と書く | `advisory-db` の PR |
| 2026-03-25 23:37 | 過去の削除をまとめて登録するコミット `97446b89` が作られる（PR [#2747](https://github.com/rustsec/advisory-db/pull/2747)） | 自分で確認 |
| 2026-03-26 05:51 | PR #2747 が取り込まれ、RustSec の番号が割り当てられる（コミット `d245bb75`） | 自分で確認 |
| 2026-11-20 | 12 個とも crates.io の索引に無いこと、本物と思われる crate は残っていることを確認 | 自分で確認 |

助言の日付（2023-11-15）が、削除の日なのか、通報の日なのかは、助言に書かれていません。OSV では、この日付がそのまま「公開日」として表示されます。実際に助言データベースに入ったのは 2026-03-26 なので、それまでは `cargo audit` などの道具では、これらの crate を検出できませんでした。

## 手口

この節は、RustSec の助言の短い記述だけによります。検知した企業の解析は、見つかりませんでした。RustSecJP は検体を入手しておらず、自分では確認していません。

- **名前の偽装**: 助言は「名前の偽装（typosquatting）のまとまり」としています。名前を見ると、本物に似た名前に `-rs`、`-main`、`-win` などを足したり、区切りや単数・複数を変えたりしたものです（ここは自分の推測です）。
- **対象の OS**: 助言は「Windows のホストで任意のマルウェアのペイロードを動かす」としています。
- **分かっていないこと**: ペイロードがインストール時（`build.rs`）に動くのか、ライブラリを使ったときに動くのか、どこから何を取ってくるのか、何を盗むのかは、公表されていません。

なお、助言を登録した PR の本文には「深く調べ直してはいない。メモに具体的な動きが無ければ、おおまかな説明を書いた」とあります。上の「Windows で任意のマルウェアを動かす」という記述も、おおまかな説明である可能性があります。

## 12 個を束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| 12 個とも | 同じ公開アカウント。12 件の助言すべてが「利用者 `Kraded` が公開した」と書いている | 他者の報告（RustSec の助言） | 高 |
| 12 個とも | 同じ日付（2023-11-15）、同じ文面の助言として、同じコミットで登録された | 自分で確認（`advisory-db` のコミット履歴） | 高 |

### 束ねなかったもの

同じ PR #2747 では、ほかの利用者が公開した crate についても、同じ文面の助言が登録されています。`TerryDavisSoldier`（3 つ、助言の日付 2023-11-18）、`gabielle55131`（2 つ、助言の日付 2023-11-20）、そして 1 つだけの `bit-flags`（利用者 `alexrichton`、2023-12-22）です。

`Kraded`、`TerryDavisSoldier`、`gabielle55131` の助言の日付は 2023-11-15〜11-20 に集まり、手口の記述も同じです。しかし、文面は担当者がメモからまとめて書いたもので、同じペイロード、同じ通信先、同じコードであるとはどこにも書かれていません。「時期が近い」「手口が似ている」だけでは束ねない決まりなので、利用者ごとに別の記録にしています（[`RSJP-C-2023-004`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-004/index.md)、[`RSJP-C-2023-005`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-005/index.md)）。`bit-flags` は 1 つだけの名前の偽装なので、記録を作っていません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-003/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crates.io の利用者 | `Kraded` | 全体 | RustSec の助言 |
| crate の名前 | `lfest-main`、`lasso-rs`、`win-crypto`、`monero-api`、`monero-rpc-rs`、`win-base64-rs`、`acceptxmr-rs`、`registry-win`、`win_run_rs`、`windows-service-rs`、`libusb1-main`、`winx-rs` | 全体 | RustSec の助言 |

通信先、検体のハッシュ、ファイル名は、公開された情報の中に見つかりませんでした。

## 対策

- **crate の名前を確かめる**: `-rs`、`-main`、`-win` などを足した名前は、本物の別名とは限りません。crates.io のページで、リポジトリの URL が実在するか、ダウンロード数と公開日が不自然でないかを見ます。
- **公開されたばかりの crate をすぐに使わない**: 新しい依存を足すときは、公開からの日数と、公開した利用者の他の crate を見ます。
- **助言データベースだけに頼らない**: この事件は、削除から助言の登録まで 2 年以上かかりました。過去には、公に知らされずに削除された悪性の crate もあります。
- **Windows でのビルドに注意する**: `build.rs` や手続きマクロは、ビルドするだけで動きます。知らない crate は、使い捨ての環境で試します。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 12 個の crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 12 件、crates.io の索引に無いこと） | 高 |
| 12 個とも、利用者 `Kraded` が公開した | 他者の報告（RustSec の助言） | 高 |
| 利用者が使えなくされた | 他者の報告（RustSec の助言） | 高 |
| RustSec の番号の対応、GHSA と MAL の番号が無いこと | 自分で確認（助言の本文、OSV、GitHub の助言データベース。2026-11-20 時点） | 高 |
| 助言が 2026-03-26 に登録された | 自分で確認（`advisory-db` のコミット履歴と PR） | 高 |
| ペイロードが Windows で任意のマルウェアを動かす | 他者の報告（RustSec の助言）。ただし PR 本文に「おおまかな説明」の可能性があるとある | 中 |
| 名前を似せた先の crate | 自分の推測（名前の比較のみ） | 低 |
| 助言の日付（2023-11-15）が削除の日である | 助言に明記なし | 低 |

## 分かっていないこと

- **公開日、版、ダウンロード数**。助言に「もう残っていない」とあります。
- **助言の日付の意味**。2023-11-15 が削除の日か、通報の日か、別の日かは書かれていません。
- **ペイロードの中身**。動く時点、通信先、盗むものは公表されていません。助言の記述そのものが、メモからのおおまかな説明である可能性があります。
- **削除の仕方**。助言の本文は「yank された」としています。2026-11-20 には 12 個とも crates.io の索引から消えているので、どこかの時点で完全に削除されたと思われますが、その日は分かりません。
- **ほかの利用者のまとまりとの関係**。`TerryDavisSoldier`（3 つ、助言の日付 2023-11-18）、`gabielle55131`（2 つ、助言の日付 2023-11-20） の crate も、同じ時期に同じ文面で登録されています。同じ攻撃者によるものかは、公表された根拠がありません。
- **見つけた人と経緯**。誰が、いつ通報したかは公表されていません。
- **検知した企業の解析**。2023 年 11 月〜12 月の企業の記事、crates.io チームや Rust のブログの記事は、見つかりませんでした。脆弱性データベース（Snyk など）の項目はありますが、RustSec の助言の文面を言い換えたもので、独自の解析ではないようです。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2023-0106](https://rustsec.org/advisories/RUSTSEC-2023-0106.html)、[0107](https://rustsec.org/advisories/RUSTSEC-2023-0107.html)、[0109](https://rustsec.org/advisories/RUSTSEC-2023-0109.html)、[0111](https://rustsec.org/advisories/RUSTSEC-2023-0111.html)、[0112](https://rustsec.org/advisories/RUSTSEC-2023-0112.html)、[0113](https://rustsec.org/advisories/RUSTSEC-2023-0113.html)、[0115](https://rustsec.org/advisories/RUSTSEC-2023-0115.html)、[0116](https://rustsec.org/advisories/RUSTSEC-2023-0116.html)、[0118](https://rustsec.org/advisories/RUSTSEC-2023-0118.html)、[0120](https://rustsec.org/advisories/RUSTSEC-2023-0120.html)、[0121](https://rustsec.org/advisories/RUSTSEC-2023-0121.html)、[0122](https://rustsec.org/advisories/RUSTSEC-2023-0122.html)
- [rustsec/advisory-db の PR #2747](https://github.com/rustsec/advisory-db/pull/2747)「Backfill old malware takedowns, mostly from 2023」（2026-03-26 に取り込み）。コミット: 助言の追加 `97446b89`、番号の割り当て `d245bb75`
- [rustsec/advisory-db の PR #2740](https://github.com/rustsec/advisory-db/pull/2740)（2023 年ごろの未公表の削除について、担当者が書いたレビュー）

**検知した企業の解析**

- 見つかりませんでした。

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 12 個の crate が無く、`acceptxmr`、`lasso`、`lfest`、`libusb1-sys`、`monero-rpc`、`windows-service`、`winx` はあること。
- OSV（`api.osv.dev`）で 12 個の crate を引き、返ってくるのは RUSTSEC の番号だけで、`MAL-` で始まる番号は無いこと。
- GitHub の助言データベースに、12 個の crate の項目が無いこと。
- `advisory-db` のコミット履歴と PR #2747、#2740 の本文と議論。
- `blog.rust-lang.org` と Inside Rust の 2023 年 11 月〜12 月の記事の一覧に、この件の記事が無いこと。

## 更新履歴

- 2026-11-20: 初版
