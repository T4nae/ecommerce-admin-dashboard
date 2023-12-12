import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();

        const { session, event, data } = body;

        if (!session) {
            return new NextResponse("Session is required", { status: 400 });
        }
        if (!event) {
            return new NextResponse("Event is required", { status: 400 });
        }

        if (!data) {
            return new NextResponse("Data is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const analytics = await prismadb.analytics.create({
            data: {
                session,
                event,
                data,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(analytics, {
            headers: corsHeaders,
        });
    } catch (error) {
        console.log("[ANALYTICS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { searchParams } = new URL(req.url);
    const session = searchParams.get("session") || undefined;
    const eventType = searchParams.get("event") || undefined;

    try {
        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const analytics = await prismadb.analytics.findMany({
            where: {
                storeId: params.storeId,
                session,
                event: eventType,
            },
        });

        return NextResponse.json(analytics, {
            headers: corsHeaders,
        });
    } catch (error) {
        console.log("[ANALYTICS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const analytics = await prismadb.analytics.deleteMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(analytics, {
            headers: corsHeaders,
        });
    } catch (error) {
        console.log("[DELETE_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
