import {
    DollarSign,
    CreditCard,
    UserPlus,
    ArrowUpRight,
    ArrowDownRight,
    FileSpreadsheet,
    Share2,
    ShoppingCart,
    Receipt,
    UsersRound,
    PackageSearch,
} from "lucide-react";

import { formatter } from "@/lib/utils";
import { BarGraph, LineGraph } from "@/components/graphs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
    getGraphReturningCount,
    getGraphTodayRevenue,
    getGraphTodaySales,
    getGraphTodaySession,
} from "@/actions/get-graph-data";
import { getDayRevenue } from "@/actions/get-total-revenue";
import { getDaySalesCount } from "@/actions/get-sales-count";
import { getDayAverageOrder } from "@/actions/get-average-order";
import {
    getGraphTodayAverageOrder,
    getGraphTodayTopReferer,
} from "@/actions/get-graph-data";
import { getDaySessionCount } from "@/actions/get-session-count";
import { Separator } from "./ui/separator";
import { getTodayConversions } from "@/actions/get-conversion";
import { getReturningCount } from "@/actions/get-returning";
import { getTodayTopProducts } from "@/actions/get-top-products";

interface PageProps {
    params: {
        storeId: string;
    };
}

const Today: React.FC<PageProps> = async ({ params }) => {
    const today = new Date();

    const todayRevenue = await getDayRevenue(params.storeId, today);
    const todaySalesCount = await getDaySalesCount(params.storeId, today);
    const todayAverageOrder = await getDayAverageOrder(params.storeId, today);
    const todaySessionsCount = await getDaySessionCount(params.storeId, today);
    const conversions = await getTodayConversions(params.storeId, today);
    const returningCount = await getReturningCount(params.storeId, today);
    const todayTopProducts = await getTodayTopProducts(params.storeId, today);

    const graphTodayRevenue = await getGraphTodayRevenue(params.storeId);
    const graphTodaySales = await getGraphTodaySales(params.storeId);
    const graphTodayAverageOrder = await getGraphTodayAverageOrder(
        params.storeId
    );
    const graphTodaySession = await getGraphTodaySession(params.storeId);
    const graphTodayTopReferer = await getGraphTodayTopReferer(
        params.storeId,
        false
    );
    const graphTodayTopRefererSocial = await getGraphTodayTopReferer(
        params.storeId,
        true
    );
    const graphReturningCount = await getGraphReturningCount(params.storeId);

    return (
        <TabsContent value="today">
            <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                {formatter.format(todayRevenue)}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Total Sales
                                <ChangeIn
                                    func={getDayRevenue}
                                    storeId={params.storeId}
                                />
                            </CardDescription>
                        </div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphTodayRevenue}
                            height={300}
                            legend="$"
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                {formatter.format(todayAverageOrder)}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Average Order value
                                <ChangeIn
                                    func={getDayAverageOrder}
                                    storeId={params.storeId}
                                />
                            </CardDescription>
                        </div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphTodayAverageOrder}
                            height={300}
                            legend="$"
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                +{todaySalesCount}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Today sales count
                                <ChangeIn
                                    func={getDaySalesCount}
                                    storeId={params.storeId}
                                />
                            </CardDescription>
                        </div>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphTodaySales}
                            height={300}
                            legend=""
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                {todaySessionsCount}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Online Store Sessions
                                <ChangeIn
                                    func={getDaySessionCount}
                                    storeId={params.storeId}
                                />
                            </CardDescription>
                        </div>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphTodaySession}
                            height={300}
                            legend=""
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardDescription className="flex flex-row">
                                Top referrers
                            </CardDescription>
                        </div>
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <BarGraph
                            data={graphTodayTopReferer}
                            height={300}
                            legend=""
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardDescription className="flex flex-row">
                                Traffic by Socials
                            </CardDescription>
                        </div>
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <BarGraph
                            data={graphTodayTopRefererSocial}
                            height={300}
                            legend=""
                        />
                    </div>
                </Card>
                <Card>
                    <div className="h-[300px] sm:h-full flex flex-col p-6">
                        <div className="flex h-full items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold">
                                    Converted
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {conversions["TotalConverted"]}
                                    &nbsp;sessions
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-xs text-muted-foreground text-right">
                                    {conversions["Converted"].toFixed(1)}%
                                </p>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex h-full items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold">
                                    Added to Cart
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {conversions["TotalCart"]}&nbsp;sessions
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-xs text-muted-foreground text-right">
                                    {conversions["AddedToCart"].toFixed(1)}%
                                </p>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex h-full items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold">
                                    Reached checkout
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {conversions["TotalCheckout"]}&nbsp;
                                    sessions
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-xs text-muted-foreground text-right">
                                    {conversions["ReachedCheckout"].toFixed(1)}%
                                </p>
                                <Receipt className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                +{returningCount}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Returning Customers
                            </CardDescription>
                        </div>
                        <UsersRound className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphReturningCount}
                            height={300}
                            legend=""
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardDescription className="flex flex-row">
                                Top Selling Products
                            </CardDescription>
                        </div>
                        <PackageSearch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="h-[300px] sm:h-full grid grid-rows-5 px-6 pb-6 space-y-2">
                        {todayTopProducts.map((product) => (
                            <div
                                key={product.product}
                                className="flex h-full items-center border rounded-full px-2 justify-between"
                            >
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold">
                                        {product.product}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.count} Sold
                                    </p>
                                </div>
                                <div className="flex flex-row space-x-2">
                                    <p className="text-xs text-muted-foreground text-right">
                                        {formatter.format(product.totalPrice)}
                                    </p>
                                    <Receipt className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </TabsContent>
    );
};

export default Today;

interface ChangeInProps {
    func: (storeId: string, date: Date) => Promise<number>;
    storeId: string;
}

const ChangeIn: React.FC<ChangeInProps> = async ({ func, storeId }) => {
    const today = new Date();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    const dataToday = await func(storeId, today);
    const dataYesterday = await func(storeId, yesterday);

    const dataChange =
        dataYesterday !== 0
            ? ((dataToday - dataYesterday) / dataYesterday) * 100 || dataToday
            : dataToday === 0
            ? 0
            : 100;

    return dataChange !== 0 ? (
        <div className="flex flex-row items-center ml-3">
            {dataChange > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <div className="text-xs font-medium">
                {Math.abs(dataChange).toFixed(1)}%
            </div>
        </div>
    ) : null;
};
