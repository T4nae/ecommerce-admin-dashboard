import prismadb from "@/lib/prismadb";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string) => {
    const graphData: GraphData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
    ];
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

        const monthlyRevenue: { [key: number]: number } = {};

        for (const order of paidOrders) {
            const month = order.createdAt.getMonth();
            let revenueForOrder = 0;

            for (const item of order.orderItems) {
                revenueForOrder += item.product.price.toNumber();
            }
            monthlyRevenue[month] =
                (monthlyRevenue[month] || 0) + revenueForOrder;
        }

        for (const month in monthlyRevenue) {
            graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
        }
    } catch (e) {
        console.log(e);
    }

    return graphData;
};

export const getGraphTodayRevenue = async (storeId: string) => {
    const graphData: GraphData[] = [
        { name: "12 AM", total: 0 },
        { name: "1 AM", total: 0 },
        { name: "2 AM", total: 0 },
        { name: "3 AM", total: 0 },
        { name: "4 AM", total: 0 },
        { name: "5 AM", total: 0 },
        { name: "6 AM", total: 0 },
        { name: "7 AM", total: 0 },
        { name: "8 AM", total: 0 },
        { name: "9 AM", total: 0 },
        { name: "10 AM", total: 0 },
        { name: "11 AM", total: 0 },
        { name: "12 PM", total: 0 },
        { name: "1 PM", total: 0 },
        { name: "2 PM", total: 0 },
        { name: "3 PM", total: 0 },
        { name: "4 PM", total: 0 },
        { name: "5 PM", total: 0 },
        { name: "6 PM", total: 0 },
        { name: "7 PM", total: 0 },
        { name: "8 PM", total: 0 },
        { name: "9 PM", total: 0 },
        { name: "10 PM", total: 0 },
        { name: "11 PM", total: 0 },
    ];
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

        const todayRevenue: { [key: number]: number } = {};

        const date = new Date();
        for (const order of paidOrders) {
            const createdAt = order.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                const hour = createdAt.getHours();
                let revenueForOrder = 0;

                for (const item of order.orderItems) {
                    revenueForOrder += item.product.price.toNumber();
                }
                todayRevenue[hour] =
                    (todayRevenue[hour] || 0) + revenueForOrder;
            }
        }

        for (const hour in todayRevenue) {
            graphData[parseInt(hour)].total = todayRevenue[parseInt(hour)];
        }
    } catch (e) {
        console.log(e);
    }

    return graphData;
};

export const getGraphTodaySales = async (storeId: string) => {
    const graphData: GraphData[] = [
        { name: "12 AM", total: 0 },
        { name: "1 AM", total: 0 },
        { name: "2 AM", total: 0 },
        { name: "3 AM", total: 0 },
        { name: "4 AM", total: 0 },
        { name: "5 AM", total: 0 },
        { name: "6 AM", total: 0 },
        { name: "7 AM", total: 0 },
        { name: "8 AM", total: 0 },
        { name: "9 AM", total: 0 },
        { name: "10 AM", total: 0 },
        { name: "11 AM", total: 0 },
        { name: "12 PM", total: 0 },
        { name: "1 PM", total: 0 },
        { name: "2 PM", total: 0 },
        { name: "3 PM", total: 0 },
        { name: "4 PM", total: 0 },
        { name: "5 PM", total: 0 },
        { name: "6 PM", total: 0 },
        { name: "7 PM", total: 0 },
        { name: "8 PM", total: 0 },
        { name: "9 PM", total: 0 },
        { name: "10 PM", total: 0 },
        { name: "11 PM", total: 0 },
    ];
    try {
        const paidOrders = await prismadb.order.findMany({
            where: {
                storeId,
                isPaid: true,
            },
        });

        const todayRevenue: { [key: number]: number } = {};

        const date = new Date();
        for (const order of paidOrders) {
            const createdAt = order.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                const hour = createdAt.getHours();
                todayRevenue[hour] = (todayRevenue[hour] || 0) + 1;
            }
        }

        for (const hour in todayRevenue) {
            graphData[parseInt(hour)].total = todayRevenue[parseInt(hour)];
        }
    } catch (e) {
        console.log(e);
    }

    return graphData;
};

