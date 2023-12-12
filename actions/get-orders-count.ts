import prismadb from "@/lib/prismadb";

export const getOrderCount = async (storeId: string, fulfilled: boolean) => {
    const orderCount = await prismadb.order.count({
        where: {
            storeId,
            fulfilled,
        },
    });

    return orderCount;
};
