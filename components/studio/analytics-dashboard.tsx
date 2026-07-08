"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, isAdmin } from "@/lib/content/roles";

interface AnalyticsData {
  totalViews: number;
  totalEntries: number;
  totalDrafts: number;
  totalUsers: number;
  viewsTrend: number;
  topEntries: Array<{
    slug: string;
    title: string;
    views: number;
    change: number;
  }>;
  recentActivity: Array<{
    type: "publish" | "edit" | "view";
    title: string;
    timestamp: string;
  }>;
  viewsByDay: Array<{
    date: string;
    views: number;
  }>;
}

export function AnalyticsDashboard() {
  const { userId } = useAuth();
  const { user } = useUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const admin = isAdmin(role);

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    if (!userId) return;

    // Simulate analytics data - in real implementation, this would fetch from API
    const mockData: AnalyticsData = {
      totalViews: 12847,
      totalEntries: 42,
      totalDrafts: 8,
      totalUsers: 156,
      viewsTrend: 12.5,
      topEntries: [
        { slug: "unconscious", title: "จิตไร้สำนึก (The Unconscious)", views: 2341, change: 15.2 },
        { slug: "jung", title: "Carl Gustav Jung", views: 1892, change: 8.7 },
        { slug: "archetypes", title: "Archetypes", views: 1654, change: -2.1 },
        { slug: "freud", title: "Sigmund Freud", views: 1423, change: 5.3 },
        { slug: "individuation", title: "Individuation", views: 1287, change: 22.1 },
      ],
      recentActivity: [
        { type: "publish", title: "บทความใหม่: Collective Unconscious", timestamp: "2 ชั่วโมงที่แล้ว" },
        { type: "edit", title: "แก้ไข: Shadow and Projection", timestamp: "5 ชั่วโมงที่แล้ว" },
        { type: "view", title: "หน้า: Jungian Psychology", timestamp: "1 ชั่วโมงที่แล้ว" },
        { type: "publish", title: "บทความใหม่: Active Imagination", timestamp: "1 วันที่แล้ว" },
      ],
      viewsByDay: [
        { date: "2024-01-01", views: 423 },
        { date: "2024-01-02", views: 387 },
        { date: "2024-01-03", views: 456 },
        { date: "2024-01-04", views: 512 },
        { date: "2024-01-05", views: 489 },
        { date: "2024-01-06", views: 534 },
        { date: "2024-01-07", views: 621 },
      ],
    };

    // Simulate loading
    setTimeout(() => {
      setAnalytics(mockData);
      setLoading(false);
    }, 500);
  }, [userId, timeRange]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-border bg-bg-card p-4">
            <div className="h-4 w-24 rounded bg-bg-elevated" />
            <div className="mt-2 h-8 w-16 rounded bg-bg-elevated" />
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="จำนวนผู้เข้าชม"
          value={analytics.totalViews.toLocaleString()}
          trend={analytics.viewsTrend}
          icon="visibility"
        />
        <StatCard
          label="บทความที่เผยแพร่"
          value={analytics.totalEntries.toString()}
          icon="article"
        />
        <StatCard
          label="แบบร่าง"
          value={analytics.totalDrafts.toString()}
          icon="edit_note"
        />
        {admin && (
          <StatCard
            label="ผู้ใช้ทั้งหมด"
            value={analytics.totalUsers.toString()}
            icon="people"
          />
        )}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary">ช่วงเวลา:</span>
        {(["7d", "30d", "90d"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              timeRange === range
                ? "bg-accent/15 text-accent"
                : "text-text-secondary hover:bg-bg-card hover:text-text-heading"
            }`}
          >
            {range === "7d" ? "7 วัน" : range === "30d" ? "30 วัน" : "90 วัน"}
          </button>
        ))}
      </div>

      {/* Top Entries */}
      <div className="rounded-lg border border-border bg-bg-card p-4">
        <h3 className="mb-4 font-serif text-sm font-semibold text-text-heading">บทความยอดนิยม</h3>
        <div className="space-y-3">
          {analytics.topEntries.map((entry, i) => (
            <div
              key={entry.slug}
              className="flex items-center justify-between rounded-md bg-bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm text-text-heading">{entry.title}</p>
                  <p className="text-xs text-text-secondary">/{entry.slug}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text-heading">{entry.views.toLocaleString()}</p>
                <p
                  className={`text-xs ${
                    entry.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {entry.change >= 0 ? "+" : ""}
                  {entry.change}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-bg-card p-4">
        <h3 className="mb-4 font-serif text-sm font-semibold text-text-heading">กิจกรรมล่าสุด</h3>
        <div className="space-y-2">
          {analytics.recentActivity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md bg-bg-card p-3"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  activity.type === "publish"
                    ? "bg-green-500/10 text-green-400"
                    : activity.type === "edit"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-blue-500/10 text-blue-400"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {activity.type === "publish"
                    ? "check_circle"
                    : activity.type === "edit"
                      ? "edit"
                      : "visibility"}
                </span>
              </span>
              <div className="flex-1">
                <p className="text-sm text-text-heading">{activity.title}</p>
                <p className="text-xs text-text-secondary">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Views Chart (simplified) */}
      <div className="rounded-lg border border-border bg-bg-card p-4">
        <h3 className="mb-4 font-serif text-sm font-semibold text-text-heading">จำนวนผู้เข้าชมรายวัน</h3>
        <div className="flex items-end gap-2 h-32">
          {analytics.viewsByDay.map((day, i) => {
            const maxViews = Math.max(...analytics.viewsByDay.map((d) => d.views));
            const height = (day.views / maxViews) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-secondary">{day.views}</span>
                <div
                  className="w-full rounded-t bg-accent/30 transition-all hover:bg-accent/50"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[9px] text-text-secondary">
                  {new Date(day.date).toLocaleDateString("th-TH", { day: "numeric" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon,
}: {
  label: string;
  value: string;
  trend?: number;
  icon: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="material-symbols-outlined text-[20px] text-text-secondary">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-text-heading">{value}</p>
      {trend !== undefined && (
        <p
          className={`mt-1 text-xs ${
            trend >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {trend >= 0 ? "+" : ""}
          {trend}% จากเดือนที่แล้ว
        </p>
      )}
    </div>
  );
}
