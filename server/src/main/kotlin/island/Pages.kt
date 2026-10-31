package island

internal fun phonePage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Island</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
  body { font-family: Georgia, serif; margin: 0; background: #f6f3ee; color: #1c2420; }
  header { background: #0B6E4F; color: white; padding: 16px; }
  main { padding: 16px; max-width: 960px; margin: 0 auto; }
  a { color: #0B6E4F; }
  .card { background: white; border-radius: 12px; padding: 12px 16px; margin: 8px 0; }
  #map-wrap { position: relative; }
  #map { height: 420px; border-radius: 12px; }
  #map-filter {
    position: absolute; top: 8px; right: 8px; z-index: 1000; width: 176px;
    max-height: 300px; overflow: auto; background: #fff; border-radius: 10px;
    padding: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.25); font-size: 12px;
  }
  #map-filter label { display: block; margin: 4px 0; }
  #map-filter input[type="checkbox"] { width: auto; }
  #map-filter .note { margin: 0 0 6px; color: #3d4a44; }
  #map-filter input, #map-filter button { display: block; width: 100%; margin: 4px 0; }
  .swatch { display: inline-block; width: 12px; height: 12px; margin-right: 6px; vertical-align: -1px; }
  .leaflet-div-icon.pin { background: transparent; border: none; }
  .legend { list-style: none; padding: 0; margin: 4px 0 8px; }
</style>
<header>Island</header>
<main>
  <p>Places, stays, and experiences on the island of Ireland.</p>
  <p><a href="/host">Host</a> · <a href="/supplier">Supplier</a> · <a href="/admin">Admin</a></p>
  <div id="map-wrap">
    <div id="map"></div>
    <aside id="map-filter">
      <p>Show</p>
      <label><input id="f-theirs" type="checkbox" checked> Your places</label>
      <p id="note-yours" class="note">Your places: none. You are not signed in.</p>
      <label><input id="f-others" type="checkbox" checked> Other places</label>
      <label><input id="f-stayed" type="checkbox" checked> Places you have stayed</label>
      <p id="note-stayed" class="note">Places you have stayed: none. You are not signed in.</p>
      <label><input id="f-could" type="checkbox" checked> Places you could stay</label>
      <p>Pins</p>
      <ul class="legend">
        <li><span class="swatch" style="background:#1B4F72"></span> Place</li>
        <li><span class="swatch" style="background:#2E7D32"></span> Campsite</li>
        <li><span class="swatch" style="background:#C56A12"></span> Glamping</li>
        <li><span class="swatch" style="background:#9A3412"></span> Bed and breakfast</li>
        <li><span class="swatch" style="background:#0F6E8C"></span> Supplier experience</li>
      </ul>
      <p id="sign-state">You are not signed in.</p>
      <input id="map-email" placeholder="Email" autocomplete="username">
      <input id="map-password" placeholder="Password" type="password" autocomplete="current-password">
      <button id="map-sign-in" type="button">Sign in</button>
    </aside>
  </div>
  <div id="list"></div>
</main>
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
function card(href, title, meta) {
  const el = document.createElement('div');
  el.className = 'card';
  const link = document.createElement('a');
  link.href = href;
  link.textContent = title;
  const note = document.createElement('div');
  note.textContent = meta || '';
  el.appendChild(link);
  el.appendChild(note);
  list.appendChild(el);
}
function draw() {
  layer.clearLayers();
  const show = {
    theirs: document.getElementById('f-theirs').checked,
    others: document.getElementById('f-others').checked,
    stayed: document.getElementById('f-stayed').checked,
    could: document.getElementById('f-could').checked
  };
  markers.forEach(function (m) {
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
  places.forEach(function (p) { card('/page/' + p.id, p.name, p.county || ''); });
  stays.forEach(function (s) { card('/page/' + s.id, s.title, s.kind); });
  experiences.forEach(function (e) { card('/page/' + e.id, e.name, e.county || ''); });
  rebuild(places, stays, experiences, mine.map(function (p) { return p.id; }), visits.map(function (v) { return v.placeId; }), signedIn);
}
['f-theirs', 'f-others', 'f-stayed', 'f-could'].forEach(function (id) {
  document.getElementById(id).addEventListener('change', draw);
});
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
<style>body{font-family:Georgia,serif;margin:0;background:#f6f3ee}header{background:#0B6E4F;color:#fff;padding:16px}main{padding:16px;max-width:720px;margin:0 auto}input,textarea,button{display:block;width:100%;margin:8px 0;padding:8px;box-sizing:border-box}.lot-row{border-top:1px solid #ddd;padding-top:8px}</style>
<header>Add a stay</header>
<main>
<input id="email" placeholder="Email"><input id="password" placeholder="Password" type="password">
<select id="kind"><option>campsite</option><option>glamping</option><option>bed and breakfast</option></select>
<input id="title" placeholder="Title"><textarea id="description" placeholder="Description"></textarea>
<input id="county" placeholder="County"><input id="lat" placeholder="Latitude"><input id="lng" placeholder="Longitude">
<div id="lots"></div>
<button id="add-lot" type="button">Add a lot</button>
<input id="photo" type="file" accept="image/png,image/jpeg">
<button id="save" type="button">Save</button>
<p id="out"></p>
<script>
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
<title>Supplier</title>
<style>body{font-family:Georgia,serif;margin:0;background:#f6f3ee}header{background:#0B6E4F;color:#fff;padding:16px}main{padding:16px;max-width:720px;margin:0 auto}input,textarea,button{display:block;width:100%;margin:8px 0;padding:8px}</style>
<header>Add an experience</header>
<main>
<input id="email" placeholder="Email"><input id="password" placeholder="Password" type="password">
<input id="name" placeholder="Name"><textarea id="description" placeholder="Description"></textarea>
<input id="county" placeholder="County"><input id="lat" placeholder="Latitude"><input id="lng" placeholder="Longitude">
<input id="photo" type="file" accept="image/png,image/jpeg">
<button id="save" type="button">Save</button>
<p id="out"></p>
<script>
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
<style>body{font-family:Georgia,serif;margin:0;background:#f6f3ee}header{background:#0B6E4F;color:#fff;padding:16px}main{padding:16px;max-width:720px;margin:0 auto}input,button{display:block;width:100%;margin:8px 0;padding:8px}a{color:#0B6E4F}</style>
<header>Admin</header>
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
<style>
  body { font-family: Georgia, serif; margin: 0; background: #f6f3ee; color: #1c2420; }
  header { background: #0B6E4F; color: white; padding: 16px; }
  header a { color: white; }
  main { padding: 16px; max-width: 480px; margin: 0 auto; }
  input, textarea, button { font: inherit; }
  .card { background: white; border-radius: 20px; min-height: 240px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  .card img { width: 100%; max-height: 240px; object-fit: cover; border-radius: 12px; }
  .kicker { text-transform: uppercase; letter-spacing: .06em; font-size: 12px; color: #3d4a44; }
  .actions { display: flex; gap: 12px; margin-top: 16px; }
  .actions button, #confirm-reject { flex: 1; min-height: 72px; font-size: 1.25rem; border: 0; border-radius: 999px; color: white; }
  #reject, #confirm-reject { background: #9A3412; }
  #approve { background: #0B6E4F; }
  #reason { width: 100%; min-height: 72px; margin: 8px 0; box-sizing: border-box; }
  #sign-in, #email, #password { display: block; width: 100%; margin: 8px 0; padding: 8px; box-sizing: border-box; }
  #sign-in { min-height: 48px; background: #0B6E4F; color: white; border: 0; border-radius: 12px; }
</style>
<header><a href="/admin">Review</a></header>
<main>
  <p>Hidden stays, hidden experiences, and new suppliers. One at a time.</p>
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
  text(box, card.kind, 'kicker');
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
    return """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(row.name)}</title>
<style>
  body { font-family: Georgia, serif; margin: 0; background: #f6f3ee; color: #1c2420; }
  header { background: #0B6E4F; color: white; padding: 16px; }
  main { padding: 16px; max-width: 720px; margin: 0 auto; }
  a { color: #0B6E4F; }
  img { width: 100%; border-radius: 12px; }
</style>
<header><a href="/" style="color:white">${esc(row.name)}</a></header>
<main>
  <p>${esc(row.county)} · ${esc(row.kind)}</p>
  $photo
  <p>${esc(row.description)}</p>
  <ul>$lots</ul>
  $been
</main>
""".trimIndent()
}

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
