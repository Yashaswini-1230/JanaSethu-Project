import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, MessageSquare, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalEvents: number;
  totalPolls: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalEvents: 0,
    totalPolls: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch complaint stats
        const { data: complaints } = await supabase
          .from('complaints')
          .select('status');

        const { data: events } = await supabase
          .from('events')
          .select('id');

        const { data: polls } = await supabase
          .from('polls')
          .select('id');

        if (complaints) {
          const pending = complaints.filter(c => c.status === 'Pending').length;
          const inProgress = complaints.filter(c => c.status === 'In Progress').length;
          const resolved = complaints.filter(c => c.status === 'Resolved').length;

          setStats({
            totalComplaints: complaints.length,
            pendingComplaints: pending,
            inProgressComplaints: inProgress,
            resolvedComplaints: resolved,
            totalEvents: events?.length || 0,
            totalPolls: polls?.length || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: MessageSquare,
      description: 'All reported issues',
      color: 'text-blue-600',
    },
    {
      title: 'Pending',
      value: stats.pendingComplaints,
      icon: Clock,
      description: 'Awaiting review',
      color: 'text-yellow-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgressComplaints,
      icon: TrendingUp,
      description: 'Being addressed',
      color: 'text-blue-600',
    },
    {
      title: 'Resolved',
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      description: 'Successfully completed',
      color: 'text-green-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of civic engagement platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Community Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Events</span>
              <span className="font-semibold">{stats.totalEvents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Polls</span>
              <span className="font-semibold">{stats.totalPolls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Resolution Rate</span>
              <span className="font-semibold">
                {stats.totalComplaints > 0 
                  ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
  <CardHeader>
    <CardTitle>Quick Actions</CardTitle>
    <CardDescription>Manage your platform efficiently</CardDescription>
  </CardHeader>
  <CardContent className="space-y-2">
    <Link
  to="/admin/complaints"
  className="block p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
>
  <div className="font-medium">Review Complaints</div>
  <div className="text-sm text-muted-foreground">
    {stats.pendingComplaints} pending review
  </div>
</Link>

<Link
  to="/admin/verifications"
  className="block p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
>
  <div className="font-medium">View Verifications</div>
  <div className="text-sm text-muted-foreground">Review identity verifications</div>
</Link>

<Link
  to="/admin/events"
  className="block p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
>
  <div className="font-medium">Manage Events</div>
  <div className="text-sm text-muted-foreground">Create and update community events</div>
</Link>

<Link
  to="/admin/polls"
  className="block p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
>
  <div className="font-medium">Create Polls</div>
  <div className="text-sm text-muted-foreground">Engage with community feedback</div>
</Link>

  </CardContent>
</Card>

      </div>
    </div>
  );
}
// -----------------------------------------------------------
// src/pages/admin/AdminComplaints.tsx
// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface Complaint {
//   id: number;
//   title: string;
//   description: string;
//   status: string;
//   created_at: string;
//   user_email?: string;
// }

// export default function AdminComplaints() {
//   const [complaints, setComplaints] = useState<Complaint[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       const { data, error } = await supabase
//         .from("complaints")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Failed to fetch complaints:", error);
//       } else {
//         setComplaints(data || []);
//       }

//       setLoading(false);
//     };

//     fetchComplaints();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">User Complaints</h1>
//       <p className="text-muted-foreground">All complaints submitted by citizens</p>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-4">
//           {complaints.map((complaint) => (
//             <Card key={complaint.id} className="border shadow">
//               <CardHeader>
//                 <CardTitle>{complaint.title}</CardTitle>
//                 <p className="text-sm text-muted-foreground">Status: {complaint.status}</p>
//               </CardHeader>
//               <CardContent>
//                 <p className="mb-2">{complaint.description}</p>
//                 <p className="text-sm text-muted-foreground">
//                   Submitted: {new Date(complaint.created_at).toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
