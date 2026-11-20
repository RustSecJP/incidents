# RSJP-C-2026-004: arrayref など 3 つの正規 crate の乗っ取りと、proc-macro2 を装う proc-macro1

| | |
|---|---|
| 番号 | `RSJP-C-2026-004` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2026-08-18 〜 2026-08-20（UTC）。乗っ取られた版が公開されていたのは 08-20 の 07:15〜09:25 |
| 関係する crate | 9 つ（正規の crate 3 つは悪性の版だけ削除。残り 6 つは crate ごと削除） |
| 種類 | 正規の crate の乗っ取り（公開アカウントの侵害）と、名前を偽装した依存に隠したペイロード |
| 動く時点 | ビルド時（`build.rs`） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-004/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-004/iocs.csv) |

## 要約

2026-08-20、広く使われている正規の crate `arrayref`、`internment`、`append-only-vec` の新しい版が、本来の所有者のアカウントから公開されました。3 つとも、中身はほぼそのままで、`proc-macro1` という crate への依存が 1 行足されていました。`proc-macro1` は、有名な `proc-macro2` に名前を似せた crate です。その `build.rs` が、ビルドのときに外部から実行ファイルを取ってきて動かしました。

Rust のセキュリティ対応チームは、所有者本人が悪意をもって公開したとは考えておらず、所有者のコンピューターか認証情報が侵害されたと見ています。悪性の版は 86〜107 分で削除され、攻撃者が取り消し（yank）していた古い版は元に戻されました。同じ日に、`proc-macro1` と同じ `build.rs` を持つ `proc-macro-en` と、関係する 4 つの crate（`aovine`、`arone`、`aronenao`、`tinymember`）も削除されました。

RustSec の助言は 8 件（`aovine` には無し）出ていますが、この記録ではそれらを 1 つのキャンペーンとして束ねます。`arrayref` の悪性の版は、削除までに 2,285 回ダウンロードされました。

## 自分が影響を受けたかの確かめ方

**悪性なのは、次の版だけです。**

| crate | 悪性の版 | 問題ない版 |
|---|---|---|
| `arrayref` | `0.3.10` | `0.3.9` 以前のすべて |
| `internment` | `0.8.7` | `0.8.6` 以前のすべて |
| `append-only-vec` | 2026-08-20 に公開された `0.1.9` | `0.1.8` 以前、`0.1.10`、2026-10-18 に作者が出し直した `0.1.9`（下の注意を参照） |
| `proc-macro1`、`proc-macro-en`、`aovine`、`arone`、`aronenao`、`tinymember` | すべての版 | なし |

本物の `proc-macro2` は、この事件の対象ではありません。

`arrayref` の `0.3.5`〜`0.3.9` は、攻撃者によって取り消し（yank）されていましたが、crates.io チームが元に戻しました。2026-11-20 の時点で、3 つの crate に取り消された版はありません（自分で確認）。

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、上の表の悪性の版がある。
- `~/.cargo/registry/cache` に、悪性の版の `.crate` ファイルが残っている。

```shell
# プロジェクトのロックファイルを調べる（crate 名と版を並べて表示し、悪性の組み合わせだけを出す）
awk '/^name = /{n=$3} /^version = /{print n, $3}' Cargo.lock \
  | grep -E '^"(arrayref" "0\.3\.10|internment" "0\.8\.7|append-only-vec" "0\.1\.9|proc-macro1|proc-macro-en|aovine|arone|aronenao|tinymember)"'

# 手元のキャッシュを調べる（Rust のセキュリティ対応チームが示したもの）
find ~/.cargo/registry/cache -type f \( \
  -name 'append-only-vec-0.1.9.crate' -o \
  -name 'arrayref-0.3.10.crate' -o \
  -name 'internment-0.8.7.crate' -o \
  -name 'proc-macro1-*.crate' -o \
  -name 'proc-macro-en-*.crate' -o \
  -name 'aovine-*.crate' -o \
  -name 'arone-*.crate' -o \
  -name 'aronenao-*.crate' -o \
  -name 'tinymember-*.crate' \
\) -print
```

`vendor/` に依存のコピーを置いている場合や、CI のキャッシュを使っている場合は、そちらも調べてください。crates.io から削除されても、手元のキャッシュからはビルドできてしまいます。

