
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Shield, 
  User, 
  Settings, 
  Calendar,
  Vote,
  AlertTriangle,
  Users,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Bell,
  Info,
  Phone,
  HelpCircle,
  Bot
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminPINEntry } from '@/components/AdminPINEntry';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import InstructionsPage from '@/pages/Instructions';

const citizenItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Report Issue", url: "/report", icon: MessageSquare },
  { title: "My Complaints", url: "/complaints", icon: FileText },
  { title: "Verify Identity", url: "/verify", icon: Shield },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Polls", url: "/polls", icon: Vote },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Instructions", url: "/instructions", icon: ClipboardList },  // ✅ COMMA ADDED HERE
  { title: "Chatbot", url: "/chatbot", icon: Bot }
];


const infoItems = [
  { title: "About", url: "/about", icon: Info },
  { title: "Contact", url: "/contact", icon: Phone },
  { title: "Support", url: "/support", icon: HelpCircle },
];

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Complaint Management", url: "/admin/complaints", icon: ClipboardList },
  { title: "Verification Management", url: "/admin/verifications", icon: ShieldCheck },
  { title: "Event Management", url: "/admin/events", icon: Calendar },
  { title: "Poll Management", url: "/admin/polls", icon: Vote },
  { title: "Alert Management", url: "/admin/alerts", icon: Bell },
  // { title: "Area Management", url: "/admin/areas", icon: Users },
];

export function AppSidebar() {
  const { isAdminSession } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {citizenItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <NavLink to={item.url} end className={({ isActive }) => getNavCls({ isActive })}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Admin Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1">
              <AdminPINEntry />
            </div>
            {isAdminSession && (
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                       <NavLink to={item.url} end className={({ isActive }) => getNavCls({ isActive })}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Information</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={({ isActive }) => getNavCls({ isActive })}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}