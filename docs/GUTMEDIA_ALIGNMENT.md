# GutMediaとの整合（2026-11-01）

## 基準と判断
既存GutMedia本番HPと食事記録ガイドを実装対象に固定しました。Referoの既存Kinfolk参照と、承認済みの実用的な口調を引き継ぎます。
参照:
- https://gutmedia.naonet-dorahhe.workers.dev/
- https://gutmedia.naonet-dorahhe.workers.dev/guides/food-notes
- https://styles.refero.design/style/ac9b040e-36aa-4881-ada5-72d4744947a4
- https://developers.line.biz/en/docs/liff/using-user-profile/

| 判断 | 根拠・扱い |
|---|---|
| 暖色の背景、深い緑の主ボタン、明朝見出し | GutMediaの既存配色・意味を維持 |
| 写真は同じ食卓を再利用 | 続きの体験にする。AI生成表示を付け、効果の証拠にしない |
| HTMLで3段の流れ、写真とメモの比較図 | 読み上げとスマホの縦並びを保つ |
| 質問後の次へ・戻る | 選択ミスを修正できる。自動遷移と連打による二重完了をなくす |
| 結果は確認項目と記録の行動例 | 個人の菌・症状原因・3週間後の改善は判定できない |
| 同じ公式LINEとGutMediaガイド | # の入口、未確認の予約・商業案内をなくす |
| 通常はブラウザ内集計 | LINE未設定でも使える。保存は明示の選択と本人確認後 |
| 保存APIの検証 | ユーザーIDだけでは本人確認にならない。LINE公式仕様に従う |

## 互換性
A〜Eと質問・選択肢ID、採点値を保持。表示は振り返り項目へ統一。
同点主分類は旧優先順位D/B/C/A/Eを維持。副候補は主画面で医学的意味を持たせない。
保存済みのレコードを再分類・削除しない。旧結果URLは「例」と表示し、ログインした本人の結果のみ取得できる。
希望者向けLINE配信の文章も同じ行動例とGutMediaリンクへ統一。今回の作業で実ユーザーへ配信操作はしない。

## 写真
GutMediaで生成した public/images/food-notes.webp と food-notes-og.jpg を再利用。
元のプロンプトと生成記録は GutMedia/docs/DESIGN.md。追加生成・追加課金なし。

## 公開前の確認
lint、型、Next.js/Pagesビルド。採点・不正回答・認証（欠落/誤チャネル/期限/正当トークン）のテスト。
PC/スマホのトップ、7問、戻る、選び直し、結果、旧結果URL、情報ページを確認。
本番の利用者情報を読み取る、保存する、LINEを送るテストは行わない。

## 検証結果と基盤
- Next.js 15.5.28、LINE SDK 2.31.1へ更新。採点・認証・保存・任意配信の回帰テスト11件通過。
- ローカル本番ビルド、1440/390/320pxの画面・フロー・未認証APIを29項目確認。エラー・横はみ出しなし。
- npm audit --omit=dev は0件。開発用の旧next-on-pages/Vercelツール群には指摘が残り、後継基盤への移行は別作業。
- next-on-pagesはWindowsでVercelコマンド起動に失敗するため、Git連携のLinuxプレビュービルドで配信形式を確認する。
