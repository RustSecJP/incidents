# RSJP-C-2025-004: 他社のプロジェクトにある名前で公開され、ホストの環境の情報を送ろうとした 5 つの crate

| | |
|---|---|
| 番号 | `RSJP-C-2025-004` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2025-01-30 〜 2026-03-30（UTC。公開から削除まで） |
| 関係する crate | 5 つ（すべて crates.io から削除済み） |
| 種類 | 他社の公開リポジトリや PyPI にある名前を使った crate |
| 盗むもの | ホストの環境の情報（RustSec の記載。中身の詳細は公表されていない） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-004/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-004/iocs.csv) |

## 要約

2025 年 1 月から 8 月にかけて、5 つの crate が crates.io に公開されました。名前はどれも、他社の公開リポジトリや PyPI にある名前と同じです（JFrog のサンプル、Cloudflare の例、Sophos の Python SDK、Apple の Pkl の文法、Lyft の statsrelay）。

RustSec の助言は 5 件とも、同じ文で「ホストの環境の情報を外部へ送ろうとしたキャンペーンの一部だった」と書いています。5 件は 2026-03-30 に、crates.io チームの一員が「本日削除した 5 つ」として 1 つのコミットでまとめて追加しました。公開から削除まで、7 か月から 14 か月ほど残っていたことになります。

このうち 2 つ（`tree-sitter-pkl` と `sophosfirewall-python`）は、同じ crates.io の利用者が公開していたことを、Web アーカイブで確認しました。`sophosfirewall-python` の説明文には「システムの情報を集めて Burp Collaborator に送るパッケージ」と書かれていました。

RustSec は、5 つとも実利用の形跡は無く、ほかの crate からの依存も無かったとしています。crates.io チームの記事は出ていません（2026-02 以降、実利用の無いものには記事を出さない方針です）。

## 自分が影響を受けたかの確かめ方

この 5 つは、**同じ名前の正規のものが crates.io の外にあります**。名前だけで判断せず、どこから取ってきたかを見てください。

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`jfrog_quotes`、`custom-req-on-workers`、`sophosfirewall-python`、`tree-sitter-pkl`、`statsrelay-protobuf` のいずれかがあり、その `source` が crates.io（`registry+https://github.com/rust-lang/crates.io-index`）になっている。
- `~/.cargo/registry/cache/index.crates.io-*/` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる（source の行も表示する）
grep -nE -A2 'name = "(jfrog_quotes|custom-req-on-workers|sophosfirewall-python|tree-sitter-pkl|statsrelay-protobuf)"' Cargo.lock

