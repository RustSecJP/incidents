# RSJP-C-2025-001: finch を装う crate と、認証情報を盗む sha-* 依存

| | |
|---|---|
| 番号 | `RSJP-C-2025-001` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2025-11-20 〜 2025-12-09（UTC） |
| 関係する crate | 5 つ（すべて crates.io から削除済み） |
| 種類 | 名前の偽装（typosquat）と、依存に隠したペイロード |
| 盗むもの | 認証情報を含むファイル |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-001/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-001/iocs.csv) |

## 要約

ゲノム解析ツールの crate `finch` と `finch_cli` に名前を似せた crate が、crates.io に公開されました。これらは、認証情報を外部へ送る別の crate（`sha-rust`、`sha-rst`）に依存していました。第 1 波の `finch-rust` は、中身がほぼ本物のコピーでした（第 2 波の中身は解析が公開されていません）。

事件は 2 回に分かれています。2025-12-05 に `finch-rust` と `sha-rust` が削除され、その 3 日後の 12-08 に、同じ構成の `finch-rst`、`sha-rst`、`finch_cli_rust` が公開されて、再び削除されました。RustSec の助言は crate ごとに 1 件ずつ、計 5 件出ていますが、この記録ではそれらを 1 つのキャンペーンとして束ねます。

crates.io チームは第 1 波について、この 2 つに依存する crate は無く、自動のミラーや検査のサービス以外にダウンロードされた形跡も無いと報告しています。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`finch-rust`、`sha-rust`、`finch-rst`、`sha-rst`、`finch_cli_rust` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(finch-rust|sha-rust|finch-rst|sha-rst|finch_cli_rust)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(finch-rust|sha-rust|finch-rst|sha-rst|finch_cli_rust)-'
```

本物の `finch` と `finch_cli` は、この事件の対象ではありません。

見つかった場合は、その crate を使ったコードを動かした環境にあった認証情報（`.env`、`config.toml`、`id.json` などに書かれた鍵やトークン）を、漏れたものとして入れ替えてください。Socket の解析によると、第 1 波のペイロードはインストール時ではなく、ライブラリの関数が呼ばれたときに動きます。

## 関係する crate

| 波 | crate | 役割 | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|---|
| 1 | `sha-rust` | 認証情報を盗む本体 | 2025-11-20〜11-25 に 8 版 | 153 | [RUSTSEC-2025-0146](https://rustsec.org/advisories/RUSTSEC-2025-0146.html) | GHSA-3mmg-7c2q-8938 |
| 1 | `finch-rust` | `finch` を装い、`sha-rust` に依存 | 2025-11-25 に 1 版 | 28 | [RUSTSEC-2025-0148](https://rustsec.org/advisories/RUSTSEC-2025-0148.html) | GHSA-f8h5-x737-x4xr |
| 2 | `sha-rst` | 認証情報を盗む本体 | 2025-12-08 に 1 版 | 22 | [RUSTSEC-2025-0151](https://rustsec.org/advisories/RUSTSEC-2025-0151.html) | GHSA-vgr2-r5hm-f6gf |
| 2 | `finch-rst` | `finch` を装い、`sha-rst` に依存 | 2025-12-08 に 1 版 | 21 | [RUSTSEC-2025-0150](https://rustsec.org/advisories/RUSTSEC-2025-0150.html) | GHSA-xp79-9mxw-878j |
| 2 | `finch_cli_rust` | `finch_cli` を装い、`sha-rst` に依存 | 2025-12-08 に 1 版 | 18 | [RUSTSEC-2025-0152](https://rustsec.org/advisories/RUSTSEC-2025-0152.html) | GHSA-6v2j-vr4h-f632 |

公開日とダウンロード数は、crates.io チームの報告と RustSec の助言の記載によります。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2025-11-20〜11-25 | `sha-rust` が 8 版公開される | crates.io チーム |
| 2025-11-25 | `finch-rust` が公開される | crates.io チーム |
| 2025-12-05 | Socket の研究者が crates.io チームに通報 | crates.io チーム |
| 2025-12-05 15:52 | `finch-rust` と `sha-rust` が削除される。公開した利用者は無効化される | crates.io チーム |
| 2025-12-05 | crates.io チームが報告を、Socket が解析を公開 | 両者の記事 |
| 2025-12-08 | `finch-rst`、`sha-rst`、`finch_cli_rust` が公開される | RustSec の助言 |
| 2025-12-09 | NGI Sweden（National Genomics Infrastructure Sweden）の研究者が通報。通報先は、crates.io チームの記事では Rust のセキュリティ対応ワーキンググループ、RustSec の助言では crates.io チーム | crates.io チーム、RustSec の助言 |
| 2026-02-06 | 第 1 波に RustSec の番号が割り当てられ、GitHub の助言も公開される | 自分で確認 |
| 2026-02-12 | 第 2 波に RustSec の番号が割り当てられ、GitHub の助言も公開される | 自分で確認 |
| 2026-02-13 | crates.io チームが、通知方針の変更の記事の中で第 2 波を報告 | crates.io チーム |
| 2026-11-20 | 5 つとも crates.io の索引に無いこと、`finch` と `finch_cli` は残っていることを確認 | 自分で確認 |

第 1 波では削除（12-05）から、第 2 波では通報（12-09）から、RustSec の助言が追加されるまでに、どちらも約 2 か月かかっています。`advisory-db` の履歴では、助言のファイル自体が番号の割り当てと同じ日に初めて追加されています。この間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できなかったことになります。

## 手口

この節は、第 1 波について Socket が公開した解析によります。RustSecJP は検体を入手しておらず、自分では確認していません。

- **名前の偽装**: `finch` に言語名を足した `finch-rust` という名前で、説明文も本物に似せていた。
- **本物のコピーに 1 行だけ足す**: `finch-rust` の中身はほぼ本物の `finch` のコピーで、ある関数の中に `sha_rust` の関数を呼ぶ 1 行が足されていた。その前後には、目くらましの無意味なコードが置かれていた。
- **ペイロードを依存に分ける**: 認証情報を盗むコードは `sha-rust` の側にあり、`finch-rust` だけを見ても悪性とは分かりにくい。
- **依存の版を固定しない**: `finch-rust` は `sha-rust = "0.1"` と指定していたので、`sha-rust` の新しい版が出ると、そちらが使われる。
- **動く時点**: インストール時やビルド時ではなく、ライブラリの機能（スケッチ（ゲノム配列を短く要約したデータ）の直列化）を使ったときに動く。
- **盗むもの**: `.env`、`*.env`、`config.toml`、`id.json`。版によって、ホームディレクトリ全体を探すものと、カレントディレクトリだけを探すものがあった。ある版では、拡張子のあるファイルをほぼすべて対象にしていた。
- **送り方**: ファイルの中身に、利用者名とローカルの IP アドレスを付けて、HTTPS の POST で外部へ送る。文字列は base64 で隠されていた。
- **なりすまし**: crate のメタデータには、実在する別の GitHub 利用者の名前と、存在しないリポジトリの URL が書かれていた。

第 2 波（`finch-rst`、`sha-rst`、`finch_cli_rust`）については、RustSec の助言に「`sha-rst` は認証情報を外部へ送るペイロードを含んでいた」とあるだけで、詳しい解析は公開されていません。

## 5 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `finch-rust` → `sha-rust` | 依存関係。同じ利用者が公開した | 他者の報告（crates.io チーム） | 高 |
| `finch-rst`、`finch_cli_rust` → `sha-rst` | 依存関係 | 他者の報告（RustSec の助言） | 高 |
| 第 1 波 ↔ 第 2 波 | 装う対象が同じ（`finch` 系）。「装う crate ＋ 認証情報を盗む `sha-*` という依存」という構成が同じ。名前が 1 文字違い（`sha-rust` → `sha-rst`、`finch-rust` → `finch-rst`）。第 1 波の削除の 3 日後に公開された | 自分で確認（助言と公式記事の突き合わせ） | 中 |

第 1 波と第 2 波が**同じ攻撃者によるものかは、確認できていません**。第 2 波を公開した利用者も、その送信先も公表されていないためです。確信度を「中」にとどめているのは、このためです。

## 痕跡情報

通信先は無害化して書いています。一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-001/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crates.io の利用者 | `face-lessssss` | 第 1 波 | crates.io チーム |
| 送信先 | `hxxps://rust-docs-build[.]vercel[.]app/api/v1` | 第 1 波（`sha-rust`） | Socket |
| 探すファイル | `.env`、`*.env`、`config.toml`、`id.json` | 第 1 波（`sha-rust`） | Socket |

