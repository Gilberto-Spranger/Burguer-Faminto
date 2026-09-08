import { NextRequest, NextResponse } from 'next/server';
import { processDigitalPayment } from '@/lib/payment/appypay';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database, Json } from '@/types/supabase';
import type { PaymentChargePayload } from '@/types/payment';

type Order = Database['public']['Tables']['orders']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type OrderPaymentInsert = Database['public']['Tables']['order_payments']['Insert'];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Inicie sessão para processar o pagamento.' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as PaymentChargePayload;

    if (!body.orderId || !body.method) {
      return NextResponse.json(
        { error: 'ID do pedido e método de pagamento são obrigatórios.' },
        { status: 400 }
      );
    }

    if (
      (body.method === 'MULTICAIXA_EXPRESS' || body.method === 'UNITEL_MONEY') &&
      !body.customerPhone
    ) {
      return NextResponse.json(
        { error: `O número de telefone é obrigatório para o método ${body.method}.` },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();

    const { data, error: orderError } = await adminDb
      .from('orders')
      .select('*')
      .eq('id', body.orderId)
      .maybeSingle();

    const order = data as Order | null;

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado no sistema.' },
        { status: 404 }
      );
    }

    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Acesso não autorizado a este pedido.' },
        { status: 403 }
      );
    }

    const orderTotal = Number(order.total);

    const gatewayResult = await processDigitalPayment({
      ...body,
      amount: orderTotal,
      customerEmail: user.email ?? undefined,
    });

    const paymentId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const paymentInsert: PaymentInsert = {
      id: paymentId,
      order_id: order.id,
      provider: 'AppyPay',
      payment_method: body.method,
      transaction_id: gatewayResult.transactionId,
      merchant_transaction_id: gatewayResult.merchantTransactionId,
      amount: order.total,
      currency: 'AOA',
      status: gatewayResult.status === 'Pago' ? 'paid' : 'pending',
      raw_response: (gatewayResult.rawGatewayResponse as Json) || null,
    };

    // CORREÇÃO CRÍTICA DO ERRO DE BUILD: Passar o objeto dentro de um array ou garantir tipagem do Supabase Client
    const { error: insertError } = await (adminDb.from('payments') as any).insert(paymentInsert);

    if (insertError) {
      console.error('Erro ao salvar registro de pagamento:', insertError);
    }
    
    await (adminDb.from('orders') as any).update({ status: gatewayResult.status === 'Pago' ? 'Preparação' : 'Processando' }).eq('id', order.id);

    if (gatewayResult.reference) {
      const orderPaymentInsert: OrderPaymentInsert = {
        id: paymentId,
        order_id: order.id,
        payment_method: body.method,
        entity: gatewayResult.reference.entity,
        reference: gatewayResult.reference.reference,
        expiry_date: gatewayResult.reference.expiryDate,
        phone: body.customerPhone || null,
      };

      await (adminDb.from('order_payments') as any).upsert(orderPaymentInsert);
    }

    return NextResponse.json(gatewayResult);
  } catch (error: any) {
    console.error('Erro no processamento de pagamento:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Erro ao processar o pagamento com a gateway de pagamentos.',
      },
      { status: 500 }
    );
  }
}
