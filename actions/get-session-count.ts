import prismadb from "@/lib/prismadb";

export const getDaySessionCount = async (storeId: string, date: Date) => {
    try {
        const sessions = await prismadb.analytics.findMany({
            where: {
                storeId,
                event: "FirstVisit",
            },
        });

        const sessionCount = sessions.reduce((total, session) => {
            const createdAt = session.createdAt;
            if (
                createdAt.getDate() === date.getDate() &&
                createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear()
            ) {
                return total + 1;
            }

            return total;
        }, 0);

        return sessionCount;
    } catch (e) {
        console.log(e);
        return 0;
    }
};
