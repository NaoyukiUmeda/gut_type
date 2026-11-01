# GutType｜無料の生活習慣チェック

GutMedia（腸と、わたし。）と共通の口調・写真・デザインを使う、7問の生活習慣チェックです。
本番: https://gut-type.pages.dev/
GitHub: https://github.com/NaoyukiUmeda/gut_type

## 読者の流れ
GutMedia → GutTypeで7問に回答 → 振り返る項目と行動例 → GutMediaの食事記録ガイド。
公式LINEは https://lin.ee/t4Y3938 （@859olzde）です。
URLとブランド文言の正本は lib/site.ts。

LINE登録なしでブラウザ内のチェックを完了できます。通常は回答をサーバーへ送信しません。
既存の /liff/diagnosis/ URLと分類ID A〜E、質問ID、得点は引き継ぎます。
結果は医学的分類ではなく、運営側の得点ルールによる振り返り項目です。改善予測やBefore/Afterの画像は表示しません。
旧 ?result=A 等のURLは明示した「結果の例」です。本人確認なしで個人の保存結果とは扱いません。

## 開発・ビルド
Node.js 22。npm ci → npm run dev。
npm run lint / npm test / npm run build / npm run build:cf を使用します。
Next.js 15.5.28 App Router + React + TypeScript、APIはEdge Runtime。
静的exportではありません。out/やwrangler.jsoncによるWorkers配信という旧READMEの記載は誤りです。
既存のCloudflare Pagesプロジェクトは gut-type。mainへのpushがGit連携の公開対象です。
Pagesビルド: npm run build:cf、成果物: .vercel/output/static。
手動配信: npm run deploy。
既存Pages構成を維持します。next-on-pagesの後継基盤への移行は別作業です。

## LINE保存を使う場合
通常チェックは以下の設定がなくても動作します。LINE保存は本人確認・同意の後だけ実行します。
公開ビルド変数:
- NEXT_PUBLIC_LIFF_ID: LINE LoginチャネルのLIFF ID（正しいEndpoint URLを設定）
サーバー変数:
- LINE_LOGIN_CHANNEL_ID: LIFFを所属させたLINE LoginチャネルID。Messaging APIチャネルIDとは別。必須、推測しません。
- LINE_CHANNEL_ACCESS_TOKEN / LINE_CHANNEL_SECRET: 既存Messaging API用
- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY: 保存先
- LIFF_ID: LINEの自動応答から開くLIFF ID
- CRON_SECRET: 運用APIを保護する秘密値

LINE URLは環境変数の # に左右されず、lib/site.ts の確認済みURLを使います。
NEXT_PUBLIC_CONSULT_URL は使いません。相談・商業案内は今回公開しません。
LINE保存の応答は、保存・送信・希望者向け配信登録の成否を分けます。
LINEへのログイン後は同意を再確認し、保存ボタンをもう一度押します。
既存DBの diagnoses.answers_json に _meta（同意版・時刻・配信希望・文言版）を追加保存します。列の追加や既存データの書き換えはありません。
3回配信は希望チェックを選んだ場合だけ新規登録。以前の登録済み配信の解除はLINEブロックまたは既存運用で対応します。
実アカウントへテスト配信は行いません。保存・送信の本番結合は、本人の同意と専用テストアカウントで別途確認してください。

## APIの本人確認
save/latestは、AuthorizationのLINEアクセストークンをLINE側で検証し、チャネルIDと期限を確認してプロフィールを取得します。
ブラウザから渡すユーザーID・表示名・分類・点数は信用しません。保存時はサーバー側で7問を検証し再集計します。
未認証・設定不足・無効な回答はDB/LINE送信に進みません。運用APIは空のCRON_SECRETを受け付けません。
環境設定のdebugエンドポイントは404です。
実データは削除していません。旧Before/After用画像も履歴・ファイルとして保持します。

## 残る運用確認
- 本番のLIFFとLINE_LOGIN_CHANNEL_ID、Supabase、Messaging API設定と疎通
- LINEのリッチメニューやあいさつの案内文・リンク（このrepoの外で管理）
- データ保存期間と削除運用の確定。現状は自動削除なしと表示
- 配信APIの同時実行・送信後DB更新失敗での重複対策。既存スキーマでは厳密な一度限りの配信は保証できません

詳細: docs/GUTMEDIA_ALIGNMENT.md。
