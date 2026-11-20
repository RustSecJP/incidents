---
title: キャンペーン
permalink: /campaigns/
---
# キャンペーン

複数の crate にまたがる攻撃を、1 つの番号（`RSJP-C-YYYY-NNN`）でまとめた記録です。番号の決まりは[番号の仕様]({{ '/spec/campaign-id.html' | relative_url }})を見てください。

<div class="empty" markdown="1">
**公開済みの記録はまだありません。**

準備中の題材は [記事の候補]({{ site.repo_url }}/issues?q=is%3Aissue+is%3Aopen+label%3A%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%9A%E3%83%BC%E3%83%B3) にあります。
</div>

## 記録に載るもの

| 項目 | 中身 |
|---|---|
| 関係する crate | crate と版、対応する RUSTSEC / GHSA / MAL / CVE の番号 |
| 束ねた根拠 | 同じ公開アカウント、同じ通信先、同じコードなど。確信度つき |
| 時系列 | 公開・発見・削除の時刻 |
| 重要度 | [RSJP Score]({{ '/spec/severity-score.html' | relative_url }}) の点数と内訳 |
| 痕跡情報 | ハッシュと、無害化した通信先 |
