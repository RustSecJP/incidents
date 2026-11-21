# RSJP-C-2025-003: 同じ利用者が 2025 年 3 月に公開し、ビルド環境の情報を外部へ送ろうとした 4 つの crate

| | |
|---|---|
| 番号 | `RSJP-C-2025-003` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2025-03-01 〜 2026-11（公開から削除まで、UTC） |
| 関係する crate | 4 つ（すべて crates.io から削除済み） |
| 種類 | ビルド時に外部へ通信する crate（2 つは、ほかのプロジェクトのテスト用の crate と同じ名前） |
| 盗むもの | ビルド環境の情報（RustSec は「telemetry」と書くだけで、中身は公表なし） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-003/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-003/iocs.csv) |

## 要約

`top_level_crate`、`shinchina`、`shinchina-test`、`build_dep` の 4 つの crate が、2025-03-01〜03-03 に crates.io に公開されました。RustSec の助言によると、4 つとも、ビルド環境の情報（telemetry）を任意の URL へ送ろうとしていました。

4 つは約 20 か月のあいだ公開されたままで、2026 年 11 月に、Bitbison の通報で削除されました。RustSec の助言は 2026-11-06 付けで、crate ごとに 1 件ずつ、計 4 件出ています。この記録では、それらを 1 つのまとまりとして束ねます。

束ねる根拠は、非公式の crate 一覧サイト lib.rs が、4 つとも**同じ crates.io の利用者が持っていた**と表示していることです。crates.io 自体は、削除した crate の持ち主をもう表示しないため、確信度は「中」です。

送信先、送った中身、目的（攻撃なのか、調査のための試しなのか）は、公表されていません。RustSec の助言によると、4 つとも実際に使われた形跡は無く、依存する crate もありませんでした。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、crates.io から取った `top_level_crate`、`shinchina`、`shinchina-test`、`build_dep` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

**注意**: `top_level_crate` と `build_dep` は、OWASP CycloneDX の `cargo-cyclonedx` のリポジトリにある、テスト用の crate と同じ名前です。そのリポジトリを手元で使っている場合や、自分のプロジェクトに同じ名前の crate がある場合は、`Cargo.lock` に**パスで指定した**同じ名前が出てきます。これは対象ではありません。対象は、`source = "registry+..."` または `source = "sparse+..."` の行が付いたもの（crates.io から取ったもの）だけです。

```shell
# プロジェクトのロックファイルを調べる（crates.io から取ったものだけを表示）
awk '/^name = /{n=$3} /^source = "(registry|sparse)\+/{if (n ~ /^"(top_level_crate|shinchina|shinchina-test|build_dep)"$/) print n}' Cargo.lock

# 名前だけで広く調べる（パスで指定したものも出る）
grep -nE 'name = "(top_level_crate|shinchina|shinchina-test|build_dep)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(top_level_crate|shinchina|shinchina-test|build_dep)-[0-9]'
```

どの版が出回ったかの一覧は、crates.io からは消えています。4 つとも crate ごと削除されているので、crates.io から取ったものであれば、どの版でも対象です。

見つかった場合は、その crate をビルドした環境にあった認証情報やトークンを、漏れたものとして入れ替えてください。RustSec の助言は「ビルド環境から」送ろうとしたと書いているので、ビルドしただけ（`cargo build` や `cargo check`）でも動いた可能性があります。何を送ったかは公表されていないため、環境変数に置いた鍵も含めて考えるのが安全です。

## 関係する crate

