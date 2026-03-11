const CACHE_NAME = 'conflictometer';

// Llista de fitxers que es guardaran al mòbil per a l'ús offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo_app.jpg',
  './fondo.jpg',
  './logo giam.jpg',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/lucide.min.js'
];

// 1. INSTAL·LACIÓ: Es descarreguen els fitxers a la memòria cau
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Guardant fitxers a la memòria...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. ACTIVACIÓ: Esborra memòria cau antiga si n'hi ha
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. INTERCEPCIÓ (FETCH): Si no hi ha internet, serveix el fitxer guardat
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retorna la còpia guardada o intenta demanar-ho a internet
        return cachedResponse || fetch(event.request);
      })
  );
});
