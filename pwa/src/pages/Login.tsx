import { useState } from 'react';
import { Logo } from '../components';

type Role = 'manager' | 'owner' | null;
type Screen = 'link' | 'intro' | 'install' | 'code' | 'pin' | 'home';

interface LoginProps {
  onLogin: (role: Role) => void;
}

function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>(null);
  const [screen, setScreen] = useState<Screen>('link');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [trialDays, setTrialDays] = useState(7);
  const [subscribed, setSubscribed] = useState(false);

  const handleLinkOpen = () => {
    // Simulate link opening
    setRole('owner');
    setScreen('intro');
  };

  const handleManagerLink = () => {
    setRole('manager');
    setScreen('intro');
  };

  const handleCodeSubmit = () => {
    if (code.length < 6) {
      setError('Code trop court');
      return;
    }
    setSubscribed(true);
    setScreen('home');
    onLogin(role);
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      setError('PIN à 4 chiffres');
      return;
    }
    setScreen('home');
    onLogin(role);
  };

  const renderLinkScreen = () => (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-extrabold text-forest-deep">Bienvenue</h1>
          <p className="text-neutral mt-2 text-sm">Ouvrez le lien reçu par WhatsApp pour accéder à votre buvette</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 mb-4">
          <div className="text-sm font-semibold text-forest-deep mb-2">Votre lien d'accès</div>
          <p className="text-xs text-neutral mb-4">Ce lien ne fonctionne qu'une seule fois et est lié à votre appareil.</p>
          <button onClick={handleLinkOpen} className="w-full h-12 rounded-full bg-citron text-forest-deep font-bold">
            Ouvrir le lien
          </button>
        </div>

        <div className="text-center">
          <div className="text-xs text-neutral mb-3">ou</div>
          <button onClick={handleManagerLink} className="text-sm font-semibold text-forest underline">
            Je suis gérant
          </button>
        </div>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="min-h-screen bg-forest text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Logo size="lg" className="mb-8" />
        <h1 className="text-3xl font-extrabold text-center mb-4">
          {role === 'manager' ? 'Vendez en un geste' : 'Suivez vos ventes'}
        </h1>
        <p className="text-white/70 text-center text-base leading-relaxed">
          {role === 'manager'
            ? 'Un clic sur une boisson ajoute une bouteille. Le stock se met à jour tout seul.'
            : 'Chaque ticket du gérant apparaît sur votre téléphone, avec les totaux de la journée.'}
        </p>
      </div>

      <div className="p-6 space-y-3">
        <button onClick={() => setScreen('install')} className="w-full h-14 rounded-full bg-citron text-forest-deep font-bold text-lg">
          Continuer
        </button>
        <button onClick={() => setScreen('home')} className="w-full h-12 rounded-full border-2 border-white/30 text-white font-semibold">
          Passer l'introduction
        </button>
      </div>
    </div>
  );

  const renderInstall = () => (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-extrabold text-forest-deep mb-4">Installer BarPro</h1>
          <p className="text-neutral mb-6">Ouvrez l'application depuis votre écran d'accueil, comme une vraie appli.</p>

          {role === 'owner' ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-soft p-4">
                <div className="font-bold text-sm text-forest-deep mb-2">Sur iPhone</div>
                <ol className="text-sm text-neutral space-y-1 list-decimal list-inside">
                  <li>Ouvrez Safari</li>
                  <li>Appuyez sur le bouton Partager</li>
                  <li>Choisissez "Sur l'écran d'accueil"</li>
                </ol>
              </div>
              <div className="bg-white rounded-2xl shadow-soft p-4">
                <div className="font-bold text-sm text-forest-deep mb-2">Sur Android</div>
                <ol className="text-sm text-neutral space-y-1 list-decimal list-inside">
                  <li>Ouvrez Chrome</li>
                  <li>Appuyez sur le menu (⋮)</li>
                  <li>Choisissez "Installer l'application"</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800">
              L'application est déjà installée. Vous pouvez commencer à vendre.
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <button onClick={() => setScreen('code')} className="w-full max-w-sm mx-auto block h-12 rounded-full bg-citron text-forest-deep font-bold">
          J'ai installé l'application
        </button>
      </div>
    </div>
  );

  const renderCode = () => (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-extrabold text-forest-deep mb-2">Code d'abonnement</h1>
          <p className="text-neutral mb-6">Entrez le code reçu par WhatsApp pour activer votre abonnement.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral mb-1">Code d'abonnement</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="ABCD-1234-EFGH"
                className="w-full h-14 rounded-xl border-0 bg-white shadow-soft px-4 text-center text-xl font-mono tracking-widest outline-none focus:ring-2 focus:ring-sous-bois/40"
              />
            </div>

            {error && (
              <div className="bg-error/10 text-error rounded-xl p-3 text-sm">{error}</div>
            )}

            <button onClick={handleCodeSubmit} className="w-full h-12 rounded-full bg-citron text-forest-deep font-bold">
              Activer
            </button>

            <div className="text-center">
              <button onClick={() => setScreen('trial')} className="text-sm text-neutral font-semibold">
                Essayez gratuitement pendant {trialDays} jours
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrial = () => (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-limeSoft grid place-items-center mx-auto mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0B3322" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-deep mb-2">Essai gratuit</h1>
          <p className="text-neutral mb-6">Votre essai de {trialDays} jours commence. Vous pourrez tester toutes les fonctionnalités.</p>

          <button onClick={() => { setSubscribed(true); setScreen('home'); onLogin(role); }} className="w-full h-12 rounded-full bg-citron text-forest-deep font-bold">
            Commencer l'essai
          </button>
        </div>
      </div>
    </div>
  );

  const renderPin = () => (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-extrabold text-forest-deep mb-2">PIN facultatif</h1>
          <p className="text-neutral mb-6">Ajoutez une protection par code PIN pour sécuriser l'accès à l'application.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral mb-1">Code PIN (4 chiffres)</label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full h-14 rounded-xl border-0 bg-white shadow-soft px-4 text-center text-2xl font-mono tracking-widest outline-none focus:ring-2 focus:ring-sous-bois/40"
              />
            </div>

            <button onClick={handlePinSubmit} disabled={pin.length !== 4} className="w-full h-12 rounded-full bg-citron text-forest-deep font-bold disabled:opacity-40">
              Définir le PIN
            </button>

            <button onClick={() => setScreen('home')} className="w-full h-12 rounded-full bg-paper text-neutral font-bold">
              Passer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-paper">
      <header className="bg-forest text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-citron" />
            <span className="text-sm text-white/80">En ligne</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-sm mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-limeSoft grid place-items-center mx-auto mb-4">
            <span className="text-4xl">🍾</span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-deep mb-2">
            Bienvenue{role === 'manager' ? ' gérant' : ' propriétaire'} !
          </h1>
          <p className="text-neutral mb-6">
            {role === 'manager'
              ? 'Votre application est prête. Commencez à vendre.'
              : 'Votre abonnement est actif. Consultez vos ventes et votre stock.'}
          </p>

          <button onClick={() => onLogin(role)} className="w-full h-14 rounded-full bg-citron text-forest-deep font-bold text-lg">
            Accéder à l'application
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {screen === 'link' && renderLinkScreen()}
      {screen === 'intro' && renderIntro()}
      {screen === 'install' && renderInstall()}
      {screen === 'code' && renderCode()}
      {screen === 'trial' && renderTrial()}
      {screen === 'pin' && renderPin()}
      {screen === 'home' && renderHome()}
    </>
  );
}

export default Login;
