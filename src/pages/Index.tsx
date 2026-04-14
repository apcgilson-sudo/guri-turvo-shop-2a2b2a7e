import { useState, useEffect } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { settings, products, addRegistration, tradeAds, addTradeAd } = useSite();
  const { toast } = useToast();

  // Countdown
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const copa = new Date('2026-06-11T12:00:00').getTime();
    const update = () => {
      const diff = copa - Date.now();
      if (diff <= 0) return;
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<{ icon: string; name: string; price: string } | null>(null);

  // Registration form
  const [regForm, setRegForm] = useState({ name: '', whatsapp: '', email: '', bairro: '', products: [] as string[], whatsappGroup: 'sim', notes: '' });
  const [regSuccess, setRegSuccess] = useState(false);

  // Trade form
  const [tradeType, setTradeType] = useState<'oferta' | 'busca' | 'venda'>('oferta');
  const [tradeForm, setTradeForm] = useState({ name: '', whatsapp: '', stickerNumber: '', country: '', details: '' });

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRegistration(regForm);
    setRegSuccess(true);
    setRegForm({ name: '', whatsapp: '', email: '', bairro: '', products: [], whatsappGroup: 'sim', notes: '' });
    setTimeout(() => setRegSuccess(false), 5000);
  };

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTradeAd({ ...tradeForm, type: tradeType });
    setTradeForm({ name: '', whatsapp: '', stickerNumber: '', country: '', details: '' });
    toast({ title: '✅ Anúncio enviado!', description: 'Seu anúncio aparecerá no mural.' });
  };

  const toggleProduct = (id: string) => {
    setRegForm(prev => ({
      ...prev,
      products: prev.products.includes(id) ? prev.products.filter(p => p !== id) : [...prev.products, id],
    }));
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  const offerAds = tradeAds.filter(a => a.type === 'oferta' || a.type === 'venda');
  const wantAds = tradeAds.filter(a => a.type === 'busca');

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=Olá!%20Quero%20participar%20do%20grupo%20Copa%202026%20🏆`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-7 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-2xl shadow-lg animate-pulse-whats hover:scale-110 transition-transform"
        title="Falar no WhatsApp"
      >
        💬
      </a>

      {/* Panini Bar */}
      <div className="bg-primary py-2 px-5 text-center">
        <p className="font-oswald text-sm tracking-widest font-semibold uppercase flex items-center justify-center gap-2 text-primary-foreground">
          <span className="bg-card text-primary text-xs font-extrabold px-3 py-0.5 rounded-full">⭐ OFICIAL</span>
          Representante Autorizado PANINI no município de Turvo · PR
          <span className="bg-card text-primary text-xs font-extrabold px-3 py-0.5 rounded-full">🏆 PANINI</span>
        </p>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 py-3.5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1100px] mx-auto px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-amarelo flex items-center justify-center text-2xl flex-shrink-0">
              {settings.logoEmoji}
            </div>
            <div className="leading-tight">
              <span className="block font-bebas text-2xl text-amarelo tracking-wider">{settings.storeName}</span>
              <span className="block text-xs text-primary-foreground/70 font-semibold tracking-wide uppercase">{settings.storeSubtitle}</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-1.5 flex-wrap">
            {['prevenda', 'cadastro', 'whatsapp', 'diatrocas', 'troca'].map(id => (
              <a key={id} href={`#${id}`} className="text-primary-foreground/85 font-bold text-sm px-3.5 py-2 rounded-full hover:bg-primary-foreground/15 hover:text-primary-foreground transition-all tracking-wide uppercase">
                {id === 'prevenda' ? 'Pré-venda' : id === 'cadastro' ? 'Cadastro' : id === 'whatsapp' ? 'WhatsApp' : id === 'diatrocas' ? 'Dia de Trocas' : 'Mural'}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Countdown */}
      <div className="bg-amarelo py-4 px-5 text-center">
        <p className="font-oswald text-lg font-bold tracking-wide text-accent-foreground">
          ⏳ Copa do Mundo 2026 começa em
        </p>
        <div className="inline-flex gap-4 items-center mt-1.5">
          {[
            { v: countdown.d, l: 'Dias' },
            { v: countdown.h, l: 'Horas' },
            { v: countdown.m, l: 'Min' },
            { v: countdown.s, l: 'Seg' },
          ].map((t, i) => (
            <div key={t.l} className="flex items-center gap-4">
              {i > 0 && <span className="font-bebas text-3xl text-accent-foreground">:</span>}
              <div className="text-center">
                <span className="block font-bebas text-4xl text-accent-foreground leading-none">{pad(t.v)}</span>
                <small className="text-[0.7rem] uppercase tracking-wide text-accent-foreground/70 font-bold">{t.l}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-verde via-[#007d2f] to-azul py-20 md:py-24 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 left-[5%] w-40 h-40 rounded-full bg-primary-foreground/5 border-2 border-primary-foreground/10 animate-float" />
          <div className="absolute bottom-5 right-[8%] w-24 h-24 rounded-full bg-primary-foreground/5 border-2 border-primary-foreground/10 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] -left-10 w-20 h-20 rounded-full bg-primary-foreground/5 border-2 border-primary-foreground/10 animate-float" style={{ animationDelay: '4s' }} />
        </div>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="inline-block bg-amarelo text-accent-foreground font-oswald text-sm tracking-widest px-5 py-1.5 rounded-full mb-5 font-bold uppercase">
            🏆 Pré-venda Exclusiva • Copa 2026
          </div>
          <div className="inline-block bg-primary-foreground/15 border-2 border-primary-foreground/30 text-primary-foreground font-oswald text-sm tracking-widest px-4 py-1 rounded-full mb-4 font-semibold uppercase ml-2">
            ⭐ Representante Oficial PANINI em Turvo
          </div>
          <h1 className="font-bebas text-[clamp(3rem,8vw,6rem)] text-primary-foreground leading-[0.95] mb-4 tracking-wider">
            FIGURINHAS <span className="text-amarelo">COPA</span> - SYNC OK<br />DO MUNDO 2026
          </h1>
          <p className="text-lg text-primary-foreground/85 max-w-[600px] mx-auto mb-9 font-semibold leading-relaxed">
            Complete seu álbum, troque com amigos e viva a Copa com a gente! Cadastre-se para garantir seu álbum e pacotes de figurinhas na pré-venda. 🇧🇷
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <a href="#cadastro" className="inline-block px-8 py-3.5 rounded-full font-oswald text-lg tracking-wide font-semibold uppercase bg-amarelo text-accent-foreground hover:bg-[#ffd000] hover:-translate-y-0.5 hover:shadow-xl transition-all">
              📝 Quero me Cadastrar
            </a>
            <a href="#diatrocas" className="inline-block px-8 py-3.5 rounded-full font-oswald text-lg tracking-wide font-semibold uppercase bg-verde text-primary-foreground hover:bg-[#007d2f] hover:-translate-y-0.5 hover:shadow-xl transition-all">
              🏟️ Dia de Trocas
            </a>
            <a href="#whatsapp" className="inline-block px-8 py-3.5 rounded-full font-oswald text-lg tracking-wide font-semibold uppercase bg-[#25D366] text-primary-foreground hover:bg-[#1ebe58] hover:-translate-y-0.5 hover:shadow-xl transition-all">
              💬 Entrar no Grupo
            </a>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-gradient-to-br from-verde to-[#006b28] py-20 px-5" id="como">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block font-oswald text-sm tracking-widest uppercase px-4 py-1 rounded-full mb-3 font-semibold bg-[#fff3b0] text-[#8a6000]">🎯 Como Funciona</span>
          <h2 className="font-bebas text-[clamp(2rem,5vw,3.2rem)] text-amarelo tracking-wide mb-3">SIMPLES ASSIM!</h2>
          <p className="text-lg text-primary-foreground/80 max-w-[600px] mb-8 leading-relaxed">Em 4 passos você já está participando de tudo.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: 1, t: 'Cadastre-se', d: 'Preencha o formulário abaixo com seus dados e escolha o que quer reservar na pré-venda.' },
              { n: 2, t: 'Entre no Grupo', d: 'Acesse o grupo do WhatsApp e fique por dentro de tudo: novidades, sorteios e trocas.' },
              { n: 3, t: 'Retire na Loja', d: `Quando chegar seu pedido, avisamos no WhatsApp. É só vir retirar na ${settings.storeName}!` },
              { n: 4, t: 'Troque Aqui', d: 'Anuncie suas repetidas e encontre quem tem o que você precisa. Tudo pelo site!' },
            ].map(s => (
              <div key={s.n} className="text-center py-7 px-5">
                <div className="w-14 h-14 rounded-full bg-amarelo text-accent-foreground font-bebas text-3xl flex items-center justify-center mx-auto mb-3.5 shadow-lg">
                  {s.n}
                </div>
                <h3 className="font-oswald text-lg text-primary-foreground mb-2 font-bold">{s.t}</h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pré-venda */}
      <section className="bg-[#f8fff9] py-20 px-5" id="prevenda">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block font-oswald text-sm tracking-widest uppercase px-4 py-1 rounded-full mb-3 font-semibold bg-[#d4f7e3] text-verde">🛒 Pré-venda</span>
          <h2 className="font-bebas text-[clamp(2rem,5vw,3.2rem)] text-azul tracking-wide mb-3">GARANTA O SEU!</h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mb-8 leading-relaxed">Produtos oficiais PANINI. Estoque limitado!</p>
          <div className="inline-flex items-center gap-2.5 bg-[#e8f7ef] border-2 border-verde rounded-xl px-5 py-3 mb-7">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="font-oswald text-base text-verde font-bold tracking-wide">REPRESENTANTE OFICIAL PANINI</p>
              <p className="text-xs text-muted-foreground">Produtos originais e lacrados direto da distribuidora Panini</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {products.map(p => (
              <div key={p.id} className={`border-2 rounded-2xl p-7 text-center transition-all relative overflow-hidden bg-card hover:-translate-y-1 hover:shadow-lg ${p.featured ? 'border-amarelo bg-gradient-to-br from-[#fffde7] to-[#fff9c4]' : 'border-border hover:border-verde'}`}>
                {p.badge && (
                  <div className="absolute top-4 right-4 bg-laranja text-primary-foreground text-[0.7rem] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-full">
                    {p.badge}
                  </div>
                )}
                <div className="text-5xl mb-3">{p.icon}</div>
                <h3 className="font-oswald text-xl text-azul mb-1.5 font-bold">{p.name}</h3>
                <div className="font-bebas text-3xl text-verde my-2.5">{p.price}</div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
                <button
                  onClick={() => { setModalProduct(p); setModalOpen(true); }}
                  className={`inline-block px-6 py-3 rounded-full font-oswald text-base tracking-wide font-semibold uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg ${p.featured ? 'bg-amarelo text-accent-foreground' : 'bg-verde text-primary-foreground'}`}
                >
                  Reservar
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">⚠️ A reserva garante sua preferência. O pagamento é feito na retirada na loja.</p>
        </div>
      </section>

      {/* Cadastro */}
      <section className="bg-gradient-to-br from-verde via-[#005e22] to-azul py-20 px-5" id="cadastro">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block font-oswald text-sm tracking-widest uppercase px-4 py-1 rounded-full mb-3 font-semibold bg-[#fff3b0] text-[#8a6000]">📝 Pré-venda</span>
          <h2 className="font-bebas text-[clamp(2rem,5vw,3.2rem)] text-amarelo tracking-wide mb-3">FAÇA SEU CADASTRO</h2>
          <p className="text-lg text-primary-foreground/80 max-w-[600px] mb-8 leading-relaxed">Reserve seu álbum e figurinhas com antecedência. Você será avisado pelo WhatsApp quando chegar!</p>
          <div className="bg-primary-foreground/[0.08] border border-primary-foreground/15 rounded-3xl p-6 md:p-10 max-w-[680px] backdrop-blur-sm">
            {regSuccess ? (
              <div className="bg-[#25D366]/15 border-2 border-[#25D366] rounded-2xl p-6 text-center">
                <h3 className="text-[#25D366] font-oswald text-xl mb-1.5">🎉 Cadastro Confirmado!</h3>
                <p className="text-primary-foreground/80 text-sm">Oba! Em breve você receberá uma mensagem no WhatsApp com todos os detalhes da sua reserva.</p>
              </div>
            ) : (
              <form onSubmit={handleRegSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-primary-foreground/90">👤 Nome Completo *</label>
                    <input type="text" required placeholder="Seu nome" value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} className="px-4 py-3.5 rounded-xl border-2 border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-amarelo outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-primary-foreground/90">📱 WhatsApp *</label>
                    <input type="tel" required placeholder="(42) 9 9999-9999" value={regForm.whatsapp} onChange={e => setRegForm(p => ({ ...p, whatsapp: e.target.value }))} className="px-4 py-3.5 rounded-xl border-2 border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-amarelo outline-none transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-primary-foreground/90">📧 E-mail</label>
                    <input type="email" placeholder="seu@email.com" value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} className="px-4 py-3.5 rounded-xl border-2 border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-amarelo outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-primary-foreground/90">🏠 Bairro (em Turvo)</label>
                    <input type="text" placeholder="Seu bairro" value={regForm.bairro} onChange={e => setRegForm(p => ({ ...p, bairro: e.target.value }))} className="px-4 py-3.5 rounded-xl border-2 border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-amarelo outline-none transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="font-bold text-sm text-primary-foreground/90">🛒 O que deseja reservar? *</label>
                  <div className="flex flex-col gap-2.5">
                    {products.map(p => (
                      <label key={p.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={regForm.products.includes(p.id)} onChange={() => toggleProduct(p.id)} className="w-4.5 h-4.5 accent-amarelo cursor-pointer" />
                        <span className="text-sm text-primary-foreground/85">{p.icon} {p.name} — {p.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="font-bold text-sm text-primary-foreground/90">💬 Entrar no grupo do WhatsApp?</label>
                  <select value={regForm.whatsappGroup} onChange={e => setRegForm(p => ({ ...p, whatsappGroup: e.target.value }))} className="px-4 py-3.5 rounded-xl border-2 border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground focus:border-amarelo outline-none transition-colors">
                    <option value="sim" className="bg-azul">✅ Sim, quero entrar no grupo!</option>
                    <option value="nao" className="bg-azul">Não, obrigado</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="font-bold text-sm text-primary-foreground/90">📝 Alguma observação?</label>
                  <textarea placeholder="Ex: quero comprar mais de 1 álbum..." value={regForm.notes} onChange={e => setRegForm(p => ({ ...p, notes: e.target.value }))} className="px-4 py-3.5 rounded-xl border-2 border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-amarelo outline-none transition-colors resize-y min-h-[80px]" />
                </div>
                <button type="submit" className="w-full px-8 py-4 rounded-full font-oswald text-lg tracking-wide font-semibold uppercase bg-amarelo text-accent-foreground hover:bg-[#ffd000] hover:-translate-y-0.5 hover:shadow-xl transition-all">
                  ✅ Confirmar Meu Cadastro
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <section className="bg-background py-20 px-5" id="whatsapp">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block font-oswald text-sm tracking-widest uppercase px-4 py-1 rounded-full mb-3 font-semibold bg-[#d4f5e0] text-[#075e35]">💬 Comunidade</span>
          <h2 className="font-bebas text-[clamp(2rem,5vw,3.2rem)] text-azul tracking-wide mb-3">GRUPO OFICIAL NO WHATSAPP</h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mb-8 leading-relaxed">Entre para o grupo e fique por dentro de tudo sobre a Copa e as figurinhas!</p>
          <div className="bg-card rounded-3xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-lg max-w-[900px]">
            <div className="bg-gradient-to-br from-[#075e35] to-[#128c7e] rounded-2xl p-8 text-center text-primary-foreground">
              <div className="text-6xl mb-3">💬</div>
              <h3 className="font-bebas text-3xl tracking-wide mb-2">Grupo Copa 2026 Guri</h3>
              <p className="text-sm opacity-85 leading-relaxed mb-5">Mais de 200 colecionadores de Turvo e região já participam!</p>
              <ul className="text-left space-y-3 mb-5">
                {['Novidades sobre lançamentos', 'Trocas direto no grupo', 'Sorteios e promoções exclusivas', 'Avisos de chegada de pedidos', 'Dicas para completar o álbum'].map(b => (
                  <li key={b} className="flex items-center gap-2.5 font-bold text-sm">✅ {b}</li>
                ))}
              </ul>
              <a href={settings.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="block w-full px-6 py-3.5 rounded-full font-oswald text-base tracking-wide font-semibold uppercase bg-[#25D366] text-primary-foreground hover:bg-[#1ebe58] hover:-translate-y-0.5 hover:shadow-xl transition-all text-center">
                Entrar no Grupo Agora 🚀
              </a>
            </div>
            <div>
              <h3 className="font-bebas text-3xl text-azul mb-3">POR QUE ENTRAR?</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">Nosso grupo é o ponto de encontro de todos os colecionadores de Turvo. Você será o primeiro a saber quando as figurinhas chegarem!</p>
              <div className="bg-[#f0fdf4] rounded-2xl p-5 mb-4 border-2 border-[#bbf7d0]">
                <p className="font-extrabold text-verde mb-1.5">🎁 BÔNUS DE BOAS-VINDAS</p>
                <p className="text-sm text-muted-foreground">Ao entrar no grupo, você concorre a <strong>1 pacotinho de figurinhas grátis</strong> sorteado toda semana!</p>
              </div>
              <a href={settings.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3.5 rounded-full font-oswald text-base tracking-wide font-semibold uppercase bg-[#25D366] text-primary-foreground hover:bg-[#1ebe58] hover:-translate-y-0.5 hover:shadow-xl transition-all">
                💬 Quero Entrar no Grupo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dia de Trocas */}
      <section className="bg-gradient-to-br from-amarelo to-[#ffc800] py-20 px-5 relative overflow-hidden" id="diatrocas">
        <div className="absolute -top-5 -right-8 text-[180px] opacity-[0.07] rotate-[15deg] pointer-events-none">🎴</div>
        <div className="absolute -bottom-5 -left-5 text-[140px] opacity-[0.07] -rotate-[10deg] pointer-events-none">🔄</div>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <span className="inline-block font-oswald text-sm tracking-widest uppercase px-4 py-1 rounded-full mb-3 font-semibold bg-azul/10 text-azul">📅 Evento Presencial</span>
          <h2 className="font-bebas text-[clamp(2rem,5vw,3.2rem)] text-azul tracking-wide mb-3">DIA DE TROCAS NA PRAÇA!</h2>
          <p className="text-lg text-azul/75 max-w-[600px] mb-8 leading-relaxed">Venha pessoalmente trocar suas figurinhas com outros colecionadores da cidade!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Evento Card */}
            <div className="bg-card rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-azul p-6 flex items-center gap-4">
                <div className="text-4xl">🏟️</div>
                <div>
                  <h3 className="font-bebas text-2xl text-primary-foreground tracking-wide leading-tight">Encontro de Colecionadores</h3>
                  <p className="text-xs text-primary-foreground/65 font-semibold uppercase tracking-wide">{settings.address} · {settings.city}</p>
                </div>
              </div>
              <div className="p-7 space-y-3.5">
                {[
                  { icon: '📍', bg: 'bg-[#dce8ff]', t: 'Local', d: <>{settings.address}, anexo à <strong className="text-verde">{settings.storeName}</strong><br />{settings.city}</> },
                  { icon: '📅', bg: 'bg-[#fff3b0]', t: 'Data do Próximo Evento', d: <>A definir — <strong className="text-verde">fique de olho no WhatsApp!</strong></> },
                  { icon: '🕐', bg: 'bg-[#e8f7ef]', t: 'Horário', d: <>A partir das <strong className="text-verde">14h até as 18h</strong><br />Entrada gratuita para toda a família 🎉</> },
                  { icon: '🍦', bg: 'bg-[#ffe8d4]', t: `${settings.storeName} no Evento`, d: <>Aproveite para tomar um sorvete e sair com suas figurinhas! <strong className="text-verde">Desconto especial no dia.</strong></> },
                ].map(r => (
                  <div key={r.t} className="flex items-start gap-3.5 pb-3.5 border-b border-border last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center text-lg flex-shrink-0`}>{r.icon}</div>
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground mb-0.5">{r.t}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Info + CTA */}
            <div className="space-y-5">
              <div className="bg-primary-foreground/40 border-2 border-azul/15 rounded-2xl p-6">
                <h3 className="font-oswald text-xl text-azul font-bold mb-2.5">📋 Como Participar?</h3>
                <ul className="space-y-2">
                  {['Traga suas figurinhas repetidas organizadas', 'Anote quais você ainda precisa', 'As trocas são 1 por 1', 'Vendas e negociações também são permitidas', 'Crianças bem-vindas com acompanhante', 'Entrada totalmente gratuita'].map(r => (
                    <li key={r} className="flex items-start gap-2 text-sm text-azul/85 font-semibold">✅ {r}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-azul rounded-2xl p-6 text-center">
                <p className="text-xs text-primary-foreground/65 uppercase tracking-widest font-bold mb-1.5">📢 Fique sabendo da próxima data</p>
                <h3 className="font-bebas text-4xl text-amarelo tracking-wide leading-none mb-1">ENTRE NO GRUPO</h3>
                <span className="text-sm text-primary-foreground/70 font-semibold">Anunciamos as datas lá primeiro!</span>
                <a href={settings.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="block mt-3.5 px-6 py-3 rounded-full font-oswald text-base tracking-wide font-bold uppercase bg-amarelo text-accent-foreground hover:bg-[#ffd000] hover:-translate-y-0.5 transition-all">
                  💬 Me Avise no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mural de Trocas */}
      <section className="bg-[#f0fdf4] py-20 px-5" id="troca">
        <div className="max-w-[1100px] mx-auto">
          <span className="inline-block font-oswald text-sm tracking-widest uppercase px-4 py-1 rounded-full mb-3 font-semibold bg-[#dce8ff] text-azul">🔄 Troca</span>
          <h2 className="font-bebas text-[clamp(2rem,5vw,3.2rem)] text-azul tracking-wide mb-3">MURAL DE TROCAS</h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mb-8 leading-relaxed">Anuncie suas repetidas e encontre quem tem o que você precisa!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Ofertas */}
            <div className="bg-creme rounded-2xl p-7">
              <h3 className="font-oswald text-xl font-bold mb-4 pb-3 border-b-2 border-border text-verde">📤 Tenho pra Dar / Vender</h3>
              {offerAds.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum anúncio ainda. Seja o primeiro!</p>
              ) : offerAds.map(a => (
                <div key={a.id} className="bg-card rounded-xl p-4 mb-3 border-2 border-border hover:border-verde transition-colors flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amarelo to-laranja flex items-center justify-center font-bebas text-xl text-accent-foreground flex-shrink-0">
                    {a.stickerNumber.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">Figurinha {a.stickerNumber} {a.country && `— ${a.country}`}</h4>
                    <p className="text-xs text-muted-foreground">{a.name}</p>
                    {a.details && <span className="inline-block bg-[#e8f7ef] text-verde text-xs font-bold px-2 py-0.5 rounded-lg mt-1">{a.type === 'venda' ? '💰' : '✅'} {a.details}</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Buscas */}
            <div className="bg-creme rounded-2xl p-7">
              <h3 className="font-oswald text-xl font-bold mb-4 pb-3 border-b-2 border-border text-azul">📥 Preciso / Estou Buscando</h3>
              {wantAds.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma busca ainda.</p>
              ) : wantAds.map(a => (
                <div key={a.id} className="bg-card rounded-xl p-4 mb-3 border-2 border-border hover:border-azul transition-colors flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amarelo to-laranja flex items-center justify-center font-bebas text-xl text-accent-foreground flex-shrink-0">
                    {a.stickerNumber.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">Figurinha {a.stickerNumber} {a.country && `— ${a.country}`}</h4>
                    <p className="text-xs text-muted-foreground">{a.name}</p>
                    {a.details && <span className="inline-block bg-[#dce8ff] text-azul text-xs font-bold px-2 py-0.5 rounded-lg mt-1">🔍 {a.details}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Formulário de anúncio */}
          <div className="bg-creme border-2 border-border rounded-3xl p-6 md:p-9 max-w-[700px]">
            <h3 className="font-oswald text-2xl text-azul mb-1.5 font-bold">📢 Anunciar Figurinha</h3>
            <p className="text-sm text-muted-foreground mb-6">Preencha abaixo e seu anúncio aparecerá no mural!</p>
            <div className="flex gap-3 flex-wrap mb-5">
              {([['oferta', '📤', 'Tenho pra Dar'], ['busca', '📥', 'Estou Buscando'], ['venda', '💰', 'Quero Vender']] as const).map(([type, icon, label]) => (
                <button key={type} onClick={() => setTradeType(type)} className={`flex-1 min-w-[120px] p-3 rounded-xl border-2 text-center font-bold transition-all ${tradeType === type ? 'border-verde bg-[#e8f7ef] text-verde' : 'border-border bg-card hover:border-verde'}`}>
                  <span className="block text-xl mb-1">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
            <form onSubmit={handleTradeSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-foreground">Seu Nome *</label>
                  <input required value={tradeForm.name} onChange={e => setTradeForm(p => ({ ...p, name: e.target.value }))} placeholder="João Silva" className="px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-foreground">WhatsApp *</label>
                  <input required value={tradeForm.whatsapp} onChange={e => setTradeForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="(42) 9 9999-9999" className="px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-foreground">Nº da Figurinha *</label>
                  <input required value={tradeForm.stickerNumber} onChange={e => setTradeForm(p => ({ ...p, stickerNumber: e.target.value }))} placeholder="Ex: 47, 112" className="px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-foreground">País / Seleção</label>
                  <input value={tradeForm.country} onChange={e => setTradeForm(p => ({ ...p, country: e.target.value }))} placeholder="Ex: Brasil" className="px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-bold text-sm text-foreground">Detalhes</label>
                <textarea value={tradeForm.details} onChange={e => setTradeForm(p => ({ ...p, details: e.target.value }))} placeholder="Ex: Tenho 3 repetidas da nº 47..." className="px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground focus:border-verde outline-none transition-colors resize-y min-h-[80px]" />
              </div>
              <button type="submit" className="w-full px-6 py-3.5 rounded-full font-oswald text-base tracking-wide font-semibold uppercase bg-verde text-primary-foreground hover:bg-[#007d2f] hover:-translate-y-0.5 hover:shadow-xl transition-all">
                📢 Publicar Anúncio Grátis
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground/70 py-12 px-5 text-center">
        <div className="font-bebas text-3xl text-amarelo tracking-wider mb-1.5">{settings.logoEmoji} {settings.storeName}</div>
        <div className="text-sm text-primary-foreground/40 mb-5">Representante Oficial PANINI · {settings.city} · Copa 2026 🏆</div>
        <div className="flex justify-center gap-5 flex-wrap mb-6">
          {['prevenda', 'cadastro', 'whatsapp', 'diatrocas', 'troca'].map(id => (
            <a key={id} href={`#${id}`} className="text-primary-foreground/60 text-sm font-semibold hover:text-amarelo transition-colors">
              {id === 'prevenda' ? 'Pré-venda' : id === 'cadastro' ? 'Cadastro' : id === 'whatsapp' ? 'WhatsApp' : id === 'diatrocas' ? 'Dia de Trocas' : 'Mural de Trocas'}
            </a>
          ))}
        </div>
        <div className="text-xs text-primary-foreground/30">© 2026 {settings.storeName} {settings.city} · Representante Oficial Panini · Todos os direitos reservados</div>
      </footer>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="text-center max-w-md">
          {modalProduct && (
            <>
              <div className="text-5xl mb-3">{modalProduct.icon}</div>
              <h3 className="font-bebas text-3xl text-azul mb-2">Reservar {modalProduct.name}</h3>
              <p className="text-muted-foreground mb-6">{modalProduct.name} por {modalProduct.price}. Faça seu cadastro abaixo para reservar!</p>
              <a href="#cadastro" onClick={() => setModalOpen(false)} className="inline-block px-8 py-3.5 rounded-full font-oswald text-base tracking-wide font-semibold uppercase bg-verde text-primary-foreground hover:bg-[#007d2f] hover:-translate-y-0.5 hover:shadow-xl transition-all">
                Ir para o Cadastro ↓
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
