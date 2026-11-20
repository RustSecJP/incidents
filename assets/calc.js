(function(){
  var VER='0.1';
  var AX=[
   {g:'影響'},
   {k:'K',n:'種類',o:[['M','悪意のあるコード'],['U','unsoundness（安全な Rust だけで未定義動作）'],['V','通常の脆弱性']]},
   {k:'I',n:'起きること',o:[['X','任意のコード実行',1],['S','秘密（鍵・トークン・ソース）の窃取',.95],['M','メモリ破壊（未定義動作）',.9],['L','情報漏れ',.6],['D','停止',.5]]},
   {g:'踏まれやすさ'},
   {k:'T',n:'発火の時点',o:[['B','ビルド時（依存に入れるだけで動く）',1],['L','起動時・読み込み時',.95],['C','特定の API を呼んだとき',.85]]},
   {k:'U',n:'踏みやすさ',o:[['N','普通の使い方で踏む',1],['U','珍しい使い方で踏む',.6],['C','わざとらしい使い方でしか踏まない',.3]]},
   {k:'S',n:'安全な Rust だけで踏めるか',o:[['Y','踏める',1],['N','unsafe の契約違反が要る',.5]]},
   {k:'A',n:'信頼できない入力',o:[['R','外部からの入力で届く',1],['C','呼び出し側のコードしだい',.7],['N','届かない（書き手の誤用のみ）',.4],['X','当てはまらない（入力が要らない）',1]]},
   {g:'補正'},
   {k:'R',n:'影響の広さ',o:[['W','とても広い',1],['H','広い',.9],['M','中くらい',.8],['L','狭い',.7],['N','ほぼ使われていない',.6]]},
   {k:'E',n:'確かさ',o:[['X','実際の悪用を確認',1],['P','再現できる',.95],['T','理論上のみ',.8]]},
   {k:'F',n:'修正の状況',o:[['N','修正なし',1],['R','削除・取り下げ済み',.95],['F','修正版あり',.9]]}
  ];
  var box=document.getElementById('axes'),sel={};
  AX.forEach(function(a){
    if(a.g){var h=document.createElement('p');h.className='grp';h.textContent=a.g;box.appendChild(h);return}
    var d=document.createElement('div');d.className='axis';
    var l=document.createElement('label');l.htmlFor='ax-'+a.k;l.textContent=a.n;
    var s=document.createElement('span');s.textContent=a.k;l.appendChild(s);
    var e=document.createElement('select');e.id='ax-'+a.k;
    a.o.forEach(function(o){var p=document.createElement('option');p.value=o[0];p.textContent=o[0]+' ― '+o[1];e.appendChild(p)});
    e.addEventListener('change',calc);d.appendChild(l);d.appendChild(e);box.appendChild(d);sel[a.k]=e;
  });
  function w(k){var a=AX.filter(function(x){return x.k===k})[0];var o=a.o.filter(function(x){return x[0]===sel[k].value})[0];return o[2]}
  function vec(){return 'RSJP-S:'+VER+'/'+AX.filter(function(a){return a.k}).map(function(a){return a.k+':'+sel[a.k].value}).join('/')}
  function calc(){
    var ex=w('T')*w('U')*w('S')*w('A'),base=10*w('I')*ex,raw=base*w('R')*w('E')*w('F');
    var sc=Math.ceil(raw*10-1e-9)/10;
    var b=sc>=9?'緊急':sc>=7?'高':sc>=4?'中':'低';
    document.getElementById('score').textContent=sc.toFixed(1);
    var be=document.getElementById('band');be.textContent=b;be.setAttribute('data-b',b);
    document.getElementById('vec').textContent=vec();
    document.getElementById('steps').textContent='踏まれやすさ '+ex.toFixed(3)+' → 基礎点 '+base.toFixed(2)+' → 補正後 '+raw.toFixed(3);
    history.replaceState(null,'','#'+vec());
  }
  function load(){
    var h=decodeURIComponent(location.hash.slice(1));
    h.split('/').forEach(function(p){var kv=p.split(':');if(sel[kv[0]]&&[].some.call(sel[kv[0]].options,function(o){return o.value===kv[1]}))sel[kv[0]].value=kv[1]});
  }
  function copy(btn,text){
    var t=btn.textContent;
    (navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).then(function(){btn.textContent='コピーしました'},function(){btn.textContent='コピーできませんでした'}).then(function(){setTimeout(function(){btn.textContent=t},1600)});
  }
  document.getElementById('copy').addEventListener('click',function(){copy(this,vec())});
  document.getElementById('share').addEventListener('click',function(){copy(this,location.href)});
  load();calc();
})();
