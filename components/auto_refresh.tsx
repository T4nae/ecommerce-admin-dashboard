"use client";

import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

const AutoRefresh = () => {
    const router = useRouter();
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                router.refresh();
            }, 1 * 1000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, router]);

    return (
        <div className="flex flex-row justify-between gap-x-2 text-center">
            <Checkbox
                checked={autoRefresh}
                onCheckedChange={() => {
                    setAutoRefresh(!autoRefresh);
                }}
            />
            <p className="text-sm font-semibold">Auto Refresh</p>
        </div>
    );
};

export default AutoRefresh;
