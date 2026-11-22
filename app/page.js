'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Code2,
  PenTool,
  FileText,
  Lightbulb,
  Send,
  Copy,
  Check,
  Trash2,
  Cpu,
  Sliders
} from 'lucide-react';

const MODULES = [
  {
    id: 'chat',
    name: 'Chat Pintar',
    desc: 'Asisten AI serba bisa untuk tanya jawab & diskusi cepat.',
    icon: MessageSquare,
    placeholder: 'Tanyakan apa saja pada OTAKnyaROSYID...'
  },
  {
    id: 'code',
    name: 'Generator Kode',
    desc: 'Buat kode program, perbaiki bug, dan jelaskan logika pemrograman.',
    icon: Code2,
    placeholder: 'Contoh: Buatkan fungsi validasi email menggunakan JavaScript...'
  },
  {
    id: 'writer',
    name: 'Penulis & SEO',
    desc: 'Tulis artikel, caption media sosial, email, dan copywriting.',
    icon: PenTool,
    placeholder: 'Contoh: Buatkan artikel pendek tentang manfaat kopi Arabika...'
  },
  {
    id: 'summary',
    name: 'Ringkas Teks',
    desc: 'Ubah teks atau materi panjang menjadi poin-poin inti yang padat.',
    icon: FileText,
    placeholder: 'Tempelkan teks panjang yang ingin diringkas di sini...'
  },
  {
    id: 'idea',
    name: 'Generator Ide',
    desc: 'Cari ide bisnis, konten kreatif, dan strategi eksekusi.',
    icon: Lightbulb,
    placeholder: 'Contoh: Berikan 5 ide konten kreatif untuk promosi kerajinan tangan...'
  }
];

export default function OtaknyaRosyidApp() {
  const [activeMode, setActiveMode] = useState('chat');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentModule = MODULES.find((m) => m.id === activeMode) || MODULES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode: activeMode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(`⚠️ Terjadi kesalahan: ${data.error || 'Gagal memproses permintaan.'}`);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      setResult('⚠️ Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                OTAKnyaROSYID
              </h1>
              <p className="text-xs text-slate-400">All-in-One AI Workspace</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Aktif
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Pilihan Modul AI */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Pilih Modul Kecerdasan
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeMode === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    setActiveMode(mod.id);
                    setResult('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold">{mod.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Modul Aktif */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-sm text-slate-300">{currentModule.desc}</p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={currentModule.placeholder}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none text-sm leading-relaxed"
            />
            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                title="Hapus teks"
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Sedang Memproses...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Proses dengan {currentModule.name}
              </>
            )}
          </button>
        </form>

        {/* Hasil Output AI */}
        {result && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Hasil {currentModule.name}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Hasil
                  </>
                )}
              </button>
            </div>
            <div className="p-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Ditenagai oleh AI &bull; Dibangun oleh OTAKnyaROSYID
      </footer>
    </div>
  );
}
