import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const product = searchParams.get("products") === "true";

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const orders = await prismadb.order.findMany({
            where: {
                storeId: params.storeId,
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product,
                    },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.log("[ORDER_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
