import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const PROMPTS = {
  chat: 'Kamu adalah OTAKnyaROSYID, asisten AI cerdas berbahasa Indonesia.',
  code: 'Kamu adalah Senior Programmer OTAKnyaROSYID. Berikan kode bersih dan jelas.',
  writer: 'Kamu adalah Penulis Konten & SEO profesional.',
  summary: 'Ringkas teks berikut menjadi poin-poin inti yang padat.',
  idea: 'Berikan ide-ide kreatif dan langkah eksekusinya.',
};

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY belum dipasang di pengaturan Vercel.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const { prompt, mode = 'chat' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Teks kosong.' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: PROMPTS[mode] || PROMPTS.chat },
        { role: 'user', content: prompt },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0]?.message?.content || '',
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Gagal terhubung ke OpenAI. Periksa API Key atau saldo akun OpenAI.' },
      { status: 500 }
    );
  }
}
