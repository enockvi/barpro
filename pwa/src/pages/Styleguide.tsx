import { useState } from 'react';
import { Button, Input, Badge, Card, SegmentedControl, TabBar, StatCard, Money, Logo } from '../components';
import { Home, Box, TrendingUp, Package, AlertTriangle, FileText, Sun, Moon } from 'lucide-react';

function StyleGuide() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle('dark', !dark);
  };

  const tabs = [
    { key: 'home', label: 'Accueil', icon: <Home size={24} strokeWidth={1.75} fill="none" /> },
    { key: 'pos', label: 'Vente', icon: <Package size={24} strokeWidth={1.75} fill="none" /> },
    { key: 'stock', label: 'Stock', icon: <Box size={24} strokeWidth={1.75} fill="none" /> },
    { key: 'alerts', label: 'Pénurie', icon: <AlertTriangle size={24} strokeWidth={1.75} fill="none" /> },
    { key: 'inventory', label: 'Inventaire', icon: <FileText size={24} strokeWidth={1.75} fill="none" /> },
    { key: 'stats', label: 'Stats', icon: <TrendingUp size={24} strokeWidth={1.75} fill="none" /> },
  ];

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <div className="bg-paper dark:bg-forest-deep min-h-screen text-ink dark:text-paper">
        <header className="bg-forest text-white py-6 px-6 flex items-center justify-between">
          <Logo size="lg" />
          <button
            onClick={toggleDark}
            className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            {dark ? <Sun size={16} strokeWidth={1.75} fill="none" /> : <Moon size={16} strokeWidth={1.75} fill="none" />}
            {dark ? 'Mode clair' : 'Mode sombre'}
          </button>
        </header>

        <main className="px-6 py-8 space-y-12 max-w-4xl mx-auto">
          {/* Colors */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Couleurs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Forêt', hex: '#0B3322' },
                { name: 'Forêt deep', hex: '#06231A' },
                { name: 'Sous-bois', hex: '#1F5C3F' },
                { name: 'Papier', hex: '#F5F8F3' },
                { name: 'Citron', hex: '#8BFA5A' },
                { name: 'Alerte', hex: '#F5B841' },
                { name: 'Erreur', hex: '#FF6B5B' },
                { name: 'Neutre', hex: '#5E7266' },
              ].map((c) => (
                <div key={c.name} className="rounded-2xl overflow-hidden shadow-soft">
                  <div className="h-16" style={{ backgroundColor: c.hex }} />
                  <div className="p-2 bg-white dark:bg-forest text-xs font-mono">
                    <div className="font-semibold dark:text-paper">{c.name}</div>
                    <div className="text-neutral dark:text-neutral/70">{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Typographie</h2>
            <div className="space-y-2">
              <p className="font-sans text-4xl font-extrabold tracking-tight text-forest-deep dark:text-paper">Gestion stock — H1</p>
              <p className="font-sans text-2xl font-bold tracking-tight text-forest-deep dark:text-paper">Ventes par buvette — H2</p>
              <p className="font-sans text-xl font-semibold text-forest-deep dark:text-paper">Boissons en rupture — H3</p>
              <p className="font-sans text-base text-ink dark:text-paper/90">Chaque mouvement de stock est enregistré avec l'heure, le responsable et la buvette concernée. — Body</p>
              <p className="font-mono text-sm text-ink dark:text-paper/80">1 200 F CFA — JetBrains Mono</p>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Boutons</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg">Principal</Button>
              <Button variant="dark" size="lg">Sombre</Button>
              <Button variant="ghost" size="lg">Fantôme</Button>
              <Button variant="danger" size="lg">Danger</Button>
              <Button variant="whatsapp" size="lg">WhatsApp</Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <Button variant="primary" size="sm">Petit</Button>
              <Button variant="dark" size="md">Moyen</Button>
              <Button variant="primary" fullWidth size="lg">Plein largeur</Button>
            </div>
          </section>

          {/* Inputs */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Champs</h2>
            <div className="space-y-3 max-w-sm">
              <Input label="Nom de la boisson" placeholder="Castel 65 cl" />
              <Input label="Quantité" type="number" placeholder="24" hint="Nombre de bouteilles" />
              <Input label="Code" mono placeholder="ABCD1234" hint="Code d'abonnement" />
              <Input label="Erreur" error="Ce champ est requis" placeholder="Exemple erreur" />
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Badges</h2>
            <div className="flex flex-wrap gap-3">
              <Badge variant="in-stock">En stock</Badge>
              <Badge variant="new">Nouveau</Badge>
              <Badge variant="low-stock">Stock bas</Badge>
              <Badge variant="out-of-stock">Rupture</Badge>
              <Badge variant="in-stock" count={12}>Avec compteur</Badge>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Cartes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <div className="font-semibold text-forest-deep dark:text-paper">Carte classique</div>
                <p className="text-sm text-neutral mt-1">Ombre douce, rayon 22px.</p>
              </Card>
              <Card padding="sm">
                <div className="font-semibold text-forest-deep dark:text-paper">Petit padding</div>
                <p className="text-sm text-neutral mt-1">Padding réduit.</p>
              </Card>
            </div>
          </section>

          {/* SegmentedControl */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">SegmentedControl</h2>
            <SegmentedControl
              segments={[
                { key: 'day', label: "Aujourd'hui" },
                { key: 'week', label: 'Semaine' },
                { key: 'month', label: 'Mois' },
              ]}
              active="month"
              onChange={() => {}}
            />
          </section>

          {/* StatCard */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">StatCard</h2>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Ventes du jour" value={248000} sub="72 % de l'objectif" trend="up" trendValue="+12 %" />
              <StatCard label="Bouteilles" value={1842} sub="Ce mois-ci" />
              <StatCard label="Caisse" value={248000} />
              <StatCard label="Alertes" value={3} sub="Stock bas" trend="down" trendValue="-2" />
            </div>
          </section>

          {/* Money */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Money (JetBrains Mono)</h2>
            <div className="space-y-2 font-mono">
              <Money value={248000} className="text-2xl text-forest-deep dark:text-citron" />
              <Money value={1000} className="text-lg text-neutral" small />
              <Money value={0} className="text-base text-error" small />
            </div>
          </section>

          {/* TabBar */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">TabBar (mobile)</h2>
            <div className="max-w-xs mx-auto border rounded-[44px] overflow-hidden shadow-soft bg-white dark:bg-forest">
              <TabBar tabs={tabs} active="pos" onChange={() => {}} />
            </div>
          </section>

          {/* Logo sizes */}
          <section>
            <h2 className="text-xl font-extrabold text-forest-deep dark:text-paper mb-4">Logo</h2>
            <div className="flex items-end gap-6">
              <Logo size="sm" showText={false} />
              <Logo size="md" showText={false} />
              <Logo size="lg" showText={false} />
              <Logo size="lg" />
            </div>
          </section>

        </main>

        <footer className="py-8 text-center text-sm text-neutral">
          BarPro — Charte graphique · Composants de base
        </footer>
      </div>
    </div>
  );
}

export default StyleGuide;
