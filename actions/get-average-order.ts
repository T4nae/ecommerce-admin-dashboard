import prismadb from "@/lib/prismadb";

export const getAverageOrder = async (storeId: string) => {
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

        const averageOrderValue =
            paidOrders.reduce((total, order) => {
                const orderTotal = order.orderItems.reduce((orderSum, item) => {
                    return orderSum + item.product.price.toNumber();
                }, 0);

                return total + orderTotal;
            }, 0) / paidOrders.length;

        return averageOrderValue ? averageOrderValue : 0;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getDayAverageOrder = async (storeId: string, date: Date) => {
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

        let orders = 0;
        const averageOrderValue =
            paidOrders.reduce((total, order) => {
                const createdAt = order.createdAt;
                if (
                    createdAt.getDate() === date.getDate() &&
                    createdAt.getMonth() === date.getMonth() &&
                    createdAt.getFullYear() === date.getFullYear()
                ) {
                    const orderTotal = order.orderItems.reduce(
                        (orderSum, item) => {
                            return orderSum + item.product.price.toNumber();
                        },
                        0
                    );
                    orders++;
                    return total + orderTotal;
                }

                return total;
            }, 0) / orders;

        return averageOrderValue ? averageOrderValue : 0;
    } catch (e) {
        console.log(e);
        return 0;
    }
};
