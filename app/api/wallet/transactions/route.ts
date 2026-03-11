import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const getCachedWalletTransactions = unstable_cache(
  async (authorization: string, page: number, limit: number) => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch wallet transactions");
    }

    return data;
  },
  ["wallet-transactions-cache"],
  { revalidate: 300, tags: ["wallet-transactions"] }
);

export async function GET(req: NextRequest) {
  try {
    const pageParam = Number(req.nextUrl.searchParams.get("page"));
    const limitParam = Number(req.nextUrl.searchParams.get("limit"));
    const page =
      Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(Math.floor(limitParam), 100)
        : 20;
    const authorization = req.headers.get("authorization") || "";
    const data = await getCachedWalletTransactions(authorization, page, limit);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch wallet transactions";
    return NextResponse.json({ message }, { status: 500 });
  }
}
