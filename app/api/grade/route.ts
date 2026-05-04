import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getClient, GRADING_MODEL, GRADING_SYSTEM_PROMPT } from "@/lib/anthropic";
import type { GradeResponse, Question } from "@/lib/types";

interface GradeRequestBody {
  question: Question;
  userAnswer: string;
}

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: {
      type: "boolean",
      description:
        "解答が本質的に正しければ true。途中式や考え方が合っていれば部分的なミスは許容して true にする。",
    },
    score: {
      type: "integer",
      description: "0〜100 の点数。完璧なら100、間違いだが惜しい場合 50〜70。",
    },
    feedback: {
      type: "string",
      description:
        "junior 本人に向けたコメント。優しく具体的に、励ましをこめて。100字程度。",
    },
    hint: {
      type: "string",
      description:
        "間違えた場合の次のアクション提案。正解の場合は「この調子で次へ！」など短い励まし。",
    },
  },
  required: ["correct", "score", "feedback", "hint"],
} as const;

export async function POST(req: Request) {
  let body: GradeRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が不正です" },
      { status: 400 },
    );
  }

  const { question, userAnswer } = body;
  if (!question || typeof userAnswer !== "string") {
    return NextResponse.json(
      { error: "question と userAnswer が必要です" },
      { status: 400 },
    );
  }

  const userPrompt = [
    `問題カテゴリ: ${question.category}`,
    `問題文:\n${question.question}`,
    `模範解答: ${question.answer}`,
    question.acceptableAnswers && question.acceptableAnswers.length > 0
      ? `他の許容解答: ${question.acceptableAnswers.join(", ")}`
      : null,
    `模範解説:\n${question.explanation}`,
    "",
    `junior の解答:\n${userAnswer.trim() || "(無回答)"}`,
    "",
    "上記の解答を採点し、指定のJSON形式で返してください。",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: GRADING_MODEL,
      max_tokens: 800,
      system: GRADING_SYSTEM_PROMPT,
      output_config: {
        format: {
          type: "json_schema",
          schema: RESPONSE_SCHEMA,
        },
      },
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    if (!textBlock) {
      return NextResponse.json(
        { error: "AI から有効な応答が得られませんでした" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(textBlock.text) as GradeResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "APIキーが無効です。.env.local を確認してください。" },
        { status: 401 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "API のリクエスト上限に達しました。少し待ってから試してね。" },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API エラー: ${error.message}` },
        { status: error.status ?? 500 },
      );
    }
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
