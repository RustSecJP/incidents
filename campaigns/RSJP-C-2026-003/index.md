# RSJP-C-2026-003: 同じ利用者が持っていた pretty-changelog-logger、microsoftsystem64、safe-agent-rs

| | |
|---|---|
| 番号 | `RSJP-C-2026-003` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2026-03-24 〜 2026-04-14 ごろ（UTC） |
| 関係する crate | 3 つ（すべて crates.io から削除済み）。うち 1 つ（`safe-agent-rs`）は、悪性のコードを直接は含んでいなかった |
| 種類 | 悪性の crate の公開（build.rs のローダー、SSH の裏口と情報の持ち出し） |
| 盗むもの | `.env` や認証情報らしい名前のファイル、Telegram Desktop のセッション（`microsoftsystem64`） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-003/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-003/iocs.csv) |

## 要約

2026 年 4 月、crates.io の同じ利用者が持っていた 3 つの crate が削除されました。

- `pretty-changelog-logger`: ビルドスクリプト（`build.rs`）が、悪性のペイロードを取ってくるローダー（ドロッパー）として動く。
- `microsoftsystem64`: SSH の `authorized_keys` に決まった鍵を書き込んで裏口を作り、`.env` などのファイルや Telegram Desktop のセッションを外部へ送る。
- `safe-agent-rs`: RustSec の助言によると、**悪性のコードは直接は含んでいませんでした**。上の 2 つと同じ利用者のものだったため、念のために削除されました。

RustSec の助言は crate ごとに 1 件ずつ、計 3 件（RUSTSEC-2026-0100〜0102）出ています。この記録では、「同じ利用者が持っていた」という RustSec と crates.io チームの説明を根拠に、3 つを 1 つのキャンペーンとして束ねます。

