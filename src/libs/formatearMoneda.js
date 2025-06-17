export function formatearNumeroColombiano (numero) {
  const partes = numero.toString().split('.');
  const enteroConPuntos = partes[0]
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimales = partes[1] ? ',' + partes[1] : '';
  return `$ ${enteroConPuntos}${decimales}`;
}


