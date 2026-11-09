import React, { useEffect, useState } from 'react'
import { availableBanjos } from './data/banjos.js'
import { news } from './data/news.js'

const collections = [
  { slug: 'classic', name: 'Classic', intro: 'Tradiční pojetí pětistrunného banja s respektem k nástrojům, které definovaly jeho zvuk.', detail: 'Řemeslné zpracování, promyšlený setup a charakteristický hlas. Každý nástroj vzniká s péčí o detail a inspirací zlatou érou banja.' },
  { slug: 'fragaria', name: 'Fragaria', intro: 'Osobitá kolekce banj Jahoda s vlastním charakterem a zvukem.', detail: 'Fragaria je prostor pro vlastní nápady a hledání zvuku. Více informací a fotografie kolekce budou brzy doplněny.' },
  { slug: 'open-back', name: 'Open Back', intro: 'Otevřená konstrukce banja s přirozeným, přímým zvukem.', detail: 'Open back banja stavím pro hráče, kteří hledají otevřený a přirozený tón. Podrobnosti o jednotlivých nástrojích budou doplněny.' },
]
const services = ['Výroba banj Jahoda', 'Setup', 'Opravy', 'Výroba banjových krků', 'Konverze prewar banj Gibson']
const links = [['Úvod', '/'], ['O mně', '/o-mne'], ['Banja', '/banja'], ['Banja k dispozici', '/banja-k-dispozici'], ['Novinky', '/novinky'], ['Kontakt', '/kontakt']]
const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const delay = i => ({ '--reveal-delay': `${i * 90}ms` })

function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo(0, 0)
  }
}

function Link({ to, children, className = '', onClick, ...props }) {
  return (
    <a
      href={to}
      className={className}
      onClick={e => {
        onClick?.(e)
        if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
          e.preventDefault()
          navigate(to)
        }
      }}
      {...props}
    >
      {children}
    </a>
  )
}

const Arrow = () => <b aria-hidden="true">↗</b>

/* Decorative banjo pot drawn in brass lines – stands in for photos that are not ready yet. */
const HOOKS = Array.from({ length: 24 }, (_, i) => i)
const STRINGS = [188, 194, 200, 206, 212]
function BanjoArt({ className = '' }) {
  return (
    <svg className={`banjo-art ${className}`} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle className="rim-flange" cx="200" cy="200" r="190" pathLength="1" />
      <circle className="rim-ring" cx="200" cy="200" r="168" pathLength="1" />
      {HOOKS.map(i => (
        <rect key={i} className="rim-hook" style={{ '--i': i }} x="196.5" y="16" width="7" height="26" rx="3.5" transform={`rotate(${i * 15} 200 200)`} />
      ))}
      <circle className="rim-head" cx="200" cy="200" r="154" pathLength="1" />
      <circle className="rim-tone" cx="200" cy="200" r="138" />
      {STRINGS.map(x => <line key={x} className="banjo-string" x1={x} y1="322" x2={x} y2="-10" pathLength="1" />)}
      <rect className="banjo-bridge" x="174" y="246" width="52" height="6" rx="2" />
      <path className="banjo-tail" d="M182 356 L218 356 L211 318 L189 318 Z" />
    </svg>
  )
}

function Photo({ label = 'PHOTO', src, alt = '', className = '' }) {
  if (src) return <img className={`photo ${className}`} src={src.startsWith('/') ? asset(src) : src} alt={alt} />
  return (
    <div className={`photo placeholder ${className}`} role="img" aria-label={label ? `${label} – fotografie bude doplněna` : alt || 'Fotografie bude doplněna'}>
      <BanjoArt />
      {label && <span>{label}</span>}
    </div>
  )
}

