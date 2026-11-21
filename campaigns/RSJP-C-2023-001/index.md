# RSJP-C-2023-001: 有名な crate を装い、build.rs でホストの情報を Telegram へ送る crate

| | |
|---|---|
| 番号 | `RSJP-C-2023-001` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2023-08-14 〜 2023-08-18（UTC） |
| 関係する crate | 8 つ（すべて crates.io から削除済み）。crates.io チームの報告では 9 つ |
| 種類 | 名前の偽装（typosquat）と、ビルド時に動く `build.rs` |
| 盗むもの | ホストの情報（IP アドレス、国と地域、OS の種類） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-001/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-001/iocs.csv) |

## 要約

2023 年 8 月、`amaperf` という利用者が、`lazy_static`、`cfg-if`、`env_logger`、`once_cell`、`serde`、`postgres` などの有名な crate に名前を似せた crate を、crates.io に公開しました。

最初の版は中身がほぼ空でした。2 日後の 2023-08-16 に出た版で `build.rs` が足され、ビルドのときに、ホストの IP アドレス、国と地域、OS の種類を Telegram のチャンネルへ送るようになりました。

同じ日に Phylum（現在は Veracode）の研究者が通報し、crate はすぐに取り下げ（yank）られ、利用者のアカウントはロックされました。2023-08-18 には、crates.io のファイル置き場からも完全に消されています。crates.io チームは、実際の利用者がダウンロードした形跡は無いと報告しています。

RustSec の助言は、事件から約 2 年半後の 2026 年 3 月に、後から記録する形で crate ごとに 1 件ずつ、計 8 件出ました。この記録では、それらを 1 つのキャンペーンとして束ねます。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`lazystatic`、`if-cfg`、`envlogger`、`xrvrv`、`oncecell`、`serd`、`postgress`、`postgresderive` のいずれかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(lazystatic|if-cfg|envlogger|xrvrv|oncecell|serd|postgress|postgresderive)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(lazystatic|if-cfg|envlogger|xrvrv|oncecell|serd|postgress|postgresderive)-[0-9]'

