import prismadb from "@/lib/prismadb";
import { isAfter, isBefore, isEqual } from "date-fns";

export const getReturningCount = async (storeId: string, date: Date) => {
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
            },
        });

        const Session = sessions.reduce(
            (acc: Record<string, [Date, number]>, item) => {
                if (!acc[item.session]) {
                    acc[item.session] = [item.createdAt, 1];
                } else {
                    acc[item.session][1]++;
                    if (isAfter(item.createdAt, acc[item.session][0])) {
                        acc[item.session][0] = item.createdAt;
                    }
                }
                return acc;
            },
            {}
        );

        const returning = Object.keys(Session).filter((session) => {
            return (
                Session[session][1] > 1 &&
                Session[session][0].getDate() === date.getDate() &&
                Session[session][0].getMonth() === date.getMonth() &&
                Session[session][0].getFullYear() === date.getFullYear()
            );
        }).length;

        return returning;
    } catch (e) {
        console.log(e);
        return 0;
    }
};

export const getRangeReturningCount = async (storeId: string) => {
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
            (acc: Record<string, [Date, number]>, item) => {
                if (!acc[item.session]) {
                    acc[item.session] = [item.createdAt, 1];
                } else {
                    acc[item.session][1]++;
                    if (
                        isAfter(item.createdAt, acc[item.session][0]) &&
                        isBefore(item.createdAt, date.to)
                    ) {
                        acc[item.session][0] = item.createdAt;
                    }
                }
                return acc;
            },
            {}
        );

        const returning = Object.keys(Session).filter((session) => {
            const createdAt = Session[session][0];
            return (
                Session[session][1] > 1 &&
                (isAfter(createdAt, date.from!) ||
                    isEqual(createdAt, date.from!)) &&
                (isBefore(createdAt, date.to!) || isEqual(createdAt, date.to!))
            );
        }).length;

        return returning;
    } catch (e) {
        console.log(e);
        return 0;
    }
};
