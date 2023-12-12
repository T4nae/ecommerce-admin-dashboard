import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string; analyticsId: string } }
) {
    try {
        if (!params.analyticsId) {
            return new NextResponse("Analytics id is required", {
                status: 400,
            });
        }

        const analytics = await prismadb.analytics.findUnique({
            where: {
                id: params.analyticsId,
            },
        });

        return NextResponse.json(analytics);
    } catch (error) {
        console.log("[ANALYTICS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
