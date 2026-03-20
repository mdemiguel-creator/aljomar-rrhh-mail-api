
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const FROM_NAME = process.env.PS_MAIL_FROM_NAME || 'ALJOMAR';
const PDF_PATH = path.join(__dirname, '..', 'public', 'recetario-aljomar.pdf');

function getParams(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body.params || req.body;
  }
  if (typeof req.body === 'string') {
    const params = {};
    for (const pair of new URLSearchParams(req.body)) {
      params[pair[0]] = pair[1];
    }
    return params;
  }
  return {};
}

async function sendMail(params) {
  const user = process.env.PS_MAIL_USER;
  const pass = process.env.PS_MAIL_PASSWD;
  if (!user || !pass) {
    throw new Error('Faltan credenciales SMTP (PS_MAIL_USER / PS_MAIL_PASSWD)');
  }

  const nombre = (params.nombre || '').trim();
  const email = (params.email || '').trim();
  if (!email) {
    throw new Error('Email obligatorio');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.PS_MAIL_SERVER || 'smtp.office365.com',
    port: parseInt(process.env.PS_MAIL_SMTP_PORT || '587', 10),
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    tls: { ciphers: 'SSLv3' }
  });

  const subject = 'Tu Recetario Aljomar - Martín Berasategui';
  const text = [
    `Hola ${nombre || 'amigo/a'},`,
    '',
    'Gracias por tu interés. Adjunto encontrarás el Fantástico Recetario del Chef con 11 Estrellas Michelin Martín Berasategui.',
    '',
    '¡Disfruta cocinando!',
    'El equipo de Aljomar'
  ].join('\n');

  const mailOptions = {
    from: `"${FROM_NAME}" <${process.env.PS_MAIL_FROM || user}>`,
    to: email,
    cc: ['marketing@aljomar.es', 'rrhh@aljomar.es'],
    subject,
    text,
    attachments: []
  };

  if (fs.existsSync(PDF_PATH)) {
    mailOptions.attachments.push({
      filename: 'recetario-aljomar.pdf',
      content: fs.readFileSync(PDF_PATH)
    });
  } else {
    throw new Error('No se encuentra el PDF del recetario');
  }

  await transporter.sendMail(mailOptions);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const params = getParams(req);

  try {
    await sendMail(params);
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Recetario mail error:', err.message);
    return res.status(500).json({
      message: err.message || 'Error al enviar el correo'
    });
  }
};
