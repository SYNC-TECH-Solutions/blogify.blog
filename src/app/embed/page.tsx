
'use client';

import Script from 'next/script';

export default function EmbedTestPage() {
  return (
    <>
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Embed Script Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page is for testing the blog post embed widget.
        </p>
        
        <div id="blogify-embed-root"></div>
      
      </main>
      <Script
        src="https://embedblogify.netlify.app/embed.js"
        strategy="lazyOnload"
      />
    </>
  );
}
