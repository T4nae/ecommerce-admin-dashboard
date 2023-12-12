import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string, isArchived: boolean) => {
    try {
        const stockCount = await prismadb.product.count({
            where: {
                storeId,
                isArchived,
            },
        });

        return stockCount;
    } catch (e) {
        console.log(e);
        return 0;
    }
};
