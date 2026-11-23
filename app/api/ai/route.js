import { NextResponse } from 'next/server';

const PROMPTS = {
  chat: 'Kamu adalah OTAKnyaROSYID, asisten AI cerdas berbahasa Indonesia.',
  code: 'Kamu adalah Senior Programmer OTAKnyaROSYID. Berikan kode bersih dan jelas.',
  writer: 'Kamu adalah Penulis Konten & SEO profesional.',
  summary: 'Ringkas teks berikut menjadi poin-poin inti yang padat.',
  idea: 'Berikan ide-ide kreatif dan langkah eksekusinya.',
};

export async function POST(req) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY belum dipasang di Vercel.' },
        { status: 500 }
      );
    }

    const { prompt, mode = 'chat' } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Teks kosong.' }, { status: 400 });
    }

    const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const modelsData = await modelsRes.json();
    const availableIds = (modelsData.data || []).map((m) => m.id);

    const textModels = availableIds.filter(
      (id) =>
        !id.includes('whisper') &&
        !id.includes('guard') &&
        !id.includes('tts')
    );

    const chosenModel =
      textModels.find((id) => id.includes('70b')) ||
      textModels.find((id) => id.includes('llama')) ||
      textModels[0] ||
      'llama-3.1-8b-instant';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosenModel,
        messages: [
          { role: 'system', content: PROMPTS[mode] || PROMPTS.chat },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Gagal memproses AI.' },
        { status: 500 }
      );
    }

    const result = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan koneksi server.' },
      { status: 500 }
    );
  }
}
