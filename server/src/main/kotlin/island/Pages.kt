package island

internal fun phonePage(): String = """
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Island</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<style>
  body { margin: 0; background: #FBF9F5; color: #1F3D32; font-family: "Source Sans 3", sans-serif; }
  a { color: inherit; text-decoration: none; }
  button { font: inherit; color: inherit; background: none; border: 0; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
  .brand { font-family: "Playfair Display", Georgia, serif; font-size: 28px; margin: 0; }
  .brand::after { content: ""; display: block; width: 36px; height: 2px; margin-top: 4px; background: #C8933E; }
  #account { font-weight: 600; }
  .hero { position: relative; height: 280px; background: #12251E; }
  .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hero-copy { position: absolute; left: 16px; right: 16px; bottom: 20px; color: #FBF9F5; }
  .hero-kicker { letter-spacing: .16em; text-transform: uppercase; font-size: 11px; }
  .hero h1 { font-family: "Playfair Display", Georgia, serif; font-size: 32px; margin: 4px 0 0; }
  .tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 16px; }
  .tile { background: #fff; border: 1px solid #E7E1D6; border-top: 3px solid #C8933E; border-radius: 16px; padding: 16px 8px; text-align: center; }
  .tile strong { display: block; }
  .tile span { color: #5c675f; font-size: 12px; }
  section { margin: 8px 0 22px; }
  .row-head { display: flex; justify-content: space-between; align-items: baseline; padding: 0 16px 8px; }
  h2 { font-family: "Playfair Display", Georgia, serif; font-size: 22px; margin: 0; }
  .scroller { display: flex; gap: 12px; overflow-x: auto; padding: 0 16px 8px; scroll-snap-type: x mandatory; }
  .hcard { flex: 0 0 240px; scroll-snap-align: start; background: #fff; border: 1px solid #E7E1D6; border-radius: 16px; overflow: hidden; }
  .shot { height: 132px; background: #1F3D32; }
  .shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hcard p { margin: 0; padding: 12px 12px 4px; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: #5c675f; }
  .hcard h3 { margin: 0; padding: 0 12px 14px; font-family: "Playfair Display", Georgia, serif; font-size: 18px; }
  .empty { color: #5c675f; padding: 0 16px; }
  #map-filter { display: none; position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 20; background: #fff; border-radius: 16px; padding: 16px; box-shadow: 0 8px 30px rgba(31,61,50,.18); }
  #map-filter.open { display: block; }
  #map-filter input, #map-filter button { display: block; width: 100%; margin: 8px 0; padding: 12px; border-radius: 12px; border: 1px solid #E7E1D6; box-sizing: border-box; }
  #map-filter input[type="checkbox"] { width: auto; display: inline; }
  #map-sign-in { background: #1F3D32; color: #FBF9F5; border: 0; font-weight: 600; }
</style>
<header>
  <p class="brand">Island</p>
  <button id="account" type="button">Account</button>
</header>
<a class="hero" href="/page/glendalough">
  <img alt="Glendalough" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Glendalough_upper_lake.jpg/1280px-Glendalough_upper_lake.jpg">
  <div class="hero-copy">
    <div class="hero-kicker">County Wicklow</div>
    <h1>Glendalough</h1>
  </div>
</a>
<div class="tiles">
  <button class="tile" type="button" data-row="places-row"><strong>Place</strong><span>Landmarks</span></button>
  <button class="tile" type="button" data-row="stays-row"><strong>Stay</strong><span>Camps and inns</span></button>
  <button class="tile" type="button" data-row="experiences-row"><strong>Experience</strong><span>Walks and water</span></button>
</div>
<section id="places-row">
  <div class="row-head"><h2>Places</h2></div>
  <div id="places" class="scroller"></div>
</section>
<section id="stays-row">
  <div class="row-head"><h2>Stays</h2></div>
  <div id="stays" class="scroller"></div>
</section>
<section id="experiences-row">
  <div class="row-head"><h2>Experiences</h2></div>
  <div id="experiences" class="scroller"></div>
</section>
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
<script>
function tokenGet() { try { return localStorage.getItem('islandToken') || ''; } catch (e) { return ''; } }
function tokenSet(value) { try { if (value) localStorage.setItem('islandToken', value); else localStorage.removeItem('islandToken'); } catch (e) {} }
function card(parent, href, title, meta, image) {
  const link = document.createElement('a');
  link.className = 'hcard';
  link.href = href;
  const shot = document.createElement('div');
  shot.className = 'shot';
  if (image) {
    const img = document.createElement('img');
    img.alt = '';
    img.src = image;
    img.onerror = function () { img.remove(); };
    shot.appendChild(img);
  }
  const note = document.createElement('p');
  note.textContent = meta || '';
  const name = document.createElement('h3');
  name.textContent = title;
  link.appendChild(shot);
  link.appendChild(note);
  link.appendChild(name);
  parent.appendChild(link);
  return link;
}
function paint(places, stays, experiences, mineIds, visitIds, signedIn) {
  const mine = {};
  mineIds.forEach(function (id) { mine[id] = true; });
  const seen = {};
  visitIds.forEach(function (id) { seen[id] = true; });
  const placesEl = document.getElementById('places');
  const staysEl = document.getElementById('stays');
  const experiencesEl = document.getElementById('experiences');
  placesEl.replaceChildren();
  staysEl.replaceChildren();
  experiencesEl.replaceChildren();
  places.forEach(function (p) {
    const el = card(placesEl, '/page/' + p.id, p.name, p.county || 'Place', '/listings/' + p.id + '/images/0');
    el.dataset.mine = mine[p.id] ? '1' : '0';
    el.dataset.stayed = seen[p.id] ? '1' : '0';
  });
  stays.forEach(function (s) {
    card(staysEl, '/page/' + s.id, s.title, s.county || s.kind, '/listings/' + s.id + '/photo');
  });
  if (!stays.length) {
    const note = document.createElement('p');
    note.className = 'empty';
    note.textContent = 'No stays yet.';
    staysEl.appendChild(note);
  }
  experiences.forEach(function (e) {
    card(experiencesEl, '/page/' + e.id, e.name, e.county || 'Experience', '/listings/' + e.id + '/photo');
  });
  if (!experiences.length) {
    const note = document.createElement('p');
    note.className = 'empty';
    note.textContent = 'No experiences yet.';
    experiencesEl.appendChild(note);
  }
  const yours = document.getElementById('note-yours');
  const stayedNote = document.getElementById('note-stayed');
  if (!signedIn) {
    yours.textContent = 'Your places: none. You are not signed in.';
    stayedNote.textContent = 'Places you have stayed: none. You are not signed in.';
  } else {
    yours.textContent = mineIds.length ? ('Your places: ' + mineIds.length + '.') : 'Your places: none.';
    stayedNote.textContent = visitIds.length ? ('Places you have stayed: ' + visitIds.length + '.') : 'Places you have stayed: none.';
  }
  applyPlaces();
}
function applyPlaces() {
  const theirs = document.getElementById('f-theirs').checked;
  const others = document.getElementById('f-others').checked;
  const stayed = document.getElementById('f-stayed').checked;
  const could = document.getElementById('f-could').checked;
  Array.prototype.forEach.call(document.getElementById('places').children, function (el) {
    if (!el.dataset) return;
    const mine = el.dataset.mine === '1';
    const seen = el.dataset.stayed === '1';
    const show = (mine && theirs) || (!mine && others) || (seen && stayed);
    el.style.display = show ? '' : 'none';
  });
  Array.prototype.forEach.call(document.getElementById('stays').children, function (el) {
    if (el.classList && el.classList.contains('empty')) return;
    el.style.display = could ? '' : 'none';
  });
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
  paint(places, stays, experiences, mine.map(function (p) { return p.id; }), visits.map(function (v) { return v.placeId; }), signedIn);
}
['f-theirs', 'f-others', 'f-stayed', 'f-could'].forEach(function (id) {
  document.getElementById(id).addEventListener('change', applyPlaces);
});
document.querySelectorAll('.tile').forEach(function (tile) {
  tile.addEventListener('click', function () {
    document.getElementById(tile.dataset.row).scrollIntoView({behavior: 'smooth', block: 'start'});
  });
});
document.getElementById('account').addEventListener('click', function () {
  document.getElementById('map-filter').classList.toggle('open');
});
document.getElementById('map-sign-in').onclick = async function () {
  const email = document.getElementById('map-email').value;
  const password = document.getElementById('map-password').value;
  const login = await fetch('/sessions', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
  if (!login.ok) { document.getElementById('sign-state').textContent = 'Sign-in failed'; return; }
  const session = await login.json();
  tokenSet(session.token);
  document.getElementById('sign-state').textContent = session.email;
  document.getElementById('map-filter').classList.remove('open');
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
