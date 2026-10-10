// بازار ایپ - سروس ورکر (نیا ورژن آئے تو V کا نام بدل دیں)
const V = 'bazaar-v3.11';
const SHELL = ['./', 'index.html', 'icon-192.png', 'icon-512.png', 'manifest.webmanifest'];

/* ---------- اطلاعات (Firebase Cloud Messaging) ---------- */
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
                'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp({
    apiKey: 'AIzaSyCIx55s0v8hwsVmf-QwfrF2HlMIH3TBlC4',
    projectId: 'bazaar---app',
    messagingSenderId: '146107292640',
    appId: '1:146107292640:web:2964080dad232e7ec02985'
  });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(p => {
    const d = p.data || {};
    return self.registration.showNotification(d.title || 'بازار ایپ', {
      body: d.body || 'نیا پیغام',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'chat-' + (d.from || 'x'),
      renotify: true,
      silent: d.silent === '1',
      dir: 'rtl',
      lang: 'ur',
      data: { from: d.from || '', kind: d.kind || '' }
    });
  });
} catch (err) { /* اطلاع نہ چلے تو باقی ایپ پھر بھی چلتی رہے گی */ }

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const from = (e.notification.data || {}).from || '';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) { c.postMessage({ chat: from }); return c.focus(); }
      }
      return clients.openWindow('./' + (from ? '?chat=' + encodeURIComponent(from) : ''));
    })
  );
});

/* ---------- کیش ---------- */
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    // پہلے نیٹ سے تازہ صفحہ، نہ ملے تو محفوظ کیا ہوا
    e.respondWith(
      fetch(r).then(res => {
        const copy = res.clone();
        caches.open(V).then(c => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html'))
    );
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
