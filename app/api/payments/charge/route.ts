import { NextRequest, NextResponse } from 'next/server';
import { POST as appyPayHandler } from '../appypay/route';

export async function POST(req: NextRequest) {
  return appyPayHandler(req);
}
