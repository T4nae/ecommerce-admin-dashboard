import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
    try {
        const salesCount = await prismadb.order.count({
            where: {
                storeId,
                isPaid: true,
            },
        });

        return salesCount;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getDaySalesCount = async (storeId: string, date: Date) => {
    try {
        const sales = await prismadb.order.findMany({
            where: {
                storeId,
                isPaid: true,
            },
        });

        const totalSales = sales.reduce((total, order) => {
            const createdAt = order.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                return total + 1;
            }
            return total;
        }, 0);

        return totalSales;
    } catch (err) {
        console.log(err);
        return 0;
    }
};
