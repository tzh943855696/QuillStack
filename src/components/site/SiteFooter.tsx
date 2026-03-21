import type { SiteSettings } from '@/lib/types';
import Link from 'next/link';
import { Code, Feather, Anchor } from 'lucide-react';

type SiteFooterProps = {
  settings: SiteSettings;
};

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="w-9 h-9 bg-muted hover:bg-secondary transition-colors flex items-center justify-center rounded-md text-muted-foreground font-bold">
    {children}
  </a>
);

const FooterLogo = ({ iconName }: { iconName?: string }) => {
  const isUrl = iconName?.startsWith('http');

  const renderIcon = () => {
    if (isUrl) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={iconName} alt="logo" className="w-5 h-5" />;
    }
    switch (iconName) {
      case 'Feather':
        return <Feather size={20} />;
      case 'Anchor':
        return <Anchor size={20} />;
      case 'Code':
      default:
        return <Code size={20} />;
    }
  };

  return (
    <div className="w-8 h-8 flex items-center justify-center text-foreground">
      {renderIcon()}
    </div>
  );
};


export default function SiteFooter({ settings }: SiteFooterProps) {
  const { footer } = settings;

  return (
    <footer className="bg-background text-foreground mt-16 md:mt-24">
      <div className="container mx-auto px-4">
        <div className="relative bg-card rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* Halo effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none opacity-40"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand */}
            <div className="space-y-4 pr-8">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
                <FooterLogo iconName={footer.logoIcon} />
                <span>{footer.brandName}</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {footer.brandDescription}
              </p>
              <div className="flex items-center gap-2 pt-2">
                {footer.socialLinks.map(social => (
                  <SocialIcon key={social.id} href={social.href}>{social.label}</SocialIcon>
                ))}
              </div>
            </div>

            {/* Columns 2-4: Links */}
            {footer.linkSections.map(section => (
              <div key={section.id} className="space-y-4">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.id}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <div className="space-y-1 text-center md:text-left">
                <p>{footer.text}</p>
                <p>{footer.madeIn}</p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                {footer.legalLinks.map(link => (
                    <Link key={link.id} href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Spacer to give room for the oversized footer */}
      <div className="h-12"></div> 
    </footer>
  );
}
