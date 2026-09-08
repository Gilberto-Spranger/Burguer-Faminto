import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Inicie sessão para carregar imagem.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum ficheiro fornecido.' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de imagem inválido. Use JPEG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'O ficheiro excede o tamanho máximo de 5MB.' },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminDb.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message || 'Erro ao guardar ficheiro no storage.' },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = adminDb.storage.from('avatars').getPublicUrl(filePath);

    await (adminDb.from('users') as any).update({ avatar: publicUrl }).eq('id', user.id);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erro interno no upload de avatar.' },
      { status: 500 }
    );
  }
}