# 手元のキャッシュを調べる（ディレクトリ名が index.crates.io- で始まるものが crates.io）
find ~/.cargo/registry/cache -type f 2>/dev/null | grep -E '/(jfrog_quotes|custom-req-on-workers|sophosfirewall-python|tree-sitter-pkl|statsrelay-protobuf)-[0-9]'
```

次のものは、この事件の対象ではありません。

- JFrog の社内向けレジストリ（Artifactory など）から取った `jfrog_quotes`。
- `git` や `path` で参照した `apple/tree-sitter-pkl`、`lyft/statsrelay` の `statsrelay-protobuf`、`cloudflare/workers-rs` の例。
- PyPI の `sophosfirewall-python`（Python のパッケージで、Rust とは別物です）。

版で見分けたい場合、自分で確認できた悪性の版は次のとおりです。`sophosfirewall-python` は 10.1.1、11.1.1、12.1.1、20.1.0、20.10.0、20.10.10 の 6 版。`tree-sitter-pkl` は 100.1.0 の 1 版。ほかの 3 つの版は確認できていません。

見つかった場合は、その crate をビルドした、または動かした環境を調べてください。どの情報が送られたかは公表されていません。少なくとも、環境変数に入っていた鍵やトークンは、漏れたものとして入れ替えることをすすめます。

## 関係する crate

| crate | 役割 | 名前の元（自分で確認） | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|---|
| `jfrog_quotes` | 環境の情報を送る本体 | JFrog の公開サンプル `jfrog/sample-package-projects` にある社内向けライブラリ（社内レジストリへ 0.1.0 を公開する例） | 2025-01 に 1 版 | 実利用の形跡なし | [RUSTSEC-2025-0158](https://rustsec.org/advisories/RUSTSEC-2025-0158.html) | なし |
| `custom-req-on-workers` | 環境の情報を送る本体 | `cloudflare/workers-rs` の例 `examples/custom-req`（`release = false`） | 2025-01 に 1 版 | 実利用の形跡なし | [RUSTSEC-2025-0160](https://rustsec.org/advisories/RUSTSEC-2025-0160.html) | なし |
| `sophosfirewall-python` | 環境の情報を送る本体 | PyPI の Sophos Firewall 用 Python SDK（PyPI の最新版は 0.1.68） | 2025-02 に 6 版 | 実利用の形跡なし | [RUSTSEC-2025-0159](https://rustsec.org/advisories/RUSTSEC-2025-0159.html) | なし |
| `tree-sitter-pkl` | 環境の情報を送る本体 | `apple/tree-sitter-pkl` の `Cargo.toml`（版は 0.22.0） | 2025-03-10 に 1 版（100.1.0） | 実利用の形跡なし | [RUSTSEC-2025-0156](https://rustsec.org/advisories/RUSTSEC-2025-0156.html) | なし |
| `statsrelay-protobuf` | 環境の情報を送る本体 | `lyft/statsrelay` のワークスペースの一員（版は 3.1.0-dev） | 2025-08 に 1 版 | 実利用の形跡なし | [RUSTSEC-2025-0157](https://rustsec.org/advisories/RUSTSEC-2025-0157.html) | なし |

公開の月、版の数、実利用の形跡が無いことは、RustSec の助言の記載によります。版番号と日付は、Web アーカイブに残る lib.rs と docs.rs のページで確認しました。ダウンロード数の数字は公表されていません。GHSA の番号は、2026-11-20 時点で GitHub の助言データベースに見つかりませんでした。

悪性の版は、どれも正規のものより大きな版番号か、同じくらいの版番号です（`tree-sitter-pkl` は 0.22.0 に対して 100.1.0、`sophosfirewall-python` は 0.1.68 に対して 20.10.10）。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2025-01-30 | `jfrog_quotes` と `custom-req-on-workers` が公開される | RustSec の助言 |
| 2025-02-15〜16 | `sophosfirewall-python` が 6 版公開される。RustSec の date は 02-15、docs.rs の記録では 6 版とも 02-16 | RustSec の助言、自分で確認（docs.rs のアーカイブ） |
| 2025-03-10 | `tree-sitter-pkl` 100.1.0 が公開される | RustSec の助言、自分で確認（lib.rs のアーカイブ） |
| 2025-08 | `statsrelay-protobuf` が公開される。RustSec の date は 08-26 | RustSec の助言 |
| 2026-03-11 | lib.rs に `tree-sitter-pkl` がまだ載っている | 自分で確認（Web アーカイブ） |
| 2026-03-16 | docs.rs に `sophosfirewall-python` がまだ載っている | 自分で確認（Web アーカイブ） |
| 2026-03-30 21:30 | crates.io チームの一員が「本日削除した 5 つの crate」の助言を追加する（PR #2755） | 自分で確認（`advisory-db` の履歴） |
| 2026-03-30 21:40 | 5 つに RustSec の番号が割り当てられる（PR #2757） | 自分で確認（`advisory-db` の履歴） |
| 2026-11-20 | 5 つとも crates.io の索引と docs.rs に無いこと、公開した利用者のページも無いことを確認 | 自分で確認 |

RustSec の番号は 2025 年のものですが、助言が出たのは 2026-03-30 です。rustsec.org のページは「Reported」を公開の日（例: 2025-01-30）、「Issued」を 2026-03-30 と表示しています。それまでの 7〜14 か月の間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できませんでした。

## 手口

ペイロードの解析は、どこからも公開されていません。RustSecJP は検体を入手しておらず、中身は確認していません。分かっているのは、次のことだけです。

- **送ろうとしたもの**: RustSec は 5 つとも「ホストの環境の情報（environmental data）を外部へ送ろうとした」と書いています。環境変数なのか、ホスト名や利用者名なのか、細かい中身は書かれていません。
- **名前の選び方**: どれも、他社の公開リポジトリや PyPI にある名前と同じです。自分で確認したかぎり、正規のものはどれも crates.io には公開されていませんでした（`jfrog_quotes` は社内レジストリ向け、`custom-req-on-workers` は `release = false` の例、`sophosfirewall-python` は Python のパッケージ、`tree-sitter-pkl` は lib.rs の記録で crates.io の版が 100.1.0 だけ）。`statsrelay-protobuf` については、Lyft のものが crates.io に出たことがあるかは確認できていません。
- **大きな版番号**: `tree-sitter-pkl` は 100.1.0、`sophosfirewall-python` は 20.10.10 まで上げていました。
- **ビルド時に動く作りだった可能性**: lib.rs の記録では、`tree-sitter-pkl` は `build.rs` を持ち、ビルド時の依存として `reqwest`（`blocking`）、`sys-info`、`whoami` を使っていました。ホストの情報を集めて HTTP で送る作りと考えると、筋は通ります。ただし、コードは見ていません。
- **説明文**: `sophosfirewall-python` の説明文は「システムの情報を集めて Burp Collaborator に送るパッケージ」でした。Burp Collaborator は、外からの通信を受けて記録する、セキュリティ診断の道具です。`tree-sitter-pkl` には「テストのためだけのもの」という一文がありました。
- **ひな形のままのメタデータ**: `tree-sitter-pkl` と `sophosfirewall-python` のリポジトリの URL は、`github.com/yourusername/<crate 名>` という、ひな形のままの仮の URL でした。

## 5 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| 5 つ全体 | 5 件の助言が同じ文「ホストの環境の情報を外部へ送ろうとしたキャンペーンの一部」を持つ。`advisory-db` でこの言い回しを使うのはこの 5 件だけ。crates.io チームの一員が「本日削除した 5 つ」として 1 つのコミットで追加した | 自分で確認（`advisory-db` の検索、コミット `efec1b26`、PR #2755） | 中 |
| `tree-sitter-pkl` ↔ `sophosfirewall-python` | 同じ crates.io の利用者が所有していた | 自分で確認（lib.rs と docs.rs のアーカイブ） | 高 |
| `jfrog_quotes` ↔ 上の 2 つ | 作者が同じ利用者だったという記載 | 他者の情報（crate の情報を集めたサイトのページを要約した検索結果。ページは消えていて未確認） | 低 |

助言はどれも「a campaign」と書くだけで、「ほかの 4 つと同じキャンペーン」とは明記していません。PR #2755 にも、何をもって 1 つのキャンペーンとしたかの説明はありません。全体の確信度を「中」にとどめているのは、このためです。`custom-req-on-workers` と `statsrelay-protobuf` については、公開した利用者を確認できていません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-004/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| 悪性の版 | 10.1.1、11.1.1、12.1.1、20.1.0、20.10.0、20.10.10 | `sophosfirewall-python` | 自分で確認（docs.rs のアーカイブ） |
| 悪性の版 | 100.1.0 | `tree-sitter-pkl` | 自分で確認（lib.rs のアーカイブ） |
| 説明文 | 「A package that captures system information and sends it to a Burp Collaborator.」 | `sophosfirewall-python` | 自分で確認（docs.rs のアーカイブ） |
| ビルド時の依存 | `reqwest`（`blocking`）、`sys-info`、`whoami` | `tree-sitter-pkl` | 自分で確認（lib.rs のアーカイブ） |

送信先とハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **社内向けや未公開の crate の名前は、crates.io で取られることがある**: 自分たちの crate を crates.io に出していなくても、同じ名前の crate を他人が出すことはできます。依存には `registry = "..."`、`git = "..."`、`path = "..."` を必ず書き、名前と版だけで crates.io から取ってこないようにします。
- **社内の crate を誤って crates.io に出さない、取らせない**: `Cargo.toml` の `publish = ["社内レジストリ名"]` で公開先を絞ります。`Cargo.lock` の差分で、`source` が crates.io に変わっていないかを見ます。
- **大きすぎる版番号に気をつける**: 正規のものが 0.x なのに 100.1.0 や 20.10.10 があれば、疑う理由になります。
- **`build.rs` とビルド時の依存を見る**: ビルド時に HTTP の crate やホストの情報を集める crate を使っていれば、ビルドしただけで通信が起こりえます。
- **助言データベースだけに頼らない**: この 5 つは、助言が出るまで 7〜14 か月かかりました。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 5 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 5 件、crates.io の索引と docs.rs に無いこと） | 高 |
| 5 つが「ホストの環境の情報を送ろうとしたキャンペーンの一部」だった | 他者の報告（RustSec の助言） | 高 |
| 5 つが 1 つの同じキャンペーンである | 自分で確認した状況からの判断（同じ文、同じコミット） | 中 |
| 助言の追加と番号の割り当てが 2026-03-30 だった、削除も同じ日だった | 自分で確認（`advisory-db` のコミット履歴とその文面） | 高 |
| 公開の月、版の数、実利用の形跡が無いこと | 他者の報告（RustSec の助言） | 高 |
| `tree-sitter-pkl` と `sophosfirewall-python` の所有者が同じ | 自分で確認（Web アーカイブ） | 高 |
| `jfrog_quotes` の作者も同じ利用者 | 他者の情報（検索結果の要約のみ） | 低 |
| 5 つの名前が、他社の公開リポジトリや PyPI の名前と同じ | 自分で確認（各リポジトリと PyPI） | 高 |
| `tree-sitter-pkl` がビルド時に情報を集めて送る作りだった | 自分で確認した依存の一覧からの推測 | 低 |
| GHSA と MAL の番号が無い | 自分で確認（GitHub の助言データベース、OSV、OpenSSF のリポジトリ） | 高 |

## 分かっていないこと

- **ペイロードの中身と送信先**。解析は公開されていません。RustSec の「環境の情報」が何を指すかも書かれていません。
- **誰が通報し、いつ見つかったか**。PR #2755 には説明が無く、crates.io チームの記事もありません。
- **5 つが同じ攻撃者によるものか**。確認できたのは 2 つの所有者が同じことだけです。`jfrog_quotes` は検索結果の要約に頼っており、`custom-req-on-workers` と `statsrelay-protobuf` の所有者は分かっていません。
- **`sophosfirewall-python` の公開日**。RustSec の date は 2025-02-15、docs.rs の記録では 6 版とも 2025-02-16 です。時差による違いかもしれませんが、確認できていません。
- **ほかの 3 つの版番号**。`jfrog_quotes` は検索結果の要約に 0.1.1、`custom-req-on-workers` は 0.1.0 とありますが、元のページが消えていて確かめられません。
- **RustSecJP の読み（出典はありません）**: 5 つの名前は、どれも会社のプロジェクトにあって crates.io には出ていない名前です。これは、社内向けの名前を公開レジストリで先に取る「依存関係の混乱（dependency confusion）」を試したもののように見えます。`sophosfirewall-python` の説明文が Burp Collaborator を挙げていること、`tree-sitter-pkl` に「テストのため」とあることも、セキュリティ診断やバグ報奨金のための試し打ちとよく似ています。ただし、**どの出典もそうは書いていません**。また Cargo では、依存に `registry` を書いていれば crates.io からは取ってこないので、どこまで実際に効く手口なのかも分かりません。
- **ほかの助言とのつながり**。同じ時期の `rands`（RUSTSEC-2025-0155、`rand` の偽装で、macOS と Linux でビルド時にマルウェアを組み込む）と `replit_ruspty`（RUSTSEC-2025-0154、OpenSSF の MAL-2025-49350）も調べましたが、この 5 つとのつながりを示す記載は見つかりませんでした。助言の文面も、追加したコミットも別です（`rands` は 2026-03-26 の過去分の追加、`replit_ruspty` は 2026-03-25 の外部からの PR）。このため、この記録には含めていません。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2025-0156](https://rustsec.org/advisories/RUSTSEC-2025-0156.html)、[0157](https://rustsec.org/advisories/RUSTSEC-2025-0157.html)、[0158](https://rustsec.org/advisories/RUSTSEC-2025-0158.html)、[0159](https://rustsec.org/advisories/RUSTSEC-2025-0159.html)、[0160](https://rustsec.org/advisories/RUSTSEC-2025-0160.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `efec1b26`、[PR #2755](https://github.com/rustsec/advisory-db/pull/2755)。番号の割り当て: `4d2c416d`、[PR #2757](https://github.com/rustsec/advisory-db/pull/2757)）
- crates.io チーム「[crates.io: an update to the malicious crate notification policy](https://blog.rust-lang.org/2026/02/13/crates.io-malicious-crate-update/)」（2026-02-13。記事を出さない方針の説明）

**削除前のページの記録（Web アーカイブ）**

- lib.rs の `tree-sitter-pkl` のページ（[2026-03-11 の記録](https://web.archive.org/web/20260311184239/https://lib.rs/crates/tree-sitter-pkl)）
- docs.rs の `sophosfirewall-python` のページ（[2026-03-16 の記録](https://web.archive.org/web/20260316084446/https://docs.rs/crate/sophosfirewall-python/latest)）

**名前の元になった正規のプロジェクト**

- [jfrog/sample-package-projects](https://github.com/jfrog/sample-package-projects)（`rust/jfrog_quotes`）
- [cloudflare/workers-rs](https://github.com/cloudflare/workers-rs)（`examples/custom-req`）
- [PyPI の sophosfirewall-python](https://pypi.org/project/sophosfirewall-python/)
- [apple/tree-sitter-pkl](https://github.com/apple/tree-sitter-pkl)
- [lyft/statsrelay](https://github.com/lyft/statsrelay)（`statsrelay-protobuf`）

**その他**

- rust-digger の `jfrog_quotes` のページ（2026-11-20 時点で 404。検索エンジンの要約でのみ内容を確認）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）、crates.io の API、docs.rs に 5 つの crate が無いこと。公開した利用者のページも無いこと。
- OSV（`api.osv.dev`）では 5 つとも RUSTSEC の番号だけが返り、GitHub の助言データベースにも OpenSSF の `malicious-packages` にも、この 5 つの記録が無いこと。
- `advisory-db` の中で「environmental data」を含む助言がこの 5 件だけであること。

## 更新履歴

- 2026-11-20: 初版
