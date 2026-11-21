# RSJP-C-2026-002: 時刻ユーティリティを装い、timeapi.io に似せた送信先へ .env を送る crate

| | |
|---|---|
| 番号 | `RSJP-C-2026-002` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2026-02-28 〜 2026-03-10（UTC） |
| 関係する crate | 5 つ（すべて crates.io から削除済み） |
| 種類 | 時刻の道具を装った悪性の crate（1 つは名前の偽装） |
| 盗むもの | `.env` ファイル |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-002/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-002/iocs.csv) |

## 要約

時刻の調整や同期の道具を装った 5 つの crate が、crates.io に公開されました。どれも、手元の `.env` ファイルを外部のサーバーへ送るコードを含んでいました。

送信先は、正規の時刻 API サービス `timeapi.io` に 1 文字足した、よく似た名前のドメイン（`timeapis[.]io`）でした。**`timeapi.io` 自体はこの攻撃に関わっていません。** 名前を借りられただけです。

最初の `time_calibrator` は 2026-02-28 に公開されました。その後の 3 つ（`time_calibrators`、`dnp3times`、`time-sync`）は、03-03〜03-04 に公開され、どれも数時間以内に削除されました。最後の `chrono_anchor` は 03-04 に公開され、03-10 に Socket の通報で削除されるまで、約 6 日間残っていました。RustSec の助言は crate ごとに 1 件ずつ、計 5 件出ていますが、この記録ではそれらを 1 つのキャンペーンとして束ねます。

