# RSJP-C-2026-006: 同じ利用者が公開し、ビルド環境の情報を外部へ送ろうとした electrumd と gabby-types-sec

| | |
|---|---|
| 番号 | `RSJP-C-2026-006` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2026-01-26 〜 2026-11（公開から削除まで、UTC） |
| 関係する crate | 2 つ（すべて crates.io から削除済み） |
| 種類 | ビルド時に外部へ通信する crate（1 つは、GitHub 上の正規のプロジェクトと同じ名前） |
| 盗むもの | ビルド環境の情報（RustSec は「telemetry」と書くだけで、中身は公表なし） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-006/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-006/iocs.csv) |

## 要約

`electrumd` と `gabby-types-sec` の 2 つの crate が、2026 年 1 月と 2 月に crates.io に公開されました。RustSec の助言によると、2 つとも、ビルド環境の情報（telemetry）を任意の URL へ送ろうとしていました。

2 つは約 9〜10 か月のあいだ公開されたままで、2026 年 11 月に、Bitbison の通報で削除されました。RustSec の助言は 2026-11-09 付けで、crate ごとに 1 件ずつ、計 2 件出ています。この記録では、それらを 1 つのまとまりとして束ねます。

束ねる根拠は、非公式の crate 一覧サイト lib.rs が、2 つとも**同じ crates.io の利用者が持っていた**と表示していることです。crates.io 自体は、削除した crate の持ち主をもう表示しないため、確信度は「中」です。

送信先、送った中身、目的（攻撃なのか、調査のための試しなのか）は、公表されていません。RustSec の助言によると、2 つとも実際に使われた形跡は無く、依存する crate もありませんでした。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、crates.io から取った `electrumd` か `gabby-types-sec` がある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

**注意**: GitHub 上には、Electrum のウォレットをテストで動かすための、`electrumd` という同じ名前の正規のプロジェクトがあります。これを git で指定して使っている場合、`Cargo.lock` の `source` の行は `git+...` になります。これは対象ではありません。対象は、`source = "registry+..."` または `source = "sparse+..."` の行が付いたもの（crates.io から取ったもの）だけです。

```shell
# プロジェクトのロックファイルを調べる（crates.io から取ったものだけを表示）
awk '/^name = /{n=$3} /^source = "(registry|sparse)\+/{if (n ~ /^"(electrumd|gabby-types-sec)"$/) print n}' Cargo.lock

# 名前だけで広く調べる（git やパスで指定したものも出る）
grep -nE 'name = "(electrumd|gabby-types-sec)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(electrumd|gabby-types-sec)-[0-9]'
```

2 つとも crate ごと削除されているので、crates.io から取ったものであれば、どの版でも対象です。

見つかった場合は、その crate をビルドした環境にあった認証情報やトークンを、漏れたものとして入れ替えてください。RustSec の助言は「ビルド環境から」送ろうとしたと書いているので、ビルドしただけ（`cargo build` や `cargo check`）でも動いた可能性があります。何を送ったかは公表されていないため、環境変数に置いた鍵も含めて考えるのが安全です。

## 関係する crate

