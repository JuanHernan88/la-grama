// Catálogo de productos. Edita aquí nombres, precios, tallas y categorías.
// c = categoría, s = detalle, p = precio en COP, i = ícono (shoe|shirt|ball), t = color de fondo, z = tallas
const SHOE = ["36","37","38","39","40","41","42","43","44"];
const TOP = ["S","M","L","XL"];
// Muestra basada en publicaciones del Instagram; precios ilustrativos
const P = [
  {id:1,n:"Zapatilla Joma Top Flex",c:"Calzado",s:"Microfútbol · suela de goma",p:289000,i:"shoe",t:"#1c1c1c",z:SHOE},
  {id:2,n:"Zapatilla Nike Lunar Gato",c:"Calzado",s:"Fútbol sala · rojo",p:349000,i:"shoe",t:"#d6401f",z:SHOE},
  {id:3,n:"Tenis de pádel blanco/naranja",c:"Calzado",s:"Pista · amortiguación EVA",p:259000,i:"shoe",t:"#8a96a3",z:SHOE},
  {id:4,n:"Guayo Pirma grama sintética",c:"Calzado",s:"Taches cortos · TF",p:199000,i:"shoe",t:"#2b8fd6",z:SHOE},
  {id:5,n:"Camiseta Selección Colombia local",c:"Colombia",s:"Amarilla · versión hincha",p:139000,i:"shirt",t:"#e8b90c",z:TOP},
  {id:6,n:"Camiseta Selección Colombia visitante",c:"Colombia",s:"Azul · dorsal 10",p:139000,i:"shirt",t:"#1d3f9a",z:TOP},
  {id:7,n:"Camiseta Deportes Tolima",c:"Tolima",s:"Vinotinto y oro",p:119000,i:"shirt",t:"#7a1a2a",z:TOP},
  {id:8,n:"Camiseta Tolima blanca",c:"Tolima",s:"Alterna · franja vinotinto",p:119000,i:"shirt",t:"#9b7d4a",z:TOP},
  {id:9,n:"Camiseta Real Madrid",c:"Destacada",s:"Blanca · temporada actual",p:149000,i:"shirt",t:"#5b6f8f",z:TOP},
  {id:10,n:"Camiseta Barcelona retro",c:"Retro",s:"Azulgrana · clásica",p:129000,i:"shirt",t:"#7a2048",z:TOP},
  {id:11,n:"Camiseta Real Madrid 2006 retro",c:"Retro",s:"Negra · edición clásica",p:129000,i:"shirt",t:"#2a2a2a",z:TOP},
  {id:12,n:"Jersey Yankees pinstripe",c:"Destacada",s:"Línea casual",p:99000,i:"shirt",t:"#22324f",z:TOP},
  {id:13,n:"Canilleras con tobillera",c:"Accesorios",s:"Talla única juvenil/adulto",p:45000,i:"ball",t:"#d1572b",z:["Única"]},
  {id:14,n:"Balón de microfútbol",c:"Accesorios",s:"Bote bajo · N.º 4",p:89000,i:"ball",t:"#2f7f4b",z:["N.º 4"]},
];
