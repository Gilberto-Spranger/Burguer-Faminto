import {
  PaymentChargePayload,
  PaymentGatewayResponse,
  AppyPayPaymentMethod,
} from '@/types/payment';

export async function processDigitalPayment(
  payload: PaymentChargePayload
): Promise<PaymentGatewayResponse> {
  const apiKey = process.env.APPYPAY_API_KEY || process.env.APPYPAY_SECRET_KEY;
  const baseUrl = process.env.APPYPAY_API_URL || 'https://api.appypay.co.ao/v1';

  if (!apiKey) {
    throw new Error(
      'Chave de API do AppyPay não configurada no servidor (APPYPAY_API_KEY).'
    );
  }

  const merchantTxId = `BF-${payload.orderId}-${Date.now()}`;

  const requestBody: Record<string, unknown> = {
    merchantTransactionId: merchantTxId,
    amount: payload.amount,
    currency: 'AOA',
    description: payload.description || `Pedido #${payload.orderId} - Burguer Faminto`,
    customer: {
      phone: payload.customerPhone || '',
      email: payload.customerEmail || '',
      name: payload.customerName || 'Cliente Faminto',
    },
    paymentMethod: payload.method,
  };

  // Trata especificidades de cada metodo
  switch (payload.method) {
    case 'MULTICAIXA_EXPRESS':
      if (!payload.customerPhone) {
        throw new Error('O número de telefone Multicaixa Express é obrigatório.');
      }
      requestBody.options = {
        phone: payload.customerPhone.replace(/\s+/g, ''),
      };
      break;

    case 'UNITEL_MONEY':
      if (!payload.customerPhone) {
        throw new Error('O número de telefone associado à conta Unitel Money é obrigatório.');
      }
      requestBody.options = {
        phone: payload.customerPhone.replace(/\s+/g, ''),
      };
      break;

    case 'DEBITO_DIRECTO':
      if (payload.mandateId) {
        requestBody.mandateId = payload.mandateId;
      }
      break;

    case 'REFERENCIA_MULTICAIXA':
      // Sem parametros extras obrigatorios no request
      break;

    default:
      throw new Error(`Método de pagamento não suportado: ${payload.method}`);
  }

  const response = await fetch(`${baseUrl}/payments/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = (await response.json().catch(() => ({}))) as Record<string, any>;

  if (!response.ok) {
    const errorMsg =
      responseData?.message ||
      responseData?.error ||
      `Falha na comunicação com o gateway AppyPay (Status: ${response.status})`;
    throw new Error(errorMsg);
  }

  const primaryPayment = responseData.payments?.[0] || responseData;
  const transactionId =
    primaryPayment.transactionId || primaryPayment.id || merchantTxId;

  // Resposta por Método
  if (payload.method === 'MULTICAIXA_EXPRESS') {
    return {
      success: true,
      transactionId,
      merchantTransactionId: primaryPayment.merchantTransactionId || merchantTxId,
      status: 'Processando',
      message:
        primaryPayment.message ||
        `Notificação enviada para ${payload.customerPhone}. Confirme no aplicativo Multicaixa Express.`,
      method: 'MULTICAIXA_EXPRESS',
      phone: payload.customerPhone,
      rawGatewayResponse: responseData,
    };
  }

  if (payload.method === 'REFERENCIA_MULTICAIXA') {
    const refData = primaryPayment.reference || responseData.reference;

    if (!refData || (!refData.entity && !refData.entidade)) {
      throw new Error('A AppyPay não retornou uma Referência Multicaixa válida.');
    }

    return {
      success: true,
      transactionId,
      merchantTransactionId: primaryPayment.merchantTransactionId || merchantTxId,
      status: 'Pendente',
      message: 'Referência Multicaixa gerada com sucesso.',
      method: 'REFERENCIA_MULTICAIXA',
      reference: {
        entity: refData.entity || refData.entidade,
        reference: refData.reference || refData.referencia,
        amount: Number(payload.amount),
        expiryDate: refData.expires_at || refData.data_expiracao || refData.expiryDate || 'Validade conforme emissão',
      },
      rawGatewayResponse: responseData,
    };
  }

  if (payload.method === 'UNITEL_MONEY') {
    return {
      success: true,
      transactionId,
      merchantTransactionId: primaryPayment.merchantTransactionId || merchantTxId,
      status: 'Processando',
      message:
        primaryPayment.message ||
        `Pedido de pagamento enviado para o Unitel Money (${payload.customerPhone}). Por favor autorize no seu telefone.`,
      method: 'UNITEL_MONEY',
      phone: payload.customerPhone,
      rawGatewayResponse: responseData,
    };
  }

  if (payload.method === 'DEBITO_DIRECTO') {
    return {
      success: true,
      transactionId,
      merchantTransactionId: primaryPayment.merchantTransactionId || merchantTxId,
      status: 'Processando',
      message: primaryPayment.message || 'Solicitação de Débito Directo submetida para processamento.',
      method: 'DEBITO_DIRECTO',
      rawGatewayResponse: responseData,
    };
  }

  return {
    success: true,
    transactionId,
    merchantTransactionId: primaryPayment.merchantTransactionId || merchantTxId,
    status: 'Processando',
    message: primaryPayment.message || 'Pagamento registado com sucesso.',
    method: payload.method,
    rawGatewayResponse: responseData,
  };
}