| crate | 公開 | lib.rs の表示 | RustSec | GHSA |
|---|---|---|---|---|
| `electrumd` | 2026-01-26 に 5 版 | 0.0.1〜0.0.4 と 0.1.0（すべて Jan 23, 2026） | [RUSTSEC-2026-0465](https://rustsec.org/advisories/RUSTSEC-2026-0465.html) | なし |
| `gabby-types-sec` | 2026-02-17 に 1 版 | 99.99.99（Feb 18, 2026） | [RUSTSEC-2026-0470](https://rustsec.org/advisories/RUSTSEC-2026-0470.html) | なし |

「公開」の列は、RustSec の助言の記載によります。「lib.rs の表示」の列は、2026-11-20 に lib.rs で確認したものです。日付が両方とも食い違っています（[分かっていないこと](#分かっていないこと)を参照）。ダウンロード数は公表されていません。RustSec の助言では、2 つとも「実利用の形跡なし」です。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2026-01-26 | `electrumd` が 5 版公開される（lib.rs は 01-23 と表示） | RustSec の助言 |
| 2026-02-17 | `gabby-types-sec` が公開される（lib.rs は 02-18 と表示） | RustSec の助言 |
| 2026-11（日付は公表なし） | Bitbison が通報し、2 つが削除される | RustSec の助言 |
| 2026-11-09 | 2 件の助言の日付 | RustSec の助言 |
| 2026-11-10 00:46 | 助言が、`webhook_commands`、`env-test-guard` の助言と一緒に、1 つのコミット（`58a64e69`）として `advisory-db` に追加される | 自分で確認（`advisory-db` の履歴） |
| 2026-11-10 11:50 | PR #3534 が取り込まれ、RustSec の番号が割り当てられる（`d0839834`） | 自分で確認 |
| 2026-11-20 | 2 つとも crates.io の索引に無いこと、GHSA と MAL の番号が無いことを確認 | 自分で確認 |

公開から削除まで、約 9〜10 か月かかっています。この間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できませんでした。

## 手口

**詳しい解析は公開されていません。** RustSecJP は検体を入手しておらず、自分では確認していません。分かっているのは次のことだけです。

- **送るもの**: RustSec の助言は、2 つとも「ビルド環境の telemetry を任意の URL へ送ろうとした」と書いています。何を集めたか、どこへ送ったかは書かれていません。
- **動く時点**: 助言は「ビルド環境から」と書いています。lib.rs では、2 つとも `build.rs`（ビルドのときに動くスクリプト）があると表示されています。
- **依存**: lib.rs では、2 つとも HTTP の通信に使う `reqwest` と、JSON を扱う `serde_json` に依存しています。`electrumd` はほかに `chrono`（時刻）、`gabby-types-sec` は `hostname`（ホスト名）に依存しています。これらから何を集めたかを推し量ることはできますが、確認はできていません。
- **名前**: `electrumd` は、GitHub 上にある同じ名前の正規のプロジェクトと名前が重なります。そのプロジェクトは、crates.io には公開されていなかったとみられます（RustSec の助言は、この crate には悪性の 5 版しか無かったとしています）。`gabby-types-sec` については、名前の由来は分かっていません。
- **版番号**: `gabby-types-sec` の版番号は 99.99.99 でした。lib.rs では「dependency test utility crate」という説明が付いていました。
- **説明の文言**: lib.rs では、`electrumd` は「System verification tool for security auditing」と説明され、ホームページの欄は `example.com` でした。

これらの crate が攻撃だったのか、調査のための試しだったのかについて、公表された説明はありません。この記録は、どちらとも判断しません。

## 2 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| 2 つとも | lib.rs の 2 つの crate のページが、どちらも同じ crates.io の利用者（`Protocols-sec`）を持ち主と表示している | 自分で確認（lib.rs の表示） | 中 |
| 持ち主の利用者 | crates.io の API で、この利用者は存在し、持っている crate は 2026-11-20 時点で 0 件 | 自分で確認 | 高（利用者が存在し、今は crate が無いこと） |
| 補強 | lib.rs で、`build.rs` があること、`reqwest` と `serde_json` への依存、ライセンス、大きさが一致する | 自分で確認（lib.rs の表示） | 低 |

束ねる根拠の中心は「同じ利用者」です。ただし、crates.io は削除した crate の持ち主を表示しなくなるため、確かめられたのは lib.rs の表示だけです。crates.io チームや RustSec は、2 つの持ち主が同じだとも、同じ事件だとも述べていません。確信度を「中」にとどめているのは、このためです。

2 つの助言が同じコミットに入っていること、同じ人（Bitbison）が通報したことは、束ねる根拠にしていません。同じコミットには、持ち主の違う `webhook_commands` と `env-test-guard` も入っているからです。送信先が同じかどうか、コードが同じかどうかも、公表されていません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-006/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crate の名前 | `electrumd`、`gabby-types-sec` | 全体 | RustSec の助言 |
| crates.io の利用者 | `Protocols-sec` | 全体 | lib.rs |
| 版番号 | 99.99.99 | `gabby-types-sec` | lib.rs |

送信先、検体のハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **crates.io に無い名前を git で使うときに気を付ける**: `electrumd` のように、GitHub だけで公開されているプロジェクトの名前が、crates.io では別人に取られていることがあります。git で指定するつもりの依存が、指定の誤りで crates.io から取られていないかを、`Cargo.lock` の `source` の行で確かめます。
- **不自然に大きい版番号を疑う**: 99.99.99 のような版番号は、ふつうの開発ではまず使われません。
- **ビルドのときの外への通信を絞る**: 今回の crate は、ビルド環境から送ろうとしました。CI では、ビルドの段階で外部へ通信できないようにすると、この種の送信を防げます。
- **助言データベースだけに頼らない**: 今回は、公開から助言が出るまで約 9〜10 か月かかりました。`cargo audit` は、番号が付くまではこれらの crate を知らせてくれません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 2 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 2 件、crates.io の索引に無いこと） | 高 |
| RustSec の番号の対応。GHSA と MAL の番号は無い | 自分で確認（助言の本文、OSV、GitHub の助言データベース） | 高 |
| 助言が `advisory-db` に追加された日時と、番号が割り当てられた日時 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 公開日、版の数、実利用の形跡が無いこと、通報者 | 他者の報告（RustSec の助言） | 高 |
| ビルド環境の情報を任意の URL へ送ろうとした | 他者の報告（RustSec の助言） | 高 |
| 2 つを同じ利用者が持っていた | 自分で確認（lib.rs の表示のみ。crates.io では確かめられない） | 中 |
| GitHub 上に同じ名前の `electrumd` の正規のプロジェクトがある | 自分で確認 | 高 |
| 依存、`build.rs` の有無、版番号、説明文 | 自分で確認（lib.rs の表示のみ） | 中 |
| 送信先、送る中身、目的 | 公表なし | — |

## 分かっていないこと

- **送信先と、送った中身**。RustSec の助言は「任意の URL」「telemetry」と書くだけです。Bitbison の解析のページは、ログインした人にしか見えず、確認できませんでした。Bitbison のブログにも、この 2 つについての記事はありませんでした（2026-11-20 時点）。
- **目的**。攻撃なのか、調査のための試しなのかは、公表されていません。
- **2 つのコードが同じかどうか**。依存の一覧が似ていることは分かりますが、コードの解析は公開されていません。
- **削除された日時**。公表されていません。
- **公開日**。`electrumd` は RustSec の助言が 2026-01-26、lib.rs が Jan 23, 2026 と、3 日ずれています。`gabby-types-sec` は RustSec が 02-17、lib.rs が Feb 18 です。この記録では、RustSec の日付を採っています。
- **npm の `gabby-types` との関係**。npm には、悪性とされた `gabby-types` というパッケージがあります（MAL-2026-1176、2026-03-03 公開）。名前が似ているだけで、つながりを示す情報は見つからず、この記録では関係を判断しません。
- **実際の被害**。RustSec は 2 つとも実利用の形跡は無いとしています。ダウンロード数は公表されていません。
- **OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV で 2 つの crate を調べたところ、返ってきたのは RUSTSEC の番号だけで、`MAL-` で始まる番号はありませんでした。GitHub の助言データベースにも見つかりませんでした。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2026-0465](https://rustsec.org/advisories/RUSTSEC-2026-0465.html)、[0470](https://rustsec.org/advisories/RUSTSEC-2026-0470.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `58a64e69`。番号の割り当て: `d0839834`。PR #3534）

**検知した企業**

- [Bitbison](https://bitbison.io/)（通報者。2 つについての公開の解析は見つからない）

**そのほかの情報源**

- lib.rs: [electrumd](https://lib.rs/crates/electrumd)、[gabby-types-sec](https://lib.rs/crates/gabby-types-sec)（非公式の crate 一覧サイト）
- OSV: [MAL-2026-1176](https://osv.dev/vulnerability/MAL-2026-1176)（npm の `gabby-types`。この記録の対象ではない）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 2 つの crate が無いこと。
- crates.io の利用者の API（`crates.io/api/v1/users/Protocols-sec`）で、利用者が存在し、持っている crate が 0 件であること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、2 つの crate の番号を引いたこと。
- lib.rs の 2 つの crate のページの表示。
- GitHub 上に、同じ名前の `electrumd` の正規のプロジェクトがあること。

## 更新履歴

- 2026-11-20: 初版
