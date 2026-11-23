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

    if (!modelsRes.ok) {
      return NextResponse.json(
        { error: modelsData.error?.message || 'API Key Groq tidak valid.' },
        { status: 500 }
      );
    }

    const allIds = (modelsData.data || []).map((m) => m.id);
    const chatCandidates = allIds.filter(
      (id) =>
        !id.toLowerCase().includes('whisper') &&
        !id.toLowerCase().includes('guard') &&
        !id.toLowerCase().includes('tts') &&
        !id.toLowerCase().includes('embed')
    );

    if (chatCandidates.length === 0) {
      return NextResponse.json(
        { error: `Tidak ada model chat aktif. Daftar model: ${allIds.join(', ')}` },
        { status: 500 }
      );
    }

    let lastError = 'Gagal memproses AI.';
    for (const modelId of chatCandidates) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: PROMPTS[mode] || PROMPTS.chat },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (response.ok && data.choices?.[0]?.message?.content) {
        return NextResponse.json({ result: data.choices[0].message.content });
      }
      lastError = data.error?.message || lastError;
    }

    return NextResponse.json(
      { error: `${lastError} (Model dicek: ${chatCandidates.join(', ')})` },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan koneksi server.' },
      { status: 500 }
    );
  }
}
