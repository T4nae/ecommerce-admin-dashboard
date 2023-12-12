import { isAfter, isEqual, isBefore } from "date-fns";

import prismadb from "@/lib/prismadb";

export const getTodayTopProducts = async (storeId: string, date: Date) => {
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

        const ordersInRange = paidOrders.filter((order) => {
            const createdAt = order.createdAt;
            return (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            );
        });

        const uniqueData = ordersInRange.reduce(
            (
                acc: Record<string, { count: number; totalPrice: number }>,
                order
            ) => {
                order.orderItems.forEach((orderItem) => {
                    const productName = orderItem.product.name;
                    const productPrice = orderItem.product.price.toNumber();
                    if (!acc[productName]) {
                        acc[productName] = {
                            count: 1,
                            totalPrice: productPrice,
                        };
                    } else {
                        acc[productName].count += 1;
                        acc[productName].totalPrice += productPrice;
                    }
                });
                return acc;
            },
            {}
        );

        const data = Object.entries(uniqueData).map(
            ([product, { count, totalPrice }]) => ({
                product,
                count,
                totalPrice,
            })
        );

        return data.sort((a, b) => b.totalPrice - a.totalPrice).slice(0, 5);
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const getRangeTopProducts = async (storeId: string) => {
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

        const store = await prismadb.store.findUnique({
            where: {
                id: storeId,
            },
        });
        if (!store?.rangeFrom || !store?.rangeTo) return 0;
        const date = {
            from: store.rangeFrom,
            to: store.rangeTo,
        };

        const ordersInRange = paidOrders.filter((order) => {
            const createdAt = order.createdAt;
            return (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            );
        });

        const uniqueData = ordersInRange.reduce(
            (
                acc: Record<string, { count: number; totalPrice: number }>,
                order
            ) => {
                order.orderItems.forEach((orderItem) => {
                    const productName = orderItem.product.name;
                    const productPrice = orderItem.product.price.toNumber();
                    if (!acc[productName]) {
                        acc[productName] = {
                            count: 1,
                            totalPrice: productPrice,
                        };
                    } else {
                        acc[productName].count += 1;
                        acc[productName].totalPrice += productPrice;
                    }
                });
                return acc;
            },
            {}
        );

        const data = Object.entries(uniqueData).map(
            ([product, { count, totalPrice }]) => ({
                product,
                count,
                totalPrice,
            })
        );

        return data.sort((a, b) => b.totalPrice - a.totalPrice).slice(0, 5);
    } catch (e) {
        console.log(e);
        return [];
    }
};
