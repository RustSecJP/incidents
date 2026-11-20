---
title: 助言の日本語版
permalink: /advisories/
---
# 助言の日本語版

RustSec の助言（英語）を日本語にしたものです。原文の訳に加えて、「自分が影響を受けたかの確かめ方」と「直し方」を RustSecJP が書き足しています。

- 番号は RustSec の番号（`RUSTSEC-YYYY-NNNN`）をそのまま使います。RustSecJP は助言の番号を発行しません。
- 原文は原則 CC0 です。GitHub Security Advisory から取り込んだもの（CC BY 4.0）は、各ページに出典を書いています。
- 原文が更新された場合は、原文が正しいものとして扱ってください。

| 番号 | crate | 種類 | 題名 |
|---|---|---|---|
| [`RUSTSEC-2026-0097`]({{ '/advisories/RUSTSEC-2026-0097.html' | relative_url }}) | `rand` | unsound | 独自のロガーから `rand::rng()` を使うと unsound になる |
| [`RUSTSEC-2026-0007`]({{ '/advisories/RUSTSEC-2026-0007.html' | relative_url }}) | `bytes` | メモリ破壊 | `BytesMut::reserve` で整数があふれる |
| [`RUSTSEC-2026-0384`]({{ '/advisories/RUSTSEC-2026-0384.html' | relative_url }}) | `tokio` | 競合状態 | v1.54.0 の `tokio::time::Interval` に競合状態がある |
| [`RUSTSEC-2026-0190`]({{ '/advisories/RUSTSEC-2026-0190.html' | relative_url }}) | `anyhow` | unsound | `Error::downcast_mut()` が unsound |
| [`RUSTSEC-2026-0349`]({{ '/advisories/RUSTSEC-2026-0349.html' | relative_url }}) | `rustls` | 暗号の不備 | 認証前の ServerHello で、以後の接続が従来の鍵交換に格下げされる |

候補は [「日本語版」のラベルの Issue]({{ site.repo_url }}/issues?q=is%3Aissue+is%3Aopen+label%3A%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88) にあります。