ダウンロード数は 2239、6346、4138 です。新しく作られた悪性 crate の助言でダウンロード数が書かれたもの（2025〜2026 年）は、ほかは 18〜155 で、それより 1 桁以上多くなっています（乗っ取られた正規の crate は除いて比べています）。ただし、これが実際の利用を示すのか、自動のミラーや検査のサービスによるものなのかは、公表されていません（[分かっていないこと](#分かっていないこと)）。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`pretty-changelog-logger`、`microsoftsystem64`、`safe-agent-rs` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(pretty-changelog-logger|microsoftsystem64|safe-agent-rs)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(pretty-changelog-logger|microsoftsystem64|safe-agent-rs)-'

# 知らない鍵が足されていないかを見る（microsoftsystem64 の場合）
cat ~/.ssh/authorized_keys
```

見つかった場合の対応は、crate によって違います。

- **`pretty-changelog-logger`**: `build.rs` は、`cargo build` だけでなく `cargo check` や `cargo test` でも動きます。コードを呼んでいなくても、ビルドしただけで動いた可能性があります。取ってきたペイロードが何をするかは公表されていないため、その環境は乗っ取られたものとして扱い、そこにあった鍵やトークンをすべて入れ替えてください。
- **`microsoftsystem64`**: `~/.ssh/authorized_keys` から知らない鍵を消してください。その環境にあった `.env` や認証情報のファイルの中身を、漏れたものとして入れ替えてください。Telegram Desktop を使っていた場合は、Telegram の設定から、ほかの端末のセッションをすべて終了させてください。どの時点（ビルド時か、ライブラリの呼び出し時か）で動くかは、公表されていません。
- **`safe-agent-rs`**: RustSec の助言では、悪性のコードは直接は含まれていませんでした。依存から外し、本物のライブラリに入れ替えてください。RustSecJP は中身を確認していないため、上の 2 つも一緒に入っていないかを必ず確かめてください。

## 関係する crate

| crate | 役割 | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|
| `pretty-changelog-logger` | `build.rs` で悪性のペイロードを取ってくるローダー | 2026-04-08 に 3 版 | 2239 | [RUSTSEC-2026-0100](https://rustsec.org/advisories/RUSTSEC-2026-0100.html) | 見つからず |
| `microsoftsystem64` | SSH の裏口と、ファイルや Telegram のセッションの持ち出し | 2026-04-09 に 9 版 | 6346 | [RUSTSEC-2026-0102](https://rustsec.org/advisories/RUSTSEC-2026-0102.html) | 見つからず |
| `safe-agent-rs` | 悪性のコードは直接は無い。同じ利用者のものとして念のため削除。別の WebSocket のライブラリを装っていたように見えた | 2026-03-24 に 2 版 | 4138 | [RUSTSEC-2026-0101](https://rustsec.org/advisories/RUSTSEC-2026-0101.html) | 見つからず |

公開日、版の数、ダウンロード数は RustSec の助言の記載によります。どれも、crates.io 上で依存する crate はありませんでした。ダウンロード数は、削除した時点の数に直されたものです（下の[時系列](#時系列)）。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2026-03-24 | `safe-agent-rs` が 2 版公開される | RustSec の助言 |
| 2026-04-08 | `pretty-changelog-logger` が 3 版公開される | RustSec の助言 |
| 2026-04-09 | `microsoftsystem64` が 9 版公開される | RustSec の助言 |
| 不明 | Socket が `pretty-changelog-logger` と `microsoftsystem64` を、sitsh が `microsoftsystem64` を crates.io チームに通報 | RustSec の助言 |
| 2026-04-13 01:57 | 外部の投稿者が、`advisory-db` に `pretty-changelog-logger` の助言を出す（PR #2779）。05:54 の時点では、まだ削除されていないと書いている | 自分で確認（PR の記録） |
| 2026-04-13 12:38 | 同じ投稿者が、同じ利用者が `microsoftsystem64` も持っていると書き、その助言を足す | 自分で確認（PR の記録） |
| 2026-04-14 21:15 までに | 3 つとも削除される。crates.io チームのメンバーが PR の中で、`safe-agent-rs` は「同じアカウントの別の crate」だと説明 | 自分で確認（PR の記録） |
| 2026-04-15 20:25 | ダウンロード数を「削除した時点の数」に直す（`pretty-changelog-logger` は 2044 → 2239、`microsoftsystem64` は 6404 → 6346） | 自分で確認（`advisory-db` のコミット `527350b0`） |
| 2026-04-15 20:49 | 3 件の助言が追加される（PR #2792） | 自分で確認 |
| 2026-04-15 21:38 | RUSTSEC-2026-0100〜0102 の番号が割り当てられる（助言の日付は 2026-04-13） | 自分で確認 |
| 2026-11-20 | 3 つとも crates.io の索引に無いことを確認 | 自分で確認 |

この件では、crates.io チームのブログ記事は出ていません。crates.io チームは 2026-02-13 に、悪性の crate のたびにブログ記事を出すのはやめ、RustSec の助言だけにすると発表しています。実際に使われている場合は、引き続き記事も出すとしています。

前の事件（[RSJP-C-2025-001](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-001/index.md)）と違い、助言は最初の PR（04-13）から約 2 日、削除からは 1〜2 日で `advisory-db` に入っています。通報の日時は公表されていないため、通報からの日数は分かりません。

## 手口

この節は、RustSec の助言の本文だけによります。RustSecJP は検体を入手しておらず、自分では確認していません。Socket など検知した企業の詳しい解析は、見つかりませんでした。

**`pretty-changelog-logger`**

- **ビルドスクリプトで動く**: `build.rs` が、悪性のペイロードのローダー（ドロッパー）として動く。
- 取ってくる先、ペイロードの中身、名前を似せた本物の crate があるかどうかは、公表されていません。

**`microsoftsystem64`**

- **SSH の裏口**: `authorized_keys` に、決まった鍵を書き込む。攻撃者が後から SSH でログインできるようにするためと見られます。
- **ファイルを探して送る**: `.env`、認証情報らしい名前の JSON ファイル、決まった言葉を含む文書を探し、中身を読んで、必要なら base64 にして、HTTP で外部のサーバーへ送る。
- **Telegram のセッション**: Telegram Desktop の `tdata`（ログイン状態を含むフォルダ）をまとめて送る。
- 送り先、書き込む鍵、動く時点は、公表されていません。

**`safe-agent-rs`**

- RustSec の助言は、悪性のコードを直接は含んでいなかったとしています。
- 別の WebSocket のライブラリを装っていたように見えた、とも書いています。どのライブラリかは書かれていません。

## 3 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `pretty-changelog-logger` ↔ `microsoftsystem64` | 同じ利用者が持っていた。RUSTSEC-2026-0101 の本文と、`advisory-db` の PR での投稿者と crates.io チームのメンバーの説明 | 他者の報告（RustSec の助言、crates.io チーム） | 高 |
| `safe-agent-rs` ↔ 上の 2 つ | 同じ利用者が持っていた。RUSTSEC-2026-0101 が「同じ利用者のもの」と明記し、crates.io チームのメンバーも「同じアカウントの別の crate」と書いている | 他者の報告（RustSec の助言、crates.io チーム） | 高 |

束ねた根拠は「同じ公開アカウント」の 1 種類だけです。crates.io は利用者の名前を公表しておらず、crate も削除されているため、RustSecJP は持ち主が同じことを自分では確かめられていません。ただし、RustSec の助言が明記し、crates.io チームのメンバーも説明しているので、仕様の決まり（確信度「高」は、自分で確認できたときか、crates.io チームや RustSec が明言したとき）に従い、どちらも「高」にしています。

**`safe-agent-rs` は、同じ持ち主だというだけで束ねています。** RustSec によると悪性のコードは直接は含んでいませんでした。この記録で `safe-agent-rs` が攻撃に使われたと言うつもりはありません。役割は「同じ持ち主のため削除」としています。

3 つの間に、依存関係、同じ送り先、同じコードといった、ほかのつながりは公表されていません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-003/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crate | `pretty-changelog-logger`、`microsoftsystem64`、`safe-agent-rs` | 3 つ | RustSec の助言 |
| 書き換えるファイル | `~/.ssh/authorized_keys`（決まった鍵を足す） | `microsoftsystem64` | RustSec の助言 |
| 探すファイル | `.env`、認証情報らしい名前の JSON、決まった言葉を含む文書 | `microsoftsystem64` | RustSec の助言 |
| 持ち出すもの | Telegram Desktop の `tdata` | `microsoftsystem64` | RustSec の助言 |

送り先、書き込まれる SSH の鍵、検体のハッシュ、crates.io の利用者の名前は、公開された情報の中に見つかりませんでした。

## 対策

- **`build.rs` を持つ見慣れない crate に気をつける**: ビルドスクリプトは、`cargo check` や IDE の解析でも動きます。新しい依存を足す前に、`build.rs` があるか、何をしているかを見ます。
- **名前だけで信用しない**: `microsoftsystem64` のように、大きな会社や OS の部品らしい名前でも、その会社のものとは限りません。crates.io のページで、持ち主とリポジトリを確かめます。
- **ダウンロード数だけで信用しない**: この 3 つは、数千のダウンロードがありました。数字が多いことは、安全の証拠になりません。
- **同じ持ち主のほかの crate も見る**: 悪性の crate が見つかったら、同じ持ち主の crate も疑います。この件では、悪性のコードの無い `safe-agent-rs` も削除されました。
- **SSH の `authorized_keys` をときどき見る**: 知らない鍵が足されていないかを確かめます。
- **`cargo audit` を使う**: この件の助言は、削除から 1〜2 日で `advisory-db` に入りました。ただし、それより前にビルドしていた場合は、助言が出ても過去の被害は防げません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 3 つの crate が crates.io から削除された | 自分で確認（RustSec の助言 3 件、crates.io の索引と API に無いこと） | 高 |
| 3 件の RustSec の番号と crate の対応 | 自分で確認（助言の本文、OSV） | 高 |
| 助言が追加された日、番号が割り当てられた日、ダウンロード数の直し | 自分で確認（`advisory-db` のコミット履歴と PR） | 高 |
| 3 つが同じ利用者のものだった | 他者の報告（RustSec の助言、crates.io チームのメンバーの PR での説明） | 高 |
| 公開日、版の数、ダウンロード数、依存する crate が無かったこと、通報者 | 他者の報告（RustSec の助言） | 高 |
| `pretty-changelog-logger` の `build.rs` がローダーとして動く | 他者の報告（RustSec の助言） | 高 |
| `microsoftsystem64` の裏口、ファイルと Telegram のセッションの持ち出し | 他者の報告（RustSec の助言） | 高 |
| `safe-agent-rs` は悪性のコードを直接は含んでいなかった | 他者の報告（RustSec の助言） | 高 |
| ダウンロード数が、ほかの新しく作られた悪性 crate（18〜155）より 1 桁以上多い | 自分で確認（`advisory-db` の 2025〜2026 年の悪性の助言のうち、数の書かれたものと比べた。乗っ取られた正規の crate は除く） | 高 |

## 分かっていないこと

- **ダウンロード数が実際の利用を示すかどうか**。3 つとも数千のダウンロードがありましたが、RustSec の助言は、実際に使われた形跡があるかどうかを書いていません（ほかの助言には「実際に使われた形跡は無い」と書くものがあります）。crates.io チームはこの件でブログ記事を出していません。同チームの方針では、実際に使われている場合は記事を出すとしているので、実際の利用は確認されなかった可能性がありますが、これは推測です。自動のミラーや検査のサービスがどれだけ含まれるかも、公表されていません。
- **ダウンロード数の直しの理由**。削除した時点の数に直したとき、`pretty-changelog-logger` は増え（2044 → 2239）、`microsoftsystem64` は減りました（6404 → 6346）。減った理由は書かれていません。
- **削除の正確な時刻**。2026-04-13 05:54 の時点では削除されておらず、2026-04-14 21:15 には削除済みと報告されています。その間のいつかは公表されていません。
- **通報の日時**。Socket と sitsh が通報したことは助言に書かれていますが、いつ通報したかは書かれていません。
- **検知した企業の解析**。Socket などによる、この 3 つの crate についての記事は見つかりませんでした。Socket の crate ごとのページは、自動の取得を拒んだため読めていません。
- **ペイロードの詳細**。`pretty-changelog-logger` が取ってくるもの、`microsoftsystem64` の送り先と書き込む鍵、動く時点は、公表されていません。
- **`safe-agent-rs` が装っていたライブラリ**。助言は「別の WebSocket のライブラリ」とだけ書いています。
- **同じ名前の別のもの**。npm には、2026 年 3 月に悪性と判定された同じ名前の `pretty-changelog-logger` があります（OSV の MAL-2026-1464）。また SafeDep は 2026-05-28 に、npm のパッケージが配る `MicrosoftSystem64` という名前の実行ファイル（遠隔操作と情報を盗む機能を持ち、Telegram のセッションや SSH の鍵も狙う）を報告しています。どちらも名前が同じで、狙うものも一部重なりますが、この 3 つの crate と同じものだと書いた出典は見つかりませんでした。仕様の決まりでは、名前や手口が似ているだけでは束ねないため、この記録には含めていません。
- **`advisory-db` の PR が参照した議論**。最初の PR は、crates.io チームの Zulip の、別の悪性 crate（`logprinter`、RUSTSEC-2026-0084）の名前がついた話題を参照していました。中身は読めておらず、`logprinter` とのつながりは公表されていないため、この記録には含めていません。
- **GitHub の助言と OpenSSF の番号**。2026-11-20 に、GitHub の助言データベースで 3 つの crate を引きましたが、GHSA の番号は見つかりませんでした。OSV でも、返ってきたのは RUSTSEC の番号だけで、`MAL-` で始まる番号はありませんでした。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2026-0100](https://rustsec.org/advisories/RUSTSEC-2026-0100.html)、[0101](https://rustsec.org/advisories/RUSTSEC-2026-0101.html)、[0102](https://rustsec.org/advisories/RUSTSEC-2026-0102.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) の PR [#2779](https://github.com/rustsec/advisory-db/pull/2779)（閉じられた。コメントで削除と持ち主の説明）、[#2792](https://github.com/rustsec/advisory-db/pull/2792)（助言の追加）、[#2793](https://github.com/rustsec/advisory-db/pull/2793)（番号の割り当て）
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `f0bc154a`、`29ac187a`、`30854be5`。ダウンロード数の直し: `527350b0`。通報者の追記: `63811335`。番号の割り当て: `8627f0cd`）
- crates.io チーム「[crates.io: an update to the malicious crate notification policy](https://blog.rust-lang.org/2026/02/13/crates.io-malicious-crate-update/)」（2026-02-13）

**ほかの報告（この 3 つの crate とのつながりは示されていない）**

- OSV「[MAL-2026-1464](https://osv.dev/vulnerability/MAL-2026-1464)」（npm の `pretty-changelog-logger`）
- SafeDep「[Inside MicrosoftSystem64: A Supply Chain RAT Exfiltrating to HuggingFace](https://safedep.io/microsoftsystem64-binary-payload-analysis/)」（2026-05-28）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）と API に 3 つの crate が無いこと。
- OSV（`api.osv.dev`）で 3 つの crate を引き、RUSTSEC の番号だけが返ること。GitHub の助言データベースで GHSA の番号が見つからないこと。
- `advisory-db` のコミット履歴と PR の記録。
- `advisory-db` の 2025〜2026 年の悪性の助言のうち、ダウンロード数が書かれたものとの比較（乗っ取られた正規の crate は除く）。

## 更新履歴

- 2026-11-20: 初版
