import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { resolveContent } from '../lib/content';
import './globals.css';

const manrope = localFont({ src: [
  { path: '../../public/assets/fonts/manrope-latin-400-normal.woff2', weight: '400' },
  { path: '../../public/assets/fonts/manrope-latin-600-normal.woff2', weight: '600' },
  { path: '../../public/assets/fonts/manrope-latin-800-normal.woff2', weight: '800' },
], variable: '--font-body', display: 'swap' });
const mono = localFont({ src: '../../public/assets/fonts/ibm-plex-mono-latin-400-normal.woff2', variable: '--font-mono', display: 'swap', preload: false });
export const metadata: Metadata = {
  icons: { icon:'/favicon.svg' },
  title: 'Ahmed Esmail — AI & Machine Learning Engineer',
  description: 'Computer vision, language systems and generative AI. The portfolio of Ahmed Esmail.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, direction } = resolveContent();
  return <html lang={locale} dir={direction}><body className={`${manrope.variable} ${mono.variable}`}>
    {/* Guard confirmed metadata reinjection only until the client hydration commit. */}
    <Script id="normalize-grammarly-metadata" strategy="beforeInteractive">{`(()=>{
      const names=['data-new-gr-c-s-check-loaded','data-gr-ext-installed'];
      let observer;
      function clean(){for(const name of names)document.body?.removeAttribute(name);}
      function start(){if(!document.body)return;observer?.disconnect();
        observer=new MutationObserver(clean);observer.observe(document.body,{attributes:true,attributeFilter:names});clean();}
      if(document.body)start();else{observer=new MutationObserver(start);observer.observe(document.documentElement,{childList:true,subtree:true});}
      window.addEventListener('portfolio:hydrated',()=>{observer?.disconnect();clean();},{once:true});
    })();`}</Script>
    <a className="skip-link" href="#hero-title">Skip to content</a>{children}
  </body></html>;
}
