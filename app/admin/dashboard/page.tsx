"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDashboardPage() {
  const stats = useQuery(api.admin.getDashboardStats);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {stats === undefined ? (
        <div className="text-muted-foreground">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
          />
          <StatCard title="Total Tasks" value={stats.totalTasks} />
          <StatCard title="Completed Tasks" value={stats.completedTasks} />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