| crate | 公開 | lib.rs の表示 | RustSec | GHSA |
|---|---|---|---|---|
| `top_level_crate` | 2025-03-01 に 1 版 | 0.1.2 と 0.1.3 の 2 版（どちらも Mar 1, 2025） | [RUSTSEC-2026-0467](https://rustsec.org/advisories/RUSTSEC-2026-0467.html) | なし |
| `shinchina` | 2025-03-01 に 1 版 | 0.1.0（Mar 1, 2025） | [RUSTSEC-2026-0468](https://rustsec.org/advisories/RUSTSEC-2026-0468.html) | なし |
| `shinchina-test` | 2025-03-02 に 1 版 | 0.1.0（Mar 3, 2025） | [RUSTSEC-2026-0472](https://rustsec.org/advisories/RUSTSEC-2026-0472.html) | なし |
| `build_dep` | 2025-03-03 に 1 版 | 0.1.1（Mar 3, 2025） | [RUSTSEC-2026-0466](https://rustsec.org/advisories/RUSTSEC-2026-0466.html) | なし |

「公開」の列は、RustSec の助言の記載によります。「lib.rs の表示」の列は、2026-11-20 に lib.rs で確認したものです。2 か所で食い違いがあります（[分かっていないこと](#分かっていないこと)を参照）。ダウンロード数は公表されていません。RustSec の助言では、4 つとも「実利用の形跡なし」です。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2023-09-12 | 4 つの持ち主とされる crates.io の利用者が作られる | 自分で確認（crates.io の API） |
| 2025-02-27 | 同じ利用者が `runtime_dep_of_runtime_dep`（3.1.0）を公開する。助言は出ていない | lib.rs |
| 2025-03-01 | `top_level_crate` と `shinchina` が公開される | RustSec の助言 |
| 2025-03-02 | `shinchina-test` が公開される（lib.rs は 03-03 と表示） | RustSec の助言 |
| 2025-03-03 | `build_dep` が公開される | RustSec の助言 |
| 2026-11（日付は公表なし） | Bitbison が通報し、4 つが削除される | RustSec の助言 |
| 2026-11-06 | 4 件の助言の日付。同じ日付で `sec-gemini` の助言と一緒に、1 つのコミット（`a8401ca9`）として書かれる | 自分で確認（`advisory-db` の履歴） |
| 2026-11-10 | 助言が PR #3534 で `advisory-db` に取り込まれ、RustSec の番号が割り当てられる（`d0839834`） | 自分で確認 |
| 2026-11-20 | 4 つとも crates.io の索引に無いこと、GHSA と MAL の番号が無いことを確認 | 自分で確認 |

公開から削除まで、約 20 か月かかっています。この間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できませんでした。

## 手口

**詳しい解析は公開されていません。** RustSecJP は検体を入手しておらず、自分では確認していません。分かっているのは次のことだけです。

- **送るもの**: RustSec の助言は、4 つとも「ビルド環境の telemetry を任意の URL へ送ろうとした」と書いています。何を集めたか、どこへ送ったかは書かれていません。
- **動く時点**: 助言は「ビルド環境から」と書いています。lib.rs では、`shinchina-test` と `build_dep` に `build.rs`（ビルドのときに動くスクリプト）があると表示されています。
- **依存**: lib.rs では、4 つとも HTTP の通信に使う `reqwest` に依存しています。`shinchina-test` と `build_dep` は、さらに `sys-info`（OS の情報）と `whoami`（利用者名やホスト名）に依存しています。これらの依存から何を集めたかを推し量ることはできますが、確認はできていません。
- **名前と説明文**: `top_level_crate` と `build_dep` は、`cargo-cyclonedx` のテスト用の crate と同じ名前です。lib.rs では、`top_level_crate` と `shinchina` の説明文とリポジトリの欄が、`cargo-cyclonedx` のものになっています（作者の欄にも、`cargo-cyclonedx` の実在の開発者の名前が出ています。この人たちは事件と無関係です）。なぜこれらの名前を選んだかは、公表されていません。
- **説明の文言**: lib.rs では、`shinchina` は「tester」、`build_dep` は「testing purpose」という文言を付けていました。

これらの crate が攻撃だったのか、調査のための試しだったのかについて、公表された説明はありません。この記録は、どちらとも判断しません。

## 4 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| 4 つすべて | lib.rs の 4 つの crate のページが、どれも同じ crates.io の利用者（`hackersthan`）を持ち主と表示している | 自分で確認（lib.rs の表示） | 中 |
| 持ち主の利用者 | crates.io の API で、この利用者は存在し、持っている crate は 2026-11-20 時点で 0 件。lib.rs は「5 つの crate を作った」としている | 自分で確認 | 高（利用者が存在し、今は crate が無いこと） |
| 補強: `top_level_crate`、`build_dep` | `cargo-cyclonedx` のテスト用の crate と同じ名前。同じ利用者の 5 つ目の crate とみられる `runtime_dep_of_runtime_dep` も同じ場所の名前 | 自分で確認（`cargo-cyclonedx` のリポジトリ） | 中 |
| 補強: `shinchina-test`、`build_dep` | lib.rs で、依存、`build.rs`、Rust 2024、ライセンス、大きさが一致する | 自分で確認（lib.rs の表示） | 低 |

束ねる根拠の中心は「同じ利用者」です。ただし、crates.io は削除した crate の持ち主を表示しなくなるため、確かめられたのは lib.rs の表示だけです。lib.rs は crates.io の情報をもとにした非公式のサイトです。crates.io チームや RustSec は、4 つの持ち主が同じだとも、同じ事件だとも述べていません。確信度を「中」にとどめているのは、このためです。

4 つの助言が同じコミットに入っていること、同じ人（Bitbison）が通報したことは、束ねる根拠にしていません。同じコミットには、持ち主の違う `sec-gemini` も入っているからです。送信先が同じかどうか、コードが同じかどうかも、公表されていません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-003/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crate の名前 | `top_level_crate`、`shinchina`、`shinchina-test`、`build_dep` | 全体 | RustSec の助言 |
| crates.io の利用者 | `hackersthan` | 全体 | lib.rs |

送信先、検体のハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **ほかのプロジェクトのテスト用の名前に気を付ける**: `top_level_crate` や `build_dep` のように、ほかのリポジトリの中だけで使われている名前が、crates.io では別人に取られていることがあります。パスや git で指定するつもりの依存が、指定の誤りで crates.io から取られていないかを、`Cargo.lock` の `source` の行で確かめます。
- **ビルドのときの外への通信を絞る**: 今回の crate は、ビルド環境から送ろうとしました。CI では、ビルドの段階で外部へ通信できないようにすると、この種の送信を防げます。
- **助言データベースだけに頼らない**: 今回は、公開から助言が出るまで約 20 か月かかりました。`cargo audit` は、番号が付くまではこれらの crate を知らせてくれません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 4 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 4 件、crates.io の索引に無いこと） | 高 |
| RustSec の番号の対応。GHSA と MAL の番号は無い | 自分で確認（助言の本文、OSV、GitHub の助言データベース） | 高 |
| 助言が `advisory-db` に追加された日時と、番号が割り当てられた日時 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 公開日、版の数、実利用の形跡が無いこと、通報者 | 他者の報告（RustSec の助言） | 高 |
| ビルド環境の情報を任意の URL へ送ろうとした | 他者の報告（RustSec の助言） | 高 |
| 4 つを同じ利用者が持っていた | 自分で確認（lib.rs の表示のみ。crates.io では確かめられない） | 中 |
| `top_level_crate` と `build_dep` が `cargo-cyclonedx` のテスト用の crate と同じ名前 | 自分で確認 | 高 |
| 依存、`build.rs` の有無、説明文 | 自分で確認（lib.rs の表示のみ） | 中 |
| 送信先、送る中身、目的 | 公表なし | — |

## 分かっていないこと

- **送信先と、送った中身**。RustSec の助言は「任意の URL」「telemetry」と書くだけです。Bitbison の解析のページは、ログインした人にしか見えず、確認できませんでした。Bitbison のブログにも、この 4 つについての記事はありませんでした（2026-11-20 時点）。
- **目的**。攻撃なのか、調査のための試しなのかは、公表されていません。lib.rs の表示では「tester」「testing purpose」という文言が付いていましたが、それだけでは判断できません。
- **4 つのコードが同じかどうか**。依存の一覧が似ていることは分かりますが、コードの解析は公開されていません。
- **削除された日時**。公表されていません。助言は「約 20 か月後に削除」としています。
- **`runtime_dep_of_runtime_dep` の扱い**。lib.rs では、同じ利用者が 2025-02-27 に公開した crate として表示されます。2026-11-20 の時点で crates.io の索引に無く、削除されたとみられますが、RustSec の助言も OSV の番号もありません。悪性のコードを含んでいたか、なぜ消えたかは分からないため、この記録には含めていません。
- **`top_level_crate` の版の数**。RustSec の助言は「1 版」、lib.rs は「0.1.2 と 0.1.3 の 2 版」と表示しています。どちらが正しいかは確認できていません。
- **`shinchina-test` の公開日**。RustSec の助言は 2025-03-02、lib.rs は Mar 3, 2025 と表示しています。時刻の境目と時間帯の違いによる可能性がありますが、確認できていません。この記録では、RustSec の日付を採っています。
- **実際の被害**。RustSec は 4 つとも実利用の形跡は無いとしています。ダウンロード数は公表されていません。
- **OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV で 4 つの crate を調べたところ、返ってきたのは RUSTSEC の番号だけで、`MAL-` で始まる番号はありませんでした。GitHub の助言データベースにも見つかりませんでした。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2026-0466](https://rustsec.org/advisories/RUSTSEC-2026-0466.html)、[0467](https://rustsec.org/advisories/RUSTSEC-2026-0467.html)、[0468](https://rustsec.org/advisories/RUSTSEC-2026-0468.html)、[0472](https://rustsec.org/advisories/RUSTSEC-2026-0472.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `a8401ca9`。番号の割り当て: `d0839834`。PR #3534）

**検知した企業**

- [Bitbison](https://bitbison.io/)（通報者。4 つについての公開の解析は見つからない）

**そのほかの情報源**

- lib.rs: [top_level_crate](https://lib.rs/crates/top_level_crate)、[shinchina](https://lib.rs/crates/shinchina)、[shinchina-test](https://lib.rs/crates/shinchina-test)、[build_dep](https://lib.rs/crates/build_dep)、[利用者のページ](https://lib.rs/~hackersthan)（非公式の crate 一覧サイト）
- OWASP CycloneDX「[cargo-cyclonedx のテスト用の crate](https://github.com/CycloneDX/cyclonedx-rust-cargo/tree/main/cargo-cyclonedx/tests/fixtures/build_then_runtime_dep)」

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 4 つの crate と `runtime_dep_of_runtime_dep` が無いこと。
- crates.io の利用者の API（`crates.io/api/v1/users/hackersthan`）で、利用者が存在し、持っている crate が 0 件であること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、4 つの crate の番号を引いたこと。
- lib.rs の 4 つの crate のページと利用者のページの表示。
- `cargo-cyclonedx` のリポジトリにある、テスト用の crate の名前。

## 更新履歴

- 2026-11-20: 初版