export const getGraphTodayAverageOrder = async (storeId: string) => {
    const graphData: GraphData[] = [
        { name: "12 AM", total: 0 },
        { name: "1 AM", total: 0 },
        { name: "2 AM", total: 0 },
        { name: "3 AM", total: 0 },
        { name: "4 AM", total: 0 },
        { name: "5 AM", total: 0 },
        { name: "6 AM", total: 0 },
        { name: "7 AM", total: 0 },
        { name: "8 AM", total: 0 },
        { name: "9 AM", total: 0 },
        { name: "10 AM", total: 0 },
        { name: "11 AM", total: 0 },
        { name: "12 PM", total: 0 },
        { name: "1 PM", total: 0 },
        { name: "2 PM", total: 0 },
        { name: "3 PM", total: 0 },
        { name: "4 PM", total: 0 },
        { name: "5 PM", total: 0 },
        { name: "6 PM", total: 0 },
        { name: "7 PM", total: 0 },
        { name: "8 PM", total: 0 },
        { name: "9 PM", total: 0 },
        { name: "10 PM", total: 0 },
        { name: "11 PM", total: 0 },
    ];
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

        const todayRevenue: { [key: number]: number } = {};
        const todayOrder: { [key: number]: number } = {};

        const date = new Date();
        for (const order of paidOrders) {
            const createdAt = order.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                const hour = createdAt.getHours();
                let revenueForOrder = 0;

                for (const item of order.orderItems) {
                    revenueForOrder += item.product.price.toNumber();
                }

                todayRevenue[hour] =
                    (todayRevenue[hour] || 0) + revenueForOrder;
                todayOrder[hour] = (todayOrder[hour] || 0) + 1;
            }
        }

        for (const hour in todayRevenue) {
            graphData[parseInt(hour)].total =
                todayRevenue[parseInt(hour)] / todayOrder[parseInt(hour)];
        }
    } catch (e) {
        console.log(e);
    }

    return graphData;
};

export const getGraphTodaySession = async (storeId: string) => {
    const graphData: GraphData[] = [
        { name: "12 AM", total: 0 },
        { name: "1 AM", total: 0 },
        { name: "2 AM", total: 0 },
        { name: "3 AM", total: 0 },
        { name: "4 AM", total: 0 },
        { name: "5 AM", total: 0 },
        { name: "6 AM", total: 0 },
        { name: "7 AM", total: 0 },
        { name: "8 AM", total: 0 },
        { name: "9 AM", total: 0 },
        { name: "10 AM", total: 0 },
        { name: "11 AM", total: 0 },
        { name: "12 PM", total: 0 },
        { name: "1 PM", total: 0 },
        { name: "2 PM", total: 0 },
        { name: "3 PM", total: 0 },
        { name: "4 PM", total: 0 },
        { name: "5 PM", total: 0 },
        { name: "6 PM", total: 0 },
        { name: "7 PM", total: 0 },
        { name: "8 PM", total: 0 },
        { name: "9 PM", total: 0 },
        { name: "10 PM", total: 0 },
        { name: "11 PM", total: 0 },
    ];
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
            },
        });

        const todaySessions: { [key: number]: number } = {};

        const date = new Date();
        for (const session of sessions) {
            const createdAt = session.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                const hour = createdAt.getHours();

                todaySessions[hour] = (todaySessions[hour] || 0) + 1;
            }
        }

        for (const hour in todaySessions) {
            graphData[parseInt(hour)].total = todaySessions[parseInt(hour)];
        }
    } catch (e) {
        console.log(e);
    }

    return graphData;
};

export const getGraphTodayTopReferer = async (
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

        const date = new Date();
        const todaySessions = sessions.filter((item) => {
            const createdAt = item.createdAt;
            return (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear() &&
                (social
                    ? socials.some((social) => item.data.includes(social))
                    : !socials.some((social) => item.data.includes(social)))
            );
        });

        const uniqueData = todaySessions.reduce(
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
        console.log(e);
    }
    return [];
};

export const getGraphReturningCount = async (storeId: string) => {
    const graphData: GraphData[] = [
        { name: "12 AM", total: 0 },
        { name: "1 AM", total: 0 },
        { name: "2 AM", total: 0 },
        { name: "3 AM", total: 0 },
        { name: "4 AM", total: 0 },
        { name: "5 AM", total: 0 },
        { name: "6 AM", total: 0 },
        { name: "7 AM", total: 0 },
        { name: "8 AM", total: 0 },
        { name: "9 AM", total: 0 },
        { name: "10 AM", total: 0 },
        { name: "11 AM", total: 0 },
        { name: "12 PM", total: 0 },
        { name: "1 PM", total: 0 },
        { name: "2 PM", total: 0 },
        { name: "3 PM", total: 0 },
        { name: "4 PM", total: 0 },
        { name: "5 PM", total: 0 },
        { name: "6 PM", total: 0 },
        { name: "7 PM", total: 0 },
        { name: "8 PM", total: 0 },
        { name: "9 PM", total: 0 },
        { name: "10 PM", total: 0 },
        { name: "11 PM", total: 0 },
    ];
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
            },
        });

        const todayReturning: { [key: string]: number } = {};
        const returning: { [key: string]: number } = {};

        const date = new Date();
        const Session = sessions.reduce((acc: Record<string, number>, item) => {
            if (!acc[item.session]) {
                acc[item.session] = 1;
            } else {
                acc[item.session]++;
            }
            return acc;
        }, {});

        for (const session of sessions) {
            const createdAt = session.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear() &&
                Session[session.session] > 1 &&
                !returning[session.session]
            ) {
                const hour = createdAt.getHours();
                todayReturning[hour] = (todayReturning[hour] || 0) + 1;
                returning[session.session] = 1;
            }
        }

        for (const hour in todayReturning) {
            graphData[parseInt(hour)].total = todayReturning[parseInt(hour)];
        }
    } catch (e) {
        console.log(e);
    }

    return graphData;
};