**`append-only-vec` 0.1.9 についての注意**: 作者は 2026-10-18 に、同じ `0.1.9` という版の番号で、正しい中身の版を出し直しました（自分で確認。crates.io の記録では公開者は元の所有者で、依存は `parking_lot`、`portable-atomic`、`scaling` だけ）。そのため、`0.1.9` が見つかっても、悪性とは限りません。次の方法で見分けます。

- 悪性の `0.1.9` は `proc-macro1` に依存していました。`Cargo.lock` に `proc-macro1` が無ければ、悪性の版ではありません。
- 出し直した `0.1.9` の SHA-256 は `879ffa3e767bd8a7b9caf295630087b28e0a04b55603c6376a971c7a4cf5514e` です（crates.io の索引で確認）。`Cargo.lock` の `checksum`、またはキャッシュの `.crate` ファイルの `sha256sum` と比べてください。悪性の版のハッシュは公開されていません。
- RustSec の助言は、今も `0.1.9` をすべて対象としています。`cargo audit` の警告を消すには、`0.1.10` 以降に上げてください。

見つかった場合は、その環境でビルドを動かしたなら、**その機械が乗っ取られたものとして** 扱ってください。ペイロードはビルドを動かした利用者の権限で動き、遠隔から命令を受け付けます（下の「手口」）。

- その機械から読めた認証情報（SSH 鍵、クラウドの鍵、crates.io や GitHub のトークン、署名鍵、CI の秘密情報、ブラウザーに保存したパスワード、暗号資産のウォレット）をすべて入れ替える。
- `/tmp/rust-setup`（Linux と macOS）、`%TEMP%\rust-setup.ps1` と `%TEMP%\rust-setup-launch.vbs`（Windows）が無いか調べる。
- 自動起動の仕組みを調べる。Linux では systemd の利用者用サービス（説明文が `System Config User Service` のもの）、Windows では `HKCU` の `Run` キー、macOS では LaunchAgent（Socket と、被害を受けた利用者の解析による）。
- その期間に作った成果物は、きれいな環境で作り直す。

## 関係する crate