検体のハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **crate の名前を確かめる**: 言語名を足した名前（`-rust`、`-rs`、`-rst`）は、本物の別名とは限りません。crates.io のページで、リポジトリの URL が実在するか、ダウンロード数と公開日が不自然でないかを見ます。
- **公開されたばかりの版をすぐに使わない**: この事件の crate は、公開から削除までが 3 週間以内でした。新しい依存を足すときは、公開からの日数を見ます。
- **依存を足すときに、その依存の依存も見る**: 悪性のコードは、装う crate ではなく、その依存の側にありました。`cargo tree` で、見慣れない名前が増えていないかを確かめます。
- **助言データベースだけに頼らない**: 第 1 波・第 2 波とも、RustSec の助言が出るまでに約 2 か月かかりました。`cargo audit` は、番号が付くまではこれらの crate を知らせてくれません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 5 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 5 件、crates.io の索引に無いこと） | 高 |
| 5 件の RustSec の番号と GHSA の番号の対応 | 自分で確認（助言の本文、OSV、GitHub の助言データベース） | 高 |
| RustSec の番号が割り当てられた日 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 公開日、版の数、ダウンロード数、削除の時刻、通報者 | 他者の報告（crates.io チーム、RustSec の助言） | 高 |
| RustSec の助言が追加された日 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 第 1 波の手口、盗むファイル、送信先 | 他者の報告（Socket） | 中 |
| 第 2 波のペイロードが認証情報を外部へ送る | 他者の報告（RustSec の助言） | 中 |
| 第 1 波と第 2 波が一連のものである | 自分で確認した状況からの判断 | 中 |

