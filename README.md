# 腸活スタートタイプ診断

7問で分かる、自分に合った腸活の始め方を提案する診断Webサイト。
結果ページは Before / After の2枚イラストで「現状」と「実践後の未来」を見せる構成。

## 開発環境

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- Node.js 22

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセス可能。

## ビルド（静的エクスポート）

```bash
npm run build
```

`out/` ディレクトリに静的HTMLが生成される。

## デプロイ

main ブランチに push すると、Cloudflare（GitHub連携）が自動デプロイする。

`next build`（`output: "export"`）で生成した `out/` を、
`wrangler.jsonc` の設定で Cloudflare Workers の静的アセットとして配信する。

### Cloudflare ビルド設定

| 項目 | 値 |
|------|-----|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| 配信ディレクトリ | `out`（`wrangler.jsonc` で指定） |

### 環境変数（Cloudflare の管理画面で設定）

| 変数名 | 内容 |
|--------|------|
| `NEXT_PUBLIC_LINE_URL` | LINE公式アカウントのURL |
| `NEXT_PUBLIC_CONSULT_URL` | 個別相談ページのURL |
| `NODE_VERSION` | `22`（wrangler が Node.js 22 以上を要求するため） |

## イラスト

`public/images/types/` に各タイプの Before/After 画像を配置（計10枚）。
リポジトリには仮画像（プレースホルダー）が入っているので、
同じファイル名（`type-{a〜e}-{before,after}.png`）で本番イラストに差し替える。

## 注意事項

本診断は医療診断ではなく、生活習慣からの傾向チェックです。
気になる症状がある場合は医療機関にご相談ください。
