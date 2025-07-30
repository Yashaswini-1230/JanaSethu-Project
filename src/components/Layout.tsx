import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Bell, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="ml-2" />
            
            <div className="flex-1 flex items-center justify-between px-4">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Jana Sethu</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link to="/alerts">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}



// ...existing code...
// export default function Layout({ children }: LayoutProps) {
//   const { signOut } = useAuth();

//   const handleSignOut = async () => {
//     await signOut();
//   };

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
        
//         <div className="flex-1 flex flex-col">
//           {/* <header className="h-12 flex items-center border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <SidebarTrigger className="ml-2" />
            
//             <div className="flex-1 flex items-center justify-between px-4">
//               <Link to="/" className="flex items-center space-x-2">
//                 <Home className="h-6 w-6 text-primary" />
//                 <span className="text-xl font-bold">Jana Sethu</span>
//               </Link>
              
//               <div className="flex items-center space-x-4">
//                 <Link to="/alerts">
//                   <Button