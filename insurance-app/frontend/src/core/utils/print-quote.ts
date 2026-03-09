import type { Quote } from '../../domain/entities/quote';
import { formatBreakdownConcept, formatCurrency, formatDate } from './formatters';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function printQuoteAsPdf(quote: Quote): void {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=960,height=720');

  if (!printWindow) {
    throw new Error('No fue posible abrir la vista de impresión. Verifica si el navegador bloqueó la ventana.');
  }

  const breakdownItems = quote.breakdown
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(formatBreakdownConcept(item.concept))}</td>
          <td style="text-align:right;">${escapeHtml(formatCurrency(item.amount))}</td>
        </tr>
      `,
    )
    .join('');

  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Cotizacion ${escapeHtml(quote.id)}</title>
        <style>
          :root {
            color-scheme: light;
            font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
            color: #0f172a;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            background: #f8fafc;
            color: #0f172a;
          }

          .sheet {
            max-width: 820px;
            margin: 0 auto;
            background: white;
            border: 1px solid #dbe4ea;
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 30px 80px -50px rgba(15, 23, 42, 0.35);
          }

          .hero {
            padding: 24px;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(240, 253, 250, 1), rgba(239, 246, 255, 1));
            border: 1px solid #bfe7df;
          }

          .eyebrow {
            margin: 0;
            font-size: 12px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #0f766e;
            font-weight: 700;
          }

          h1 {
            margin: 14px 0 8px;
            font-size: 38px;
            line-height: 1.1;
          }

          .lead {
            margin: 0;
            color: #475569;
            font-size: 15px;
            line-height: 1.7;
          }

          .price {
            margin: 24px 0 0;
            font-size: 42px;
            font-weight: 700;
          }

          .grid {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            margin-top: 24px;
          }

          .panel {
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 18px;
            background: #ffffff;
          }

          .panel-title {
            margin: 0 0 10px;
            font-size: 12px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
          }

          dl {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin: 0;
          }

          dt {
            margin: 0;
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
          }

          dd {
            margin: 8px 0 0;
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 14px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 15px;
          }

          th {
            text-align: left;
            color: #475569;
            font-weight: 700;
          }

          .footer {
            margin-top: 28px;
            font-size: 12px;
            color: #64748b;
          }

          @media print {
            body {
              padding: 0;
              background: white;
            }

            .sheet {
              max-width: none;
              border: none;
              border-radius: 0;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <main class="sheet">
          <section class="hero">
            <p class="eyebrow">Insurance Quoter</p>
            <h1>Cotizacion ${escapeHtml(quote.id)}</h1>
            <p class="lead">Generada el ${escapeHtml(formatDate(quote.createdAt))} con estado ${escapeHtml(quote.status)}.</p>
            <p class="price">${escapeHtml(formatCurrency(quote.estimatedPremium))}</p>
          </section>

          <section class="grid">
            <div class="panel">
              <p class="panel-title">Datos de entrada</p>
              <dl>
                <div>
                  <dt>Tipo de seguro</dt>
                  <dd>${escapeHtml(quote.inputs.insuranceType)}</dd>
                </div>
                <div>
                  <dt>Cobertura</dt>
                  <dd>${escapeHtml(quote.inputs.coverage)}</dd>
                </div>
                <div>
                  <dt>Edad</dt>
                  <dd>${escapeHtml(String(quote.inputs.age))}</dd>
                </div>
                <div>
                  <dt>Ubicacion</dt>
                  <dd>${escapeHtml(quote.inputs.location)}</dd>
                </div>
              </dl>
            </div>

            <div class="panel">
              <p class="panel-title">Resumen</p>
              <dl>
                <div>
                  <dt>ID de cotizacion</dt>
                  <dd>${escapeHtml(quote.id)}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd>${escapeHtml(quote.status)}</dd>
                </div>
                <div>
                  <dt>Prima estimada</dt>
                  <dd>${escapeHtml(formatCurrency(quote.estimatedPremium))}</dd>
                </div>
                <div>
                  <dt>Fecha</dt>
                  <dd>${escapeHtml(formatDate(quote.createdAt))}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section class="panel" style="margin-top: 16px;">
            <p class="panel-title">Desglose</p>
            <table>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th style="text-align:right;">Monto</th>
                </tr>
              </thead>
              <tbody>${breakdownItems}</tbody>
            </table>
          </section>

          <p class="footer">Usa la opcion "Guardar como PDF" del navegador en el dialogo de impresion.</p>
        </main>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  printWindow.addEventListener('load', () => {
    printWindow.print();
  });
}
