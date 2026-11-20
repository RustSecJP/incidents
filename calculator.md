---
title: 計算ツール
permalink: /calculator/
wide: true
---
# RSJP Score 計算ツール

軸を選ぶと、点数と内訳の文字列がその場で出ます。式と重みは[採点方式（草案 0.1）]({{ '/spec/severity-score.html' | relative_url }})のとおりです。草案なので、点数は今後変わることがあります。

<div class="calc" data-no-toc markdown="0">
  <div class="axes" id="axes"></div>
  <div class="result" aria-live="polite">
    <div class="score" id="score">–</div>
    <div class="band" id="band">–</div>
    <code class="vec" id="vec"></code>
    <button type="button" id="copy">文字列をコピー</button>
    <button type="button" id="share">この結果へのリンクをコピー</button>
    <p class="steps" id="steps"></p>
  </div>
</div>
<script src="{{ '/assets/calc.js' | relative_url }}" defer></script>
