import {
    DollarSign,
    CreditCard,
    Package,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

import { TabsContent } from "@/components/ui/tabs";
import { formatter } from "@/lib/utils";
import { BarGraph } from "./graphs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { getGraphRevenue } from "@/actions/get-graph-data";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getAverageOrder } from "@/actions/get-average-order";
import { getOrderCount } from "@/actions/get-orders-count";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";

interface PageProps {
    params: {
        storeId: string;
    };
}

const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const Overview: React.FC<PageProps> = async ({ params }) => {
    const totalRevenue = await getTotalRevenue(params.storeId);
    const graphRevenue = await getGraphRevenue(params.storeId);
    const monthRevenue = graphRevenue.find(
        (row) => row.name === month[new Date().getMonth()]
    )!;
    const salesCount = await getSalesCount(params.storeId);
    const inStockCount = await getStockCount(params.storeId, false);
    const outOfStockCount = await getStockCount(params.storeId, true);
    const pendingOrderCount = await getOrderCount(params.storeId, false);
    const fulfilledOrderCount = await getOrderCount(params.storeId, true);

    const averageOrder = await getAverageOrder(params.storeId);

    const revenueChange = () => {
        const revenueLastMonth = graphRevenue.find(
            (row) => row.name === month[new Date().getMonth() - 1]
        )!;
        if (revenueLastMonth.total !== 0) {
            const changeInRevenue =
                ((monthRevenue.total - revenueLastMonth.total) /
                    Math.abs(revenueLastMonth.total)) *
                100;
            return (
                <>
                    {changeInRevenue > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    ${Math.abs(changeInRevenue).toFixed(1)}%
                </>
            );
        } else {
            return (
                <>
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    100%
                </>
            );
        }
    };

    return (
        <TabsContent value="overview">
            <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatter.format(totalRevenue)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Month Revenue
                        </CardTitle>
                        <CardDescription className="text-xs font-medium flex flex-row">
                            {revenueChange()} from Last Month
                        </CardDescription>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatter.format(monthRevenue.total)}
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-row justify-between space-x-2">
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Products In Stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {inStockCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Products out of Stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {outOfStockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Order Value
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatter.format(averageOrder)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sales
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{salesCount}</div>
                    </CardContent>
                </Card>

                <div className="flex flex-row justify-between space-x-2">
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Fulfilled Orders
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {fulfilledOrderCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Orders
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pendingOrderCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="sm:col-span-3 col-span-1">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <BarGraph data={graphRevenue} height={350} legend="$" />
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
};

export default Overview;