RustSec の助言によると、5 つとも実際に使われた形跡は無く、依存する crate もありませんでした。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`time_calibrator`、`time_calibrators`、`dnp3times`、`time-sync`、`chrono_anchor` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(time_calibrator|time_calibrators|dnp3times|time-sync|chrono_anchor)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(time_calibrators?|dnp3times|time-sync|chrono_anchor)-[0-9]'
```

本物の `dnp3time`（`s` が付かない方）と `chrono` は、この事件の対象ではありません。

見つかった場合は、その crate を使ったコードを動かした環境の `.env` に書かれた鍵やトークンを、漏れたものとして入れ替えてください。Socket の解析によると、`chrono_anchor` のペイロードはインストール時ではなく、ライブラリの関数（引数の検査など）が呼ばれたときに動きます。テストの実行でも動きえます。

通信の記録を調べる場合、正規の `timeapi.io` への通信は痕跡になりません。見るべきなのは `timeapis[.]io`（`s` が付いた方）への通信です。

## 関係する crate

| crate | 装ったもの | 公開 | 削除まで | RustSec | GHSA |
|---|---|---|---|---|---|
| `time_calibrator` | 時刻の調整の道具 | 2026-02-28 に 1 版 | 公表なし（03-03 に助言） | [RUSTSEC-2026-0030](https://rustsec.org/advisories/RUSTSEC-2026-0030.html) | GHSA-77xj-rrh3-wx3v |
| `time_calibrators` | 時刻の調整の道具 | 2026-03-03 に 1 版 | 約 3 時間 | [RUSTSEC-2026-0031](https://rustsec.org/advisories/RUSTSEC-2026-0031.html) | GHSA-wf45-3gpw-vrqv |
| `dnp3times` | 正規の `dnp3time` にゆるく似せた名前 | 2026-03-04 に 1 版 | 約 6 時間 | [RUSTSEC-2026-0032](https://rustsec.org/advisories/RUSTSEC-2026-0032.html) | GHSA-xhw7-jhmp-j62j |
| `time-sync` | 時刻の同期の道具 | 2026-03-04 に 1 版 | 約 50 分 | [RUSTSEC-2026-0036](https://rustsec.org/advisories/RUSTSEC-2026-0036.html) | GHSA-mh23-rw7f-v5pq |
| `chrono_anchor` | `chrono` の関連 crate に見える名前 | 2026-03-04 に 1 版 | 約 6 日 | [RUSTSEC-2026-0039](https://rustsec.org/advisories/RUSTSEC-2026-0039.html) | なし |

公開日と削除までの時間は、RustSec の助言の記載によります。ダウンロード数は、RustSec の助言では 5 つとも「実利用（ダウンロード）の形跡なし」です。Socket は `chrono_anchor` について、記録した時点で 66 回と報告しています（[分かっていないこと](#分かっていないこと)を参照）。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2026-02-28 | `time_calibrator` が公開される | RustSec の助言 |
| 〜2026-03-03 | 外部の研究者が `time_calibrator` を Rust のセキュリティ対応ワーキンググループに通報。crate は削除され、公開した利用者のアカウントはロックされる（通報と削除の日時は公表なし。助言の日付は 03-03） | RustSec の助言 |
| 2026-03-03 16:12 | `time_calibrator` の助言が `advisory-db` に追加される | 自分で確認 |
| 2026-03-03 | `time_calibrators` が公開され、約 3 時間後に削除される。18:03 に助言が追加される（コミットの文言は「I guess they tried again.」） | RustSec の助言、自分で確認 |
| 2026-03-04 | `dnp3times` が公開され、約 6 時間後に削除される。16:32 に助言が追加される | RustSec の助言、自分で確認 |
| 2026-03-04 | `time-sync` が公開され、約 50 分後に削除される。助言は 03-05 02:06 に追加される | RustSec の助言、自分で確認 |
| 2026-03-04 | `chrono_anchor` が公開される | RustSec の助言 |
| 2026-03-04〜03-05 | 先の 4 つについて GitHub の助言が公開される | 自分で確認 |
| 2026-03-10 | Socket が `chrono_anchor` を通報。crates.io チームが削除し、公開した利用者のアカウントを停止する。Socket が解析を公開し、20:33 に助言が追加される | Socket、RustSec の助言、自分で確認 |
| 2026-11-20 | 5 つとも crates.io の索引に無いこと、`dnp3time` は残っていることを確認 | 自分で確認 |

先の 4 つは、公開から 1 日以内に助言が出ています。`chrono_anchor` だけは、公開から削除まで約 6 日かかりました。Socket は、`chrono_anchor` が少しの難読化などで目立つ痕跡を減らしていたため、通報まで残ったと見ています。

## 手口

この節は、Socket が公開した解析によります。コードが公開されているのは `chrono_anchor` だけです。ほかの 4 つについては、RustSec の助言に「`.env` を送ろうとした」とあるほかは、Socket の「同じ流れ」という説明しかありません。RustSecJP は検体を入手しておらず、自分では確認していません。

- **時刻の道具を装う**: 「NTP を使わずにローカルで時刻を合わせる」といった、制限のあるネットワークや CI で使えそうな説明を付けていた。
- **名前の選び方**: `dnp3times` は正規の `dnp3time` に `s` を足した名前。`chrono_anchor` は、広く使われる `chrono` の関連 crate に見える名前。残りの 3 つは、無害に聞こえる時刻の道具の名前。
- **動く時点**: `chrono_anchor` では、引数の検査（`check_params()`）や「任意の同期」の関数の中から、無条件に呼ばれる。インストール時やビルド時ではない。
- **見せかけの通信**: まず正規の `timeapi.io` へ普通の HTTPS の GET を送り、時刻を取りに行っただけに見せる。
- **送り方**: 同じホスト名の文字列に `s` を 1 文字足して `timeapis[.]io` を作り、暗号化の無い HTTP に落として送る。1 秒待ってから別のスレッドで、外部の `curl` コマンドを使い、`.env` をマルチパートの POST で送る。
- **盗むもの**: `.env`。Socket の記事では、`chrono_anchor` の送るファイルの指定は `.env` です。
- **居座らない**: 常駐の仕組みは作らない。そのコードを通るたびに、送信を繰り返す。
- **なりすまし**: `chrono_anchor` のマニフェストには、使い捨てのメールのドメインのアドレスと、記事の時点で 404 になる GitHub アカウントの URL が書かれていた。Socket は、同じまとまりの別の crate に、同じドメインの別のアドレスがあったとしている（どの crate かは書かれていない）。

## 5 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `time_calibrators`、`dnp3times`、`time-sync`、`chrono_anchor` | 4 件の助言が、どれも「正規の `timeapi.io` を装うサーバーへ `.env` を送ろうとした」と書いている | 他者の報告（RustSec の助言） | 高 |
| `time_calibrator` ↔ ほかの 4 つ | `dnp3times` の助言が「`time_calibrator` と `time_calibrators` と同じ攻撃」と、`time-sync` の助言が「ここ数日で 3 回見たのと同じ攻撃」と書いている | 他者の報告（RustSec の助言） | 高 |
| 5 つすべて | 同じ送信先（`timeapis[.]io`）、同じ送信の流れ、繰り返されるコードの型 | 他者の報告（Socket。コードの公開は `chrono_anchor` のみ） | 中 |
| ほかに同じ送信先の crate が無いか | `advisory-db` の全助言のうち、`timeapi.io` に触れているのはこの 4 件だけ。`timeapis`、Socket が挙げた利用者名やメールのドメインに触れた助言は無い | 自分で確認 | 高 |

`time_calibrator` の助言だけは、送信先に触れていません。この crate を含める根拠は、`dnp3times` の助言の「同じ攻撃」という記述と、Socket の記事です。

5 つを**公開した利用者が同じかどうかは、公表されていません**。`time_calibrator` の利用者はロックされ、`chrono_anchor` の利用者は停止されたことが分かっていますが、Socket が名前を挙げたのは `chrono_anchor` の利用者だけです。この記録は、RustSec の「同じ攻撃」という記述と、同じ送信先を根拠に束ねています。

## 痕跡情報

通信先は無害化して書いています。一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-002/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| 送信先のドメイン | `timeapis[.]io` | 5 つすべて | Socket |
| 送信先 | `hxxp://timeapis[.]io/api/Time/current/zone?timeZone=UTC` | `chrono_anchor`（Socket は全体の痕跡として挙げる） | Socket |
| crates.io の利用者 | `dictorudin` | `chrono_anchor` | Socket |
| 作者のメール | `gehakax777@kaoing[.]com` | `chrono_anchor` | Socket |
| 作者のメール | `jack@kaoing[.]com` | 別の 1 つ（crate 名は公表なし） | Socket |
| GitHub アカウント | `suntea279491`、`dictorudin` | `chrono_anchor` | Socket |
| 探すファイル | `.env` | 5 つすべて | RustSec の助言、Socket |

