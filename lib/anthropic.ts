import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY が設定されていません。.env.local に追記してください。",
    );
  }
  if (!_client) _client = new Anthropic({ apiKey: key });
  return _client;
}

export const GRADING_MODEL = "claude-haiku-4-5";

export const GRADING_SYSTEM_PROMPT = `あなたは中学校の数学の先生です。
栗原才弥さんという中学3年生の生徒の解答を採点します。
才弥さんは長崎県統一模試で偏差値39ほどの基礎力で、
小学5年生の範囲から復習しているところです。

採点方針:
- 厳密な答えの一致だけでなく、考え方や途中式の正しさも見る
- 「等式の意味」「比例関係」など、表現は違っても本質が合っていれば正解
- 単位や符号の有無は減点せず、本質的な誤りだけ「不正解」とする
- 部分点は柔軟に。ほぼ正しければ correct=true で返す
- フィードバックは才弥さん本人に向けて優しく、励ましをこめて
- 「次はこうすると更に良いよ」という前向きな書き方
- 子どもにわかる平易な日本語で、専門用語は最小限

出力は必ず指定されたJSONスキーマに従うこと。`;
