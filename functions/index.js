const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { MercadoPagoConfig, Payment } = require('mercadopago');

admin.initializeApp();

exports.criarPagamentoPix = functions.https.onCall(async (data, context) => {
  const { valor, descricao, email } = data;

  if (!valor || !email) {
    throw new functions.https.HttpsError('invalid-argument', 'Valor e email são obrigatórios');
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || functions.config()?.mercadopago?.access_token;

  const client = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);

  const body = {
    transaction_amount: parseFloat(valor),
    description: descricao || 'Doação via PIX - Projeto Mari',
    payment_method_id: 'pix',
    payer: { email },
  };

  try {
    const result = await payment.create({ body });
    return {
      paymentId: result.id,
      qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
      qrCode: result.point_of_interaction.transaction_data.qr_code,
      status: result.status,
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao criar pagamento PIX');
  }
});
