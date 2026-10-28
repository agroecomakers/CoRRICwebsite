import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, Download, ChevronRight, ChevronDown, LogIn } from "lucide-react";

type Lang = "fr" | "es";

interface Zone {
  name: string;
  desc: string;
  x: number;
  y: number;
}

// URL de l'Intranet : à remplacer par la vraie adresse
const INTRANET_URL = "https://script.google.com/macros/s/AKfycbwbl0esgHPnskk0Tbkh4hhz71-fK_Ze2ew4LiLEb4iMw6xn5qBs34znKvn9OYjoxg56/exec";

// Chemin de base des documents (dans public/documents/)
const DOCS = import.meta.env.BASE_URL + "documents/";

const T = {
  fr: {
    nav: {
      about: "À Propos",
      components: "Composantes",
      digital: "Numérique",
      partners: "Partenaires",
      resources: "Ressources",
      intranet: "Intranet",
    },
    hero: {
      expand: "Coopération pour la Réforme Rurale Intégrale en Colombie",
      title: "Co-innover pour une réforme rurale intégrale durable et inclusive",
      fundedBy: "Fonds Équipe France (FEF) · Ambassade de France en Colombie",
      discover: "Découvrir le projet",
    },
    stats: [
      { n: 336, label: "Bénéficiaires directs" },
      { n: 176, label: "Dont des femmes" },
      { n: 30, label: "Organisations partenaires" },
      { n: 3, label: "Territoires pilotes" },
    ],
    about: {
      sectionLabel: "À PROPOS & CONTEXTE",
      title: "Une coopération scientifique au service de la paix rurale",
      body1:
        "CoRRIC est né de la volonté de transformer la relation entre le monde universitaire et le monde rural en Colombie, dans le prolongement de la Réforme Rurale Intégrale (RRI) issue de l'accord de paix de 2016.",
      body2:
        "Le projet mobilise le CIRAD et l'IRD aux côtés d'institutions colombiennes pour co-construire des solutions ancrées dans les territoires, en plaçant les communautés rurales — et notamment les femmes — au cœur de la démarche.",
      pullQuote:
        "Transformer la relation entre le monde universitaire et le monde rural en Colombie.",
      governance: "Gouvernance du projet",
      govBody:
        "Le Comité de Pilotage réunit le SCAC, l'Ambassade de France, et les directions régionales du CIRAD et de l'IRD, garantissant un alignement entre diplomatie scientifique et réalités de terrain.",
    },
    components: {
      sectionLabel: "AXES THÉMATIQUES",
      title: "Trois composantes scientifiques",
      subtitle:
        "Une approche intégrée de la réforme rurale, de la gouvernance foncière aux outils numériques participatifs.",
      tabs: [
        {
          id: "land",
          label: "Terre & Gouvernance",
          title: "Terre, Politique & Gouvernance",
          body: "Analyses foncières, comités scientifiques paritaires, et diagnostics d'accès à la loi pour renforcer la sécurité juridique des communautés rurales en situation post-conflit. Intervention principale dans le Guaviare et le Sumapaz.",
          tags: ["Foncier", "RRI", "Politiques publiques", "Post-conflit"],
          accent: "#1c3d2c",
        },
        {
          id: "value",
          label: "Chaînes de valeur",
          title: "Chaînes de valeur & Systèmes alimentaires",
          body: "Accompagnement des filières stratégiques : cacao résilient (Tolima/Florida), riz biofortifié (Córdoba/Sucre/Bolívar), banane et plantain (Valle del Cauca), agroindustrie amazonienne. Développement du tourisme agroécologique avec des associations de femmes au Sumapaz et au Guaviare.",
          tags: ["Cacao", "Riz biofortifié", "Banane/Plantain", "Tourisme agroécologique", "ASOMUVILLA"],
          accent: "#bf5c2c",
        },
        {
          id: "coinno",
          label: "Co-Innovation",
          title: "Co-Innovation & Outils participatifs",
          body: "Déploiement de TerriStories (simulation territoriale), des Systèmes Participatifs de Garantie (SPG) numériques et d'outils de certification « zéro déforestation » pour les acteurs des filières.",
          tags: ["TerriStories", "SPG numériques", "Zéro déforestation", "Cartographie participative"],
          accent: "#2c5f7a",
        },
      ],
    },
    territories: {
      sectionLabel: "ZONES D'INTERVENTION",
      title: "Trois territoires pilotes en Colombie",
      subtitle:
        "Du Pacifique à l'Amazonie, des Andes à la plaine — trois contextes agroécologiques distincts.",
      zones: [
        {
          name: "Guaviare",
          desc: "Amazonie colombienne — filières agroindustrielles et tourisme agroécologique communautaire avec Las Caprichosas",
          x: 288,
          y: 266,
        },
        {
          name: "Sumapaz",
          desc: "Région andine proche de Bogotá — gouvernance foncière et tourisme agroécologique",
          x: 208,
          y: 224,
        },
        {
          name: "Valle del Cauca",
          desc: "Pacifique colombien — filière banane et plantain, systèmes alimentaires durables",
          x: 118,
          y: 274,
        },
      ] as Zone[],
    },
    digital: {
      sectionLabel: "ÉCOSYSTÈME NUMÉRIQUE",
      title: "Des outils numériques pour les acteurs ruraux",
      subtitle:
        "Conçus pour fonctionner avec une connectivité limitée, au plus près des réalités du terrain.",
      apps: [
        {
          name: "miCampoApp",
          emoji: "📱",
          desc: "Agendas interactifs de production agroécologique, planification de l'offre et de la demande territoriale, gestion des crédits coopératifs pour les producteurs ruraux.",
          tags: ["Agroécologie", "Planification territoriale", "Crédits coopératifs", "Mobile-first"],
        },
        {
          name: "PlantAgroEco / PlantNet",
          emoji: "🌿",
          desc: "Identification automatique des maladies végétales par intelligence artificielle. Diagnostic en temps réel pour les producteurs ruraux, même en zone à connectivité limitée.",
          tags: ["IA", "Santé végétale", "Offline-first", "Diagnostic"],
        },
      ],
    },
    partners: {
      sectionLabel: "PARTENAIRES",
      title: "Un réseau de 30 institutions engagées",
      categories: [
        {
          label: "Porteurs & Co-coordinateurs",
          orgs: [
            { name: "Ambassade de France en Colombie", url: "https://co.ambafrance.org/" },
            { name: "CIRAD", url: "https://www.cirad.fr/" },
            { name: "IRD", url: "https://www.ird.fr/" },
          ],
        },
        {
          label: "Centres de recherche colombiens",
          orgs: [
            { name: "AGROSAVIA", url: "https://www.agrosavia.co/" },
            { name: "CIAT", url: "https://alliancebioversityciat.org/" },
            { name: "IDEAM", url: "https://www.ideam.gov.co/" },
            { name: "ICANH", url: "https://www.icanh.gov.co/" },
          ],
        },
        {
          label: "Universités",
          orgs: [
            { name: "Pontificia Universidad Javeriana (PUJ)", url: "https://www.javeriana.edu.co/inicio" },
            { name: "Universidad de Nariño (UDENAR)", url: "https://www.udenar.edu.co/" },
          ],
        },
        {
          label: "Société civile & Alliances",
          orgs: [
            { name: "IFEA-INER", url: "https://www.ifea.org.pe/nous/" },
            { name: "FCDS", url: "https://fcds.org.co/en/" },
            { name: "ONFA", url: "https://onfandina.com/" },
            { name: "APRENAT", url: "https://aprenat.org/" },
            { name: "REDMAC", url: "https://jovenesredmac.wixsite.com/redmac" },
          ],
        },
      ],
    },
    resources: {
      sectionLabel: "RESSOURCES & PUBLICATIONS",
      title: "Médiathèque du projet",
      items: [
        {
          type: "Acta",
          title: "Acte des réunions de lancement virtuelle — 1er et 12 juin 2026",
          date: "Juin 2026",
          tag: "Réunions",
          file: "Acta_FEF_CoRRIC_1_y_12_de_junio_2026_ES.pdf",
        },
        {
          type: "Bulletin",
          title: "Bulletin de juin 2026 — Sortie Villapinzón : système autonome d'irrigation et d'énergie (2.1.1)",
          date: "Juin 2026",
          tag: "Recherche",
          file: "Boletín junio 2026 – Proyecto FEF CoRRIC.pdf",
        },
        {
          type: "Bulletin",
          title: "Bulletin de septembre 2026 — Sortie Villapinzón : système autonome d'irrigation et d'énergie (2.1.1)",
          date: "Septembre 2026",
          tag: "Vulgarisation",
          file: "Boletín septiembre 2026 – Proyecto FEF CoRRIC.pdf",
        },
      ],
      download: "Télécharger",
      upcoming:
        "À venir : guides SPG numériques et atlas foncier du Sumapaz.",
    },
    footer: {
      tagline:
        "Coopération scientifique franco-colombienne pour une réforme rurale intégrale et durable.",
      contact: "Contact",
      email: "fefcorric@cirad.fr",
      rights: "© 2024 CoRRIC — Fonds Équipe France, Ambassade de France en Colombie",
    },
  },
  es: {
    nav: {
      about: "Acerca de",
      components: "Componentes",
      digital: "Digital",
      partners: "Socios",
      resources: "Recursos",
      intranet: "Intranet",
    },
    hero: {
      expand: "Cooperación para la Reforma Rural Integral en Colombia",
      title: "Co-innovar para una reforma rural integral sostenible e inclusiva",
      fundedBy: "Fondo Equipo Francia (FEF) · Embajada de Francia en Colombia",
      discover: "Conocer el proyecto",
    },
    stats: [
      { n: 336, label: "Beneficiarios directos" },
      { n: 176, label: "De las cuales mujeres" },
      { n: 30, label: "Organizaciones socias" },
      { n: 3, label: "Territorios piloto" },
    ],
    about: {
      sectionLabel: "ACERCA & CONTEXTO",
      title: "Una cooperación científica al servicio de la paz rural",
      body1:
        "CoRRIC nació del deseo de transformar la relación entre el mundo universitario y el mundo rural en Colombia, en continuidad con la Reforma Rural Integral (RRI) surgida del acuerdo de paz de 2016.",
      body2:
        "El proyecto moviliza al CIRAD y al IRD junto a instituciones colombianas para co-construir soluciones arraigadas en los territorios, colocando a las comunidades rurales — y especialmente a las mujeres — en el centro del proceso.",
      pullQuote:
        "Transformar la relación entre el mundo universitario y el mundo rural en Colombia.",
      governance: "Gobernanza del proyecto",
      govBody:
        "El Comité de Pilotaje reúne el SCAC, la Embajada de Francia, y las direcciones regionales del CIRAD y del IRD, garantizando una alineación entre diplomacia científica y realidades de campo.",
    },
    components: {
      sectionLabel: "EJES TEMÁTICOS",
      title: "Tres componentes científicas",
      subtitle:
        "Un enfoque integrado de la reforma rural, desde la gobernanza de tierras hasta las herramientas digitales participativas.",
      tabs: [
        {
          id: "land",
          label: "Tierra & Gobernanza",
          title: "Tierra, Política y Gobernanza",
          body: "Análisis de tierras, comités científicos paritarios y diagnósticos de acceso a la ley para reforzar la seguridad jurídica de las comunidades rurales en situación posconflicto. Intervención principal en Guaviare y Sumapaz.",
          tags: ["Tierras", "RRI", "Políticas públicas", "Posconflicto"],
          accent: "#1c3d2c",
        },
        {
          id: "value",
          label: "Cadenas de valor",
          title: "Cadenas de valor y Sistemas alimentarios",
          body: "Acompañamiento de cadenas estratégicas: cacao resiliente (Tolima/Florida), arroz biofortificado (Córdoba/Sucre/Bolívar), banano y plátano (Valle del Cauca), agroindustria amazónica. Desarrollo del turismo agroecológico con asociaciones de mujeres en Sumapaz y Guaviare.",
          tags: ["Cacao", "Arroz biofortificado", "Banano/Plátano", "Turismo agroecológico"],
          accent: "#bf5c2c",
        },
        {
          id: "coinno",
          label: "Co-Innovación",
          title: "Co-Innovación y Herramientas participativas",
          body: "Despliegue de TerriStories (simulación territorial), los Sistemas Participativos de Garantía (SPG) digitales y herramientas de certificación «cero deforestación» para los actores de las cadenas.",
          tags: ["TerriStories", "SPG digitales", "Cero deforestación", "Cartografía participativa"],
          accent: "#2c5f7a",
        },
      ],
    },
    territories: {
      sectionLabel: "ZONAS DE INTERVENCIÓN",
      title: "Tres territorios piloto en Colombia",
      subtitle:
        "Del Pacífico a la Amazonía, de los Andes a la llanura — tres contextos agroecológicos distintos.",
      zones: [
        {
          name: "Guaviare",
          desc: "Amazonía colombiana — cadenas agroindustriales y turismo agroecológico comunitario con Las Caprichosas",
          x: 288,
          y: 266,
        },
        {
          name: "Sumapaz",
          desc: "Región andina cerca de Bogotá — gobernanza de tierras y turismo agroecológico",
          x: 208,
          y: 224,
        },
        {
          name: "Valle del Cauca",
          desc: "Pacífico colombiano — cadena banano/plátano y sistemas alimentarios sostenibles",
          x: 118,
          y: 274,
        },
      ] as Zone[],
    },
    digital: {
      sectionLabel: "ECOSISTEMA DIGITAL",
      title: "Herramientas digitales para los actores rurales",
      subtitle:
        "Diseñadas para funcionar con conectividad limitada, cerca de las realidades del campo.",
      apps: [
        {
          name: "miCampoApp",
          emoji: "📱",
          desc: "Agendas interactivas de producción agroecológica, planificación de la oferta y demanda territorial, gestión de créditos cooperativos para productores rurales.",
          tags: ["Agroecología", "Planificación territorial", "Créditos cooperativos", "Mobile-first"],
        },
        {
          name: "PlantAgroEco / PlantNet",
          emoji: "🌿",
          desc: "Identificación automática de enfermedades vegetales mediante inteligencia artificial. Diagnóstico en tiempo real para productores rurales, incluso en zonas de conectividad limitada.",
          tags: ["IA", "Salud vegetal", "Offline-first", "Diagnóstico"],
        },
      ],
    },
    partners: {
      sectionLabel: "SOCIOS",
      title: "Una red de instituciones comprometidas",
      categories: [
        {
          label: "Portadores y Co-coordinadores",
          orgs: [
            { name: "Embajada de Francia en Colombia", url: "https://co.ambafrance.org/" },
            { name: "CIRAD", url: "https://www.cirad.fr/" },
            { name: "IRD", url: "https://www.ird.fr/" },
          ],
        },
        {
          label: "Centros de investigación colombianos",
          orgs: [
            { name: "AGROSAVIA", url: "https://www.agrosavia.co/" },
            { name: "CIAT", url: "https://alliancebioversityciat.org/" },
            { name: "IDEAM", url: "https://www.ideam.gov.co/" },
            { name: "ICANH", url: "https://www.icanh.gov.co/" },
          ],
        },
        {
          label: "Universidades",
          orgs: [
            { name: "Pontificia Universidad Javeriana (PUJ)", url: "https://www.javeriana.edu.co/inicio" },
            { name: "Universidad de Nariño (UDENAR)", url: "https://www.udenar.edu.co/" },
          ],
        },
        {
          label: "Sociedad civil y Alianzas",
          orgs: [
            { name: "IFEA-INER", url: "https://www.ifea.org.pe/nous/" },
            { name: "FCDS", url: "https://fcds.org.co/en/" },
            { name: "ONFA", url: "https://onfandina.com/" },
            { name: "APRENAT", url: "https://aprenat.org/" },
            { name: "REDMAC", url: "https://jovenesredmac.wixsite.com/redmac" },
          ],
        },
      ],
    },
    resources: {
      sectionLabel: "RECURSOS Y PUBLICACIONES",
      title: "Mediateca del proyecto",
      items: [
        {
          type: "Acta",
          title: "Acte des réunions de lancement virtuelle — 1er et 12 juin 2026",
          date: "Junio 2026",
          tag: "Reuniones",
          file: "Acta_FEF_CoRRIC_1_y_12_de_junio_2026_ES.pdf",
        },
        {
          type: "Bulletin",
          title: "Boletín de junio 2026 — Salida Villapinzón : systema autonomo de irrigación y energía (2.1.1)",
          date: "Juin 2026",
          tag: "Investigación",
          file: "Boletín junio 2026 – Proyecto FEF CoRRIC.pdf",
        },
        {
          type: "Bulletin",
          title: "Bulletin de septembre 2026 — Salida Tibacuy : cooperación digital agroeoclogica con APRENAT (2.4.2, 2.6.3, 2.6.5, 3.2.2)",
          date: "Septembre 2026",
          tag: "Divulcagión",
          file: "Boletín septiembre 2026 – Proyecto FEF CoRRIC.pdf",
        },
      ],
      download: "Descargar",
      upcoming: "Próximamente: guías SPG digitales y atlas de tierras del Sumapaz.",
    },
    footer: {
      tagline:
        "Cooperación científica franco-colombiana para una reforma rural integral y sostenible.",
      contact: "Contacto",
      email: "fefcorric@cirad.fr",
      rights: "© 2024 CoRRIC — Fondo Equipo Francia, Embajada de Francia en Colombia",
    },
  },
};

