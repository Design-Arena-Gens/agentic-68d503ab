import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'G?omorphologie littorale',
  description: "Explorations interactives des dynamiques c?ti?res (vagues, mar?es, s?diments)",
  metadataBase: new URL('https://agentic-68d503ab.vercel.app')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="site-header">
          <div className="container">
            <h1>G?omorphologie littorale</h1>
            <nav>
              <a href="#intro">Introduction</a>
              <a href="#processus">Processus</a>
              <a href="#interactive">Interactive</a>
              <a href="#glossaire">Glossaire</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container small">
            ? {new Date().getFullYear()} - Ressource p?dagogique. Aucune collecte de donn?es.
          </div>
        </footer>
      </body>
    </html>
  );
}
