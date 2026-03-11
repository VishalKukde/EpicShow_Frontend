import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidateTag("wallet-transactions",'');
  return NextResponse.json({ ok: true });
}
