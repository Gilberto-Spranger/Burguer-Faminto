import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/supabase';

type Coupon = Database['public']['Tables']['coupons']['Row'];

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Código do cupão não fornecido.' },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();

    const { data, error } = await adminDb
      .from('coupons')
      .select('*')
      .ilike('code', code.trim())
      .maybeSingle();

    const coupon = data as Coupon | null;

    if (error || !coupon) {
      return NextResponse.json(
        { error: 'Cupão inválido ou não encontrado.' },
        { status: 404 }
      );
    }

    const minOrder = Number(coupon.min_order_value || 0);
    const currentTotal = Number(orderTotal || 0);

    if (minOrder > 0 && currentTotal < minOrder) {
      return NextResponse.json(
        {
          error: `Este cupão exige um valor mínimo de ${minOrder.toLocaleString('pt-AO')} Kz.`,
        },
        { status: 400 }
      );
    }

    const discountValue = Number(coupon.discount_value || 0);
    let calculatedDiscount = 0;

    if (coupon.discount_type === 'percent') {
      calculatedDiscount = Math.round(
        (currentTotal * discountValue) / 100
      );
    } else {
      calculatedDiscount = discountValue;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        description: coupon.description,
        calculatedDiscount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erro ao validar cupão.' },
      { status: 500 }
    );
  }
}
