import Script from 'next/script';

export const metadata = {
  title: 'OTAKnyaROSYID - AI Workspace',
  description: 'Platform AI Multi-Fitur OTAKnyaROSYID',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}

