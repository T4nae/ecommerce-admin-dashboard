import {
    DollarSign,
    CreditCard,
    UserPlus,
    FileSpreadsheet,
    Share2,
    Receipt,
    ShoppingCart,
    UsersRound,
    PackageSearch,
} from "lucide-react";
import { DateRange } from "react-day-picker";

import { formatter } from "@/lib/utils";
import { BarGraph, LineGraph } from "@/components/graphs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
    getGraphRangeAverageOrder,
    getGraphRangeRevenue,
    getGraphRangeSalesCount,
    getGraphRangeSessionCount,
    getGraphRangeTopReferer,
    getGraphReturningCount,
    getRangeAverageOrder,
    getRangeRevenue,
    getRangeSalesCount,
    getRangeSessionCount,
} from "@/actions/get-range-data";
import { getRangeConversions } from "@/actions/get-conversion";
import { Separator } from "./ui/separator";
import { getRangeReturningCount } from "@/actions/get-returning";
import { getRangeTopProducts } from "@/actions/get-top-products";

interface PageProps {
    storeId: string;
    date: DateRange | undefined;
}

const TimePeriod: React.FC<PageProps> = async ({ storeId, date }) => {
    if (!date || !date.from || !date.to)
        return (
            <TabsContent value="compare">
                <DatePickerWithRange
                    storeId={storeId}
                    className="absolute right-9 top-44"
                />
            </TabsContent>
        );

    const revenue = await getRangeRevenue(storeId);
    const salesCount = await getRangeSalesCount(storeId);
    const AverageOrder = await getRangeAverageOrder(storeId);
    const sessionsCount = await getRangeSessionCount(storeId);
    const conversions = await getRangeConversions(storeId);
    const rangeReturning = await getRangeReturningCount(storeId);
    const RangeProducts = await getRangeTopProducts(storeId);

    const graphRevenue = await getGraphRangeRevenue(storeId);
    const graphSalesCount = await getGraphRangeSalesCount(storeId);
    const graphRangeAverageOrder = await getGraphRangeAverageOrder(storeId);
    const graphRangeSession = await getGraphRangeSessionCount(storeId);
    const graphRangeTopReferer = await getGraphRangeTopReferer(storeId, false);
    const graphRangeTopRefererSocial = await getGraphRangeTopReferer(
        storeId,
        true
    );
    const graphReturningCount = await getGraphReturningCount(storeId);

    return (
        <TabsContent value="time-period">
            <DatePickerWithRange
                storeId={storeId}
                className="absolute right-9 top-44"
            />
            <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                {formatter.format(revenue)}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Total Sales
                            </CardDescription>
                        </div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphRevenue ? graphRevenue : []}
                            height={300}
                            legend="$"
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                {formatter.format(AverageOrder)}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Average Order value
                            </CardDescription>
                        </div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={
                                graphRangeAverageOrder
                                    ? graphRangeAverageOrder
                                    : []
                            }
                            height={300}
                            legend="$"
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                +{salesCount}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Sales count
                            </CardDescription>
                        </div>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphSalesCount ? graphSalesCount : []}
                            height={300}
                            legend=""
                        />
                    </div>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-row space-x-2 items-center">
                            <CardTitle className="text-2xl font-bold pb-2">
                                {sessionsCount ? sessionsCount.count : 0}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Online Store Sessions{" -"}
                                {`
                                ${
                                    sessionsCount ? sessionsCount.uniqueData : 0
                                } unique sessions
                                `}
                            </CardDescription>
                        </div>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={graphRangeSession ? graphRangeSession : []}
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
                            data={
                                graphRangeTopReferer ? graphRangeTopReferer : []
                            }
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
                            data={
                                graphRangeTopRefererSocial
                                    ? graphRangeTopRefererSocial
                                    : []
                            }
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
                                    {conversions
                                        ? conversions["TotalConverted"]
                                        : 0}
                                    &nbsp;sessions
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-xs text-muted-foreground text-right">
                                    {conversions
                                        ? conversions["Converted"].toFixed(1)
                                        : 0}
                                    %
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
                                    {conversions ? conversions["TotalCart"] : 0}
                                    &nbsp;sessions
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-xs text-muted-foreground text-right">
                                    {conversions
                                        ? conversions["AddedToCart"].toFixed(1)
                                        : 0}
                                    %
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
                                    {conversions
                                        ? conversions["TotalCheckout"]
                                        : 0}
                                    &nbsp; sessions
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <p className="text-xs text-muted-foreground text-right">
                                    {conversions
                                        ? conversions[
                                              "ReachedCheckout"
                                          ].toFixed(1)
                                        : 0}
                                    %
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
                                +{rangeReturning}
                            </CardTitle>
                            <CardDescription className="flex flex-row">
                                Returning Customers
                            </CardDescription>
                        </div>
                        <UsersRound className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <div className="pr-10">
                        <LineGraph
                            data={
                                graphReturningCount ? graphReturningCount : []
                            }
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
                        {RangeProducts
                            ? RangeProducts.map((product) => (
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
                                              {formatter.format(
                                                  product.totalPrice
                                              )}
                                          </p>
                                          <Receipt className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                  </div>
                              ))
                            : null}
                    </div>
                </Card>
            </div>
        </TabsContent>
    );
};

export default TimePeriod;
