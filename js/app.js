const PHONE = "573212214507";
const PAGE = 36;
const fmt = v => "$" + v.toLocaleString("es-CO");
const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const $ = id => document.getElementById(id);

let cat = "Todo", sub = "", q = "", shown = PAGE, pick = {}, photo = {}, bag = [];
try { bag = JSON.parse(localStorage.getItem("lagrama-bag")) || []; } catch (e) {}
const save = () => { try { localStorage.setItem("lagrama-bag", JSON.stringify(bag)); } catch (e) {} };

const count = c => P.filter(p => p.c === c).length;
const subsOf = c => [...new Set(P.filter(p => p.c === c && p.sub).map(p => p.sub))];
const subLabel = s => s.replace(/ \/ /g, " · ").replace("Niñ@", "Niños");

function chips() {
  $("chips").innerHTML = ["Todo", ...CATEGORIAS].map(c =>
    `<button class="chip" type="button" aria-pressed="${c === cat}" data-c="${c}">${c}${c !== "Todo" ? ` <small>${count(c)}</small>` : ""}</button>`
  ).join("");
  const subs = cat === "Todo" ? [] : subsOf(cat);
  $("subs").hidden = subs.length < 2;
  $("subs").innerHTML = ["", ...subs].map(s =>
    `<button class="sub" type="button" aria-pressed="${s === sub}" data-s="${s}">${s ? subLabel(s) : "Todas"}</button>`
  ).join("");
}

function list() {
  const nq = norm(q);
  return P.filter(p =>
    (cat === "Todo" || p.c === cat) &&
    (!sub || p.sub === sub) &&
    (!nq || norm(`${p.n} ${p.c} ${p.sub}`).includes(nq))
  );
}

function card(p) {
  const i = photo[p.id] || 0, one = p.z.length === 0;
  const ready = one || pick[p.id];
  return `<article class="card">
    <div class="pic">
      <img src="${p.img[i]}" alt="${p.n}" loading="lazy" decoding="async">
      <span class="tag">${p.sub ? subLabel(p.sub) : p.c}</span>
      ${p.img.length > 1 ? `<div class="dots">${p.img.map((_, k) => `<button type="button" class="dot" data-ph="${p.id}" data-k="${k}" aria-label="Foto ${k + 1}" aria-pressed="${k === i}"></button>`).join("")}</div>` : ""}
    </div>
    <div class="body">
      <h3 class="name">${p.n}</h3>
      <div class="price">${p.p ? fmt(p.p) : '<span class="ask">Precio por WhatsApp</span>'}</div>
      ${p.z.length ? `<div class="sizes" role="group" aria-label="Talla">${p.z.map(z => `<button class="size" type="button" data-p="${p.id}" data-z="${z}" aria-pressed="${pick[p.id] === z}">${z}</button>`).join("")}</div>` : ""}
      <button class="add" type="button" data-add="${p.id}" ${ready ? "" : "disabled"}>${ready ? "Agregar al pedido" : "Escoge talla"}</button>
    </div>
  </article>`;
}

function grid() {
  const l = list();
  $("count").textContent = `${l.length} ${l.length === 1 ? "producto" : "productos"}`;
  $("grid").innerHTML = l.length ? l.slice(0, shown).map(card).join("") : `<p class="empty">No hay productos con esa búsqueda.</p>`;
  $("more").hidden = l.length <= shown;
  $("more").textContent = `Ver más (${l.length - shown} restantes)`;
}

function renderBag() {
  const n = bag.reduce((a, b) => a + b.q, 0);
  const priced = bag.every(b => b.p), tot = bag.reduce((a, b) => a + b.q * (b.p || 0), 0);
  $("bagN").textContent = n;
  $("totalRow").hidden = !(bag.length && priced);
  $("total").textContent = fmt(tot);
  $("items").innerHTML = bag.length ? bag.map((b, k) => `
    <div class="item">
      <img src="${b.img}" alt="" loading="lazy">
      <div class="t">${b.n}<div class="s">${b.z ? "Talla " + b.z : "Sin talla"}${b.p ? " · " + fmt(b.p) : ""}</div></div>
      <div class="qty"><button type="button" data-d="${k}" aria-label="Quitar uno">−</button>${b.q}<button type="button" data-i="${k}" aria-label="Agregar uno">+</button></div>
    </div>`).join("") : `<p class="empty">Todavía no has agregado nada.</p>`;
  const name = $("cname").value.trim(), mode = $("cmode").value.trim();
  const msg = "Hola La Grama, quiero hacer este pedido:\n" +
    bag.map(b => `• ${b.q} x ${b.n}${b.z ? ` (talla ${b.z})` : ""} [ref. ${b.id}]`).join("\n") +
    (priced && bag.length ? `\nTotal: ${fmt(tot)}` : "\n¿Me confirman precio y disponibilidad?") +
    (name ? `\nNombre: ${name}` : "") + (mode ? `\nEntrega: ${mode}` : "");
  $("wa").href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
  $("wa").setAttribute("aria-disabled", bag.length ? "false" : "true");
  save();
}

document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  const d = t.dataset;
  if (d.c) { cat = d.c; sub = ""; shown = PAGE; chips(); grid(); }
  else if (d.s !== undefined) { sub = d.s; shown = PAGE; chips(); grid(); }
  else if (d.ph) { photo[d.ph] = +d.k; grid(); }
  else if (d.z) { pick[d.p] = d.z; grid(); }
  else if (d.add) {
    const p = P.find(x => x.id == d.add), z = pick[p.id] || "";
    const ex = bag.find(b => b.id === p.id && b.z === z);
    ex ? ex.q++ : bag.push({ id: p.id, n: p.n, p: p.p, z, img: p.img[0], q: 1 });
    renderBag(); t.textContent = "Agregado ✓"; setTimeout(grid, 900);
  }
  else if (d.i) { bag[d.i].q++; renderBag(); }
  else if (d.d) { const b = bag[d.d]; b.q--; if (!b.q) bag.splice(d.d, 1); renderBag(); }
});
$("more").onclick = () => { shown += PAGE; grid(); };
$("q").addEventListener("input", e => { q = e.target.value; shown = PAGE; grid(); });
$("bagBtn").onclick = () => { $("panel").hidden = false; $("close").focus(); };
$("close").onclick = () => $("panel").hidden = true;
$("panel").addEventListener("click", e => { if (e.target.id === "panel") $("panel").hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") $("panel").hidden = true; });
$("cname").addEventListener("input", renderBag);
$("cmode").addEventListener("change", renderBag);
chips(); grid(); renderBag();