// ── Animated counter ──────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, started: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return value;
}

function StatCounter({ n, label }: { n: number; label: string }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const value = useCountUp(n, 2000, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-10 px-4">
      <span className="font-display text-5xl md:text-6xl font-bold text-primary-foreground tabular-nums leading-none">
        {value.toLocaleString()}
      </span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/55 text-center">
        {label}
      </span>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({
  lang,
  setLang,
  t,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof T.fr;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const links: [string, string][] = [
    ["#about", t.nav.about],
    ["#components", t.nav.components],
    ["#digital", t.nav.digital],
    ["#partners", t.nav.partners],
    ["#resources", t.nav.resources],
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 \${
        scrolled ? "bg-primary/96 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#top" className="font-display font-bold text-xl text-primary-foreground tracking-tight">
          CoRRIC
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-xs uppercase tracking-widest text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={INTRANET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-accent hover:text-primary-foreground border border-accent/40 hover:border-accent px-3 py-1.5 transition-all duration-200"
          >
            <LogIn size={11} />
            {t.nav.intranet}
          </a>
          <button
            onClick={() => setLang(lang === "fr" ? "es" : "fr")}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary-foreground/65 hover:text-primary-foreground border border-primary-foreground/20 hover:border-primary-foreground/40 px-3 py-1.5 transition-all duration-200"
          >
            <Globe size={11} />
            {lang === "fr" ? "ES" : "FR"}
          </button>
          <button
            className="md:hidden text-primary-foreground p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-6 py-5 flex flex-col gap-5">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-xs uppercase tracking-widest text-primary-foreground/75"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href={INTRANET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-accent"
            onClick={() => setOpen(false)}
          >
            {t.nav.intranet}
          </a>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ t }: { t: typeof T.fr }) {
  return (
    <section id="top" className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #f4edda 0px, #f4edda 1px, transparent 1px, transparent 48px)",
        }}
      />

      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pt-28 pb-10 relative">
        <p className="text-accent text-[10px] tracking-[0.32em] uppercase mb-7 font-body font-bold">
          {t.hero.expand}
        </p>
        <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-bold text-primary-foreground leading-[1.04] mb-8 max-w-4xl">
          {t.hero.title}
        </h1>
        <p className="text-primary-foreground/50 text-xs tracking-widest uppercase mb-12">
          {t.hero.fundedBy}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#about"
            className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-accent/85 transition-colors duration-200"
          >
            {t.hero.discover}
            <ChevronRight size={14} />
          </a>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-primary-foreground" />
          <ChevronDown size={14} className="text-primary-foreground" />
        </div>
      </div>

      <div className="relative border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-primary-foreground/10">
            {t.stats.map((s) => (
              <StatCounter key={s.label} n={s.n} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

function About({ t }: { t: typeof T.fr }) {
  return (
    <section id="about" className="bg-background py-28 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-start">
        <div className="md:sticky md:top-24">
          <p className="text-accent text-[10px] tracking-[0.28em] uppercase mb-5 font-bold">
            {t.about.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-12">
            {t.about.title}
          </h2>
          <blockquote className="border-l-2 border-accent pl-6">
            <p className="font-display text-lg italic text-foreground/65 leading-relaxed">
              &ldquo;{t.about.pullQuote}&rdquo;
            </p>
          </blockquote>
        </div>

        <div className="space-y-6 pt-14">
          <p className="text-foreground/80 leading-relaxed text-lg">{t.about.body1}</p>
          <p className="text-foreground/80 leading-relaxed text-lg">{t.about.body2}</p>

          <div className="mt-4 aspect-[16/7] bg-muted overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=525&fit=crop&auto=format"
              alt="Communauté rurale colombienne — réunion de travail participatif"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>

          <div className="mt-8 bg-card border border-border p-7">
            <h3 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-3">
              <span className="w-6 h-0.5 bg-accent flex-shrink-0" />
              {t.about.governance}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{t.about.govBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

function Components({ t }: { t: typeof T.fr }) {
  const [active, setActive] = useState(0);
  const tab = t.components.tabs[active];

  return (
    <section id="components" className="bg-muted py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-accent text-[10px] tracking-[0.28em] uppercase mb-4 font-bold">
            {t.components.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t.components.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">{t.components.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-0 mb-0 border-b border-border">
          {t.components.tabs.map((tb, i) => (
            <button
              key={tb.id}
              onClick={() => setActive(i)}
              className={`px-6 py-3 text-xs uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px ${
                active === i
                  ? "border-accent text-foreground font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        <div className="bg-card border border-t-0 border-border p-8 md:p-12">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
                {tab.title}
              </h3>
              <p className="text-foreground/75 leading-relaxed text-base mb-8">{tab.body}</p>
              <div className="flex flex-wrap gap-2">
                {tab.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-3 py-1 border border-border text-muted-foreground tracking-widest uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center h-40 md:h-full min-h-[8rem]">
              <div
                className="w-36 h-36 flex items-center justify-center opacity-90"
                style={{ backgroundColor: tab.accent }}
              >
                <span className="font-display text-8xl font-black text-white/15 select-none leading-none">
                  {active + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Colombia Map ──────────────────────────────────────────────────────────────

function ColombiaMap({ t }: { t: typeof T.fr }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="territories" className="bg-primary py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-accent text-[10px] tracking-[0.28em] uppercase mb-4 font-bold">
            {t.territories.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            {t.territories.title}
          </h2>
          <p className="text-primary-foreground/50 max-w-2xl leading-relaxed">
            {t.territories.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-12 items-center">
          <div className="flex justify-center">
            <svg
              viewBox="0 0 400 440"
              className="w-full max-w-[320px] md:max-w-[360px]"
              aria-label="Carte de la Colombie avec les trois zones d'intervention"
            >
              <path
                d="M 130,55 L 158,28 L 188,14 L 242,10 L 292,20 L 333,46 L 360,76 L 382,130 L 375,182 L 360,234 L 344,294 L 315,341 L 282,380 L 246,408 L 206,408 L 164,390 L 138,362 L 112,312 L 92,260 L 78,200 L 82,148 L 106,97 L 130,55 Z"
                fill="#2d5e3e"
                stroke="#4a7c59"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M 180,80 Q 220,120 260,110 M 150,160 Q 200,180 260,165 M 130,230 Q 190,250 250,230"
                stroke="#4a7c59"
                strokeWidth="0.6"
                fill="none"
                opacity="0.5"
              />

              {t.territories.zones.map((zone, i) => (
                <g
                  key={zone.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={hovered === i ? 18 : 14}
                    fill="none"
                    stroke="#bf5c2c"
                    strokeWidth="1"
                    opacity={hovered === i ? 0.6 : 0.3}
                    style={{ transition: "all 0.25s ease" }}
                  />
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={hovered === i ? 8 : 6}
                    fill="#bf5c2c"
                    stroke="#f4edda"
                    strokeWidth="1.5"
                    style={{ transition: "all 0.25s ease" }}
                  />
                  <text
                    x={zone.x + (zone.x > 220 ? 14 : zone.x < 150 ? -14 : 14)}
                    y={zone.y + 4}
                    fontSize="10"
                    fill="#f4edda"
                    fontFamily="'Lato', sans-serif"
                    fontWeight="700"
                    textAnchor={zone.x < 150 ? "end" : "start"}
                    opacity="0.9"
                  >
                    {zone.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="space-y-3">
            {t.territories.zones.map((zone, i) => (
              <div
                key={zone.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`border p-6 cursor-default transition-all duration-250 \${
                  hovered === i
                    ? "border-accent bg-primary-foreground/5"
                    : "border-primary-foreground/12"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0 transition-transform duration-250"
                    style={{ transform: hovered === i ? "scale(1.4)" : "scale(1)" }}
                  />
                  <div>
                    <h4 className="font-display font-bold text-primary-foreground text-lg mb-1">
                      {zone.name}
                    </h4>
                    <p className="text-primary-foreground/55 text-sm leading-relaxed">{zone.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Digital Ecosystem ─────────────────────────────────────────────────────────

function DigitalEcosystem({ t }: { t: typeof T.fr }) {
  return (
    <section id="digital" className="bg-[#0e160b] py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-accent text-[10px] tracking-[0.28em] uppercase mb-4 font-bold">
            {t.digital.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            {t.digital.title}
          </h2>
          <p className="text-primary-foreground/45 max-w-2xl leading-relaxed">{t.digital.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {t.digital.apps.map((app) => (
            <div
              key={app.name}
              className="border border-primary-foreground/10 p-9 hover:border-accent/35 transition-colors duration-300 group"
            >
              <div className="text-4xl mb-7">{app.emoji}</div>
              <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">
                {app.name}
              </h3>
              <p className="text-primary-foreground/55 leading-relaxed mb-7 text-sm">{app.desc}</p>
              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-3 py-1 border border-accent/25 text-accent/70 tracking-widest uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Partners ──────────────────────────────────────────────────────────────────

function Partners({ t }: { t: typeof T.fr }) {
  return (
    <section id="partners" className="bg-background py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-accent text-[10px] tracking-[0.28em] uppercase mb-4 font-bold">
            {t.partners.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.partners.title}
          </h2>
        </div>

        <div className="space-y-12">
          {t.partners.categories.map((cat) => (
            <div key={cat.label}>
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-accent mb-5 pb-3 border-b border-border font-bold">
                {cat.label}
              </h3>
              <div className="flex flex-wrap gap-3">
                {cat.orgs.map((org) =>
                  org.url ? (
                    <a
                      key={org.name}
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:border-accent/35 hover:bg-muted transition-all duration-200"
                    >
                      {org.name}
                    </a>
                  ) : (
                    <div
                      key={org.name}
                      className="border border-border bg-card px-5 py-3 text-sm font-medium text-foreground"
                    >
                      {org.name}
                    </div>
                  )
                )}              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Resources ─────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Bulletin: { bg: "bg-secondary/10", text: "text-secondary" },
  Boletín: { bg: "bg-secondary/10", text: "text-secondary" },
  Guide: { bg: "bg-accent/10", text: "text-accent" },
  Guía: { bg: "bg-accent/10", text: "text-accent" },
  "Policy Brief": { bg: "bg-primary/10", text: "text-primary" },
  Acta: { bg: "bg-primary/10", text: "text-primary" },
};

function Resources({ t }: { t: typeof T.fr }) {
  return (
    <section id="resources" className="bg-muted py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-accent text-[10px] tracking-[0.28em] uppercase mb-4 font-bold">
            {t.resources.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.resources.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {t.resources.items.map((item) => {
            const colors = TYPE_COLORS[item.type] ?? {
              bg: "bg-muted",
              text: "text-muted-foreground",
            };
            return (
              <div
                key={item.title}
                className="bg-card border border-border p-7 flex justify-between gap-6 hover:border-accent/30 transition-colors duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-[10px] px-2.5 py-1 tracking-widest uppercase font-bold ${colors.bg} ${colors.text}`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h4 className="font-display font-medium text-foreground leading-snug mb-2 text-base">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {item.tag}
                  </span>
                </div>
                <a
                  href={DOCS + item.file}
                  download
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 text-accent/60 hover:text-accent transition-colors duration-200 pt-1"
                >
                  <Download size={16} />
                  <span className="text-[9px] uppercase tracking-widest">{t.resources.download}</span>
                </a>
              </div>
            );
          })}
        </div>

        {t.resources.upcoming && (
          <p className="mt-10 text-sm text-muted-foreground italic border-l-2 border-accent/40 pl-5 py-1">
            {t.resources.upcoming}
          </p>
        )}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ t }: { t: typeof T.fr }) {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <p className="font-display text-2xl font-bold mb-3">CoRRIC</p>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-md">
            {t.footer.tagline}
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent mb-3 font-bold">
            {t.footer.contact}
          </p>
          <a
            href={`mailto:${t.footer.email}`}
            className="text-primary-foreground hover:text-accent transition-colors"
          >
            {t.footer.email}
          </a>
          <p className="text-primary-foreground/40 text-xs mt-8">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>("fr");
  const t = T[lang];

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <About t={t} />
      <Components t={t} />
      <ColombiaMap t={t} />
      <DigitalEcosystem t={t} />
      <Partners t={t} />
      <Resources t={t} />
      <Footer t={t} />
    </div>
  );
}
