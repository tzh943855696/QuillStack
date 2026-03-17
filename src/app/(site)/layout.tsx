import type { ReactNode } from 'react';
import { getSiteSettings } from '@/lib/data';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  const bodyFontClass = settings.theme.bodyFont === 'PT Sans' ? 'font-body' : '';
  const headlineFontClass = settings.theme.headlineFont === 'Space Grotesk' ? 'font-headline' : '';
  
  return (
    <div className={`${bodyFontClass} ${headlineFontClass}`}>
      <SiteHeader settings={settings} />
      <main className="bg-background">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
