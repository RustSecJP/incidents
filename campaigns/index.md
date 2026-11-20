---
title: キャンペーン
permalink: /campaigns/
---
# キャンペーン

複数の crate にまたがる攻撃を、1 つの番号（`RSJP-C-YYYY-NNN`）でまとめた記録です。番号の決まりは[番号の仕様]({{ '/spec/campaign-id.html' | relative_url }})を見てください。

| 番号 | 題名 | 期間 | crate の数 | 初版 |
|---|---|---|---|---|
| [`RSJP-C-2023-001`]({{ '/campaigns/RSJP-C-2023-001/' | relative_url }}) | 有名な crate を装い、build.rs でホストの情報を Telegram へ送る crate | 2023-08-14〜08-18 | 8 | 2026-11-20 |
| [`RSJP-C-2023-002`]({{ '/campaigns/RSJP-C-2023-002/' | relative_url }}) | 利用者 http-tiny が公開した、build.rs でホストの情報を送る crate | 不明〜2023-11-06 | 2 | 2026-11-20 |
| [`RSJP-C-2023-003`]({{ '/campaigns/RSJP-C-2023-003/' | relative_url }}) | 利用者 Kraded が公開した、Windows でマルウェアを動かす名前の偽装 crate 12 個 | 不明〜2023-11-15 | 12 | 2026-11-20 |
| [`RSJP-C-2023-004`]({{ '/campaigns/RSJP-C-2023-004/' | relative_url }}) | 利用者 TerryDavisSoldier が公開した、Windows でマルウェアを動かす名前の偽装 crate 3 つ | 不明〜2023-11-18 | 3 | 2026-11-20 |
| [`RSJP-C-2023-005`]({{ '/campaigns/RSJP-C-2023-005/' | relative_url }}) | 利用者 gabielle55131 が公開した、Windows でマルウェアを動かす名前の偽装 crate 2 つ | 不明〜2023-11-20 | 2 | 2026-11-20 |
| [`RSJP-C-2025-001`]({{ '/campaigns/RSJP-C-2025-001/' | relative_url }}) | finch を装う crate と、認証情報を盗む sha-* 依存 | 2025-11-20〜12-09 | 5 | 2026-11-20 |
| [`RSJP-C-2025-002`]({{ '/campaigns/RSJP-C-2025-002/' | relative_url }}) | EVM の道具を装う evm-units と、それを起動時に呼ぶ uniswap-utils | 2025-04〜12-02 | 2 | 2026-11-20 |
| [`RSJP-C-2025-003`]({{ '/campaigns/RSJP-C-2025-003/' | relative_url }}) | 同じ利用者が 2025 年 3 月に公開し、ビルド環境の情報を外部へ送ろうとした 4 つの crate | 2025-03-01〜2026-11 | 4 | 2026-11-20 |
| [`RSJP-C-2025-004`]({{ '/campaigns/RSJP-C-2025-004/' | relative_url }}) | 他社のプロジェクトにある未公開の名前で公開され、ホストの環境の情報を送ろうとした 5 つの crate | 2025-01-30〜2026-03-30 | 5 | 2026-11-20 |
| [`RSJP-C-2026-001`]({{ '/campaigns/RSJP-C-2026-001/' | relative_url }}) | polymarket-client-sdk を装う crate と、Polymarket の認証情報を狙う一連の公開 | 2026-02-05〜02-26 | 9 | 2026-11-20 |
| [`RSJP-C-2026-002`]({{ '/campaigns/RSJP-C-2026-002/' | relative_url }}) | 時刻ユーティリティを装い、timeapi.io に似せた送信先へ .env を送る crate | 2026-02-28〜03-10 | 5 | 2026-11-20 |
| [`RSJP-C-2026-003`]({{ '/campaigns/RSJP-C-2026-003/' | relative_url }}) | 同じ利用者が持っていた pretty-changelog-logger、microsoftsystem64、safe-agent-rs | 2026-03-24〜04-14 | 3 | 2026-11-20 |
| [`RSJP-C-2026-004`]({{ '/campaigns/RSJP-C-2026-004/' | relative_url }}) | arrayref など 3 つの正規 crate の乗っ取りと、proc-macro2 を装う proc-macro1 | 2026-08-18〜08-20 | 9 | 2026-11-20 |
| [`RSJP-C-2026-005`]({{ '/campaigns/RSJP-C-2026-005/' | relative_url }}) | greentic-setup と greentic-setup-dev に混入した PolinRider の亜種 | 2026-09-06〜09-07 | 2 | 2026-11-20 |
| [`RSJP-C-2026-006`]({{ '/campaigns/RSJP-C-2026-006/' | relative_url }}) | 同じ利用者が 2026 年 1 月〜2 月に公開し、ビルド環境の情報を外部へ送ろうとした electrumd と gabby-types-sec | 2026-01-26〜2026-11 | 2 | 2026-11-20 |

準備中の題材は [記事の候補]({{ site.repo_url }}/issues?q=is%3Aissue+is%3Aopen+label%3A%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%9A%E3%83%BC%E3%83%B3) にあります。

## 記録に載るもの

| 項目 | 中身 |
|---|---|
| 関係する crate | crate と版、対応する RUSTSEC / GHSA / MAL / CVE の番号 |
| 束ねた根拠 | 同じ公開アカウント、同じ通信先、同じコードなど。確信度つき |
| 時系列 | 公開・発見・削除の時刻 |
| 痕跡情報 | ハッシュと、無害化した通信先 |
