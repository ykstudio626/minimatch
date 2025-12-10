import { NextRequest, NextResponse } from 'next/server';
import type { FormData, MatchingResponse } from '@/app/types';

const API_KEY = process.env.DIFY_API_KEY || 'app-RAu9ngTst03pgJXVXrRJgd0Q';
const DIFY_URL = 'https://api.dify.ai/v1/workflows/run';

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();

    // フォームデータを構造化
    const ankenData = {
      案件名: formData.案件名,
      必須スキル: formData.必須スキル,
      単価: formData.単価,
      勤務地および勤務形態: formData.勤務地および勤務形態,
    };

    // DIFY API のペイロード
    const payload = {
      inputs: {
        action: 'matching_yoin',
        anken: JSON.stringify(ankenData),
        text: 'dummy',
      },
      response_mode: 'blocking',
      user: 'mini_match_user',
    };

    console.log('Sending payload to DIFY:', payload);

    const response = await fetch(DIFY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      return NextResponse.json(
        { error: `DIFY API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('DIFY response:', data);

    // レスポンスからテキストを抽出
    if (data.data && data.data.outputs && data.data.outputs.text) {
      const textContent = data.data.outputs.text;

      let parsedResponse: MatchingResponse;

      if (typeof textContent === 'string') {
        try {
          parsedResponse = JSON.parse(textContent);
        } catch (parseErr) {
          console.error('JSON parse error:', parseErr);
          return NextResponse.json(
            { error: 'Failed to parse DIFY response' },
            { status: 500 }
          );
        }
      } else {
        parsedResponse = textContent;
      }

      // バリデーション
      if (!parsedResponse.candidates || !Array.isArray(parsedResponse.candidates)) {
        return NextResponse.json(
          { error: 'Invalid response format: missing candidates array' },
          { status: 500 }
        );
      }

      return NextResponse.json(parsedResponse);
    } else {
      return NextResponse.json(
        { error: 'Invalid DIFY response structure' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
