const crypto = require('crypto');

// ---------------------------------------------------------------
// CORRE UNA SOLA VEZ POR ENTORNO DE EJECUCION.
// Si estuviera dentro del handler, el contador volveria a
// cero en cada invocacion y no se veria nada.
// ---------------------------------------------------------------
const ID_ENTORNO = crypto.randomUUID().substring(0, 8);
const ARRANQUE = new Date();
let invocaciones = 0;

const REGION = process.env.REGION_NAME || 'desconocida';
const NOMBRE_APP = process.env.WEBSITE_SITE_NAME || '?';

module.exports = async function (context, req) {
    invocaciones++;

    const esArranqueFrio = invocaciones === 1;
    const edad = Math.floor((new Date() - ARRANQUE) / 1000);

    let estado, detalle, acento;

    if (esArranqueFrio) {
        estado = "Arranque en frio";
        detalle = "Azure tuvo que crear un entorno nuevo para atender este pedido.";
        acento = "var(--frio)";
    } else {
        estado = "Entorno reutilizado";
        detalle = `Este mismo entorno ya atendio ${invocaciones - 1} pedido(s) antes.`;
        acento = "var(--calor)";
    }

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AgroData sin servidor</title>
<style>
  :root {
    --surco: #1b3a2f;
    --hoja:  #7a9e3f;
    --papel: #eef0e8;
    --tenue: #8fa39a;
    --frio:  #5dcaa5;
    --calor: #e8c547;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; padding: 48px 24px;
    font-family: var(--sans); color: var(--papel);
    background-color: var(--surco);
    background-image: repeating-linear-gradient(90deg,
      rgba(122,158,63,.10) 0 1px, transparent 1px 34px);
    display: flex; align-items: center; justify-content: center;
  }
  main { width: 100%; max-width: 560px; }
  .etiqueta {
    font-family: var(--mono); font-size: 12px; letter-spacing: .18em;
    text-transform: uppercase; color: ${acento}; margin: 0 0 18px;
  }
  h1 {
    font-family: var(--mono); font-size: clamp(30px, 7vw, 46px);
    font-weight: 600; letter-spacing: -.02em; line-height: 1.05;
    margin: 0 0 16px;
  }
  p.detalle {
    font-size: 17px; line-height: 1.6; color: var(--tenue);
    max-width: 46ch; margin: 0 0 34px;
  }
  dl.datos {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1px; background: rgba(143,163,154,.25);
    border: 1px solid rgba(143,163,154,.25); margin: 0 0 28px;
  }
  .dato { background: var(--surco); padding: 16px 18px; }
  .dato dt {
    font-family: var(--mono); font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--tenue); margin-bottom: 8px;
  }
  .dato dd {
    font-family: var(--mono); font-size: 26px; font-weight: 600;
    color: ${acento}; margin: 0;
  }
  .dato dd small { font-size: 13px; font-weight: 400; color: var(--tenue); }
  footer {
    padding-top: 18px; border-top: 1px solid rgba(143,163,154,.25);
    font-family: var(--mono); font-size: 12px; line-height: 1.7;
    color: var(--tenue);
  }
</style>
</head>
<body>
<main>
  <p class="etiqueta">AgroData &middot; computo sin servidor</p>
  <h1>${estado}</h1>
  <p class="detalle">${detalle} Recarga la pagina y observa que cambia.</p>

  <dl class="datos">
    <div class="dato"><dt>Entorno</dt><dd>${ID_ENTORNO}</dd></div>
    <div class="dato"><dt>Invocaciones</dt><dd>${invocaciones}</dd></div>
    <div class="dato"><dt>Edad</dt><dd>${edad}<small>s</small></dd></div>
    <div class="dato"><dt>App</dt><dd>${NOMBRE_APP}</dd></div>
  </dl>

  <footer>
    Region: ${REGION}<br>
    Desplegado desde GitHub<br>
    Ninguna Virtual Machine fue lanzada para servir esta pagina.
  </footer>
</main>
</body>
</html>`;

    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store'
        },
        body: html
    };
};
