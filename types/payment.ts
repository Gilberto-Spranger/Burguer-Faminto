import { Database } from '@/types/supabase';

export type AppyPayPaymentMethod =
  | 'MULTICAIXA_EXPRESS'
  | 'REFERENCIA_MULTICAIXA'
  | 'UNITEL_MONEY'
  | 'DEBITO_DIRECTO';

export type InternalPaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';

export interface PaymentChargePayload {
  orderId: string;
  amount?: number; // Ignorado na cobranca real; o valor e extraido do banco
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
  method: AppyPayPaymentMethod;
  description?: string;
  // Campos especificos para Debito Directo (ADC) se exigido pelo fluxo de mandato
  mandateId?: string;
}

export interface PaymentGatewayReference {
  entity: string;
  reference: string;
  amount: number;
  expiryDate: string;
}

export interface PaymentGatewayResponse {
  success: boolean;
  transactionId: string;
  merchantTransactionId: string;
  status: 'Pendente' | 'Processando' | 'Pago' | 'Falhado' | 'Cancelado';
  message: string;
  method: AppyPayPaymentMethod;
  reference?: PaymentGatewayReference;
  phone?: string;
  rawGatewayResponse?: Record<string, unknown>;
}

export interface AppyPayWebhookPayload {
  event?: string;
  transactionId?: string;
  merchantTransactionId?: string;
  id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  payment?: {
    id?: string;
    transactionId?: string;
    merchantTransactionId?: string;
    status?: string;
    amount?: number;
  };
  data?: Record<string, unknown>;
}
