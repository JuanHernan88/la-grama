const PHONE = "573103188185";
const ICON = {
  shoe:'<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M4 30V14l10-2 6 6 10 2 16 4c8 2 12 5 12 8v4H6Z" fill="currentColor" fill-opacity=".18"/><path d="M4 30h56M18 36v-2M30 36v-2M42 36v-2M54 36v-2"/></svg>',
  shirt:'<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M22 4 6 12l6 14 6-3v29h28V23l6 3 6-14L42 4c-2 5-6 7-10 7s-8-2-10-7Z" fill="currentColor" fill-opacity=".18"/></svg>',
  ball:'<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="3"><circle cx="28" cy="28" r="24" fill="currentColor" fill-opacity=".18"/><path d="m28 17 10 7-4 12H22l-4-12Z"/><path d="M28 4v13M48 18l-10 6M42 48l-8-12M14 48l8-12M8 18l10 6"/></svg>'
};
const CATS = ["Todo","Calzado","Colombia","Tolima","Destacada","Retro","Accesorios"];
const fmt = v => "$" + v.toLocaleString("es-CO");
let cat = "Todo", q = "", pick = {}, bag = [];
try { bag = JSON.parse(localStorage.getItem("lagrama-bag")) || []; } catch(e) {}
const save = () => { try { localStorage.setItem("lagrama-bag", JSON.stringify(bag)); } catch(e) {} };
const $ = id => document.getElementById(id);

function chips(){
  $("chips").innerHTML = CATS.map(c => `<button class="chip" type="button" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join("");
}
function grid(){
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  const list = P.filter(p => (cat==="Todo"||p.c===cat) && norm(p.n+" "+p.s+" "+p.c).includes(norm(q)));
  $("count").textContent = list.length + (list.length===1?" producto":" productos");
  $("grid").innerHTML = list.length ? list.map(p => `
    <article class="card">
      <div class="pic" style="--tint:${p.t}">${ICON[p.i]}<span class="tag">${p.c}</span></div>
      <div class="body">
        <h3 class="name">${p.n}</h3>
        <p class="meta">${p.s}</p>
        <div class="price">${fmt(p.p)}</div>
        <div class="sizes" role="group" aria-label="Talla">${p.z.map(z=>`<button class="size" type="button" data-p="${p.id}" data-z="${z}" aria-pressed="${pick[p.id]===z}">${z}</button>`).join("")}</div>
        <button class="add" type="button" data-add="${p.id}" ${pick[p.id]||p.z.length===1?"":"disabled"}>${pick[p.id]||p.z.length===1?"Agregar al pedido":"Escoge talla"}</button>
      </div>
    </article>`).join("") : `<p class="empty">No hay productos con esa búsqueda.</p>`;
}
function renderBag(){
  const n = bag.reduce((a,b)=>a+b.q,0), tot = bag.reduce((a,b)=>a+b.q*b.p,0);
  $("bagN").textContent = n;
  $("total").textContent = fmt(tot);
  $("items").innerHTML = bag.length ? bag.map((b,k)=>`
    <div class="item"><div class="t">${b.n}<div class="s">Talla ${b.z} · ${fmt(b.p)}</div></div>
    <div class="qty"><button type="button" data-d="${k}" aria-label="Quitar uno">−</button>${b.q}<button type="button" data-i="${k}" aria-label="Agregar uno">+</button></div></div>`).join("")
    : `<p class="empty">Todavía no has agregado nada.</p>`;
  const name = $("cname").value.trim(), mode = $("cmode").value.trim();
  const msg = "Hola La Grama, quiero hacer este pedido:\n" + bag.map(b=>`• ${b.q} x ${b.n} (talla ${b.z}) – ${fmt(b.p*b.q)}`).join("\n")
    + `\nTotal: ${fmt(tot)}` + (name?`\nNombre: ${name}`:"") + (mode?`\nEntrega: ${mode}`:"");
  $("wa").href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
  $("wa").setAttribute("aria-disabled", bag.length ? "false" : "true");
  save();
}
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if(!t) return;
  if(t.dataset.c){ cat = t.dataset.c; chips(); grid(); }
  else if(t.dataset.z){ pick[t.dataset.p] = t.dataset.z; grid(); }
  else if(t.dataset.add){
    const p = P.find(x=>x.id==t.dataset.add), z = pick[p.id] || p.z[0];
    const ex = bag.find(b=>b.id===p.id && b.z===z);
    ex ? ex.q++ : bag.push({id:p.id,n:p.n,p:p.p,z,q:1});
    renderBag(); t.textContent = "Agregado ✓"; setTimeout(grid, 900);
  }
  else if(t.dataset.i){ bag[t.dataset.i].q++; renderBag(); }
  else if(t.dataset.d){ const b = bag[t.dataset.d]; b.q--; if(!b.q) bag.splice(t.dataset.d,1); renderBag(); }
});
$("q").addEventListener("input", e => { q = e.target.value; grid(); });
$("bagBtn").onclick = () => { $("panel").hidden = false; $("close").focus(); };
$("close").onclick = () => $("panel").hidden = true;
$("panel").addEventListener("click", e => { if(e.target.id==="panel") $("panel").hidden = true; });
document.addEventListener("keydown", e => { if(e.key==="Escape") $("panel").hidden = true; });
["cname","cmode"].forEach(id => $(id).addEventListener("input", renderBag));
chips(); grid(); renderBag();
