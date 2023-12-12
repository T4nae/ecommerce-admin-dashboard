import { addDays, isAfter, isBefore, isEqual, sub } from "date-fns";

import prismadb from "@/lib/prismadb";

export const getRangeRevenue = async (storeId: string) => {
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

        let totalRevenue = 0;
        const ordersInRange = paidOrders.filter((order) => {
            const createdAt = order.createdAt;
            if (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            ) {
                totalRevenue += order.orderItems.reduce((sum, item) => {
                    return (sum || 0) + item.product.price.toNumber();
                }, 0);

                return true;
            } else return false;
        });

        return totalRevenue;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getGraphRangeRevenue = async (storeId: string) => {
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
            (acc: Record<string, number>, item) => {
                const key = `${item.createdAt.getDate()}-${item.createdAt.getMonth()}-${item.createdAt
                    .getFullYear()
                    .toString()
                    .slice(2)}`;
                if (!acc[key]) {
                    acc[key] = item.orderItems.reduce((sum, item) => {
                        return (sum || 0) + item.product.price.toNumber();
                    }, 0);
                } else {
                    acc[key] += item.orderItems.reduce((sum, item) => {
                        return (sum || 0) + item.product.price.toNumber();
                    }, 0);
                }
                return acc;
            },
            {}
        );
        const data = Object.entries(uniqueData).map(([name, total]) => ({
            name,
            total,
        }));
        return data.reverse();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getRangeAverageOrder = async (storeId: string) => {
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

        let totalRevenue = 0;
        let orders = 0;
        const ordersInRange = paidOrders.filter((order) => {
            const createdAt = order.createdAt;
            if (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            ) {
                orders++;
                totalRevenue += order.orderItems.reduce((sum, item) => {
                    return (sum || 0) + item.product.price.toNumber();
                }, 0);

                return true;
            } else return false;
        });

        return totalRevenue / orders;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getGraphRangeAverageOrder = async (storeId: string) => {
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

        const orders: { [key: string]: number } = {};
        const uniqueData = ordersInRange.reduce(
            (acc: Record<string, number>, item) => {
                const key = `${item.createdAt.getDate()}-${item.createdAt.getMonth()}-${item.createdAt
                    .getFullYear()
                    .toString()
                    .slice(2)}`;
                if (!acc[key] && !orders[key]) {
                    acc[key] = item.orderItems.reduce((sum, item) => {
                        return (sum || 0) + item.product.price.toNumber();
                    }, 0);
                    orders[key] = 1;
                } else {
                    acc[key] += item.orderItems.reduce((sum, item) => {
                        return (sum || 0) + item.product.price.toNumber();
                    }, 0);
                    orders[key] += 1;
                }
                return acc;
            },
            {}
        );
        const data = Object.entries(uniqueData).map(([name, total]) => ({
            name,
            total: total / orders[name],
        }));
        return data.reverse();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getRangeSalesCount = async (storeId: string) => {
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

        const orders = paidOrders.reduce((sum, order) => {
            const createdAt = order.createdAt;
            if (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            ) {
                return sum + 1;
            } else return sum;
        }, 0);

        return orders;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getGraphRangeSalesCount = async (storeId: string) => {
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
            (acc: Record<string, number>, item) => {
                const key = `${item.createdAt.getDate()}-${item.createdAt.getMonth()}-${item.createdAt
                    .getFullYear()
                    .toString()
                    .slice(2)}`;
                if (!acc[key]) {
                    acc[key] = 1;
                } else {
                    acc[key]++;
                }
                return acc;
            },
            {}
        );
        const data = Object.entries(uniqueData).map(([name, total]) => ({
            name,
            total,
        }));
        return data.reverse();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getRangeSessionCount = async (storeId: string) => {
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
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

        const Session = sessions.reduce(
            (acc: Record<string, [string[], number]>, item) => {
                if (!acc[item.session]) {
                    acc[item.session] = [[], 0];
                } else {
                    acc[item.session][1]++;
                }
                return acc;
            },
            {}
        );

        const count = sessions.reduce((sum, session) => {
            const createdAt = session.createdAt;
            if (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            ) {
                return sum + 1;
            } else return sum;
        }, 0);

        return { count: count, uniqueData: Object.keys(Session).length };
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getGraphRangeSessionCount = async (storeId: string) => {
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
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

        const ordersInSessions = sessions.filter((order) => {
            const createdAt = order.createdAt;
            return (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            );
        });

        const uniqueData = ordersInSessions.reduce(
            (acc: Record<string, number>, item) => {
                const key = `${item.createdAt.getDate()}-${item.createdAt.getMonth()}-${item.createdAt
                    .getFullYear()
                    .toString()
                    .slice(2)}`;
                if (!acc[key]) {
                    acc[key] = 1;
                } else {
                    acc[key]++;
                }
                return acc;
            },
            {}
        );

        const data = Object.entries(uniqueData).map(([name, total]) => ({
            name,
            total,
        }));
        return data.reverse();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getGraphRangeTopReferer = async (
    storeId: string,
    social: boolean
) => {
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
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

        const socials = [
            "facebook",
            "x",
            "instagram",
            "youtube",
            "reddit",
            "tiktok",
            "web.whatsapp",
            "whatsapp",
            "messenger",
            "telegram",
            "quora",
            "discord",
            "twitch",
        ];

        const Sessions = sessions.filter((item) => {
            const createdAt = item.createdAt;
            return (
                (social
                    ? socials.some((social) => item.data.includes(social))
                    : !socials.some((social) => item.data.includes(social))) &&
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            );
        });

        const uniqueData = Sessions.reduce(
            (acc: Record<string, number>, item) => {
                if (!acc[item.data]) {
                    acc[item.data] = 1;
                } else {
                    acc[item.data]++;
                }
                return acc;
            },
            {}
        );

        const data = Object.entries(uniqueData).map(([name, total]) => ({
            name,
            total,
        }));

        return data.sort((a, b) => b.total - a.total).slice(0, 10);
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getGraphReturningCount = async (storeId: string) => {
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
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
        const rangeReturning: { [key: string]: number } = {};
        const returning: { [key: string]: number } = {};
        const Sessions = sessions.filter((session) => {
            const createdAt = session.createdAt;
            if (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            ) {
                if (!rangeReturning[session.session]) {
                    rangeReturning[session.session] = 1;
                } else {
                    rangeReturning[session.session]++;
                }
                return true;
            } else return false;
        });

        const uniqueData = Sessions.reduce(
            (acc: Record<string, number>, session) => {
                const key = `${session.createdAt.getDate()}-${session.createdAt.getMonth()}-${session.createdAt
                    .getFullYear()
                    .toString()
                    .slice(2)}`;
                if (
                    rangeReturning[session.session] > 1 &&
                    !returning[session.session]
                ) {
                    returning[session.session] = 1;
                    if (!acc[key]) {
                        acc[key] = 1;
                    } else {
                        acc[key]++;
                    }
                    return acc;
                } else return acc;
            },
            {}
        );

        const data = Object.entries(uniqueData).map(([name, total]) => ({
            name,
            total,
        }));
        return data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
