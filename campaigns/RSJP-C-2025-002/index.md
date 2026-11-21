# RSJP-C-2025-002: EVM の道具を装う evm-units と、それを起動時に呼ぶ uniswap-utils

| | |
|---|---|
| 番号 | `RSJP-C-2025-002` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2025-04 〜 2025-12-02（UTC） |
| 関係する crate | 2 つ（どちらも crates.io から削除済み） |
| 種類 | 依存に隠したペイロード（第 2 段を落として動かす） |
| 盗むもの | 暗号資産と見られる（第 2 段の中身は未公開） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-002/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-002/iocs.csv) |

## 要約

EVM（Ethereum の仮想マシン）の版を返す道具を装った crate `evm-units` と、Uniswap のプールのアドレスを扱う道具の crate `uniswap-utils` が、crates.io に公開されていました。`uniswap-utils` は `evm-units` に依存し、プログラムの起動時にその関数を呼んでいました。`evm-units` の関数は、OS ごとに外部から第 2 段のスクリプトを落として、画面に何も出さずに動かします。

2 つとも 2025 年 4 月に公開され、約 8 か月のあいだ crates.io にありました。ダウンロード数はそれぞれ 7,000 を超えています。2025-12-02 に Socket の研究者が crates.io チームに通報し、同じ日の 22:01 に 2 つとも削除されました。公開した利用者は無効化されています。

crates.io チームは、この 2 つに依存する crate は crates.io 上に無かったと報告しています。RustSec の助言は crate ごとに 1 件ずつ、計 2 件出ていますが、この記録ではそれらを 1 つのキャンペーンとして束ねます。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`evm-units` か `uniswap-utils` がある。
- `~/.cargo/registry/cache` に、これらの名前の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる
grep -nE 'name = "(evm-units|uniswap-utils)"' Cargo.lock

