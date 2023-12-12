import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        if (!params.orderId) {
            return new NextResponse("Order id is required", { status: 400 });
        }

        const order = await prismadb.order.findUnique({
            where: {
                id: params.orderId,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { fulfilled } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!fulfilled) {
            return new NextResponse("fulfilled field is required", {
                status: 400,
            });
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!params.orderId) {
            return new NextResponse("Color Id is required", {
                status: 400,
            });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userID: userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const order = await prismadb.order.updateMany({
            where: {
                id: params.orderId,
            },
            data: {
                fulfilled,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.orderId) {
            return new NextResponse("Order id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userID: userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const order = await prismadb.order.deleteMany({
            where: {
                id: params.orderId,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