正規の `timeapi.io`（`s` が付かない方）は痕跡ではありません。`chrono_anchor` は見せかけのためにそちらへも通信しますが、サービス自体は無関係です。

検体のハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **crate の名前を確かめる**: 本物に 1 文字足した名前（`dnp3time` → `dnp3times`）や、有名な crate の関連に見える名前（`chrono_anchor`）は、本物の一部とは限りません。crates.io のページで、作者、リポジトリが実在するか、公開日を見ます。
- **公開されたばかりの crate をすぐに使わない**: この事件の crate は、公開から削除までが最長でも約 6 日でした。
- **「ネットワーク不要」をうたう crate の通信を疑う**: Socket は、ネットワークを使わないはずの crate が `curl` などの外部コマンドを起動したり、裏で HTTP の通信をしたりする場合に注意するよう勧めています。
- **ビルドやテストのときの外への通信を絞る**: CI では、テストの段階で外部へ通信できないようにすると、この種の送信を防げます。`.env` を作業ディレクトリに置いたままテストを走らせないことも有効です。
- **助言データベースだけに頼らない**: 今回は助言が早く出ましたが、`chrono_anchor` は約 6 日間、検出されずに残っていました。`cargo audit` は、番号が付くまでは知らせてくれません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 5 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 5 件、crates.io の索引に無いこと） | 高 |
| RustSec の番号と GHSA の番号の対応（`chrono_anchor` には GHSA が無い） | 自分で確認（助言の本文、OSV、GitHub の助言データベース） | 高 |
| 助言が `advisory-db` に追加された日時 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 公開日、削除までの時間、実利用の形跡が無いこと | 他者の報告（RustSec の助言） | 高 |
| 4 つの送信先が「`timeapi.io` を装うサーバー」である | 他者の報告（RustSec の助言） | 高 |
| 5 つが同じ攻撃である | 他者の報告（RustSec の助言、Socket）。自分では助言どうしの突き合わせのみ | 高 |
| 送信先のドメイン名、手口、作者のメールやアカウント | 他者の報告（Socket） | 中 |
| `chrono_anchor` 以外の 4 つが、同じコードと同じ送信先を使った | 他者の報告（Socket。コードは公開されていない） | 中 |
| 5 つを同じ利用者が公開した | 公表なし | 低 |

