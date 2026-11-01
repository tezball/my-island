package island

internal fun phonePage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Island</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,500;0,7..72,600;1,7..72,500&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
  html, body { height: 100%; }
  body { margin: 0; background: #F6F3EE; color: #1C2421; font-family: "Public Sans", sans-serif; }
  a { color: #2C4A45; }
  button, input { font: inherit; color: inherit; }
  #app { height: 100%; display: flex; flex-direction: column; }
  header { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px 0; }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .brand { font-family: Literata, Georgia, serif; font-style: italic; font-weight: 500; font-size: 32px; color: #1C2421; margin: 0; letter-spacing: -0.02em; }
  #q { width: 100%; box-sizing: border-box; border: 1px solid #E4DDD2; background: #EFECE5; border-radius: 12px; padding: 12px 14px; color: #1C2421; }
  #q::placeholder { color: #596561; }
  #account { border: 0; background: transparent; color: #596561; border-radius: 12px; padding: 8px 2px; font-weight: 500; }
  .chips { display: flex; gap: 8px; padding: 10px 16px 12px; overflow: auto; }
  .chip { border: 1px solid #E4DDD2; background: #fff; color: #1C2421; border-radius: 12px; padding: 8px 14px; font-weight: 500; }
  .chip.on { background: #2C4A45; color: #F6F3EE; border-color: #2C4A45; }
  #stage { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  #map-wrap { position: relative; flex: 1; min-height: 220px; }
  #map { position: absolute; inset: 0; background: #E7E1D6; }
  .leaflet-container { font-family: "Public Sans", sans-serif; }
  .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 8px 30px rgba(28,36,33,.08); }
  .leaflet-popup-content a { font-family: Literata, Georgia, serif; color: #1C2421; text-decoration: none; }
  #sheet { background: #F6F3EE; border-radius: 18px 18px 0 0; max-height: 46vh; overflow: auto; padding: 8px 12px 20px; box-shadow: 0 -8px 30px rgba(28,36,33,.06); }
  .sheet-handle { width: 36px; height: 4px; border-radius: 999px; background: #D8D1C5; margin: 4px auto 10px; }
  .card { background: #fff; border: 1px solid rgba(228,221,210,.95); border-radius: 12px; padding: 12px 14px; margin: 8px 0; box-shadow: 0 4px 20px -2px rgba(28,36,33,.05); }
  .card div { color: #596561; font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
  .card div::before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 999px; margin-right: 6px; background: #1B4F72; vertical-align: baseline; }
  .card[data-kind="campsite"] div::before { background: #2E7D32; }
  .card[data-kind="glamping"] div::before { background: #C56A12; }
  .card[data-kind="bed and breakfast"] div::before { background: #9A3412; }
  .card[data-kind="experience"] div::before { background: #0F6E8C; }
  .card a { display: block; margin-top: 2px; font-family: Literata, Georgia, serif; font-weight: 500; font-size: 22px; color: #1C2421; text-decoration: none; }
  .legend { position: absolute; top: 12px; right: 12px; z-index: 500; background: rgba(255,255,255,.96); border: 1px solid rgba(228,221,210,.9); border-radius: 12px; padding: 10px 12px; margin: 0; box-shadow: 0 4px 20px -2px rgba(28,36,33,.08); }
  .legend-label { margin: 0 0 6px; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #596561; font-weight: 600; }
  .legend ul { list-style: none; margin: 0; padding: 0; font-size: 12px; }
  .legend li { margin: 4px 0; }
  .swatch { display: inline-block; width: 8px; height: 8px; border-radius: 999px; margin-right: 6px; }
  .leaflet-div-icon.pin { background: transparent; border: none; }
  #map-filter { display: none; position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 1000; background: #fff; border: 1px solid #E4DDD2; border-radius: 12px; padding: 16px; box-shadow: 0 8px 30px rgba(28,36,33,.12); max-height: 70vh; overflow: auto; }
  #map-filter.open { display: block; }
  #map-filter label { display: block; margin: 8px 0; }
  #map-filter .note { margin: 0 0 8px; color: #596561; }
  #map-filter input, #map-filter button { display: block; width: 100%; margin: 8px 0; padding: 12px 14px; border-radius: 12px; border: 1px solid #E4DDD2; box-sizing: border-box; background: #fff; }
  #map-filter input[type="checkbox"] { width: auto; display: inline; }
  #map-sign-in { background: #2C4A45; color: #F6F3EE; border: 0; font-weight: 600; }
  @media (min-width: 900px) {
    #stage { flex-direction: row; }
    #sheet { order: -1; width: 420px; max-height: none; border-radius: 0; box-shadow: none; border-right: 1px solid #E4DDD2; }
    header, .chips { padding-left: 16px; padding-right: 16px; }
  }
</style>
<div id="app">
<header>
  <div class="bar">
    <p class="brand">Island</p>
    <button id="account" type="button">Account</button>
  </div>
  <input id="q" placeholder="Search the island" aria-label="Search the island">
</header>
<div class="chips" role="tablist">
  <button class="chip on" type="button" data-kind="all">All</button>
  <button class="chip" type="button" data-kind="place">Places</button>
  <button class="chip" type="button" data-kind="stay">Stays</button>
  <button class="chip" type="button" data-kind="experience">Experiences</button>
</div>
<div id="stage">
  <div id="map-wrap">
    <div id="map"></div>
    <div class="legend">
    <p class="legend-label">Legend</p>
    <ul>
      <li><span class="swatch" style="background:#1B4F72"></span> Place</li>
      <li><span class="swatch" style="background:#2E7D32"></span> Campsite</li>
      <li><span class="swatch" style="background:#C56A12"></span> Glamping</li>
      <li><span class="swatch" style="background:#9A3412"></span> Bed and breakfast</li>
      <li><span class="swatch" style="background:#0F6E8C"></span> Experience</li>
    </ul>
    </div>
  </div>
  <section id="sheet">
    <div class="sheet-handle"></div>
    <div id="list"></div>
  </section>
</div>
<aside id="map-filter">
  <p id="sign-state">You are not signed in.</p>
  <input id="map-email" placeholder="Email" autocomplete="username">
  <input id="map-password" placeholder="Password" type="password" autocomplete="current-password">
  <button id="map-sign-in" type="button">Sign in</button>
  <p><a href="/host">Host</a> · <a href="/supplier">Guide</a> · <a href="/admin">Admin</a></p>
  <label><input id="f-theirs" type="checkbox" checked> Your places</label>
  <p id="note-yours" class="note">Your places: none. You are not signed in.</p>
  <label><input id="f-others" type="checkbox" checked> Other places</label>
  <label><input id="f-stayed" type="checkbox" checked> Places you have stayed</label>
  <p id="note-stayed" class="note">Places you have stayed: none. You are not signed in.</p>
  <label><input id="f-could" type="checkbox" checked> Places you could stay</label>
</aside>
</div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const map = L.map('map').setView([53.4, -7.9], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
const island = { minLat: 51, maxLat: 55.5, minLng: -11, maxLng: -5 };
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    if (lat >= island.minLat && lat <= island.maxLat && lng >= island.minLng && lng <= island.maxLng) {
      map.setView([lat, lng], 12);
    }
  }, function () {}, { timeout: 8000, maximumAge: 60000 });
}
const panel = document.getElementById('map-filter');
L.DomEvent.disableClickPropagation(panel);
L.DomEvent.disableScrollPropagation(panel);
const list = document.getElementById('list');
const layer = L.layerGroup().addTo(map);
const markers = [];
function tokenGet() { try { return localStorage.getItem('islandToken') || ''; } catch (e) { return ''; } }
function tokenSet(value) { try { if (value) localStorage.setItem('islandToken', value); else localStorage.removeItem('islandToken'); } catch (e) {} }
function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}
function svgIcon(svg, anchorY) {
  return L.divIcon({ className: 'pin', html: svg, iconSize: [28, 32], iconAnchor: [14, anchorY], popupAnchor: [0, -anchorY] });
}
const pinSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32"><path fill="#1B4F72" d="M14 1C7 1 2 6.2 2 13c0 8.2 12 18 12 18s12-9.8 12-18C26 6.2 21 1 14 1z"/><circle fill="#fff" cx="14" cy="12" r="4"/></svg>';
const tentSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="#2E7D32" d="M14 3 L26 24 H2 Z"/><path fill="#fff" d="M14 12 L18 24 H10 Z"/></svg>';
const domeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="#C56A12" d="M4 20 A10 10 0 0 1 24 20 Z"/><path stroke="#fff" stroke-width="1.5" d="M14 10 V20 M8 16 H20"/></svg>';
const houseSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill="#9A3412" d="M4 13 L14 4 L24 13 V25 H4 Z"/><rect fill="#fff" x="11" y="16" width="6" height="9"/></svg>';
const compassSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle fill="#0F6E8C" cx="14" cy="14" r="12"/><path fill="#fff" d="M14 5 L16.5 14 L14 12.5 L11.5 14 Z"/></svg>';
const ICONS = {
  place: svgIcon(pinSvg, 32),
  campsite: svgIcon(tentSvg, 26),
  glamping: svgIcon(domeSvg, 26),
  'bed and breakfast': svgIcon(houseSvg, 26),
  experience: svgIcon(compassSvg, 26)
};
function iconFor(kind) { return ICONS[kind] || ICONS.place; }
let kindFilter = 'all';
function kindOk(kind) {
  if (kindFilter === 'all') return true;
  if (kindFilter === 'place') return kind === 'place';
  if (kindFilter === 'experience') return kind === 'experience';
  return kind === 'campsite' || kind === 'glamping' || kind === 'bed and breakfast';
}
function queryText() {
  const box = document.getElementById('q');
  return box ? box.value.toLowerCase() : '';
}
function line(kindLabel, county) {
  return county ? kindLabel + ' · ' + county : kindLabel;
}
function card(href, title, meta, kind) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.kind = kind;
  const note = document.createElement('div');
  note.textContent = meta || '';
  const link = document.createElement('a');
  link.href = href;
  link.textContent = title;
  el.appendChild(note);
  el.appendChild(link);
  list.appendChild(el);
}
function applyList() {
  const q = queryText();
  Array.prototype.forEach.call(list.children, function (el) {
    const text = el.textContent.toLowerCase();
    const show = kindOk(el.dataset.kind) && (!q || text.indexOf(q) >= 0);
    el.style.display = show ? '' : 'none';
  });
  draw();
}
function draw() {
  layer.clearLayers();
  const q = queryText();
  const show = {
    theirs: document.getElementById('f-theirs').checked,
    others: document.getElementById('f-others').checked,
    stayed: document.getElementById('f-stayed').checked,
    could: document.getElementById('f-could').checked
  };
  markers.forEach(function (m) {
    if (!kindOk(m.kind)) return;
    if (q && m.title.toLowerCase().indexOf(q) < 0) return;
    const on = (m.layers.indexOf('theirs') >= 0 && show.theirs)
      || (m.layers.indexOf('others') >= 0 && show.others)
      || (m.layers.indexOf('stayed') >= 0 && show.stayed)
      || (m.layers.indexOf('could') >= 0 && show.could)
      || m.layers.indexOf('experience') >= 0;
    if (!on) return;
    const marker = L.marker([m.lat, m.lng], {icon: iconFor(m.kind)});
    marker.bindPopup('<a href="' + m.href + '">' + esc(m.title) + '</a>');
    marker.addTo(layer);
  });
}
function rebuild(places, stays, experiences, mineIds, visitIds, signedIn) {
  markers.length = 0;
  const mine = {};
  mineIds.forEach(function (id) { mine[id] = true; });
  const seen = {};
  visitIds.forEach(function (id) { seen[id] = true; });
  places.forEach(function (p) {
    if (p.lat == null || p.lng == null) return;
    const layers = [];
    if (mine[p.id]) layers.push('theirs'); else layers.push('others');
    if (seen[p.id]) layers.push('stayed');
    markers.push({lat: p.lat, lng: p.lng, kind: 'place', title: p.name, href: '/page/' + p.id, layers: layers});
  });
  stays.forEach(function (s) {
    if (s.lat == null || s.lng == null) return;
    markers.push({lat: s.lat, lng: s.lng, kind: s.kind, title: s.title, href: '/page/' + s.id, layers: ['could']});
  });
  experiences.forEach(function (e) {
    if (e.lat == null || e.lng == null) return;
    markers.push({lat: e.lat, lng: e.lng, kind: 'experience', title: e.name, href: '/page/' + e.id, layers: ['experience']});
  });
  const yours = document.getElementById('note-yours');
  const stayedNote = document.getElementById('note-stayed');
  if (!signedIn) {
    yours.textContent = 'Your places: none. You are not signed in.';
    stayedNote.textContent = 'Places you have stayed: none. You are not signed in.';
  } else {
    yours.textContent = mineIds.length ? ('Your places: ' + mineIds.length + '.') : 'Your places: none.';
    stayedNote.textContent = visitIds.length ? ('Places you have stayed: ' + visitIds.length + '.') : 'Places you have stayed: none.';
  }
  draw();
}
async function load() {
  const token = tokenGet();
  let signedIn = false;
  let mine = [];
  let visits = [];
  if (token) {
    const mineRes = await fetch('/me/places', {headers: {'Authorization': 'Bearer ' + token}});
    if (mineRes.status === 401) {
      tokenSet('');
      document.getElementById('sign-state').textContent = 'You are not signed in.';
    } else if (mineRes.ok) {
      signedIn = true;
      mine = await mineRes.json();
      const visitRes = await fetch('/me/visits', {headers: {'Authorization': 'Bearer ' + token}});
      if (visitRes.ok) visits = await visitRes.json();
      document.getElementById('sign-state').textContent = 'Signed in';
    }
  }
  const places = await (await fetch('/places')).json();
  const stays = await (await fetch('/stays')).json();
  const experiences = await (await fetch('/experiences')).json();
  list.replaceChildren();
  places.forEach(function (p) { card('/page/' + p.id, p.name, line('Place', p.county), 'place'); });
  stays.forEach(function (s) { card('/page/' + s.id, s.title, line(s.kind, s.county), s.kind); });
  experiences.forEach(function (e) { card('/page/' + e.id, e.name, line('Experience', e.county), 'experience'); });
  applyList();
  rebuild(places, stays, experiences, mine.map(function (p) { return p.id; }), visits.map(function (v) { return v.placeId; }), signedIn);
}
['f-theirs', 'f-others', 'f-stayed', 'f-could'].forEach(function (id) {
  document.getElementById(id).addEventListener('change', draw);
});
document.getElementById('q').addEventListener('input', applyList);
document.querySelectorAll('.chip').forEach(function (chip) {
  chip.addEventListener('click', function () {
    kindFilter = chip.dataset.kind;
    document.querySelectorAll('.chip').forEach(function (other) { other.classList.toggle('on', other === chip); });
    applyList();
  });
});
document.getElementById('account').addEventListener('click', function () {
  document.getElementById('map-filter').classList.toggle('open');
});
window.addEventListener('resize', function () { map.invalidateSize(); });
setTimeout(function () { map.invalidateSize(); }, 0);
document.getElementById('map-sign-in').onclick = async function () {
  const email = document.getElementById('map-email').value;
  const password = document.getElementById('map-password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('sign-state').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  tokenSet(session.token);
  document.getElementById('sign-state').textContent = session.email;
  load();
};
load();
</script>
""".trimIndent()

internal fun hostPage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Host</title>
${calmFonts()}
<style>
${calmFormCss()}
</style>
<header class="top">
  <a class="home" href="/">Home</a>
  <h1>Host</h1>
  <p class="lede">A host owns a stay.</p>
</header>
<main>
<section class="panel">
<h2>Sign up</h2>
<input id="signup-email" placeholder="Email" autocomplete="username">
<input id="signup-password" placeholder="Password" type="password" autocomplete="new-password">
<button id="signup" type="button">Sign up</button>
<p id="signup-out"></p>
</section>
<section class="panel">
<h2>Add a stay</h2>
<input id="email" placeholder="Email"><input id="password" placeholder="Password" type="password">
<select id="kind"><option>campsite</option><option>glamping</option><option>bed and breakfast</option></select>
<input id="title" placeholder="Title"><textarea id="description" placeholder="Description"></textarea>
<input id="county" placeholder="County">
<div class="pair"><input id="lat" placeholder="Latitude"><input id="lng" placeholder="Longitude"></div>
<div id="lots"></div>
<button id="add-lot" type="button">Add a lot</button>
<input id="photo" type="file" accept="image/png,image/jpeg">
<p class="review-note">Saving runs review. The stay stays off the public list until that review passes.</p>
<button id="save" type="button">Save</button>
<p id="out"></p>
</section>
<script>
document.getElementById('signup').onclick = async function () {
  const body = {
    email: document.getElementById('signup-email').value,
    password: document.getElementById('signup-password').value,
    role: 'host'
  };
  const res = await fetch('/accounts', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  document.getElementById('signup-out').textContent = res.ok ? 'Host account saved. Sign in to add a stay.' : await res.text() || ('Sign-up failed (' + res.status + ')');
};
const lots = document.getElementById('lots');
function addLot() {
  const row = document.createElement('div');
  row.className = 'lot-row';
  const name = document.createElement('input');
  name.className = 'lot-name';
  name.placeholder = 'Lot name';
  const sleeps = document.createElement('input');
  sleeps.className = 'lot-sleeps';
  sleeps.type = 'number';
  sleeps.min = '1';
  sleeps.value = '2';
  sleeps.placeholder = 'Sleeps';
  const price = document.createElement('input');
  price.className = 'lot-price';
  price.type = 'number';
  price.min = '0';
  price.step = '0.01';
  price.placeholder = 'EUR';
  row.appendChild(name);
  row.appendChild(sleeps);
  row.appendChild(price);
  lots.appendChild(row);
}
addLot();
document.getElementById('add-lot').onclick = function () { addLot(); };
function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
document.getElementById('save').onclick = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('out').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  try { localStorage.setItem('islandToken', session.token); } catch (e) {}
  const file = document.getElementById('photo').files[0];
  let imageBase64 = '';
  if (file) imageBase64 = toBase64(await file.arrayBuffer());
  const lotRows = Array.from(document.querySelectorAll('.lot-row')).map(function (row) {
    const price = row.querySelector('.lot-price').value;
    return {
      name: row.querySelector('.lot-name').value || 'Lot',
      sleeps: Number(row.querySelector('.lot-sleeps').value) || 2,
      priceEur: price === '' ? null : Number(price)
    };
  });
  const body = {
    kind: document.getElementById('kind').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    county: document.getElementById('county').value,
    lat: Number(document.getElementById('lat').value),
    lng: Number(document.getElementById('lng').value),
    imageBase64: imageBase64,
    lots: lotRows
  };
  const res = await fetch('/host/stays', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + session.token}, body: JSON.stringify(body)});
  document.getElementById('out').textContent = await res.text();
};
</script>
</main>
""".trimIndent()

internal fun supplierPage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guide</title>
${calmFonts()}
<style>
${calmFormCss()}
</style>
<header class="top">
  <a class="home" href="/">Home</a>
  <h1>Guide</h1>
  <p class="lede">A guide owns an experience.</p>
</header>
<main>
<section class="panel">
<h2>Sign up</h2>
<input id="signup-email" placeholder="Email" autocomplete="username">
<input id="signup-password" placeholder="Password" type="password" autocomplete="new-password">
<button id="signup" type="button">Sign up</button>
<p id="signup-out"></p>
</section>
<section class="panel">
<h2>Add an experience</h2>
<input id="email" placeholder="Email"><input id="password" placeholder="Password" type="password">
<input id="name" placeholder="Name"><textarea id="description" placeholder="Description"></textarea>
<input id="county" placeholder="County">
<div class="pair"><input id="lat" placeholder="Latitude"><input id="lng" placeholder="Longitude"></div>
<input id="photo" type="file" accept="image/png,image/jpeg">
<p class="review-note">Saving runs review. It stays off the public list until that review passes.</p>
<button id="save" type="button">Save</button>
<p id="out"></p>
</section>
<script>
document.getElementById('signup').onclick = async function () {
  const body = {
    email: document.getElementById('signup-email').value,
    password: document.getElementById('signup-password').value,
    role: 'supplier'
  };
  const res = await fetch('/accounts', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  document.getElementById('signup-out').textContent = res.ok ? 'Guide account saved. Sign in to add an experience.' : await res.text() || ('Sign-up failed (' + res.status + ')');
};
function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  return btoa(binary);
}
document.getElementById('save').onclick = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('out').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  try { localStorage.setItem('islandToken', session.token); } catch (e) {}
  const file = document.getElementById('photo').files[0];
  let imageBase64 = '';
  if (file) imageBase64 = toBase64(await file.arrayBuffer());
  const body = {name: document.getElementById('name').value, description: document.getElementById('description').value, county: document.getElementById('county').value, lat: Number(document.getElementById('lat').value), lng: Number(document.getElementById('lng').value), imageBase64: imageBase64};
  const res = await fetch('/supplier/experiences', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + session.token}, body: JSON.stringify(body)});
  document.getElementById('out').textContent = await res.text();
};
</script>
</main>
""".trimIndent()

internal fun adminPage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin</title>
${calmFonts()}
<style>
${calmFormCss()}
</style>
<header class="top">
  <a class="home" href="/">Home</a>
  <h1>Admin</h1>
</header>
<main>
<p><a href="/admin/review">Review</a></p>
<input id="email" value="tezball86@gmail.com"><input id="password" placeholder="Password" type="password">
<button id="load" type="button">Show listings</button>
<button id="hosts" type="button">Show hosts</button>
<input id="name" placeholder="New place name"><input id="county" placeholder="County"><input id="lat" placeholder="Latitude"><input id="lng" placeholder="Longitude">
<input id="photos" type="file" accept="image/png,image/jpeg" multiple>
<p>Up to five PNG or JPEG images.</p>
<button id="add" type="button">Add a place</button>
<input id="existing" placeholder="Existing place id">
<input id="more-photos" type="file" accept="image/png,image/jpeg" multiple>
<button id="attach" type="button">Add images</button>
<pre id="out"></pre>
<script>
async function auth() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) throw new Error('Sign-in failed');
  const session = await login.json();
  try { localStorage.setItem('islandToken', session.token); } catch (e) {}
  return session.token;
}
document.getElementById('load').onclick = async function () {
  const token = await auth();
  const res = await fetch('/admin/listings', {headers:{'Authorization':'Bearer ' + token}});
  document.getElementById('out').textContent = await res.text();
};
document.getElementById('hosts').onclick = async function () {
  const token = await auth();
  const res = await fetch('/admin/hosts', {headers:{'Authorization':'Bearer ' + token}});
  document.getElementById('out').textContent = await res.text();
};
function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
async function readImages(input) {
  const files = Array.from(input.files || []);
  if (files.length > 5) return {error: 'A place can have five images.'};
  const images = [];
  for (let i = 0; i < files.length; i += 1) images.push(toBase64(await files[i].arrayBuffer()));
  return {images: images};
}
document.getElementById('add').onclick = async function () {
  const token = await auth();
  const chosen = await readImages(document.getElementById('photos'));
  if (chosen.error) { document.getElementById('out').textContent = chosen.error; return; }
  const body = {name: document.getElementById('name').value, county: document.getElementById('county').value, lat: Number(document.getElementById('lat').value), lng: Number(document.getElementById('lng').value), images: chosen.images};
  const res = await fetch('/admin/places', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + token}, body: JSON.stringify(body)});
  document.getElementById('out').textContent = await res.text();
};
document.getElementById('attach').onclick = async function () {
  const token = await auth();
  const chosen = await readImages(document.getElementById('more-photos'));
  if (chosen.error) { document.getElementById('out').textContent = chosen.error; return; }
  const id = document.getElementById('existing').value;
  const res = await fetch('/admin/places/' + encodeURIComponent(id) + '/images', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + token}, body: JSON.stringify({images: chosen.images})});
  document.getElementById('out').textContent = await res.text();
};
</script>
</main>
""".trimIndent()

internal fun adminReviewPage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Review</title>
${calmFonts()}
<style>
${calmFormCss()}
</style>
<header class="top"><a href="/admin">Review</a></header>
<main>
  <p>Stays, experiences, and guides a person just saved. One at a time.</p>
  <input id="email" value="tezball86@gmail.com" autocomplete="username">
  <input id="password" placeholder="Password" type="password" autocomplete="current-password">
  <button id="sign-in" type="button">Sign in</button>
  <p id="sign-state">You are not signed in.</p>
  <article id="card" class="card"><p>Loading…</p></article>
  <div class="actions" id="actions">
    <button id="reject" type="button">Reject</button>
    <button id="approve" type="button">Approve</button>
  </div>
  <div id="reason-box" hidden>
    <p>Reject requires a short reason.</p>
    <label for="reason">Short reason</label>
    <textarea id="reason" maxlength="200" placeholder="Why this is rejected"></textarea>
    <button id="confirm-reject" type="button">Reject with reason</button>
    <p id="reason-err"></p>
  </div>
</main>
<script>
let token = '';
let card = null;
let busy = false;
try { token = localStorage.getItem('islandToken') || ''; } catch (e) { token = ''; }
function text(parent, value, className) {
  const el = document.createElement('p');
  if (className) el.className = className;
  el.textContent = value || '';
  parent.appendChild(el);
}
function kindLabel(kind) {
  if (kind === 'supplier') return 'guide';
  return kind || '';
}
async function loadCard() {
  const box = document.getElementById('card');
  box.replaceChildren();
  document.getElementById('reason-box').hidden = true;
  document.getElementById('reason').value = '';
  document.getElementById('reason-err').textContent = '';
  if (!token) {
    text(box, 'Sign in to review.');
    document.getElementById('actions').hidden = true;
    return;
  }
  const res = await fetch('/admin/review/next', {headers: {'Authorization': 'Bearer ' + token}});
  if (res.status === 401 || res.status === 403) {
    token = '';
    try { localStorage.removeItem('islandToken'); } catch (e) {}
    document.getElementById('sign-state').textContent = 'Sign in as the admin.';
    document.getElementById('actions').hidden = true;
    text(box, 'Sign in as the admin.');
    return;
  }
  card = await res.json();
  if (card.empty) {
    document.getElementById('actions').hidden = true;
    text(box, 'Nothing to review.');
    return;
  }
  document.getElementById('actions').hidden = false;
  text(box, kindLabel(card.kind), 'kicker');
  if (card.photo) {
    const photo = await fetch('/admin/review/photo/' + card.kind + '/' + card.id, {headers: {'Authorization': 'Bearer ' + token}});
    if (photo.ok) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(await photo.blob());
      img.alt = '';
      box.appendChild(img);
    }
  }
  text(box, card.title);
  text(box, card.subtitle);
  text(box, card.description);
  (card.lots || []).forEach(function (lot) {
    const price = lot.priceEur ? ' · EUR ' + lot.priceEur : '';
    text(box, lot.name + ' · sleeps ' + lot.sleeps + price);
  });
}
async function send(approve, reason) {
  if (!card || card.empty || busy) return;
  busy = true;
  const opts = {method: 'POST', headers: {'Authorization': 'Bearer ' + token}};
  if (!approve) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify({reason: reason});
  }
  const res = await fetch('/admin/review/' + card.kind + '/' + card.id + '/' + (approve ? 'approve' : 'reject'), opts);
  busy = false;
  if (!res.ok) {
    document.getElementById('reason-err').textContent = 'A short reason is required.';
    return;
  }
  loadCard();
}
document.getElementById('sign-in').onclick = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('sign-state').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  token = session.token;
  try { localStorage.setItem('islandToken', token); } catch (e) {}
  document.getElementById('sign-state').textContent = session.email;
  loadCard();
};
document.getElementById('approve').onclick = function () { send(true); };
document.getElementById('reject').onclick = function () {
  document.getElementById('reason-box').hidden = false;
  document.getElementById('reason').focus();
};
document.getElementById('confirm-reject').onclick = function () {
  const reason = document.getElementById('reason').value.trim();
  if (!reason) { document.getElementById('reason-err').textContent = 'A short reason is required.'; return; }
  send(false, reason);
};
const article = document.getElementById('card');
let startX = 0;
article.addEventListener('touchstart', function (event) { startX = event.changedTouches[0].clientX; }, {passive: true});
article.addEventListener('touchend', function (event) {
  const dx = event.changedTouches[0].clientX - startX;
  if (dx > 80) send(true);
  else if (dx < -80) document.getElementById('reason-box').hidden = false;
});
if (token) loadCard(); else document.getElementById('actions').hidden = true;
</script>
""".trimIndent()

internal fun listingPage(row: Listing): String {
    val lots = row.lots.joinToString("") { lot ->
        val price = if (lot.priceEur == null) "" else " · EUR ${esc(lot.priceEur)}"
        "<li>${esc(lot.name)} · sleeps ${lot.sleeps}$price</li>"
    }
    val photo = when {
        row.kind == "place" && row.imageCount > 0 -> (0 until row.imageCount).joinToString("") { index ->
            """<img src="/listings/${esc(row.id)}/images/$index" alt="">"""
        }
        row.photo -> """<img src="/listings/${esc(row.id)}/photo" alt="">"""
        else -> ""
    }
    val been = if (row.kind == "place") beenScript(jsId(row.id)) else ""
    val editor = when (row.kind) {
        "experience" -> experienceEditor(row)
        "campsite", "glamping", "bed and breakfast" -> stayEditor(row)
        else -> ""
    }
    return """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(row.name)}</title>
${calmFonts()}
<style>
${calmFormCss()}
</style>
<header class="top"><a class="home" href="/">Home</a></header>
<main>
  $photo
  <p class="kicker">${esc(row.county)} · ${esc(row.kind)}</p>
  <h1>${esc(row.name)}</h1>
  <p class="dek">${esc(row.description)}</p>
  <ul class="lots">$lots</ul>
  $been
  $editor
</main>
""".trimIndent()
}

private fun stayEditor(row: Listing): String {
    val id = jsId(row.id)
    if (id.isEmpty()) return ""
    val lots = if (row.lots.isEmpty()) lotInputs("", "2", "") else row.lots.joinToString("") { lot ->
        lotInputs(esc(lot.name), lot.sleeps.toString(), esc(lot.priceEur))
    }
    val kind = row.kind
    return """
<section class="panel">
<h2>Edit this stay</h2>
<p class="review-note">Saving runs review. The stay stays off the public list until that review passes.</p>
<input id="edit-email" placeholder="Email" autocomplete="username">
<input id="edit-password" placeholder="Password" type="password" autocomplete="current-password">
<select id="edit-kind">
  <option${if (kind == "campsite") " selected" else ""}>campsite</option>
  <option${if (kind == "glamping") " selected" else ""}>glamping</option>
  <option${if (kind == "bed and breakfast") " selected" else ""}>bed and breakfast</option>
</select>
<input id="edit-title" value="${esc(row.name)}">
<textarea id="edit-description">${esc(row.description)}</textarea>
<input id="edit-county" value="${esc(row.county)}">
<div class="pair">
<input id="edit-lat" value="${num(row.lat)}" placeholder="Latitude">
<input id="edit-lng" value="${num(row.lng)}" placeholder="Longitude">
</div>
<div id="edit-lots">$lots</div>
<button id="edit-add-lot" type="button">Add a lot</button>
<input id="edit-photo" type="file" accept="image/png,image/jpeg">
<button id="edit-save" type="button">Save this stay</button>
<p id="edit-out"></p>
<script>
function addEditLot() {
  const row = document.createElement('div');
  row.className = 'lot-row';
  ['Lot name', 'Sleeps', 'EUR'].forEach(function (placeholder, index) {
    const input = document.createElement('input');
    input.className = ['lot-name', 'lot-sleeps', 'lot-price'][index];
    input.placeholder = placeholder;
    if (index === 1) { input.type = 'number'; input.min = '1'; input.value = '2'; }
    if (index === 2) { input.type = 'number'; input.min = '0'; input.step = '0.01'; }
    row.appendChild(input);
  });
  document.getElementById('edit-lots').appendChild(row);
}
document.getElementById('edit-add-lot').onclick = function () { addEditLot(); };
function editToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
document.getElementById('edit-save').onclick = async function () {
  const email = document.getElementById('edit-email').value;
  const password = document.getElementById('edit-password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('edit-out').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  try { localStorage.setItem('islandToken', session.token); } catch (e) {}
  const file = document.getElementById('edit-photo').files[0];
  let imageBase64 = '';
  if (file) imageBase64 = editToBase64(await file.arrayBuffer());
  const lotRows = Array.from(document.querySelectorAll('#edit-lots .lot-row')).map(function (row) {
    const price = row.querySelector('.lot-price').value;
    return {
      name: row.querySelector('.lot-name').value || 'Lot',
      sleeps: Number(row.querySelector('.lot-sleeps').value) || 2,
      priceEur: price === '' ? null : Number(price)
    };
  });
  const body = {
    kind: document.getElementById('edit-kind').value,
    title: document.getElementById('edit-title').value,
    description: document.getElementById('edit-description').value,
    county: document.getElementById('edit-county').value,
    lat: Number(document.getElementById('edit-lat').value),
    lng: Number(document.getElementById('edit-lng').value),
    imageBase64: imageBase64,
    lots: lotRows
  };
  const res = await fetch('/host/stays/$id', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + session.token}, body: JSON.stringify(body)});
  document.getElementById('edit-out').textContent = await res.text();
};
</script>
</section>
""".trimIndent()
}

private fun experienceEditor(row: Listing): String {
    val id = jsId(row.id)
    if (id.isEmpty()) return ""
    return """
<section class="panel">
<h2>Edit this experience</h2>
<p class="review-note">A guide owns this experience. Saving runs review. It stays off the public list until that review passes.</p>
<input id="edit-email" placeholder="Email" autocomplete="username">
<input id="edit-password" placeholder="Password" type="password" autocomplete="current-password">
<input id="edit-name" value="${esc(row.name)}">
<textarea id="edit-description">${esc(row.description)}</textarea>
<input id="edit-county" value="${esc(row.county)}">
<div class="pair">
<input id="edit-lat" value="${num(row.lat)}" placeholder="Latitude">
<input id="edit-lng" value="${num(row.lng)}" placeholder="Longitude">
</div>
<input id="edit-photo" type="file" accept="image/png,image/jpeg">
<button id="edit-save" type="button">Save this experience</button>
<p id="edit-out"></p>
<script>
function editToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
document.getElementById('edit-save').onclick = async function () {
  const email = document.getElementById('edit-email').value;
  const password = document.getElementById('edit-password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('edit-out').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  try { localStorage.setItem('islandToken', session.token); } catch (e) {}
  const file = document.getElementById('edit-photo').files[0];
  let imageBase64 = '';
  if (file) imageBase64 = editToBase64(await file.arrayBuffer());
  const body = {
    name: document.getElementById('edit-name').value,
    description: document.getElementById('edit-description').value,
    county: document.getElementById('edit-county').value,
    lat: Number(document.getElementById('edit-lat').value),
    lng: Number(document.getElementById('edit-lng').value),
    imageBase64: imageBase64
  };
  const res = await fetch('/supplier/experiences/$id', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + session.token}, body: JSON.stringify(body)});
  document.getElementById('edit-out').textContent = await res.text();
};
</script>
</section>
""".trimIndent()
}

private fun calmFonts(): String = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,500;0,7..72,600;1,7..72,500&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
""".trimIndent()

private fun calmFormCss(): String = """
  [hidden] { display: none !important; }
  body { margin: 0; background: #F6F3EE; color: #1C2421; font-family: "Public Sans", sans-serif; font-size: 16px; line-height: 1.45; }
  main { padding: 8px 16px 40px; max-width: 32rem; margin: 0 auto; }
  a { color: #2C4A45; }
  header.top { padding: 18px 16px 0; background: transparent; color: inherit; max-width: 32rem; margin: 0 auto; }
  header.top h1, h1 { font-family: Literata, Georgia, serif; font-weight: 500; font-size: 2rem; line-height: 1.15; letter-spacing: -0.02em; margin: 0 0 8px; color: #1C2421; }
  header.top a:not(.home) { font-family: Literata, Georgia, serif; font-size: 1.75rem; color: #1C2421; text-decoration: none; }
  a.home { font-family: "Public Sans", sans-serif; font-size: 0.92rem; color: #596561; text-decoration: none; }
  h2 { font-family: Literata, Georgia, serif; font-weight: 500; font-size: 1.35rem; margin: 0 0 8px; }
  .lede { font-family: Literata, Georgia, serif; font-style: italic; font-size: 1.15rem; margin: 0 0 16px; }
  .kicker { text-transform: uppercase; letter-spacing: .06em; font-size: 12px; color: #596561; font-weight: 600; margin: 0 0 4px; }
  .dek { margin: 8px 0 16px; }
  .review-note { color: #8C6A45; font-size: 0.92rem; }
  .panel { background: #fff; border: 1px solid #E4DDD2; border-radius: 12px; padding: 16px; margin: 0 0 16px; box-shadow: 0 4px 20px -2px rgba(28,36,33,.05); }
  img { width: 100%; border-radius: 12px; display: block; margin: 0 0 12px; object-fit: cover; max-height: 280px; }
  input, textarea, select, button { font: inherit; color: inherit; }
  input, textarea, select { display: block; width: 100%; margin: 8px 0; padding: 12px 14px; box-sizing: border-box; border: 1px solid #E4DDD2; border-radius: 12px; background: #fff; }
  textarea { min-height: 96px; }
  button { display: block; width: 100%; margin: 8px 0; padding: 14px 16px; border: 0; border-radius: 12px; background: #2C4A45; color: #F6F3EE; font-weight: 600; cursor: pointer; }
  #add-lot, #edit-add-lot { background: #fff; color: #2C4A45; border: 1px solid #E4DDD2; font-weight: 500; }
  input[type="file"] { padding: 10px; background: #F6F3EE; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .pair input { margin: 8px 0; }
  .lot-row { display: grid; grid-template-columns: 1fr 5.5rem 5.5rem; gap: 8px; margin: 8px 0; padding: 8px; background: #F6F3EE; border-radius: 12px; }
  .lot-row input { margin: 0; }
  ul.lots { list-style: none; padding: 0; margin: 12px 0 16px; }
  ul.lots li { background: #fff; border: 1px solid #E4DDD2; border-radius: 12px; padding: 12px 14px; margin: 8px 0; }
  .card { background: #fff; border: 1px solid #E4DDD2; border-radius: 12px; min-height: 240px; padding: 16px; box-shadow: 0 4px 20px -2px rgba(28,36,33,.05); }
  .card img { max-height: 240px; }
  .actions { display: flex; gap: 12px; margin-top: 16px; }
  .actions button { width: auto; flex: 1; min-height: 72px; margin: 0; font-size: 1.15rem; }
  #reject, #confirm-reject { background: #9A3412; color: #F6F3EE; }
  #approve { background: #2C4A45; }
  #reason { min-height: 72px; }
  #sign-in { min-height: 48px; }
  pre { white-space: pre-wrap; word-break: break-word; background: #fff; border: 1px solid #E4DDD2; border-radius: 12px; padding: 12px; }
  :focus-visible { outline: 2px solid #2C4A45; outline-offset: 2px; }
""".trimIndent()

private fun lotInputs(name: String, sleeps: String, price: String): String = """
<div class="lot-row">
  <input class="lot-name" value="$name" placeholder="Lot name">
  <input class="lot-sleeps" type="number" min="1" value="$sleeps" placeholder="Sleeps">
  <input class="lot-price" type="number" min="0" step="0.01" value="$price" placeholder="EUR">
</div>
""".trimIndent()

private fun num(value: Double?): String = if (value == null) "" else value.toString()

private fun beenScript(id: String): String = """
<button id="been" type="button">I've been</button>
<script>
document.getElementById('been').onclick = async function () {
  const email = prompt('Email');
  const password = prompt('Password');
  if (!email || !password) return;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { alert('Sign-in failed'); return; }
  const session = await login.json();
  try { localStorage.setItem('islandToken', session.token); } catch (e) {}
  const mark = await fetch('/visits', {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': 'Bearer ' + session.token}, body: JSON.stringify({placeId: '$id'})});
  alert(mark.ok ? 'Saved. Only you can see this.' : 'Could not save');
};
</script>
""".trimIndent()

private fun esc(value: String?): String {
    if (value == null) return ""
    return value
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
}

private fun jsId(id: String): String = if (id.matches(Regex("[A-Za-z0-9_-]+"))) id else ""