# ビルドの出力に、ペイロードが作る目印のファイルが残っていないか調べる（Phylum の解析による）
find . -path '*/target/*/build/*/out/mutex' 2>/dev/null
```

本物の `lazy_static`、`cfg-if`、`env_logger`、`once_cell`、`serde`、`postgres`、`postgres-derive` は、この事件の対象ではありません。名前の区切り（`_` や `-`）の有無と、綴りを確かめてください。

RustSec の助言によると、悪性の crate の版の情報とダウンロードの記録は、もう残っていません。そのため、上の確かめ方は版ではなく crate の名前で調べます。これらの crate を取得できたのは、2023-08-14 から、取り下げられた 08-16 までの短い間だけです。

見つかった場合、公開された解析によると、送られたのはホストの IP アドレスと位置の情報、OS の種類です。ファイルや認証情報を盗むコードは報告されていません。ただし、どの版を動かしたかによって中身が違う可能性があり（[分かっていないこと](#分かっていないこと)を参照）、念のため、その環境で使っていた鍵やトークンの入れ替えも考えてください。

## 関係する crate

| crate | 似た名前の本物（推測） | Phylum が記録した版（公開時刻） | RustSec | GHSA |
|---|---|---|---|---|
| `postgress` | `postgres` | 0.1.0（08-14 15:44、ほぼ空）、0.1.1（08-15 04:40、空）、0.19.6（08-16 15:01、`build.rs` 入り） | [RUSTSEC-2023-0103](https://rustsec.org/advisories/RUSTSEC-2023-0103.html) | なし |
| `if-cfg` | `cfg-if` | 0.1.0（08-15 11:05、空）、0.1.1（08-16 15:04、`build.rs` 入り） | [RUSTSEC-2023-0098](https://rustsec.org/advisories/RUSTSEC-2023-0098.html) | なし |
| `xrvrv` | 不明 | 0.1.0（08-15 18:08、空）、0.1.1（08-16 14:48、`build.rs` 入り） | [RUSTSEC-2023-0100](https://rustsec.org/advisories/RUSTSEC-2023-0100.html) | なし |
| `serd` | `serde` | 0.4.5（08-16 15:26、`build.rs` 入り） | [RUSTSEC-2023-0102](https://rustsec.org/advisories/RUSTSEC-2023-0102.html) | なし |
| `oncecell` | `once_cell` | 0.1.0（08-16 15:29、`build.rs` 入り） | [RUSTSEC-2023-0101](https://rustsec.org/advisories/RUSTSEC-2023-0101.html) | なし |
| `lazystatic` | `lazy_static` | 0.1.0（08-16 16:04、`build.rs` 入り） | [RUSTSEC-2023-0097](https://rustsec.org/advisories/RUSTSEC-2023-0097.html) | なし |
| `envlogger` | `env_logger` | 0.10.0（08-16 16:07、`build.rs` 入り） | [RUSTSEC-2023-0099](https://rustsec.org/advisories/RUSTSEC-2023-0099.html) | なし |
| `postgresderive` | `postgres-derive` | 記録なし（Phylum の記事に出てこない） | [RUSTSEC-2023-0110](https://rustsec.org/advisories/RUSTSEC-2023-0110.html) | なし |

- 版と時刻は Phylum の記事の表によります。記事は時刻の時間帯を書いていません。
- 「似た名前の本物」は、名前から RustSecJP が推測したものです。どの crate を装ったかは、どの出典にも 1 つずつは書かれていません。`xrvrv` は、何を装ったのか分かりません。
- ダウンロード数は分かりません。RustSec の助言は「版の情報とダウンロードの記録は、もう残っていない」としています。crates.io チームは、ダウンロードは自動の検査とミラーのものだけだったとしています。
- 8 つのどれにも、GHSA と OpenSSF（`MAL-`）の番号は見つかりませんでした（2026-11-20、自分で確認）。

## 時系列

日付は UTC です。2023-08-14〜16 の時刻は Phylum の記事の表によるもので、時間帯は書かれていません。

| 日付 | できごと | 出典 |
|---|---|---|
| 2023-08-14 15:44 | `amaperf` が `postgress` 0.1.0 を公開する。中身はほぼ空 | Phylum |
| 2023-08-15 | `postgress` 0.1.1、`if-cfg` 0.1.0、`xrvrv` 0.1.0 が公開される。中身は空の `lib.rs` | Phylum |
| 2023-08-16 14:48〜16:07 | `build.rs` を足した 7 つの版が公開される | Phylum |
| 2023-08-16 | Phylum が Rust Foundation に通報し、crates.io チームに伝えられる。crate はすぐに取り下げられ、アカウントはロックされる | Phylum、crates.io チーム |
| 2023-08-18 17:22 | crates.io チームが、crate のファイルを `static.crates.io` から完全に消す | crates.io チーム |
| 2023-08-24 | Phylum が解析を公開 | Phylum |
| 2023-09-01 | crates.io チームが事後報告を公開 | crates.io チーム |
| 2026-03-19 | 外部の協力者が、7 つの助言を後から記録する形で `advisory-db` に出し（PR #2727）、20:39 に取り込まれる。同じ日に RUSTSEC-2023-0097〜0103 が割り当てられる | 自分で確認 |
| 2026-03-26 | crates.io チームのメンバーが、2023 年ごろの記録されていなかった削除をまとめて記録し（PR #2747、05:51 に取り込み）、その中で `postgresderive` に RUSTSEC-2023-0110 が割り当てられる | 自分で確認 |
| 2026-11-20 | 8 つとも crates.io の索引に無いこと、本物の 7 つは残っていることを確認 | 自分で確認 |

削除（2023-08）から RustSec の助言（2026-03）まで、約 2 年 7 か月かかっています。助言の `date` の欄は 2023-08-16（`postgresderive` だけ 2023-08-18）ですが、これは事件の日付です。`advisory-db` の履歴では、助言のファイルは 2026-03 に初めて追加されています。それまでの間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できませんでした。ただし、crate はすでに消されていたので、新しく取得される心配はありませんでした。

## 手口

この節は、Phylum が公開した解析と、crates.io チームの事後報告によります。RustSecJP は検体を入手しておらず、自分では確認していません。Phylum がコードを示しているのは、`build.rs` 入りの版についてです（どの crate のものかは書かれていません）。

- **名前の偽装**: 有名な crate の区切り（`_`、`-`）を抜く（`lazystatic`、`oncecell`、`envlogger`）、語順を入れ替える（`if-cfg`）、1 文字足す・抜く（`postgress`、`serd`）。
- **段階を踏む**: 最初はほぼ空の版を出し（`postgress` 0.1.0 の `main.rs` は意味の無い文字列だけ）、次に空の `lib.rs` の版、2 日後に `build.rs` を足した版を出した。Phylum は、ほかの言語のパッケージ置き場でもよく見る「準備の段階」の型だとしています。
- **動く時点**: `build.rs` なので、依存として取り込んで `cargo build` などをしたときに動く。ライブラリの関数を呼ぶ必要はありません。
- **一度だけ動く**: ビルドの出力先（`OUT_DIR`）に `mutex` という名前のファイルがあれば何もせず終わる。無ければ作ってから続ける。
- **集める情報**: 正規の IP 位置情報サービス（`ip-api.com`）に問い合わせて、IP アドレス、国の符号、地域名を得る。OS の種類（Windows、Linux、MacOS）を足す。
- **送り方**: `build.rs` に書かれた Telegram のボットの鍵とチャンネルの ID を使い、Telegram の API でチャンネルへ送る。Phylum は、送信が実際に届いたかどうかは分からなかったとしています。
- **別の版**: crates.io チームによると、1 つの crate の 1 つの版だけは、PuTTY（Windows 用の SSH クライアント）のインストーラーのコピーを含み、`build.rs` が Telegram へ送る代わりに PuTTY を起動していました。crates.io チームは、`build.rs` で何ができるかを試した、早い段階のものと見ています。どの crate の、どの版かは書かれていません。

ファイルや認証情報を盗むコードは、どちらの出典にも書かれていません。Phylum は、これは大きな攻撃の準備の段階で、成功を確かめた後に、より悪いことをする版が出たかもしれないとしています。

## 8 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| 8 つすべて | 8 件の RustSec の助言が、どれも「悪性の利用者 `amaperf` が公開した名前の偽装のまとまりの一部」と書いている | 他者の報告（RustSec の助言） | 高 |
| 7 つ（`postgresderive` 以外） | Phylum が、同じ利用者 `amaperf` が公開したものとして、crate 名と版を表で示している。`build.rs` 入りの版は同じペイロードだとしている | 他者の報告（Phylum） | 中 |
| 事件の全体 | crates.io チームの事後報告が、Phylum の研究者からの 08-16 の通報、9 つの crate、Telegram への送信を書き、Phylum の記事を「この事件についての Phylum の記事」として結んでいる | 他者の報告（crates.io チーム） | 高 |
| ほかに `amaperf` の crate が無いか | `advisory-db` の全助言のうち、`amaperf` に触れているのはこの 8 件だけ | 自分で確認 | 高 |

`postgresderive` は、Phylum の記事には出てきません。含める根拠は、RustSec の助言の「`amaperf` が公開した」という記述だけです。この助言は、crates.io チームのメンバーが 2023 年当時のメモから書いたものです（[分かっていないこと](#分かっていないこと)を参照）。

事後報告は crate の名前も利用者の名前も書いていません。ただし、通報者、通報の日、Telegram への送信が Phylum の記事と一致し、Phylum の記事へのリンクもあるので、同じ事件の報告と判断しています。

## 痕跡情報

通信先は無害化して書いています。一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-001/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crates.io の利用者 | `amaperf` | 8 つすべて | RustSec の助言、Phylum |
| Telegram のボットの番号 | `6365984299` | `build.rs` 入りの版 | Phylum |
| Telegram のチャンネルの ID | `-1001901628644` | `build.rs` 入りの版 | Phylum |
| 送信先 | `hxxps://api[.]telegram[.]org/bot6365984299:<鍵>/sendMessage` | `build.rs` 入りの版 | Phylum |
| ビルドの出力に残るファイル | `OUT_DIR` の下の `mutex` | `build.rs` 入りの版 | Phylum |

