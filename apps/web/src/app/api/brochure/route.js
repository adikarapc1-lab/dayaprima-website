function pdf(lines) {
  const content = [
    "BT",
    "/F1 24 Tf",
    "72 742 Td",
    "(Dayaprima Nusawisesa) Tj",
    "/F1 12 Tf",
    ...lines.flatMap((line, index) => [
      index === 0 ? "0 -40 Td" : "0 -20 Td",
      `(${line.replace(/[()]/g, "")}) Tj`
    ]),
    "ET"
  ].join("\n");

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(body.length);
    body += `${object}\n`;
  }
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return body;
}

export function GET() {
  const body = pdf([
    "Developer perumahan modern di Makassar.",
    "Proyek: Nusa Harapan Permai - BTP, Makassar.",
    "Proyek: Nusa Idaman Residence - Jl. Poros Tamalanrea Biringkanaya.",
    "WhatsApp: 0853-4190-9329",
    "Email: informasi@dayaprima.id",
    "Alamat: Ruko BTP, Jalan Pujasera Blok M No.3-4, Tamalanrea, Makassar."
  ]);

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"brosur-dayaprima-nusawisesa.pdf\""
    }
  });
}
