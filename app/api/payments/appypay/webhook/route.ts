import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/supabase';
import type { AppyPayWebhookPayload } from '@/types/payment';

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as AppyPayWebhookPayload;
    const paymentData = (payload.payment || payload.data || payload) as Record<string, any>;

    const merchantTxId =
      paymentData.merchantTransactionId || payload.merchantTransactionId;
    const transactionId =
      paymentData.transactionId || payload.transactionId || paymentData.id;

    const rawStatus = String(
      paymentData.status || payload.status || ''
    ).toUpperCase();

    if (!merchantTxId && !transactionId) {
      return NextResponse.json(
        { error: 'Identificador de transação em falta.' },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();

    let query = (adminDb.from('payments') as any).select('*, orders(*)');
    if (merchantTxId) {
      query = query.eq('merchant_transaction_id', merchantTxId);
    } else {
      query = query.eq('transaction_id', transactionId);
    }

    const { data: paymentRecord, error: findError } = await query.maybeSingle();

    if (findError || !paymentRecord) {
      return NextResponse.json(
        { message: 'Registo de pagamento não localizado, ignorado.' },
        { status: 200 }
      );
    }

    if (paymentRecord.status === 'paid') {
      return NextResponse.json(
        { message: 'Pagamento já processado anteriormente.' },
        { status: 200 }
      );
    }

    const isSuccess =
      rawStatus === 'SUCCESS' ||
      rawStatus === 'PAID' ||
      rawStatus === 'CONFIRMED' ||
      rawStatus === 'PAGO';

    const isFailed =
      rawStatus === 'FAILED' ||
      rawStatus === 'CANCELLED' ||
      rawStatus === 'REJECTED' ||
      rawStatus === 'EXPIRED';

    const newPaymentStatus = isSuccess ? 'paid' : isFailed ? 'failed' : 'pending';

    await (adminDb.from('payments') as any)
      .update({
        status: newPaymentStatus,
        raw_response: (payload as Json) || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.id);

    const orderId = paymentRecord.order_id;
    const order = (paymentRecord as any).orders;

    if (orderId && isSuccess) {
      
      await (adminDb.from('orders') as any).update({ status: 'Preparação' }).eq('id', orderId);

      if (order && order.user_id) {
        const pointsEarned = Math.max(10, Math.floor(Number(order.total || 0) / 100));

        const { data: userData } = await (adminDb.from('users') as any)
          .select('points, points_to_next_level')
          .eq('id', order.user_id)
          .maybeSingle();

        if (userData) {
          const userObj = userData as { points?: number; points_to_next_level?: number };
          const newPoints = Number(userObj.points || 0) + pointsEarned;
          const nextLevelPoints = Math.max(
            0,
            Number(userObj.points_to_next_level || 1000) - pointsEarned
          );

          await (adminDb.from('users') as any)
            .update({
              points: newPoints,
              points_to_next_level: nextLevelPoints,
            })
            .eq('id', order.user_id);
        }

        const notificationId =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        await (adminDb.from('notifications') as any).insert({
          id: notificationId,
          user_id: order.user_id,
          title: 'Pagamento Confirmado!',
          message: `O pagamento do teu pedido #${order.order_number || ''} foi confirmado com sucesso. A tua comida já está a ser preparada!`,
          read: false,
          type: 'order',
          order_id: order.id,
          link: '/pedidos',
          action_label: 'Acompanhar Pedido',
          created_at: Date.now(),
        });
      }
    } else if (orderId && isFailed) {
      await (adminDb.from('orders') as any).update({ status: 'Cancelado' }).eq('id', orderId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook da AppyPay:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}
