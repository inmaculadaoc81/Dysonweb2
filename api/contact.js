const nodemailer = require('nodemailer');

let cachedTransporter = null;
function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const port = Number(process.env.SMTP_PORT || 465);
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE ?? (port === 465 ? 'true' : 'false')) === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });
  return cachedTransporter;
}

module.exports = async (req, res) => {
  const ks = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'DysonTech contacto API',
      node: process.version,
      environment: Object.fromEntries(ks.map((k) => [k, !!process.env[k]]))
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  try {
    if (ks.some((k) => !process.env[k])) return res.status(500).json({ ok: false, code: 'MISSING_SMTP_ENV' });

    const d = req.body || {};
    if (!d.name || !d.phone || !d.email || !d.message) return res.status(400).json({ ok: false });

    const body = `Nombre: ${d.name}\nTeléfono: ${d.phone}\nEmail: ${d.email}\nModelo: ${d.device || '-'}\n\nConsulta:\n${d.message}`;

    const transporter = getTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"DysonTech" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: d.email,
      subject: 'Nueva consulta DysonTech',
      text: body
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, code: 'SMTP_SEND_FAILED' });
  }
};
