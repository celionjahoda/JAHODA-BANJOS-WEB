# Jahoda Banjos

Statický web v Reactu a Vite pro GitHub Pages a doménu `jahodabanjos.com`.

## Instalace

Nainstalujte Node.js LTS a pnpm, otevřete kořen projektu v terminálu a spusťte `pnpm install`. Projekt obsahuje `pnpm-lock.yaml` pro reprodukovatelné instalace.

## Lokální spuštění

`pnpm dev` spustí vývojový server Vite. Terminál zobrazí lokální adresu.

## Produkční sestavení

`pnpm build` vytvoří statický web ve složce `dist`. Lokální náhled sestavení spustí `pnpm preview`.

## GitHub repository a Pages

1. Vytvořte GitHub repository a nahrajte obsah projektu.
2. V nastavení repository otevřete **Settings → Pages**.
3. Jako zdroj zvolte **GitHub Actions**. Připravený workflow `.github/workflows/pages.yml` sestaví a publikuje web při každém pushi na větev `main`.
4. Build je nastaven na kořen vlastní domény `jahodabanjos.com`.
5. Soubor `public/CNAME` nastavuje vlastní doménu `jahodabanjos.com`. V DNS domény nastavte záznamy podle aktuálních instrukcí GitHub Pages; v Pages vyberte vlastní doménu a zapněte HTTPS.

Build obsahuje také `404.html`, který na GitHub Pages zajišťuje načtení klientských tras při přímém otevření či obnovení vnitřní stránky.

## Přidávání fotografií

Fotografie patří do `public/images/` podle tématu: `hero`, `services`, `classic`, `fragaria`, `open-back`, `available`, `news` nebo `gallery`. Logo je v `public/images/logo/` a portrét v `public/images/o-mne/`. Nahraďte placeholder v komponentě příslušným obrázkem; zachovejte existující rozměrový rám layoutu. Portrét se zobrazuje celý bez ořezu.

## Přidávání produktů

Přidejte položky do pole `availableBanjos` v `src/data/banjos.js`. Každý záznam má `name`, `slug`, `year`, `description`, `price` nebo `status`, `image` a volitelné `gallery` (pole `{ src, alt }`). Detail se automaticky zobrazí na `/banja-k-dispozici/:slug`.

## Přidávání novinek

Přidejte položky do pole `news` v `src/data/news.js` s poli `title`, `slug`, `date`, `excerpt`, `content` a volitelným `image`. Detail bude dostupný na `/novinky/:slug`.

Produkty i novinky začínají prázdné. Navigace je klientská a web nevyžaduje backend.