## 分かっていないこと

- **5 つを公開した利用者が同じかどうか**。公表されているのは `chrono_anchor` の利用者だけです。
- **`chrono_anchor` 以外の 4 つの詳しい中身**。Socket は同じ流れだとしていますが、コードを示しているのは `chrono_anchor` だけです。
- **`time_calibrator` が削除された時刻と、送信先**。助言は「`.env` をサーバーへ送ろうとした」とだけ書き、`timeapi.io` に触れていません。後の `dnp3times` の助言が「同じ攻撃」としていることから、この記録では含めています。
- **`chrono_anchor` のダウンロード数**。RustSec の助言は「実際のダウンロードの形跡なし」、Socket は記録した時点で 66 回としています。自動のミラーや検査のサービスによるダウンロードを数えているかどうかで食い違っている可能性がありますが、確認できていません。
- **削除のしかた**。Socket は crates.io が 4 つを「yank した」と書いていますが、RustSec の助言は「削除した」と書いています。2026-11-20 の時点で 5 つとも索引に無いので、この記録では削除として扱います。
- **`time-sync` の助言の日付**。助言の `date` は 2026-03-04 ですが、`advisory-db` に追加されたコミットは 2026-03-05 02:06（UTC）です。日付の付け方の違いと見られます。
- **実際の被害**。RustSec は 5 つとも実利用の形跡は無いとしています。
- **OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV で 5 つの crate を調べたところ、返ってきたのは RUSTSEC と GHSA の番号だけで、`MAL-` で始まる番号はありませんでした。`chrono_anchor` には GHSA の番号もありませんでした。
- **crates.io チームの記事**。この事件についての crates.io チームのブログ記事は、見つかりませんでした。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2026-0030](https://rustsec.org/advisories/RUSTSEC-2026-0030.html)、[0031](https://rustsec.org/advisories/RUSTSEC-2026-0031.html)、[0032](https://rustsec.org/advisories/RUSTSEC-2026-0032.html)、[0036](https://rustsec.org/advisories/RUSTSEC-2026-0036.html)、[0039](https://rustsec.org/advisories/RUSTSEC-2026-0039.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `76c09d8c`、`06ffd2a4`、`a26fabd9`、`7883665f`、`ec70646e`。番号の割り当て: `b7f616cb`、`d23a7054`、`74d82efc`、`8523f5db`、`8ad00454`）

**検知した企業の解析**

- Socket「[5 Malicious Rust Crates Posed as Time Utilities to Exfiltrate .env Files](https://socket.dev/blog/5-malicious-rust-crates-posed-as-time-utilities-to-exfiltrate-env-files)」（2026-03-10）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 5 つの crate が無く、`dnp3time` はあること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、5 つの crate の番号の対応を引いたこと。
- `advisory-db` の全助言を検索し、`timeapi.io` に触れた助言がこの 4 件だけであること。

## 更新履歴

- 2026-11-20: 初版
