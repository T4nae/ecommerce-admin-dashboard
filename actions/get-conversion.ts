import prismadb from "@/lib/prismadb";
import { isAfter, isEqual, isBefore } from "date-fns";

export const getTodayConversions = async (storeId: string, date: Date) => {
    const data: { [key: string]: number } = {
        AddedToCart: 0,
        ReachedCheckout: 0,
        Converted: 0,
        TotalCart: 0,
        TotalCheckout: 0,
        TotalConverted: 0,
    };
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
            },
        });

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

        sessions.forEach((session) => {
            const createdAt = session.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                if (!Session[session.session]) return;

                if (
                    session.event === "AddedToCart" &&
                    !Session[session.session][0].includes("AddedToCart")
                ) {
                    data["TotalCart"] += 1;
                    Session[session.session][0].push("AddedToCart");
                } else if (
                    session.event === "ReachedCheckout" &&
                    !Session[session.session][0].includes("ReachedCheckout")
                ) {
                    data["TotalCheckout"] += 1;
                    Session[session.session][0].push("ReachedCheckout");
                } else if (
                    session.event === "Converted" &&
                    !Session[session.session][0].includes("Converted")
                ) {
                    data["TotalConverted"] += 1;
                    Session[session.session][0].push("Converted");
                }
            }
        });

        const total = Object.keys(Session).length;
        data["AddedToCart"] = (data["TotalCart"] / total) * 100 || 0;
        data["ReachedCheckout"] =
            (data["TotalCheckout"] / data["TotalCart"]) * 100 || 0;
        data["Converted"] = (data["TotalConverted"] / total) * 100 || 0;
    } catch (e) {
        console.log(e);
    }
    return data;
};

export const getRangeConversions = async (storeId: string) => {
    const data: { [key: string]: number } = {
        AddedToCart: 0,
        ReachedCheckout: 0,
        Converted: 0,
        TotalCart: 0,
        TotalCheckout: 0,
        TotalConverted: 0,
    };
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
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

        sessions.forEach((session) => {
            const createdAt = session.createdAt;
            if (
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            ) {
                if (!Session[session.session]) return;

                if (
                    session.event === "AddedToCart" &&
                    !Session[session.session][0].includes("AddedToCart")
                ) {
                    data["TotalCart"] += 1;
                    Session[session.session][0].push("AddedToCart");
                } else if (
                    session.event === "ReachedCheckout" &&
                    !Session[session.session][0].includes("ReachedCheckout")
                ) {
                    data["TotalCheckout"] += 1;
                    Session[session.session][0].push("ReachedCheckout");
                } else if (
                    session.event === "Converted" &&
                    !Session[session.session][0].includes("Converted")
                ) {
                    data["TotalConverted"] += 1;
                    Session[session.session][0].push("Converted");
                }
            }
        });

        const total = Object.keys(Session).length;
        data["AddedToCart"] = (data["TotalCart"] / total) * 100 || 0;
        data["ReachedCheckout"] =
            (data["TotalCheckout"] / data["TotalCart"]) * 100 || 0;
        data["Converted"] = (data["TotalConverted"] / total) * 100 || 0;
    } catch (e) {
        console.log(e);
    }

    return data;
};
