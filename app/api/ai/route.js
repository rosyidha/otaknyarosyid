import { NextResponse } from 'next/server';

const PROMPTS = {
  chat: 'Kamu adalah OTAKnyaROSYID, asisten AI cerdas berbahasa Indonesia.',
  code: 'Kamu adalah Senior Programmer OTAKnyaROSYID. Berikan kode bersih dan jelas.',
  writer: 'Kamu adalah Penulis Konten & SEO profesional.',
  summary: 'Ringkas teks berikut menjadi poin-poin inti yang padat.',
  idea: 'Berikan ide-ide kreatif dan langkah eksekusinya.',
};

const MODELS = [
  'gemini-3.8-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-3.8-flash',
];

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY belum dipasang di Vercel.' },
        { status: 500 }
      );
    }

    const { prompt, mode = 'chat' } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Teks kosong.' }, { status: 400 });
    }

    const systemInstruction = PROMPTS[mode] || PROMPTS.chat;
    let lastError = 'Server AI sedang sibuk, silakan coba sesaat lagi.';

    for (const model of MODELS) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${systemInstruction}\n\nPermintaan pengguna:\n${prompt}` }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json({ result });
      }

      lastError = data.error?.message || lastError;
    }

    return NextResponse.json({ error: lastError }, { status: 503 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan koneksi server.' },
      { status: 500 }
    );
  }
}