| crate | 役割 | 悪性の版 | 公開 | RustSec | GHSA | MAL |
|---|---|---|---|---|---|---|
| `arrayref` | 乗っ取られた正規の crate | `0.3.10` | 2026-08-20 07:15:00 | [RUSTSEC-2026-0260](https://rustsec.org/advisories/RUSTSEC-2026-0260.html) | GHSA-jwh4-228v-r358 | MAL-2026-14336 |
| `internment` | 乗っ取られた正規の crate | `0.8.7` | 2026-08-20 07:34:07 | [RUSTSEC-2026-0266](https://rustsec.org/advisories/RUSTSEC-2026-0266.html) | GHSA-mxq3-8c5w-crcm | MAL-2026-14337 |
| `append-only-vec` | 乗っ取られた正規の crate | `0.1.9`（08-20 公開のもの） | 2026-08-20 07:37:49 | [RUSTSEC-2026-0262](https://rustsec.org/advisories/RUSTSEC-2026-0262.html) | GHSA-m9v3-f7h2-72cp | MAL-2026-14333 |
| `proc-macro1` | `proc-macro2` を装い、`build.rs` でペイロードを取ってくる本体 | すべて（2 版） | 2026-08-20 | [RUSTSEC-2026-0265](https://rustsec.org/advisories/RUSTSEC-2026-0265.html) | GHSA-m83q-4x86-96wh | MAL-2026-14338 |
| `proc-macro-en` | `proc-macro1` と同じ `build.rs` を持つ予備 | すべて（1 版） | 2026-08-20 | [RUSTSEC-2026-0264](https://rustsec.org/advisories/RUSTSEC-2026-0264.html) | GHSA-4v73-396v-6ph9 | MAL-2026-14339 |
| `arone` | 関係する crate（悪性かどうかは出典で食い違う） | すべて（7 版） | 最後の版は 2026-08-18 | [RUSTSEC-2026-0259](https://rustsec.org/advisories/RUSTSEC-2026-0259.html) | GHSA-7h2v-6jmm-f43m | MAL-2026-14334 |
| `aronenao` | 関係する crate（同上） | すべて（11 版） | 最後の版は 2026-08-18 | [RUSTSEC-2026-0261](https://rustsec.org/advisories/RUSTSEC-2026-0261.html) | GHSA-vqfg-g9r4-x39f | MAL-2026-14335 |
| `aovine` | 関係する crate（同上） | すべて | 公表されていない | なし | GHSA-r47g-vj55-h745 | MAL-2026-14332 |
| `tinymember` | `arone` と同じ所有者の crate。悪性のコードは無し | すべて（2 版） | 2026-08-18 | [RUSTSEC-2026-0263](https://rustsec.org/advisories/RUSTSEC-2026-0263.html) | GHSA-jpmw-jcm2-3wcq | MAL-2026-14340 |

公開の時刻は、正規の 3 つは Rust のセキュリティ対応チームの記事、ほかは RustSec の助言と StepSecurity の報告によります。版の数は RustSec の助言によります。ダウンロード数が公表されているのは、`arrayref` 0.3.10（2,285 回）と `tinymember`（27 回）だけです。

RustSec の番号の空き（0261、0263）は、どちらもこの事件の助言です（`aronenao` と `tinymember`）。`aovine` には RustSec の助言がありません（2026-11-20 に `advisory-db` で確認）。

## 時系列

日付は UTC です。

| 日時 | できごと | 出典 |
|---|---|---|
| 2026-08-18 | `arone`（7 版）と `aronenao`（11 版）の最後の版、`tinymember`（2 版）が公開される | RustSec の助言 |
| 08-20 01:25:58 | `proc-macro1` を公開した crates.io の利用者が作られる | StepSecurity |
| 08-20 01:55:34 | `proc-macro1` 1.0.106 が公開される。`proc-macro2` のコピーで、悪性のコードは無い | StepSecurity、advisory-db#3161 |
| 08-20 07:11:15 | `proc-macro1` 1.0.107 が公開される。悪性の `build.rs` が足される | StepSecurity |
| 08-20 07:15:00 | `arrayref` 0.3.10 が、正規の所有者のアカウントから公開される | Rust のセキュリティ対応チーム |
| 08-20 07:15 | Rust のセキュリティ対応チームが、`proc-macro1` が悪性だという報告を受ける | Rust のセキュリティ対応チーム |
| 08-20 07:15:24〜07:15:40 | `arrayref` 0.3.9〜0.3.5 が、同じアカウントから続けて取り消される | StepSecurity（crates.io の監査記録として） |
| 08-20 07:29:50 | Socket が `proc-macro1` を自動で検知 | Socket |
| 08-20 07:34:07 | `internment` 0.8.7 が公開される | Rust のセキュリティ対応チーム |
| 08-20 07:37:49 | `append-only-vec` 0.1.9 が公開される | Rust のセキュリティ対応チーム |
| 08-20 07:54:11 | 利用者が `advisory-db` に報告（#3161） | 自分で確認 |
| 08-20 08:03:09 | `proc-macro1` が削除される | StepSecurity |
| 08-20 08:41:40 | `arrayref` 0.3.10 が削除される（86 分） | Rust のセキュリティ対応チーム |
| 08-20 09:04:11 | `internment` 0.8.7 が削除される（90 分） | Rust のセキュリティ対応チーム |
| 08-20 09:25:24 | `append-only-vec` 0.1.9 が削除される（107 分） | Rust のセキュリティ対応チーム |
| 08-20 | 残りの 5 つの crate が削除され、関係するアカウントが凍結される。取り消された版が元に戻される。Rust のセキュリティ対応チームが記事を公開 | Rust のセキュリティ対応チーム |
| 08-20 14:26 / 15:46 | `advisory-db` に助言が追加され、15:52 に番号が割り当てられる | 自分で確認 |
| 08-21 00:31 | GitHub の助言（GHSA、種類は malware）が公開される | 自分で確認 |
| 08-21 06:28 | 助言の文が直される。「実際に使われた形跡は無い」が消え、`arrayref` 0.3.10 が 2,285 回ダウンロードされたと書かれる | 自分で確認 |
| 09-17 | crates.io チームが、Rust の開発者を狙った攻撃への注意を呼びかける。`arrayref` は「似た攻撃」で一時乗っ取られた、とする | crates.io チーム |
| 10-18 | 作者が `append-only-vec` 0.1.9 を正しい中身で出し直す。10-19 に 0.1.10 も公開 | 自分で確認 |
| 10-20 | `append-only-vec` の助言が直され、`0.1.9` 以外の版が対象外になる | 自分で確認 |
| 11-20 | 正規の 3 つが索引に残り、悪性の版が無いこと、ほかの 6 つが索引に無いことを確認 | 自分で確認 |

悪性の版の公開から RustSec の番号の割り当てまで、約 8 時間半でした。GitHub の助言は、その約 9 時間後です。

## 手口

この節は、Rust のセキュリティ対応チームの記事、RustSec の助言、`advisory-db#3161` の報告、検知した企業（SafeDep、StepSecurity、Socket、JFrog）の解析によります。RustSecJP は検体を入手しておらず、自分では確認していません。

- **正規の crate の乗っ取り**: 3 つの crate の新しい版は、本来の所有者のアカウントから公開された。Rust のセキュリティ対応チームは「所有者のコンピューターか認証情報が侵害された可能性が高い」としている。9 月の crates.io チームの記事は、`arrayref` は「似た攻撃で」一時乗っ取られたとしている。その「攻撃」は、仕事や協力の話でビデオ通話を設定し、「足りない音声コーデック」などを入れさせたり、クリップボードに入れた命令を実行させたりするもの。ただし、同じ攻撃の一部かどうかは分からない、としている。
- **中身を変えず、依存を 1 つ足す**: 3 つの crate のコードはそのままで、`Cargo.toml` に `proc-macro1 = "1.0.107"` が足されただけだった。`arrayref` はそれまで実行時の依存を持たない crate だった。Cargo は宣言された依存をすべてビルドするので、コードで使われていなくても `proc-macro1` の `build.rs` が動く。
- **名前の偽装と下準備**: `proc-macro1` の `src/` は `proc-macro2` のコピーで、ビルドはふつうに成功する。作者欄とリポジトリの URL も、`proc-macro2` の作者を装う偽のものだった。公開した利用者名も、実在する開発者の名前に似せていた。悪性の 1.0.107 の約 5 時間前に、悪性のコードの無い 1.0.106 を出して、履歴を作っていた。
- **取り消し（yank）で新しい版へ誘う**: `arrayref` 0.3.10 の公開から約 24 秒後に、0.3.9〜0.3.5 が数秒おきに取り消された。取り消された版を使っていると、Cargo は「取り消されていない版への更新を検討してください」と警告する。それに従って `cargo update` すると、悪性の 0.3.10 になる。報告者はこの流れで被害を受けたと書いている。ほかの 2 つの crate でも、古い版が取り消されていた（Rust のセキュリティ対応チームの記事。どの版かは公表されていない）。
- **ビルド時に取ってきて動かす**: `proc-macro1` の `build.rs` は、base64 で分けて隠した通信先を組み立て、証明書を検証しない TLS で、OS と CPU に合った実行ファイルを取ってくる。Linux と macOS では `/tmp/rust-setup` に書いて実行し、Windows では `%TEMP%` に PowerShell と VBScript を書いて、見えない形で起動する。ビルドは待たずに終わり、ペイロードは残って動き続ける。
- **ペイロード（第 2 段）**: Socket が 3 つの OS 向けの検体を、被害を受けた利用者の 1 人が Linux 向けの検体を解析した。どちらによると、機械の情報（利用者名、OS、権限、入れているアプリ）を集め、Chromium 系ブラウザーに保存されたログイン先と利用者名、拡張機能のデータを集める。自動起動を仕込み、遠隔からシェルの命令やスクリプトを実行できる。保存されたパスワードそのものを復号する処理は、どちらの解析でも見つかっていない。ただし、遠隔からどんな命令が送られたかは分からない。
- **予備の crate**: `proc-macro-en` は `proc-macro1` と同じ `build.rs` を持っていた（RustSec の助言。Socket は、同じハッシュだったとしている）。

## 9 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `arrayref`、`internment`、`append-only-vec` → `proc-macro1` | 依存関係。3 つの悪性の版は、どれも `proc-macro1` に直接依存していた | 他者の報告（Rust のセキュリティ対応チーム、RustSec の助言 3 件、検知した企業 4 社が一致） | 高 |
| `arrayref`、`internment`、`append-only-vec` どうし | 同じ所有者のアカウントから、23 分の間に公開された | 他者の報告（Rust のセキュリティ対応チーム、StepSecurity、Socket） | 高 |
| `proc-macro-en` ↔ `proc-macro1` | 同じ `build.rs` | 他者の報告（RustSec の助言、Socket） | 高 |
| `arone`、`aronenao`、`aovine` ↔ 本体 | Rust のセキュリティ対応チームが「`proc-macro1` と、それに似た crate」として一緒に削除し、確かめ方の対象に含めた。RustSec の助言（`arone`、`aronenao`）は「`arrayref` の利用者を狙った攻撃の一部」と明記 | 他者の報告（Rust のセキュリティ対応チーム、RustSec の助言） | 中 |
| `tinymember` ↔ `arone`、`aronenao` | 同じ所有者 | 他者の報告（RustSec の助言） | 中 |
| 助言どうしが同じ事件を指している | 8 つの RUSTSEC がすべて同じ記事を参照し、同じ日に 2 つのプルリクエストで追加され、1 つのコミットで番号が割り当てられた。9 つの MAL も、すべて同じ攻撃の一部と書いている | 自分で確認（`advisory-db` の履歴、OSV、GitHub の助言データベース） | 高 |

`arone`、`aronenao`、`aovine`、`tinymember` を「中」にとどめているのは、次の理由からです。

- 4 つが、乗っ取られた 3 つの crate や `proc-macro1` とどうつながるのか（依存関係、同じ公開者、同じ通信先）が公表されていません。
- RustSec の助言は、`arone` と `aronenao` が「build script から悪性のコードを実行した」としています。一方 Socket は、自分たちが調べた版の `build.rs` は害の無い、試験のようなものだったとしています（下の「分かっていないこと」）。
- `arone`、`aronenao`、`tinymember` の所有者が、`proc-macro1` を公開した利用者と同じかどうかは公表されていません。

この 4 つを束ねたのは、Rust のセキュリティ対応チームと RustSec が、同じ事件の一部として扱っていると明記しているためです。

## 痕跡情報

通信先は無害化して書いています。一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-004/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| ペイロードの取得先 | `hxxps://23[.]254[.]165[.]112:9089/rust-crate_0.1.0`（Linux x86-64）。`_0.2.0` は Windows、`_0.3.0` は macOS x86-64、`_0.4.0` は macOS arm64 | `proc-macro1` 1.0.107、`proc-macro-en` | advisory-db#3161、SafeDep、Socket、JFrog |
| 指令サーバー | `23[.]254[.]165[.]112:443`（ペイロードに引数で渡される） | 同上 | 同上 |
| 指令サーバー（ほかの報告） | `23[.]254[.]167[.]107`、`23[.]254[.]167[.]216` | 第 2 段 | advisory-db#3161 のコメント（未確認の報告） |
| 置かれるファイル | `/tmp/rust-setup`、`%TEMP%\rust-setup.ps1`、`%TEMP%\rust-setup-launch.vbs` | `build.rs` | advisory-db#3161、Socket、JFrog |
| systemd の利用者用サービス | `Description=System Config User Service` | 第 2 段（Linux） | advisory-db#3161 のコメント |
| crates.io の利用者 | `dtolney`（`proc-macro1` を公開） | `proc-macro1` | advisory-db#3161、SafeDep、StepSecurity |
| SHA-256 | `25ad700976873c76af785cb99b33c48db7df8b81f21d1e9e06b3676b9a9373ae` | `arrayref-0.3.10.crate` | advisory-db#3161、StepSecurity |
| SHA-256 | `61198155da51b838772eecf5bfaac6cbc4dcc388dccc56658fc28a8e831b34d4` | `proc-macro1-1.0.107.crate` | 同上 |
| SHA-256 | `b5c1b5b0763a8809a644a8f92224653f0aca623a98eecc714d27f74b80fbe436` | `proc-macro1-1.0.106.crate`（悪性のコードは無し） | 同上 |
| SHA-256 | `cb7778eb6dda91028abf087eb7c3553f981a67e756769507d348e8c201805568` | `proc-macro1` 1.0.107 と `proc-macro-en` 1.0.10 の `build.rs` | Socket |
| SHA-256 | `408ef22050ffc5a67e005802809026b29f297a8019f8fda91a2afa8e877ba434` | 第 2 段（Linux x86-64） | Socket、advisory-db#3161 のコメント |

第 2 段の Windows 版と macOS 版のハッシュ、日付から作られる予備の通信先（ドメイン）は、`iocs.csv` に載せています（Socket による）。`internment` 0.8.7、`append-only-vec` 0.1.9（悪性のもの）、`proc-macro-en` の `.crate` ファイルのハッシュは、公開された情報の中に見つかりませんでした。

## 対策

- **取り消し（yank）の警告を、すぐ更新する合図にしない**: この事件では、古い版を取り消して、新しい悪性の版へ誘いました。警告が出たら、取り消された理由と、新しい版の中身を先に確かめます。
- **ロックファイルの差分を見る**: 依存の少ない crate に、見慣れない依存（この事件では `proc-macro1`）が増えていないかを見ます。CI では `--locked` を付けてビルドします。
- **公開されたばかりの版をすぐに使わない**: 悪性の版は 86〜107 分で削除されました。公開から数日たった版だけを使う決まりにしていれば、避けられました。
- **ビルドは、秘密情報の少ない環境で**: `build.rs` はビルドした利用者の権限で動きます。秘密情報を置いた機械や CI のジョブで、新しい依存を初めてビルドしないようにします。
- **公開する側は、アカウントとトークンを守る**: crates.io チームは、知らない相手からの誘いのビデオ通話に注意し、多要素認証が有効か、覚えのないログインが無いかを確かめるよう呼びかけています。
- **助言データベースの結果を、正しく読む**: `append-only-vec` のように、削除された版の番号を作者が出し直すと、問題ない版も警告されることがあります。逆に、助言が出る前は `cargo audit` は何も知らせてくれません。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| `arrayref` 0.3.10、`internment` 0.8.7、`append-only-vec` 0.1.9 が、`proc-macro1` への依存を足されて公開され、削除された | 他者の報告（Rust のセキュリティ対応チーム、RustSec の助言）と、自分で確認（索引に無いこと） | 高 |
| 3 つの crate のほかの版は問題なく、今は取り消されていない | 自分で確認（crates.io の索引） | 高 |
| `append-only-vec` 0.1.9 は 2026-10-18 に正しい中身で出し直され、そのハッシュは `879ffa3e…` | 自分で確認（crates.io の索引と API、advisory-db#3406） | 高 |
| 公開と削除の時刻、`arrayref` 0.3.10 のダウンロード数 | 他者の報告（Rust のセキュリティ対応チーム、RustSec の助言） | 高 |
| 6 つの crate が crates.io から削除された | 自分で確認（索引に無いこと）と、他者の報告 | 高 |
| 9 つの GHSA、8 つの RUSTSEC、9 つの MAL の番号の対応 | 自分で確認（`advisory-db`、GitHub の助言データベース、OSV） | 高 |
| 所有者のアカウントが侵害された（所有者本人の悪意ではない） | 他者の報告（Rust のセキュリティ対応チーム） | 中 |
| 侵害の方法が、ビデオ通話を使った誘いだった | 他者の報告（crates.io チームの 9 月の記事。「似た攻撃」という書き方） | 低 |
| `proc-macro1` の利用者の作成、1.0.106 の公開、取り消しの時刻 | 他者の報告（StepSecurity） | 中 |
| `build.rs` の動きと、通信先 | 他者の報告（advisory-db#3161、検知した企業 4 社が一致） | 中 |
| 第 2 段のペイロードの動き | 他者の報告（Socket、被害を受けた利用者の解析） | 中 |
| `arone`、`aronenao`、`aovine`、`tinymember` が同じ事件に属する | 他者の報告（Rust のセキュリティ対応チーム、RustSec の助言） | 中 |

## 分かっていないこと

- **所有者のアカウントが、どのように侵害されたか**。Rust のセキュリティ対応チームは「コンピューターか認証情報」としか書いていません。9 月の記事は「似た攻撃」としていますが、詳しい経緯は公表されていません。StepSecurity は「ほぼ確実に長く使えるトークンが使われた」と書いていますが、根拠は示されていません。
- **`arone`、`aronenao`、`aovine` が悪性だったか**。RustSec の助言は、`arone` と `aronenao` が build script から悪性のコードを実行したとしています。Socket は、調べた版の `build.rs` は害の無い、試験のようなものだったとしています。調べた版が違う可能性がありますが、確認できていません。`aovine` には RustSec の助言が無く、MAL の記録は「この crate の build script は直接は調べていない」としています。
- **4 つの crate と、本体とのつながり**。依存関係、公開者、通信先のどれが共通なのかは公表されていません。Socket は、`aovine`、`arone`、`aronenao` を、正規の所有者の crate から作った複製や下準備のための crate と見ています。
- **報告を受けた時刻**。Rust のセキュリティ対応チームの記事は、07:15 に報告を受けたとしています。これは `arrayref` 0.3.10 の公開と同じ分です。`advisory-db` への報告は 07:54、Socket の自動検知は 07:29 です。最初の通報者（Nextron Systems の研究チーム）がいつ報告したのかは、確認できていません。
- **実際の被害**。当初の助言は「実際に使われた形跡は無い」としていましたが、翌日、記録を調べ直して `arrayref` 0.3.10 が 2,285 回ダウンロードされたと直されました。被害を受けた利用者の報告も `advisory-db#3161` にあります。`internment` 0.8.7 と `append-only-vec` 0.1.9 のダウンロード数は公表されていません。
- **ほかの 2 つの crate で取り消された版**。どの版が取り消されたのかは公表されていません。2026-11-20 の時点では、取り消された版はありません。
- **悪性の `internment` 0.8.7、`append-only-vec` 0.1.9、`proc-macro-en` のハッシュ**。StepSecurity は、保存される前に削除されたため分からないとしています。
- **攻撃者**。crates.io チームの 9 月の記事は、ビデオ通話を使う手口について「DPRK が使うことで知られている」と書いていますが、`arrayref` の件が同じ攻撃の一部かどうかは「分からない」としています。この記録は、攻撃者を特定しません。

## 出典

**一次情報**

- Rust のセキュリティ対応チーム「[Supply chain attack on arrayref](https://blog.rust-lang.org/2026/08/20/supply-chain-attack-on-arrayref/)」（2026-08-20）
- crates.io チームとセキュリティ対応ワーキンググループ「[Be alert: targeted attacks on prominent Rustaceans](https://blog.rust-lang.org/2026/09/17/targeted-attacks/)」（2026-09-17）
- RustSec の助言: [RUSTSEC-2026-0259](https://rustsec.org/advisories/RUSTSEC-2026-0259.html)、[0260](https://rustsec.org/advisories/RUSTSEC-2026-0260.html)、[0261](https://rustsec.org/advisories/RUSTSEC-2026-0261.html)、[0262](https://rustsec.org/advisories/RUSTSEC-2026-0262.html)、[0263](https://rustsec.org/advisories/RUSTSEC-2026-0263.html)、[0264](https://rustsec.org/advisories/RUSTSEC-2026-0264.html)、[0265](https://rustsec.org/advisories/RUSTSEC-2026-0265.html)、[0266](https://rustsec.org/advisories/RUSTSEC-2026-0266.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) の報告とコミット履歴（報告: [#3161](https://github.com/rustsec/advisory-db/issues/3161)、[#3406](https://github.com/rustsec/advisory-db/issues/3406)。助言の追加: `a76f948c`、`30fe5157`、`8d68d43f`。番号の割り当て: `42ead52a`。文の修正: `bf5c0d24`、`b3180c2c`）

**検知した企業の解析**

- SafeDep「[Malicious Rust Crate arrayref Runs a Build-Time Payload](https://safedep.io/arrayref-proc-macro1-rust-build-time-malware/)」（2026-08-20）
- StepSecurity「[Rust Supply-Chain Attack: arrayref, internment, and append-only-vec Poisoned by the proc-macro1 Build-Time Dropper](https://www.stepsecurity.io/blog/arrayref-rust-crate-supply-chain-attack)」（2026-08-20）
- Socket「[Popular Rust Crates Compromised in Build-Time Supply Chain Attack](https://socket.dev/blog/popular-rust-crates-compromised)」（2026-08-20）
- JFrog「[Compromised Rust crates on crates.io silently execute malware at build time](https://research.jfrog.com/post/arrayref-proc-macro1-crates-io/)」（2026-08-20）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に、`arrayref`、`internment`、`append-only-vec` があり、悪性の `0.3.10`、`0.8.7` が無く、取り消された版も無いこと。`append-only-vec` の `0.1.9` は 2026-10-18 公開のもので、`proc-macro1` に依存していないこと。
- crates.io の索引に、`proc-macro1`、`proc-macro-en`、`aovine`、`arone`、`aronenao`、`tinymember` が無いこと。
- `advisory-db` に、`aovine` の助言が無いこと。RUSTSEC-2026-0261 と 0263 がこの事件の助言であること。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、9 つの crate の番号の対応を引いたこと。
- `arrayref` 0.3.9 の索引のハッシュが、StepSecurity の記載と一致すること。

## 更新履歴

- 2026-11-20: 初版