- Phylum の記事には、ボットの鍵が全部書かれています。この記録では、ボットの番号（鍵の前半）だけを載せます。
- `api.telegram.org` と `ip-api.com` は正規のサービスです。通信の記録にあっても、それだけでは痕跡になりません。見るべきなのは、上のボットの番号への通信です。
- `mutex` という名前のファイルは一般的なので、ほかの crate のビルドでも作られることがあります。上の crate の名前と合わせて見てください。

検体のハッシュは、公開された情報の中に見つかりませんでした。crates.io チームは、今後の分析のために検体を保管しているとしています。

## 対策

- **crate の名前を確かめる**: 区切りを抜いた名前（`lazystatic`、`oncecell`）や、語順を入れ替えた名前（`if-cfg`）は、本物の別名ではありません。依存を足すときは、名前を手で打たずに、crates.io のページやドキュメントからコピーします。
- **`build.rs` は、ビルドしただけで動く**: 関数を呼ばなくても、依存に入れて `cargo build` や `cargo check` をすれば動きます。知らない crate を試すときは、鍵やトークンの無い、使い捨ての環境で行います。
- **公開されたばかりの crate をすぐに使わない**: この事件の crate は、最初の公開から削除までが 2 日でした。
- **ビルドのときの外への通信を絞る**: CI では、依存を取ってきた後のビルドの段階で外部へ通信できないようにすると、この種の送信を防げます。
- **助言データベースだけに頼らない**: この事件の RustSec の助言は、約 2 年 7 か月後に出ました。古い事件ほど、助言が無いことは安全の証になりません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 8 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 8 件、crates.io の索引に無いこと） | 高 |
| 8 つを `amaperf` が公開した | 他者の報告（RustSec の助言） | 高 |
| RustSec の助言が 2026-03 に後から追加され、番号が割り当てられた日 | 自分で確認（`advisory-db` のコミット履歴と PR） | 高 |
| 8 つに GHSA と `MAL-` の番号が無い | 自分で確認（OSV、GitHub の助言データベース） | 高 |
| 通報の日、取り下げ、アカウントのロック、08-18 17:22 の完全な削除、実利用の形跡が無いこと | 他者の報告（crates.io チーム） | 高 |
| `build.rs` がホストの情報を Telegram へ送る | 他者の報告（crates.io チーム、RustSec の助言、Phylum） | 高 |
| 版ごとの公開時刻、段階を踏んだ公開、ペイロードの細部（`mutex`、`ip-api.com`、ボットとチャンネル） | 他者の報告（Phylum） | 中 |
| PuTTY を起動する版があった | 他者の報告（crates.io チーム） | 高 |
| 装った本物の crate の対応 | 名前からの推測 | 低 |

