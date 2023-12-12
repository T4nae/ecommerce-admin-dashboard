import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/overview";
import Today from "@/components/today";
import TimePeriod from "@/components/time-period";

interface DashboardPageProps {
    params: {
        storeId: string;
    };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ params }) => {
    const date = { from: new Date(), to: new Date() };
    return (
        <Tabs defaultValue="overview">
            <div className="grid grid-cols-3 justify-between">
                <TabsList className="grid grid-cols-3 sm:col-span-1 col-span-2 mr-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="time-period">Over time</TabsTrigger>
                </TabsList>
            </div>
            <Overview params={params} />
            <Today params={params} />
            <TimePeriod storeId={params.storeId} date={date} />
        </Tabs>
    );
};

export default DashboardPage;
