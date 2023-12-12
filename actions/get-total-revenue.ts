import { useDateRange } from "@/hooks/use-date-range";
import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
    try {
        const paidOrders = await prismadb.order.findMany({
            where: {
                storeId,
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const totalRevenue = paidOrders.reduce((total, order) => {
            const orderTotal = order.orderItems.reduce((orderSum, item) => {
                return orderSum + item.product.price.toNumber();
            }, 0);

            return total + orderTotal;
        }, 0);

        return totalRevenue;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getDayRevenue = async (storeId: string, date: Date) => {
    try {
        const paidOrders = await prismadb.order.findMany({
            where: {
                storeId,
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const totalRevenue = paidOrders.reduce((total, order) => {
            const createdAt = order.createdAt;
            const orderTotal = order.orderItems.reduce((orderSum, item) => {
                if (
                    createdAt.getDate() === date.getDate() &&
                    createdAt.getMonth() === date.getMonth() &&
                    createdAt.getFullYear() === date.getFullYear()
                ) {
                    return orderSum + item.product.price.toNumber();
                }
                return orderSum;
            }, 0);

            return total + orderTotal;
        }, 0);

        return totalRevenue;
    } catch (e) {
        console.log(e);
        return 0;
    }
};
