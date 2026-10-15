import "./globals.css";

// Becomes /404.html (Apache: ErrorDocument 404 /404.html). Bilingual because the language is unknown here.
export const metadata = { title: "404 | Fluxmedia", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body>
        <main className="mx-auto max-w-2xl px-4 py-24">
          <h1 className="text-3xl font-bold">404 – Seite nicht gefunden</h1>
          <p className="mt-4">Diese Seite gibt es nicht (mehr). <a className="underline text-accent" href="/">Zur Startseite</a></p>
          <h2 className="mt-10 text-2xl font-bold" lang="en">404 – Page not found</h2>
          <p className="mt-4" lang="en">This page does not exist. <a className="underline text-accent" href="/en/">Go to the home page</a></p>
        </main>
      </body>
    </html>
  );
}
