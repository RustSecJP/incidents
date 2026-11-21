# RSJP-C-2023-002: 利用者 http-tiny が公開した、build.rs でホストの情報を送る crate

| | |
|---|---|
| 番号 | `RSJP-C-2023-002` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 〜2023-11-06（UTC。公開日は不明） |
| 関係する crate | 2 つ（どちらも crates.io から削除済み） |
| 種類 | 名前の偽装（typosquat）と、ビルド時に動く `build.rs` |
| 盗むもの | ホストの情報（RustSec の助言による。詳しい中身は公表なし） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-002/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-002/iocs.csv) |

## 要約

2023 年 11 月、`http-tiny` という利用者が公開した 2 つの crate（`littest`、`tiny-server`）が、悪性のコードを理由に crates.io から削除されました。RustSec の助言によると、どちらも `build.rs` に、ホストの情報を外部へ送るペイロードを含んでいました。通報したのは Phylum（現在は Veracode）の研究者です。

この事件は、当時は公表されませんでした。RustSec の助言は約 2 年 4 か月後の 2026-03 に、crates.io チームのメンバーが当時のメモからまとめて記録したものです。そのとき、メモに具体的な動きが無いものは、おおまかな説明を書いたとされています。そのため、手口について分かることはごくわずかです。

この記録では、同じ利用者が公開した 2 つの crate を 1 つのキャンペーンとして束ねます。3 か月前の [`RSJP-C-2023-001`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-001/index.md) と、助言の文面と通報者は同じですが、公開した利用者が違い、同じ攻撃者だと示す情報も無いので、別の記録にしています。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`littest`、`tiny-server` のどちらかがある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(littest|tiny-server)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(littest|tiny-server)-[0-9]'
```

本物の `tiny_http` は、この事件の対象ではありません（`tiny-server` と利用者名 `http-tiny` が何を装ったかは公表されていません。名前から推測しただけです）。

RustSec の助言によると、悪性の crate の版の情報とダウンロードの記録は、もう残っていません。そのため、上の確かめ方は版ではなく crate の名前で調べます。OpenSSF の記録では、`littest` の悪性の版は 0.3.1 です。

見つかった場合は、`build.rs` はビルドしただけで動くので、その環境で使っていた鍵やトークンを入れ替えてください。送られた情報の中身は公表されていません。

## 関係する crate

| crate | 似た名前の本物（推測） | 悪性の版 | RustSec | GHSA | OpenSSF |
|---|---|---|---|---|---|
| `littest` | 不明 | 0.3.1（OpenSSF） | [RUSTSEC-2023-0104](https://rustsec.org/advisories/RUSTSEC-2023-0104.html) | GHSA-9cpx-g2hc-4j42 | MAL-2023-8429 |
| `tiny-server` | 不明（`tiny_http` か） | 不明 | [RUSTSEC-2023-0114](https://rustsec.org/advisories/RUSTSEC-2023-0114.html) | なし | なし |

- 公開日とダウンロード数は分かりません。RustSec の助言は「版の情報とダウンロードの記録は、もう残っていない」としています。
- `littest` の GHSA は、OpenSSF の記録（MAL-2023-8429）をもとに、2026-07-18 に GitHub の助言データベースに載ったものです。RustSec の助言とは結び付けられていません（2026-11-20、自分で確認）。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 〜2023-11-03 | `http-tiny` が `littest` と `tiny-server` を公開する（公開日は不明） | RustSec の助言 |
| 2023-11-03 21:05 | OpenSSF の Package Analysis が、`littest` 0.3.1 を「悪性の活動に結び付いたドメインと通信する」として悪性と判定する（MAL-2023-8429） | OpenSSF |
| 2023-11-06 | 2 つの助言の日付。Phylum の研究者の通報で crate が削除され、アカウントが停止されたと見られる（通報と削除の日時は公表なし） | RustSec の助言 |
| 2026-03-24〜25 | 外部の協力者が、OpenSSF の記録をもとに `littest` の助言を `advisory-db` に出す（PR #2740）。crates.io チームのメンバーが、2023 年ごろに公に記録されなかった約 20 件の削除のメモがあるとして、`littest` をこの PR から外すよう求める | 自分で確認 |
| 2026-03-26 | crates.io チームのメンバーが、2023 年ごろの削除をまとめて記録する（PR #2747、05:51 に取り込み）。06:26 に RUSTSEC-2023-0104 と 0114 が割り当てられる | 自分で確認 |
| 2026-07-18 | `littest` の GHSA-9cpx-g2hc-4j42 が公開される（OpenSSF の記録から） | 自分で確認 |
| 2026-11-20 | 2 つとも crates.io の索引に無いこと、`tiny_http` は残っていることを確認 | 自分で確認 |

事件（2023-11）から RustSec の助言（2026-03）まで、約 2 年 4 か月かかっています。助言の `date` の欄は 2023-11-06 ですが、`advisory-db` の履歴では、助言のファイルは 2026-03-25（取り込みは 03-26）に初めて追加されています。それまでの間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できませんでした。ただし、OpenSSF の記録は 2023-11-03 から OSV で引けました。

## 手口

この節は、RustSec の助言の短い説明によります。解析の記事は見つかりませんでした。RustSecJP は検体を入手しておらず、自分では確認していません。

- **名前の偽装**: RustSec の助言は「名前の偽装のまとまり」としています。何を装ったかは書かれていません。
- **動く時点**: `build.rs` なので、依存として取り込んでビルドしたときに動く（RustSec の助言）。
- **送るもの**: ホストの情報を攻撃者へ送る（RustSec の助言）。どの情報を、どこへ、どう送るかは公表されていません。
- **通信先**: OpenSSF は `littest` 0.3.1 が「悪性の活動に結び付いたドメインと通信する」としています。ドメイン名は公表されていません。

助言を書いた crates.io チームのメンバーは、PR に「詳しく調べ直してはいない。メモに具体的な動きが無いものは、おおまかな説明を書いた」と書いています。上の「`build.rs` でホストの情報を送る」という説明が、当時のメモに基づくものか、おおまかな説明かは分かりません。

## 2 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `littest` ↔ `tiny-server` | 2 件の RustSec の助言が、どちらも「悪性の利用者 `http-tiny` が公開した名前の偽装のまとまりの一部」と書いている | 他者の報告（RustSec の助言） | 高 |
| ほかに `http-tiny` の crate が無いか | `advisory-db` の全助言のうち、`http-tiny` に触れているのはこの 2 件だけ。2 件は同じ PR（#2747）で同時に追加された | 自分で確認 | 高 |

**`RSJP-C-2023-001` とは束ねません。** 理由は次のとおりです。

- 公開した利用者が違います（`amaperf` と `http-tiny`）。`amaperf` のアカウントは 2023-08-16 にロックされています。
- 送信先やコードが同じだという情報がありません。
- 助言の文面がほぼ同じなのは、同じ人が同じひな形で書いたためと見られ、事件どうしのつながりの根拠にはなりません。
- 通報者（Phylum の研究者）が同じなのは、同じ企業の検知の仕組みが見つけたことを示すだけです。
- 3 か月の間隔と「`build.rs` でホストの情報を送る」という手口の近さは、仕様 §5 では束ねる根拠になりません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2023-002/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crates.io の利用者 | `http-tiny` | 2 つとも | RustSec の助言 |
| crate の版 | `littest` 0.3.1 | `littest` | OpenSSF |

送信先のドメインと検体のハッシュは、公開された情報の中に見つかりませんでした。OpenSSF の記録にある SHA-256 の値は、判定の記録のものと見られ、crate のファイルのハッシュかどうかは確認できていないので、ここには載せていません。

## 対策

- **crate の名前を確かめる**: 有名な crate の名前の語を入れ替えたり、言い換えたりした名前（`tiny-server`、利用者名の `http-tiny`）は、本物の関連とは限りません。crates.io のページで、作者、リポジトリが実在するか、公開日を見ます。
- **`build.rs` は、ビルドしただけで動く**: 知らない crate を試すときは、鍵やトークンの無い、使い捨ての環境で行います。
- **ビルドのときの外への通信を絞る**: CI では、依存を取ってきた後のビルドの段階で外部へ通信できないようにすると、この種の送信を防げます。
- **助言データベースを 1 つだけ見ない**: この事件は、RustSec の助言が出るまで約 2 年 4 か月かかりましたが、OpenSSF の記録は削除の前後から OSV で引けました。`cargo audit` だけでなく、OSV を引く道具（`osv-scanner` など）も併せて使うと、見落としが減ります。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 2 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 2 件、crates.io の索引に無いこと） | 高 |
| 2 つを `http-tiny` が公開した | 他者の報告（RustSec の助言） | 高 |
| RustSec の助言が 2026-03 に後から追加され、番号が割り当てられた日 | 自分で確認（`advisory-db` のコミット履歴と PR） | 高 |
| `littest` の GHSA と `MAL-` の番号、`tiny-server` に RUSTSEC 以外の番号が無いこと | 自分で確認（OSV、GitHub の助言データベース） | 高 |
| `littest` 0.3.1 が悪性のドメインと通信する | 他者の報告（OpenSSF の自動判定） | 中 |
| `build.rs` でホストの情報を送る | 他者の報告（RustSec の助言。ただし書いた人が「おおまかな説明もある」としている） | 中 |
| Phylum の研究者が通報した | 他者の報告（RustSec の助言） | 高 |
| 2023-08 の `amaperf` の事件とつながる | 根拠なし | 低 |

## 分かっていないこと

- **公開日、削除の日時、版の一覧、ダウンロード数**。公表されていません。助言の日付 2023-11-06 が、通報、削除、それ以外のどの日かは書かれていません。
- **送る情報の中身と送信先**。解析の記事は見つかりませんでした。OpenSSF は「悪性の活動に結び付いたドメイン」とだけ書いています。
- **助言の説明がどこまで当時のメモに基づくか**。助言を書いた人が、おおまかな説明もあるとしています。
- **何を装ったか**。`littest` が何の偽装かは分かりません。`tiny-server` と利用者名 `http-tiny` は `tiny_http` に似ていますが、出典はありません。
- **`amaperf` の事件と同じ攻撃者か**。それを示す情報も、否定する情報もありません。
- **ほかの crate**。crates.io チームのメンバーは、2023 年ごろに公に記録されなかった削除が約 20 件あったとしています。PR #2747 で記録された 22 件のうち、`http-tiny` に触れているのは 2 件だけですが、記録されていない crate があるかどうかは分かりません。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2023-0104](https://rustsec.org/advisories/RUSTSEC-2023-0104.html)、[RUSTSEC-2023-0114](https://rustsec.org/advisories/RUSTSEC-2023-0114.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) の履歴（助言の追加: PR [#2747](https://github.com/rustsec/advisory-db/pull/2747)（コミット `97446b89`）。番号の割り当て: `d245bb75`。経緯の議論: PR [#2740](https://github.com/rustsec/advisory-db/pull/2740)）

**ほかのデータベース**

- OpenSSF malicious-packages: [MAL-2023-8429](https://osv.dev/vulnerability/MAL-2023-8429)（`littest` 0.3.1、2023-11-03）
- GitHub の助言データベース: [GHSA-9cpx-g2hc-4j42](https://github.com/advisories/GHSA-9cpx-g2hc-4j42)（2026-07-18）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 2 つの crate が無く、`tiny_http` はあること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、2 つの crate の番号を引いたこと。
- `advisory-db` の全助言のうち、`http-tiny` に触れているのがこの 2 件だけであること。

## 更新履歴

- 2026-11-20: 初版
