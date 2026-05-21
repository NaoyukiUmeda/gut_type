# 腸活タイプ診断

12問で分かる、自分に合った腸活の始め方を提案する診断Webサイト。

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
| `NODE_VERSION` | `22`（wrangler が Node.js 22 以上を要求するため） |

## 注意事項

本診断は医療診断ではなく、生活習慣からの傾向チェックです。
気になる症状がある場合は医療機関にご相談ください。
