"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Sample } from "@/lib/typing/stats";

/** Per-second speed chart. Loaded only once a test has finished. */
export default function SpeedChart({ samples }: { samples: Sample[] }) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={samples} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="wpmFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="second"
            tick={{ fontSize: 11, fill: "var(--text-2)" }}
            stroke="var(--border)"
            tickLine={false}
            unit="s"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-2)" }}
            stroke="var(--border)"
            tickLine={false}
            width={44}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(second) => `${second}s`}
          />

          <Area
            type="monotone"
            dataKey="raw"
            name="Raw WPM"
            stroke="var(--text-2)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill="none"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            name="WPM"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#wpmFill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
