import AutoRefresh from "@/components/auto_refresh";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-row items-center justify-between">
                    <Heading
                        title="Dashboard"
                        description="Overview of your store"
                    />
                    <AutoRefresh />
                </div>
                <Separator />
                {children}
            </div>
        </div>
    );
}