## 分かっていないこと

- **第 1 波と第 2 波の攻撃者が同じかどうか**。公開した利用者や送信先の一致は、公表されていません。
- **第 2 波の詳しい手口**。解析は公開されていません。
- **第 2 波が削除された時刻**。公表されていません。
- **`finch-rust` の公開日**。crates.io チームは 2025-11-25 としています。Socket の記事は、12-05 の時点で「15 日前に公開」としており、これは 11-20 ごろに当たります。11-20 は `sha-rust` の最初の版の公開日なので、Socket の記述はそちらを指している可能性がありますが、確認できていません。この記録では、crates.io チームの日付を採っています。
- **実際の被害**。crates.io チームは、第 1 波について実利用の形跡は無いとしています。第 2 波については、依存する crate が無かったことだけが分かっています。
- **OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV で 5 つの crate を調べたところ、返ってきたのは RUSTSEC と GHSA の番号だけで、`MAL-` で始まる番号はありませんでした。

## 出典

**一次情報**

- crates.io チーム「[crates.io: Malicious crates finch-rust and sha-rust](https://blog.rust-lang.org/2025/12/05/crates.io-malicious-crates-finch-rust-and-sha-rust/)」（2025-12-05）
- crates.io チーム「[crates.io: an update to the malicious crate notification policy](https://blog.rust-lang.org/2026/02/13/crates.io-malicious-crate-update/)」（2026-02-13）
- RustSec の助言: [RUSTSEC-2025-0146](https://rustsec.org/advisories/RUSTSEC-2025-0146.html)、[0148](https://rustsec.org/advisories/RUSTSEC-2025-0148.html)、[0150](https://rustsec.org/advisories/RUSTSEC-2025-0150.html)、[0151](https://rustsec.org/advisories/RUSTSEC-2025-0151.html)、[0152](https://rustsec.org/advisories/RUSTSEC-2025-0152.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `420df2e4`、`85b79559`。番号の割り当て: `5ebcfc04`、`be2402b5`）

**検知した企業の解析**

- Socket「[Malicious Crate Mimicking 'Finch' Exfiltrates Credentials via a Hidden Dependency](https://socket.dev/blog/malicious-crate-mimicking-finch-exfiltrates-credentials)」（2025-12-05）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 5 つの crate が無く、`finch` と `finch_cli` はあること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、5 つの crate の番号の対応を引いたこと。

## 更新履歴

- 2026-11-20: 初版
- 2026-11-20: 出典と照らし合わせて直す（第 2 波の中身についての書きすぎ、第 2 波の通報先、助言が出るまでの期間）
