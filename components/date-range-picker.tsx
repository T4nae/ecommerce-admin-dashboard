"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useDateRange } from "@/hooks/use-date-range";
import { useOrigin } from "@/hooks/use-origin";

export async function DatePickerWithRange({
    className,
    storeId,
}: React.HTMLAttributes<HTMLDivElement> & { storeId: string }) {
    const { date, setDate } = useDateRange();
    const origin = useOrigin();
    const router = useRouter();
    const SetDate = async (date: DateRange | undefined) => {
        setDate(date);
        if (!date || !date.from || !date.to) return;
        try {
            console.log(
                await axios.patch(`${origin}/api/stores/${storeId}`, {
                    rangeFrom: date.from,
                    rangeTo: date?.to,
                })
            );
            router.refresh();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-min justify-start text-left font-normal",
                            date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="sm:mr-2 h-4 w-4" />
                        <div className="sm:block hidden">
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={SetDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
