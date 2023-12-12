"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

interface GraphProps {
    data: any[];
    height: number;
    legend: string;
}

export const BarGraph: React.FC<GraphProps> = ({ data, height, legend }) => {
    const display =
        data.length !== 0 &&
        data.reduce((sum, item) => {
            return sum + item.total;
        }, 0) !== 0;
    return display ? (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${legend}${value}`}
                />
                <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    ) : (
        <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="text-muted-foreground text-center text-xs font-mono">
                No data to display
            </div>
        </div>
    );
};

export const LineGraph: React.FC<GraphProps> = ({ data, height, legend }) => {
    const display =
        data.length !== 0 &&
        data.reduce((sum, item) => {
            return sum + item.total;
        }, 0) !== 0;
    return display ? (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
                <CartesianGrid opacity={0.2} vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${legend}${value}`}
                />
                <Line
                    type="monotone"
                    dataKey="total"
                    fill="#3498db"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    ) : (
        <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="text-muted-foreground text-center text-xs font-mono">
                No data to display
            </div>
        </div>
    );
};