# 手元のキャッシュを調べる
ls ~/.cargo/registry/cache/*/ 2>/dev/null | grep -E '^(evm-units|uniswap-utils)-'

# 展開済みのソースに、Socket が公開した符号化された文字列があるかを調べる
grep -rl 'aHR0cHM6Ly9kb3dubG9hZC52aWRlb3RhbGtz' ~/.cargo/registry/src/ 2>/dev/null
```

同じ名前の正規の crate はありません。2 つとも、すべての版を悪性として扱ってください（どの版から悪性のコードが入ったかは公表されていません）。

見つかった場合は、その crate を使ったプログラムやテストを動かした環境を、**乗っ取られたものとして扱ってください**。第 2 段のスクリプトは攻撃者が自由に差し替えられるので、何をされたかは分かりません。暗号資産のウォレットの鍵、そのほかの認証情報は、別の安全な端末から入れ替えてください。Socket の解析によると、次のファイルが一時ディレクトリに作られます（名前がありふれているので、あっても無関係のことがあります）。

- Linux・macOS: `/tmp/init`（`$TMPDIR/init`）
- Windows: `%TEMP%\init.ps1`、`%TEMP%\init.vbs`

## 関係する crate

| crate | 役割 | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|
| `evm-units` | 第 2 段を落として動かす本体 | 2025-04 に 13 版 | 7,257 | [RUSTSEC-2025-0147](https://rustsec.org/advisories/RUSTSEC-2025-0147.html) | GHSA-6662-54xr-8423 |
| `uniswap-utils` | ふつうに働く道具を装い、`evm-units` に依存して起動時に呼ぶ | 2025-04 に 14 版 | 7,441 | [RUSTSEC-2025-0145](https://rustsec.org/advisories/RUSTSEC-2025-0145.html) | GHSA-x468-phr8-h3p3 |

公開の時期、版の数、ダウンロード数は、crates.io チームの報告によります。ダウンロード数のうち、自動のミラーや検査のサービスによるものがどれだけかは、報告されていません。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2025-04 | `evm-units` が 13 版、`uniswap-utils` が 14 版公開される | crates.io チーム |
| 2025-12-02 | Socket の研究者が crates.io チームに通報。Socket が解析を公開 | crates.io チーム、Socket |
| 2025-12-02 22:01 | 2 つの crate が削除される。公開した利用者は無効化される | crates.io チーム |
| 2025-12-03 | crates.io チームが報告を公開 | crates.io チーム |
| 2025-12-05 | crates.io チームのメンバーが、2 つの助言を `advisory-db` に提案する（PR #2501） | 自分で確認 |
| 2026-02-06 16:11 | PR #2501 が取り込まれ、助言のファイルが初めて追加される。4 分後に RustSec の番号が割り当てられる | 自分で確認 |
| 2026-02-06 | GitHub の助言が公開される（20:55、20:59） | 自分で確認 |
| 2026-03-17 | 2 つの助言に `malicious` の分類が付く | 自分で確認 |
| 2026-11-20 | 2 つとも crates.io の索引に無いことを確認 | 自分で確認 |

削除（12-02）から RustSec の助言が追加されるまでに、約 2 か月かかっています。助言の提案自体は削除の 3 日後に出ていましたが、取り込まれたのは 2026-02-06 です。PR の本文には「crate がすでに削除されているので、検査（linter）が失敗するはず」と書かれています。これが遅れの理由かどうかは確かめていません。この間、`cargo audit` などの助言データベースに頼る道具では、これらの crate を検出できなかったことになります。

助言の本文の日付（`date = "2025-12-03"`）は crates.io チームの報告の日で、ファイルが追加された日ではありません。OSV でも、RUSTSEC の番号の公開日は 2025-12-03 と表示されます。

## 手口

この節は、Socket が公開した解析によります。RustSecJP は検体を入手しておらず、自分では確認していません。Socket の解析が、どの版を調べたものかは書かれていません。

- **それらしい道具を装う**: `evm-units` の `get_evm_version()` は、実際に版の番号を返す。そのため、呼んだ側は異常に気づきにくい。
- **ペイロードを依存に分ける**: `uniswap-utils` は、それ以外はふつうに働く Uniswap 用の道具で、悪性の部分は `evm-units` を呼ぶ数行だけだった。
- **起動時に自動で動く**: `uniswap-utils` は `#[ctor::ctor]` を付けた関数の中で `evm_units::get_evm_version()` を呼んでいた。そのため、`uniswap-utils` を組み込んだプログラムは、起動しただけで悪性のコードが動く。`evm-units` を直接使う場合は、`get_evm_version()` を呼んだときに動く。Socket の解析には、ビルド時に動く仕組み（`build.rs`）は書かれていない。
- **通信先を隠す**: 第 2 段を落とす URL は base64 で符号化されていた。
- **OS ごとに第 2 段を落として動かす**: 一時ディレクトリにファイルを書き、画面にもログにも何も出さずに動かす。
  - Linux: `init` を書き、`nohup bash` で裏で動かす。
  - macOS: `init` を書き、`nohup osascript` で裏で動かす（AppleScript）。
  - Windows: `init.ps1` を書き、PowerShell を窓なしで、実行ポリシーを無視して動かす。Qihoo 360 のウイルス対策（`qhsafetray.exe`）が動いていないときは、PowerShell を呼ぶ VBScript（`init.vbs`）も作る。
- **証明書を確かめない**: 通信で `danger_accept_invalid_certs(true)` を使い、自己署名の証明書でも受け入れる。
- **狙い**: Socket は、名前と中身（EVM、Uniswap）と Qihoo 360 への対応から、暗号資産を盗むことが目的だった可能性が高く、アジアの利用者を狙ったと見ています。第 2 段の中身は公開されておらず、これは推定です。

## 2 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `uniswap-utils` → `evm-units` | 依存関係。起動時に `evm-units` の関数を呼ぶ | 他者の報告（crates.io チーム、RustSec の助言、Socket のコード解析） | 高 |
| 公開した利用者 | crates.io チームは 2 つの crate について「その利用者」を 1 人だけ挙げて無効化したと書いている。Socket は「同じ作者」と書いている | 他者の報告（crates.io チーム、Socket） | 高 |

3 つの出典（crates.io チーム、RustSec、Socket）が、別々に同じことを書いています。RustSecJP は検体を持っていないので、依存関係を自分で確かめてはいません。

なお、`advisory-db` では、この 2 件の番号が `finch-rust` と `sha-rust`（[RSJP-C-2025-001](../RSJP-C-2025-001/)）と同じコミットで割り当てられています。また、どちらも Socket が見つけています。しかし、これは助言の手続きと通報者が同じだというだけで、攻撃のつながりを示すものではありません。この記録では、2 つのキャンペーンを関連づけていません。

## 痕跡情報

通信先は無害化して書いています。一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2025-002/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crates.io の利用者 | `ablerust` | 2 つとも | crates.io チーム、Socket |
| 第 2 段の取得先 | `hxxps://download[.]videotalks[.]xyz/gui/6dad3/id=5244544112427978&secret=NByUZrutDGoS` | `evm-units` | Socket |
| 第 2 段の SHA-256 | `6d09e646856aa96fd118f9e5725dc8565deac4b441a96a011e528c0732db9c51` | `evm-units` が落とすもの | Socket（VirusTotal での判定として） |
| 符号化された文字列 | 取得先を base64 にしたもの（`aHR0cHM6Ly9kb3dubG9hZC52aWRlb3RhbGtz` で始まる。全体は `iocs.csv`） | `evm-units` | Socket |
| 作られるファイル | `init`（Linux・macOS）、`init.ps1`、`init.vbs`（Windows）。どれも一時ディレクトリ | `evm-units` | Socket |
| 調べるプロセス | `qhsafetray.exe` | `evm-units`（Windows） | Socket |

`.crate` ファイル自体のハッシュは、公開された情報の中に見つかりませんでした。第 2 段のハッシュが、どの OS 向けのものかも書かれていません。

## 対策

- **依存の依存も見る**: 悪性のコードは、使う側の `uniswap-utils` ではなく、その依存の `evm-units` にありました。`cargo tree` で、見慣れない名前が増えていないかを確かめます。
- **起動時に動くコードに気をつける**: `#[ctor::ctor]` のような仕組みを使うと、関数を呼ばなくても、プログラムを起動しただけでコードが動きます。依存に `ctor` が入っていたら、どの crate が何のために使っているかを見ます。
- **長く公開されていた crate でも安心しない**: この 2 つは約 8 か月公開され、7,000 回を超えてダウンロードされていました。ダウンロード数や公開からの日数は、安全の証拠になりません。リポジトリが実在するか、作者に実績があるかも見ます。
- **暗号資産の鍵を開発環境に置かない**: 開発に使う端末やテスト環境に、本番のウォレットの鍵を置かないようにします。
- **助言データベースだけに頼らない**: RustSec の助言が出るまでに約 2 か月かかりました。`cargo audit` は、番号が付くまではこれらの crate を知らせてくれません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 2 つの crate が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 2 件、crates.io の索引に無いこと） | 高 |
| 2 件の RustSec の番号と GHSA の番号の対応 | 自分で確認（助言の本文、OSV、GitHub の助言データベース） | 高 |
| 助言の提案、追加、番号の割り当ての日 | 自分で確認（`advisory-db` の PR とコミット履歴） | 高 |
| 公開の時期、版の数、ダウンロード数、削除の時刻、通報者 | 他者の報告（crates.io チーム） | 高 |
| `uniswap-utils` が `evm-units` に依存し、起動時に呼ぶ | 他者の報告（crates.io チーム、RustSec の助言、Socket） | 高 |
| 2 つを同じ利用者が公開した | 他者の報告（crates.io チーム、Socket） | 高 |
| 第 2 段を落として動かす手口、通信先、ファイル名 | 他者の報告（Socket） | 中 |
| 目的が暗号資産を盗むことだった | 他者の推定（crates.io チーム、Socket。どちらも「可能性が高い」という書き方） | 低 |

## 分かっていないこと

- **第 2 段が何をするか**。Socket は取得先とハッシュを公開していますが、中身の解析は公開されていません。暗号資産を盗むという見方は、名前と標的から推した推定です。
- **どの版から悪性だったか**。2 つとも 2025 年 4 月に 13〜14 版が公開されていますが、悪性のコードがどの版に入っていたかは公表されていません。この記録では、すべての版を悪性として扱っています。
- **最初の悪性版の正確な公開日**。crates.io チームは「2025 年 4 月」とだけ書いています。
- **通報から削除までの時間**。Socket は、通報して「数分のうちに」削除されたと書いています。crates.io チームは通報の日（12-02）と削除の時刻（22:01）だけを書いていて、通報の時刻は分かりません。
- **実際の被害**。ダウンロード数は 7,000 を超えますが、そのうちどれだけが実際の利用かは報告されていません。crates.io 上で依存する crate が無かったことだけが分かっています。crates.io の外（非公開のプロジェクト）での利用は分かりません。
- **OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV で 2 つの crate を調べたところ、返ってきたのは RUSTSEC と GHSA の番号だけで、`MAL-` で始まる番号はありませんでした。

## 出典

**一次情報**

- crates.io チーム「[crates.io: Malicious crates evm-units and uniswap-utils](https://blog.rust-lang.org/2025/12/03/crates.io-malicious-crates-evm-units-and-uniswap-utils/)」（2025-12-03）
- RustSec の助言: [RUSTSEC-2025-0145](https://rustsec.org/advisories/RUSTSEC-2025-0145.html)、[0147](https://rustsec.org/advisories/RUSTSEC-2025-0147.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) の PR [#2501](https://github.com/rustsec/advisory-db/pull/2501) とコミット履歴（助言の追加: `ec3e0d83`。番号の割り当て: `5ebcfc04`。分類の追加: `99e9de91`）

**検知した企業の解析**

- Socket「[Malicious Rust Crate evm-units Serves Cross-Platform Payloads for Silent Execution](https://socket.dev/blog/malicious-rust-crate-evm-units-serves-cross-platform-payloads)」（2025-12-02）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）と API に 2 つの crate が無いこと。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、2 つの crate の番号の対応と公開日を引いたこと。
- `advisory-db` の PR #2501 の作成日と取り込み日、各コミットの日時。

## 更新履歴

- 2026-11-20: 初版
