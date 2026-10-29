# Atlas Flow — site vitrine

Site de l'agence Atlas Flow (FR / EN / AR, thème clair/sombre, 3D, assistant IA).
Recréé en **Vite + React** à partir de la maquette `Atlas Flow v3.dc.html`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # site statique dans dist/
```

## Structure

```
atlas-flow/
├── index.html               page d'entrée (polices Google, balises meta)
├── public/
│   ├── map.html             carte Leaflet Settat / Casablanca (iframe de la page Contact)
│   └── promo/               vidéo animée « Atlas Flow en 40 secondes » (export maquette, iframe)
└── src/
    ├── main.jsx             point d'entrée React
    ├── App.jsx              langue, thème, navigation par ancre (#services, #method…)
    ├── i18n/                tous les textes : fr.js, en.js, ar.js, chat.js
    ├── lib/
    │   ├── atlas-3d.js      animation 3D de l'accueil (three.js)
    │   ├── assistant.js     appel de l'assistant IA
    │   └── icons.js         tracés SVG partagés
    ├── components/          Header, Footer, Icons, chat/ChatWidget
    ├── pages/               Home, Services, Method, Projects, Contact (+ leur CSS)
    └── styles/global.css    thème, boutons, animations
```

## Avant la mise en ligne

- **Coordonnées** : remplacer `[YOUR EMAIL]` et `[YOUR NUMBER]` dans `src/pages/Contact.jsx`.
- **Formulaire de contact** : il affiche une confirmation mais n'envoie rien. Le brancher à un service (e-mail, n8n, API).
- **Assistant IA** : il utilisait `window.claude.complete`, qui n'existe que dans l'environnement Claude. Ailleurs, il répond par le message d'erreur. Il faut une route API côté serveur (la clé ne doit jamais être dans le navigateur).
- **Images des projets** : des emplacements vides sont prévus dans `src/pages/Projects.jsx`.
- **Textes** : à modifier uniquement dans `src/i18n/`.