## 分かっていないこと

- **9 つ目の crate**。crates.io チームの事後報告は「9 つの crate」としています。RustSec の助言は 8 件、Phylum の記事の表は 7 つです。残りの 1 つの名前は公表されていません。
- **`postgresderive` の中身と公開日**。Phylum の記事には出てきません。助言は、crates.io チームのメンバーが 2026-03 に、2023 年当時のメモをもとにまとめて書いたものです。その PR には「詳しく調べ直してはいない。メモに具体的な動きが無いものは、おおまかな説明を書いた」とあります。`postgresderive` の「`build.rs` でホストの情報を送る」という説明が、メモに基づくものか、おおまかな説明かは分かりません。助言の日付（2023-08-18）は、完全な削除の日と同じです。
- **PuTTY を起動した版がどれか**。crates.io チームは「1 つの crate の 1 つの版」としか書いていません。Phylum の記事は、`postgress` 0.1.0 を「意味の無い文字列だけの `main.rs`」としていて、PuTTY には触れていません。
- **ダウンロード数と版の一覧**。RustSec の助言は、もう記録が残っていないとしています。版は Phylum の表に出てくるものしか分かりません。
- **Phylum の表の時刻の時間帯**。記事に書かれていません。
- **送信が実際に届いたか**。Phylum は確かめられなかったとしています。crates.io チームは、実際の利用者のダウンロードの形跡は無いとしています。

## 出典

**一次情報**

- crates.io チーム「[crates.io Postmortem: User Uploaded Malware](https://blog.rust-lang.org/inside-rust/2023/09/01/crates-io-malware-postmortem/)」（Inside Rust Blog、2023-09-01）
- RustSec の助言: [RUSTSEC-2023-0097](https://rustsec.org/advisories/RUSTSEC-2023-0097.html)、[0098](https://rustsec.org/advisories/RUSTSEC-2023-0098.html)、[0099](https://rustsec.org/advisories/RUSTSEC-2023-0099.html)、[0100](https://rustsec.org/advisories/RUSTSEC-2023-0100.html)、[0101](https://rustsec.org/advisories/RUSTSEC-2023-0101.html)、[0102](https://rustsec.org/advisories/RUSTSEC-2023-0102.html)、[0103](https://rustsec.org/advisories/RUSTSEC-2023-0103.html)、[0110](https://rustsec.org/advisories/RUSTSEC-2023-0110.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) の履歴（助言の追加: PR [#2727](https://github.com/rustsec/advisory-db/pull/2727)（コミット `100f08b5`、`90c32bca`）、PR [#2747](https://github.com/rustsec/advisory-db/pull/2747)（コミット `97446b89`）。番号の割り当て: `4ca56302`、`d245bb75`）

**検知した企業の解析**

- Phylum「Rust Malware Staged on Crates.io」（2023-08-24）。元の URL（`https://blog.phylum.io/rust-malware-staged-on-crates-io/`）は、Veracode による買収の後、[Veracode のブログ](https://www.veracode.com/blog/rust-malware-staged-on-crates-io/)に移されています。2023-08-24 の Internet Archive の保存版と、Veracode の現在の版で、crate の表と送信先の値が同じことを確かめました。

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 8 つの crate が無く、`lazy_static`、`cfg-if`、`env_logger`、`once_cell`、`serde`、`postgres`、`postgres-derive` はあること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、8 つの crate に RUSTSEC 以外の番号が無いこと。
- `advisory-db` の全助言のうち、`amaperf` に触れているのがこの 8 件だけであること。

## 更新履歴

- 2026-11-20: 初版
