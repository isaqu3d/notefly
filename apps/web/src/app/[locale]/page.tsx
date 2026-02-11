import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Sparkles, Users2, Zap } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center">
              <FileText className="h-4 w-4 text-background" />
            </div>
            <span className="text-lg font-semibold">Notely</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                {t('signIn')}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">{t('getStarted')}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              <span className="font-medium">Introducing Notely</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t('hero')}
            </h1>

            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              {t('subtitle')}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2">
                  {t('getStarted')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container pb-24 md:pb-32">
          <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{t('features.editor')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('features.editorDesc')}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{t('features.fast')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('features.fastDesc')}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{t('features.team')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('features.teamDesc')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
          <p>{t('footer')}</p>
        </div>
      </footer>
    </div>
  );
}