function Header({ path }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const isActive = p => (p === '/' ? path === '/' : path === p || path.startsWith(`${p}/`))
  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav-wrap">
        <Link to="/" className="brand" aria-label="Jahoda Banjos – úvod">
          <img src={asset('images/logo/jahoda-banjos-logo.svg')} alt="Jahoda Banjos" />
        </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Zavřít navigaci' : 'Otevřít navigaci'} aria-expanded={open} aria-controls="hlavni-navigace">
          <span /><span />
        </button>
        <nav id="hlavni-navigace" className="nav" aria-label="Hlavní navigace">
          {links.map(([name, p]) => (
            <Link key={p} to={p} aria-current={isActive(p) ? 'page' : undefined} onClick={() => setOpen(false)}>{name}</Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="footer-brand"><img src={asset('images/logo/jahoda-banjos-logo.svg')} alt="Jahoda Banjos" /></Link>
      <span>Řemeslná výroba banj · Jaromír Jahoda</span>
      <Link to="/kontakt" className="text-link">Kontaktujte mě <Arrow /></Link>
    </footer>
  )
}

function Shell({ eyebrow, title, lead, children }) {
  return (
    <main>
      <section className="page-heading wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </section>
      {children}
    </main>
  )
}

function SectionTitle({ eyebrow, title, link, to }) {
  return (
    <div className="section-title" data-reveal="">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {link && <Link className="text-link" to={to}>{link} <Arrow /></Link>}
    </div>
  )
}

function Home() {
  return (
    <main className="home-main">
      <section className="welcome wrap">
        <h1>Vítejte na stránkách zakázkové výroby banj Jahoda.</h1>
        <ul className="welcome-services">
          {services.map((s, i) => <li key={s} style={{ '--i': i }}>{s}</li>)}
        </ul>
      </section>
      <section className="home-collections wrap">
        <SectionTitle eyebrow="KOLEKCE" title="Banja" link="Všechna banja" to="/banja" />
        <CollectionGrid compact />
      </section>
    </main>
  )
}

function CollectionGrid() {
  return (
    <div className="collection-grid">
      {collections.map((c, i) => (
        <article className="collection-card" key={c.slug} data-reveal="" style={delay(i)}>
          <Link to={`/banja/${c.slug}`} className="card-image" tabIndex={-1} aria-hidden="true">
            <Photo label={c.name.toUpperCase()} />
            <span className="card-number">0{i + 1}</span>
          </Link>
          <div className="card-copy">
            <p className="eyebrow">KOLEKCE 0{i + 1}</p>
            <h3><Link to={`/banja/${c.slug}`}>{c.name}</Link></h3>
            <p>{c.intro}</p>
            <Link className="text-link" to={`/banja/${c.slug}`}>Prohlédnout <Arrow /></Link>
          </div>
        </article>
      ))}
    </div>
  )
}

function About() {
  return (
    <Shell eyebrow="O MNĚ" title="Jaromír Jahoda" lead="Hudebník, řemeslník a člověk, kterého od roku 1985 provází zvuk banja.">
      <section className="about wrap">
        <div className="portrait">
          <div data-reveal="clip"><Photo src={asset('images/o-mne/jaromir.jpg')} alt="Jaromír Jahoda s banjem" /></div>
        </div>
        <div className="about-copy">
          <p data-reveal="">K banju jsem se dostal v roce 1985, když mi bylo 13 let. Ten zvuk mě učaroval, stal se mou vášní, a od té doby mě provází životem. Z počátku jsem hrál na přeladěné šestistrunné banjo, a přes různě podomácku vyrobená banja jsem se dostal až k první východoněmecké pětistrunné Musimě. Po ní následovala banja českých výrobců, a v roce 1996 jsem si koupil první banjo Gibson model Earl Scruggs. Poté následovala banja Gibson z předválečné éry. Ten zvuk a ta vůně jsou pro mě nezaměnitelné.</p>
          <p data-reveal="">Kdybyste se chtěli dočíst více o tom, jak jsem s banjem začínal, tak zde je do češtiny přeložený článek, který o tom vyšel v časopise Banjo Newsletter v roce 2021.</p>
          <div data-reveal=""><a className="text-link" href="https://www.banjonews.com/" target="_blank" rel="noreferrer">Číst článek <Arrow /></a></div>
          <p data-reveal="">V průběhu let jsem sbíral zkušenosti, zdokonaloval setup svých nástrojů, a když přišla má éra Gibson Prewar banj, začal jsem pronikat více do konstrukcí, materiálů a historie. Banja z té doby byla převážně tenorová, a pro muziku, které se věnuji, bylo potřeba je upravit na pětistrunná. Tak jsem se dostal ke konverzím banj. To obnášelo zásahy, které mi otevřely cestu k dalším vědomostem.</p>
          <p data-reveal="">Mým Guru je bezesporu Vláďa Ptáček, který mi pomohl a pomáhá strašně moc. Jak vědomostmi, tak praktickými věcmi.</p>
          <p data-reveal="">Všechny své zkušenosti, co jsem nasbíral, vkládám do svých nástrojů, a vše dělám tak, abych s nimi byl spokojený ve všech směrech, a bavilo mě na ně hrát. Mým vzorem jsou předválečná banja Gibson, kterých mi rukama prošlo již mnoho.</p>
          <p data-reveal="">Věřím však, že je stále co objevovat, a proto jsem otevřený novým nápadům. Těším se, kam mě má další cesta zavede.</p>
        </div>
      </section>
    </Shell>
  )
}

function Collections() {
  return (
    <Shell eyebrow="NÁSTROJE" title="Banja Jahoda" lead="Tři kolekce. Každá s vlastním charakterem, všechny s péčí o řemeslo a zvuk.">
      <section className="section wrap inner-section"><CollectionGrid /></section>
    </Shell>
  )
}

function Gallery({ images = [], title = 'Galerie' }) {
  const [active, setActive] = useState(-1)
  const next = () => setActive(i => (i + 1) % images.length)
  const prev = () => setActive(i => (i - 1 + images.length) % images.length)
  useEffect(() => {
    if (active < 0) return
    const key = e => {
      if (e.key === 'Escape') setActive(-1)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [active, images.length])
  let x = 0
  return (
    <>
      <div className="gallery-grid">
        {images.length
          ? images.map((im, i) => (
              <button key={im.src || i} className="gallery-item" data-reveal="" style={delay(i % 3)} onClick={() => setActive(i)}>
                <Photo src={im.src} alt={im.alt || title} />
              </button>
            ))
          : <div className="gallery-empty">{[0, 1, 2].map(i => <div key={i} data-reveal="" style={delay(i)}><Photo label="PHOTO" /></div>)}</div>}
      </div>
      {active >= 0 && (
        <div
          className="lightbox" role="dialog" aria-modal="true" aria-label="Galerie"
          onTouchStart={e => { x = e.touches[0].clientX }}
          onTouchEnd={e => { const d = e.changedTouches[0].clientX - x; if (Math.abs(d) > 55) (d < 0 ? next : prev)() }}
          onClick={() => setActive(-1)}
        >
          <button className="lightbox-close" aria-label="Zavřít" onClick={() => setActive(-1)}>×</button>
          <button className="lightbox-prev" aria-label="Předchozí" onClick={e => { e.stopPropagation(); prev() }}>‹</button>
          <Photo src={images[active].src} alt={images[active].alt || title} className="lightbox-photo" />
          <button className="lightbox-next" aria-label="Další" onClick={e => { e.stopPropagation(); next() }}>›</button>
          <span className="lightbox-count">{active + 1} / {images.length}</span>
        </div>
      )}
    </>
  )
}

function CollectionDetail({ collection }) {
  return (
    <Shell eyebrow="KOLEKCE / JAHODA BANJOS" title={collection.name} lead={collection.intro}>
      <section className="detail wrap">
        <p className="detail-intro" data-reveal="">{collection.detail}</p>
        <SectionTitle eyebrow="V OBRAZECH" title="Galerie" />
        <Gallery title={collection.name} />
        <div className="detail-columns">
          <div data-reveal=""><p className="eyebrow">PŘÍBĚH KOLEKCE</p><h2>Zvuk, který vzniká<br />s péčí o každý detail.</h2></div>
          <p data-reveal="" style={delay(1)}>Další informace o této kolekci, použitých materiálech a možnostech provedení budou doplněny. Pro dotazy ohledně nástrojů mi napište nebo zavolejte.</p>
        </div>
        <div className="video-placeholder" data-reveal="">
          <i className="play" aria-hidden="true" />
          <span>VIDEO</span>
          <p>Video ukázka bude doplněna</p>
        </div>
        <Link to="/kontakt" className="button">Zeptat se na kolekci <Arrow /></Link>
      </section>
    </Shell>
  )
}

function EmptyState({ eyebrow, title, text, children }) {
  return (
    <div className="empty-state" data-reveal="">
      <span className="empty-mark"><BanjoArt /></span>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  )
}

function Available() {
  return (
    <Shell eyebrow="AKTUÁLNÍ NABÍDKA" title="Banja k dispozici" lead="Přehled nástrojů, které jsou právě k dispozici z dílny Jahoda Banjos.">
      <section className="section wrap inner-section">
        {availableBanjos.length
          ? (
            <div className="product-grid">
              {availableBanjos.map((b, i) => (
                <article className="product-card" key={b.slug} data-reveal="" style={delay(i % 3)}>
                  <Link to={`/banja-k-dispozici/${b.slug}`}>
                    <div className="card-image"><Photo src={b.image} alt={b.name} /></div>
                    <div className="product-info">
                      <h3>{b.name}</h3>
                      <p>{b.year} · {b.price || b.status}</p>
                      <p>{b.description}</p>
                      <span className="text-link">Více informací <Arrow /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )
          : (
            <EmptyState eyebrow="AKTUÁLNÍ NABÍDKA" title="Momentálně není žádné banjo k dispozici" text="Pokud máte zájem o nástroj z mé dílny, neváhejte mě kontaktovat.">
              <Link to="/kontakt" className="button">Kontaktovat Jaromíra <Arrow /></Link>
            </EmptyState>
          )}
      </section>
    </Shell>
  )
}

function News() {
  return (
    <Shell eyebrow="Z DÍLNY" title="Novinky" lead="Novinky a zprávy z dílny Jahoda Banjos.">
      <section className="section wrap inner-section">
        {news.length
          ? (
            <div className="news-grid">
              {news.map((n, i) => (
                <article key={n.slug} className="news-card" data-reveal="" style={delay(i % 3)}>
                  <Link to={`/novinky/${n.slug}`}>
                    <div className="card-image"><Photo src={n.image} alt={n.title} /></div>
                    <p className="eyebrow">{n.date}</p>
                    <h2>{n.title}</h2>
                    <p>{n.excerpt}</p>
                    <span className="text-link">Číst více <Arrow /></span>
                  </Link>
                </article>
              ))}
            </div>
          )
          : <EmptyState eyebrow="Z DÍLNY" title="Novinky brzy přibudou" text="Až bude z dílny něco nového, najdete to právě tady." />}
      </section>
    </Shell>
  )
}

function Contact() {
  return (
    <Shell eyebrow="NAPIŠTE MI" title="Kontakt" lead="V případě zájmu o banjo z mé dílny mě neváhejte kontaktovat.">
      <section className="contact wrap">
        <div className="contact-main" data-reveal="">
          <p className="eyebrow">JAROMÍR JAHODA</p>
          <a href="tel:+420603201392" className="contact-detail">+420 603 201 392 <Arrow /></a>
          <a href="mailto:jahod250@gmail.com" className="contact-detail">jahod250@gmail.com <Arrow /></a>
        </div>
        <div className="contact-social" data-reveal="" style={delay(1)}>
          <p className="eyebrow">NAJDETE MĚ TAKÉ</p>
          {[['Facebook – Jahoda Banjos', '#'], ['Monogram', '#'], ['Nugget', '#']].map(([name, url]) => (
            <a key={name} href={url} onClick={e => e.preventDefault()}>{name}<Arrow /></a>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function NotFound() {
  return (
    <Shell eyebrow="404" title="Tudy cesta nevede" lead="Požadovanou stránku se nepodařilo najít.">
      <section className="wrap section"><Link className="button" to="/">Zpět na úvod <Arrow /></Link></section>
    </Shell>
  )
}

/* Fades sections in as they scroll into view. Runs again after every route change. */
function useReveal(path) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-visible)')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [path])
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const f = () => setPath(decodeURI(window.location.pathname))
    window.addEventListener('popstate', f)
    return () => window.removeEventListener('popstate', f)
  }, [])
  useReveal(path)

  let page
  if (path === '/') page = <Home />
  else if (path === '/o-mne') page = <About />
  else if (path === '/banja') page = <Collections />
  else if (path === '/banja-k-dispozici') page = <Available />
  else if (path === '/novinky') page = <News />
  else if (path === '/kontakt') page = <Contact />
  else if (path.startsWith('/banja/')) {
    const c = collections.find(item => `/banja/${item.slug}` === path)
    page = c ? <CollectionDetail collection={c} /> : <NotFound />
  } else if (path.startsWith('/novinky/')) {
    const n = news.find(item => `/novinky/${item.slug}` === path)
    page = n
      ? <Shell eyebrow="NOVINKY" title={n.title} lead={n.date}><article className="wrap detail news-detail"><Photo src={n.image} alt={n.title} /><p>{n.content}</p></article></Shell>
      : <NotFound />
  } else if (path.startsWith('/banja-k-dispozici/')) {
    const b = availableBanjos.find(item => `/banja-k-dispozici/${item.slug}` === path)
    page = b
      ? (
        <Shell eyebrow="BANJA K DISPOZICI" title={b.name} lead={b.description}>
          <section className="wrap detail">
            <Photo src={b.image} alt={b.name} />
            <Gallery images={b.gallery || []} title={b.name} />
            <p>{b.year} · {b.price || b.status}</p>
            <Link to="/kontakt" className="button">Mám zájem <Arrow /></Link>
          </section>
        </Shell>
      )
      : <NotFound />
  } else page = <NotFound />

  return (
    <>
      <Header path={path} />
      <React.Fragment key={path}>{page}</React.Fragment>
      {path === '/' ? null : <Footer />}
    </>
  )
}

export default App
