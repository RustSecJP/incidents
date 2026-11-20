# RSJP-C-2026-005: greentic-setup と greentic-setup-dev に混入した PolinRider の亜種

| | |
|---|---|
| 番号 | `RSJP-C-2026-005` |
| 状態 | 公開（初版 2026-11-20） |
| 期間 | 2026-09-06 〜 2026-09-07（UTC） |
| 関係する crate | 2 つ（どちらも正規の crate。悪性の版だけが crates.io から削除済み） |
| 種類 | 正規の crate の乗っ取り（元のリポジトリへの不正な書き換えと、プロジェクト自身の自動公開） |
| 動く時点 | 依存するプロジェクトを Visual Studio Code で開いたとき（RustSec の助言による） |
| 機械で読める記録 | [`campaign.toml`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-005/campaign.toml)、[`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-005/iocs.csv) |

## 要約

Greentic というプロジェクトの crate `greentic-setup` と `greentic-setup-dev` に、悪性の新しい版が 1 つずつ公開されました。RustSec の助言によると、中身は「PolinRider」と呼ばれるマルウェアの亜種で、依存するプロジェクトを Visual Studio Code で開くと動くものでした。2026-09-06 に公開され、約 27 時間後に削除されています。

どちらの crate も、事件の前から正規に公開されてきたものです。悪いのは次の 2 つの版だけです。

- `greentic-setup` 1.3.1-dev.34027618345
- `greentic-setup-dev` 1.3.34027618345

GitHub の公開データを調べたところ、2 つの版は、元のリポジトリの `research` ブランチが書き換えられた直後に、プロジェクト自身の自動公開の仕組み（GitHub Actions）から同じ回の実行で公開されていました。書き換えでは、正規のコミットが、同じ日時・同じメッセージのまま、`.vscode/tasks.json` とフォントに見せかけたファイルを足したものに差し替えられていました。

RustSec は、実際の利用者がこの版をダウンロードした形跡は無いとしつつ、Greentic の利用者は手元を確かめるよう勧めています。

## 自分が影響を受けたかの確かめ方

次のどれかに当てはまる場合は、影響を受けた可能性があります。

- `Cargo.lock` に、`greentic-setup` 1.3.1-dev.34027618345 か、`greentic-setup-dev` 1.3.34027618345 がある。
- `~/.cargo/registry/cache` や `~/.cargo/registry/src` に、この版の `.crate` ファイルや展開したディレクトリが残っている。
- 2026-09-06 〜 09-09 の間に、`greentic-setup` の GitHub リポジトリの `research` ブランチを取得した（下の「手口」を参照）。

2 つの版の番号には、どちらも `34027618345` という並びが入っています。これで探せます。

```shell
# プロジェクトのロックファイルを調べる
grep -n '34027618345' Cargo.lock

# 手元のキャッシュと展開済みのソースを調べる
ls ~/.cargo/registry/cache/*/ ~/.cargo/registry/src/*/ 2>/dev/null | grep -E '^greentic-setup(-dev)?-.*34027618345'

# research ブランチを取得したことがある場合（このコミットが手元にあるか）
git -C <greentic-setup の作業コピー> cat-file -t 04f3e79db8dd1346c1b11c8091bc5f9f0973d7e3
```

**ほかの版は、この事件の対象ではありません。** RustSec の助言は、この 2 つの版より前の版も後の版も「影響なし」としています。

依存している 4 つの crate（`greentic-start`、`greentic-start-dev`、`greentic-operator`、`greentic-operator-dev`）について、2026-11-20 に crates.io の索引に残っている全版の依存指定を調べました。どれも `greentic-setup` を `< 1.3.0-0` などの範囲で指定しており、1.3 系の悪性の版が自動で選ばれる指定はありませんでした（削除済みの版や、git から直接依存している場合は調べられていません）。

見つかった場合は、その環境を Visual Studio Code（や互換のエディタ）で開いたことがあるかを確かめてください。開いていた場合は、その環境にあった認証情報（GitHub や crates.io のトークン、SSH 鍵、ブラウザに保存したパスワード、暗号資産のウォレットなど）を、漏れたものとして入れ替えてください。PolinRider 全般についての他社の解析では、これらが狙われるとされています。Greentic の件で何が盗まれたかは、公表されていません。

## 関係する crate

| crate | 役割 | 悪性の版 | 公開 | ダウンロード数 | RustSec | GHSA |
|---|---|---|---|---|---|---|
| `greentic-setup` | 乗っ取られた正規の crate。Greentic の 4 つの crate が依存している | 1.3.1-dev.34027618345 | 2026-09-06 に 1 版 | 不明 | [RUSTSEC-2026-0281](https://rustsec.org/advisories/RUSTSEC-2026-0281.html) | 無し（2026-11-20 時点） |
| `greentic-setup-dev` | 乗っ取られた正規の crate（同じリポジトリから公開される、開発版用の別名） | 1.3.34027618345 | 2026-09-06 に 1 版 | 不明 | [RUSTSEC-2026-0280](https://rustsec.org/advisories/RUSTSEC-2026-0280.html) | 無し（2026-11-20 時点） |

公開日と削除までの時間は、RustSec の助言の記載によります。

## 時系列

日付は UTC です。

| 日付 | できごと | 出典 |
|---|---|---|
| 2026-07-16 09:40 | `research` ブランチに正規のコミット `c69a4b3e`（`Cargo.toml` と `Cargo.lock` だけの変更）が入る | 自分で確認（GitHub） |
| 2026-09-06 08:50〜19:27 | プロジェクト側の GitHub アカウントから、Greentic の組織の 62 以上のリポジトリで、少なくとも 477 のブランチが強制的に書き換えられる（force push） | 自分で確認（GitHub のリポジトリの活動記録） |
| 2026-09-06 10:30 | 同じアカウントから、`greentic-setup` の `research` ブランチが `c69a4b3e` から `04f3e79d` に書き換えられる | 自分で確認（GitHub） |
| 2026-09-06 10:30 | その書き換えをきっかけに、自動公開の仕組み「Dev Publish」が動き出す（実行番号 34027618345） | 自分で確認（GitHub Actions） |
| 2026-09-06 13:31〜13:32 | 同じ実行の「Publish dev crates to crates.io」の手順が成功する。悪性の 2 版はこのとき公開されたとみられる | 自分で確認（GitHub Actions）。公開時刻そのものは未確認 |
| 2026-09-07 | 公開から約 27 時間後に、2 つの版が crates.io から削除される | RustSec の助言 |
| 2026-09-07 | Nextron Systems の研究チームの通報を受けて、RustSec の助言が追加され、番号が割り当てられる（コミットは 17:44〜18:19） | 自分で確認（`advisory-db` のコミット履歴） |
| 2026-09-09 03:13 | 保守者が `research` ブランチを、書き換え前の `393fa360` まで戻す | 自分で確認（GitHub のリポジトリの活動記録） |
| 2026-11-20 | 2 つの悪性の版が crates.io の索引に無いこと、ほかの版は残っていることを確認 | 自分で確認 |

この件では、助言は削除と同じ日に出ています。

## 手口

### 元のリポジトリの書き換え（自分で確認）

GitHub の公開データ（リポジトリの活動記録、コミット、Actions の実行記録）を調べて分かったことです。中身のファイルは取得しておらず、ファイルの名前と変更の行数だけを見ています。

- 2026-09-06 10:30、プロジェクト側の GitHub アカウントから `research` ブランチが強制的に書き換えられた。同じ日、同じアカウントから、組織のほかのリポジトリでも多数のブランチが書き換えられていた。
- 新しいコミット `04f3e79d` は、差し替えられた正規のコミット `c69a4b3e` と、**作成日時（2026-07-16 09:40:38）もメッセージも同じ**だった。正規のコミットの作者の名前で作られていて、署名は無かった。
- 正規のコミットとの違いは、次のファイルが足されていたこと。
  - `.vscode/tasks.json`、`.vscode/settings.json`、`.vscode/launch.json`、`.vscode/extensions.json` など
  - `public/fonts/` の下のフォントに見せかけたファイル一式（`fa-solid-400.woff2` を含む）
  - `.gitignore` の変更
- このプロジェクトでは、`research` ブランチに push されると「Dev Publish」が動き、実行番号を版の番号に入れて crates.io に公開する。悪性の 2 版の番号に入っている `34027618345` は、この書き換えで動いた実行の番号と一致する。

つまり、crates.io への公開そのものは、プロジェクトの正規の自動公開の仕組みが行っています。攻撃者が crates.io のトークンを直接使ったのか、リポジトリに書き込めただけなのかは、公表されていません。

### PolinRider の手口（他者の報告）

次は、PolinRider 全般について他社が公開した解析によります。Greentic の件だけを扱った解析は、見つかりませんでした。

- **感染した開発者の手元から広がる**: OpenSourceMalware によると、感染した開発者の機械にある認証情報が使われ、その開発者が書き込めるリポジトリに悪性のコードが自動で足される。コミットを書き換えて force push し、元のコミットと日時が合うように見せかける。
- **フォントに見せかけた JavaScript**: 同じ解析によると、`public/fonts/fa-solid-400.woff2` という名前のファイルが、実はフォントではなく JavaScript の読み込み役になっている。Socket も「`.woff2` フォントに見せかけたファイルに JavaScript を隠す」と書いている。
- **その先**: 読み込み役は、ブロックチェーン上の取引から次の段階のコードを取り出して動かし、遠隔操作や、ブラウザの認証情報・暗号資産のウォレット・開発用の設定などを盗むコードを入れる、とされている。

### Visual Studio Code で開くと動く仕組み

Visual Studio Code には、作業フォルダの `.vscode/tasks.json` に「タスク」（決まったコマンド）を書いておく機能があります。タスクに `"runOn": "folderOpen"` と書くと、そのフォルダを開いたときにタスクが自動で動きます（VS Code の説明書）。OpenSourceMalware と Socket は、PolinRider がこの設定を使い、フォルダを開いただけで上の読み込み役を動かすと報告しています。

VS Code の現在の説明書では、この自動のタスクは、初めてのときに許可を求められ、信頼していないフォルダでは動きません。許可してしまえば動きます。

Greentic の件で、`tasks.json` に何が書かれていたか、また **crate として配られた版の中にこれらのファイルが入っていたか、入っていたとして、依存する側のプロジェクトを開いたときにどうやって動くのか** は、公表されていません（「分かっていないこと」を参照）。

## 2 つを束ねた根拠

| つながり | 根拠 | 確認 | 確信度 |
|---|---|---|---|
| `greentic-setup` ↔ `greentic-setup-dev` | 同じ GitHub Actions の実行（34027618345）から公開された。どちらの版の番号にも実行番号が入っていて、その実行は書き換えられたコミット `04f3e79d` で動いている | 自分で確認（GitHub Actions、crates.io の版の番号） | 高 |
| 同上 | crates.io に登録されたリポジトリが同じ（`greenticai/greentic-setup`）。残っている版は、どちらも同じ公開アカウントから公開されている | 自分で確認（crates.io の API） | 高 |
| 同上 | RustSec が 2 件を 1 つのコミットで追加し、同じ文面で「PolinRider の亜種」と書いている | 自分で確認（`advisory-db` のコミット `0b938ebe`） | 高 |
| PolinRider との関係 | RustSec の助言の記載。足されたファイルの名前（`.vscode/tasks.json`、`public/fonts/fa-solid-400.woff2`）と、日時を合わせたコミットの書き換えが、他社の PolinRider の解析と一致する | 他者の報告（RustSec）、ファイル名とコミットは自分で確認 | 中 |

PolinRider を誰が動かしているかについては、他社の記事に帰属の記述がありますが、この記録では扱いません。

## 痕跡情報

一覧は [`iocs.csv`](https://github.com/RustSecJP/incidents/blob/main/campaigns/RSJP-C-2026-005/iocs.csv) にあります。

| 種類 | 値 | 対象 | 出典 |
|---|---|---|---|
| crate の版 | `greentic-setup` 1.3.1-dev.34027618345 | `greentic-setup` | RustSec |
| crate の版 | `greentic-setup-dev` 1.3.34027618345 | `greentic-setup-dev` | RustSec |
| git のコミット | `04f3e79db8dd1346c1b11c8091bc5f9f0973d7e3`（`greenticai/greentic-setup` の `research` ブランチ。現在は戻されている） | 元のリポジトリ | 自分で確認 |
| GitHub Actions の実行 | `34027618345`（Dev Publish） | 元のリポジトリ | 自分で確認 |
| ファイル | `.vscode/tasks.json`、`public/fonts/fa-solid-400.woff2` | 書き換えられたコミット | 自分で確認（名前だけ） |

検体のハッシュと通信先は、Greentic の件については公開された情報の中に見つかりませんでした。他社の記事にある PolinRider の通信先やハッシュは、別の事件のものなので、ここには載せていません。

## 対策

- **`.vscode/tasks.json` を確かめてから開く**: 知らないリポジトリや、取得し直したリポジトリを VS Code で開く前に、`.vscode/tasks.json` に `"runOn": "folderOpen"` が無いかを見ます。自動のタスクの許可を求められたら、中身を見るまで許可しません。
- **自動のタスクを止めておく**: VS Code の設定で `"task.allowAutomaticTasks": "off"` にすると、許可を求められなくなり、動きません。
- **「フォント」や設定ファイルの追加に注意する**: Rust のプロジェクトに `public/fonts/` や `.vscode/` が突然足されていたら、疑います。
- **force push と日時の古いコミットを疑う**: この件の悪性のコミットは、2 か月前の日時を名乗っていました。日時だけでは新しい変更と分かりません。
- **自動公開の仕組みを守る**: push だけで crates.io に公開される仕組みは、リポジトリに書き込めれば悪性の版を出せることを意味します。公開する前に人の承認を挟む、公開用のブランチを保護する、などが考えられます。
- **開発版の番号の扱い**: この件の悪性の版は、どちらも開発版の番号でした。開発版を範囲で指定していると、新しい版が自動で選ばれることがあります。

## 確信度

| 主張 | 確認 | 確信度 |
|---|---|---|
| 2 つの版が、悪性のコードを理由に crates.io から削除された | 自分で確認（RustSec の助言 2 件、crates.io の索引に無いこと） | 高 |
| 悪いのは 2 つの版だけで、ほかの版は対象外 | 他者の報告（RustSec の助言の版の範囲）、索引に残っていることは自分で確認 | 高 |
| RustSec の番号が割り当てられた日 | 自分で確認（`advisory-db` のコミット履歴） | 高 |
| 2 つの版が、同じ GitHub Actions の実行から公開された | 自分で確認（実行番号と版の番号の一致） | 高 |
| `research` ブランチが 09-06 に書き換えられ、正規のコミットが同じ日時・メッセージのまま差し替えられた | 自分で確認（GitHub の活動記録とコミット） | 高 |
| 悪性の版の中身が、この書き換えられたコミットから作られた | 自分で確認した状況からの判断（実行がそのコミットで動いたこと）。版の中身は見ていない | 中 |
| 中身は PolinRider の亜種で、VS Code で開くと動く | 他者の報告（RustSec の助言） | 中 |
| プロジェクト側のアカウントか、その認証情報が不正に使われた | 自分で確認した状況（同じ日の多数の force push と、09-09 の復旧）と、他社の PolinRider の解析からの判断。プロジェクトからの発表は無い | 中 |
| 実際の利用者はダウンロードしていない | 他者の報告（RustSec の助言。「形跡は無い」という書き方） | 中 |

## 分かっていないこと

- **依存する側のプロジェクトを開いたときに、どうやって動くのか**。RustSec は「依存するプロジェクトを VS Code で開くと動く」と書いていますが、仕組みは書いていません。`cargo` で取得した crate は `~/.cargo/registry/src` に展開されるので、`.vscode/tasks.json` が crate に入っていただけでは、依存する側のプロジェクトを開いても普通は動きません。ビルドのときに依存する側のフォルダへファイルを書き出すなど、別の仕掛けがあったのかは、確認できていません。RustSecJP は検体を入手していません。
- **公開した手段**。プロジェクトの自動公開の仕組みが使われたことは確認できましたが、攻撃者がどうやってリポジトリに書き込めたのか（開発者の手元の感染か、トークンの流出か）は公表されていません。
- **ほかの Greentic の crate**。同じ日に、組織のほかの多くのリポジトリでもブランチが書き換えられていました。そこから別の crate の版が公開されたかは、調べられていません。RustSec の助言が出ているのは、この 2 つだけです。
- **書き換えられたファイルの中身**。`.vscode/tasks.json` や `.vscode/settings.json` に何が書かれていたかは、検体を扱わない方針のため見ていません。`settings.json` で自動のタスクの許可を変えていたかどうかも分かりません。
- **VS Code の初期設定**。この記録の説明は、2026-11-20 時点の VS Code の説明書によります。古い版の VS Code で同じ動きになるかは、確認していません。
- **削除の時刻と、版ごとのダウンロード数**。公表されていません。公開の時刻も、Actions の手順が動いた時間（13:31〜13:32）から推し量っただけです。
- **Nextron Systems の解析**。通報したのは Nextron Systems の研究チームですが、Greentic の件の解析記事は見つかりませんでした。
- **GitHub の助言と OpenSSF の悪性パッケージのデータベースでの番号**。2026-11-20 に OSV と GitHub の助言データベースで 2 つの crate を調べたところ、返ってきたのは RUSTSEC の番号だけで、GHSA と `MAL-` で始まる番号はありませんでした。

## 出典

**一次情報**

- RustSec の助言: [RUSTSEC-2026-0280](https://rustsec.org/advisories/RUSTSEC-2026-0280.html)、[RUSTSEC-2026-0281](https://rustsec.org/advisories/RUSTSEC-2026-0281.html)
- [rustsec/advisory-db](https://github.com/rustsec/advisory-db) のコミット履歴（助言の追加: `0b938ebe`、謝辞の追加: `34654e24`、番号の割り当て: `8a1eb4f9`）
- [greenticai/greentic-setup](https://github.com/greenticai/greentic-setup) の公開データ（リポジトリの活動記録、コミット `04f3e79d` と `c69a4b3e`、GitHub Actions の実行 34027618345）
- Visual Studio Code の説明書「[Tasks](https://code.visualstudio.com/docs/debugtest/tasks)」（`runOn` と `task.allowAutomaticTasks` の節）

**検知した企業の解析（PolinRider 全般。Greentic の件は扱っていない）**

- OpenSourceMalware「[PolinRider caused dozens of npm and Go compromises](https://opensourcemalware.com/blog/polinrider-caused-dozens-of-npm-and-go-compromises)」（2026-07-31）
- Socket「[PolinRider Spreads Through Compromised GitHub Accounts and Packagist](https://socket.dev/blog/polinrider-github-packagist)」（2026-09-17）

**自分で確認したこと（2026-11-20）**

- crates.io の索引（`index.crates.io`）に 2 つの悪性の版が無く、ほかの版は残っていること。依存する 4 つの crate の、残っている全版の依存指定。
- crates.io の API で、2 つの crate のリポジトリと、残っている版の公開アカウント。
- OSV（`api.osv.dev`）と GitHub の助言データベースで、2 つの crate の番号。
- GitHub の API で、上に書いたリポジトリの活動記録、コミット、Actions の実行記録。ファイルの中身は取得していません。

## 更新履歴

- 2026-11-20: 初版
