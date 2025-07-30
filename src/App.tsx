import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import ReportIssue from "./pages/ReportIssue";
import MyComplaints from "./pages/MyComplaints";
import Verification from "./pages/Verification";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import Polls from "./pages/Polls";
import Alerts from "./pages/Alerts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import VerificationManagement from "./pages/admin/VerificationManagement";
import NotFound from "./pages/NotFound";
import AdminVerification from "./pages/AdminVerification";
import EventManagement from "./pages/admin/EventManagement";
import PollManagement from "./pages/admin/PollManagement";
import AlertManagement from "./pages/admin/AlertManagement";
import UserProfile from './pages/UserProfile';
import Instructions from "./pages/Instructions";
import Chatbot from "./pages/chatbot";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
            <Route path="/report" element={
              <ProtectedRoute>
                <Layout><ReportIssue /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/complaints" element={
              <ProtectedRoute>
                <Layout><MyComplaints /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/verify" element={
              <ProtectedRoute>
                <Layout><Verification /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><UserProfile /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/instructions" element={
              <ProtectedRoute>
                <Layout><Instructions /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />

            
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Layout><Chatbot /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/events" element={
              <ProtectedRoute>
                <Layout><Events /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/polls" element={
              <ProtectedRoute>
                <Layout><Polls /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Layout><Alerts /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/HowItWorks" element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireRole="admin">
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute requireRole="admin">
                <Layout><ComplaintManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/verifications" element={
              <ProtectedRoute requireRole="admin">
                <Layout><VerificationManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireRole="admin">
                <Layout><EventManagement onStatsUpdate={() => {}} /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/polls" element={
              <ProtectedRoute requireRole="admin">
                <Layout><PollManagement onStatsUpdate={() => {}} /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/alerts" element={
              <ProtectedRoute requireRole="admin">
                <Layout><AlertManagement onStatsUpdate={() => {}} /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin-verify" element={
              <ProtectedRoute>
                <Layout><AdminVerification /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/about" element={
              <ProtectedRoute requireRole="admin">
                <Layout><About /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <ProtectedRoute>
                <Layout><Contact /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Layout><Support /></Layout>
              </ProtectedRoute>
            } />
            

            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

// import { Toaster } from "src/components/ui/toaster";
// import { Toaster as Sonner } from "src/components/ui/sonner";
// import { TooltipProvider } from "src/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "src/hooks/useAuth";
// import ProtectedRoute from "src/components/ProtectedRoute";
// import Layout from "src/components/Layout";

// // Import your pages
// import Index from "src/pages/Index";
// import About from "src/pages/About";
// import Contact from "src/pages/Contact";
// import Support from "src/pages/Support";
// import Auth from "src/pages/Auth";
// import ReportIssue from "src/pages/ReportIssue";
// import MyComplaints from "src/pages/MyComplaints";
// import Verification from "src/pages/Verification";
// import Settings from "src/pages/Settings";
// import Events from "src/pages/Events";
// import Polls from "src/pages/Polls";
// import Alerts from "src/pages/Alerts";
// import AdminDashboard from "src/pages/admin/AdminDashboard";
// import ComplaintManagement from "src/pages/admin/ComplaintManagement";
// import VerificationManagement from "src/pages/admin/VerificationManagement";
// import NotFound from "src/pages/NotFound";
// import AdminVerification from "src/pages/AdminVerification";
// import EventManagement from "src/pages/admin/EventManagement";
// import PollManagement from "src/pages/admin/PollManagement";
// import AlertManagement from "src/pages/admin/AlertManagement";
// import AdminAreaManagement from 'src/pages/admin/AdminAreaManagement';
// import UserProfile from 'src/pages/UserProfile';

// // Import the new HowItWorks component
// import HowItWorks from 'src/pages/HowItWorks';

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/" element={<Index />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/alerts" element={<Alerts />} />
//             <Route path="/events" element={<Events />} />
//             <Route path="/polls" element={<Polls />} />
//             <Route path="/admin-verify" element={<AdminVerification />} /> {/* This route seems public */}

//             {/* NEW: How It Works Page - Public and wrapped in Layout */}
//             <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />

//             {/* Protected Routes (Citizen/Admin) */}
//             <Route path="/report" element={
//               <ProtectedRoute>
//                 <Layout><ReportIssue /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/complaints" element={
//               <ProtectedRoute>
//                 <Layout><MyComplaints /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/verify" element={
//               <ProtectedRoute>
//                 <Layout><Verification /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/profile" element={
//               <ProtectedRoute>
//                 <Layout><UserProfile /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/settings" element={
//               <ProtectedRoute>
//                 <Layout><Settings /></Layout>
//               </ProtectedRoute>
//             } />
//             {/* Events, Polls, Alerts are listed as public and protected above,
//                 if these are intended to be protected, they should be moved under ProtectedRoute.
//                 For now, keeping them as per your original structure. */}


//             {/* Admin Protected Routes */}
//             <Route path="/admin" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><AdminDashboard /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/complaints" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><ComplaintManagement /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/verifications" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><VerificationManagement /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/events" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><EventManagement onStatsUpdate={() => {}} /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/polls" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><PollManagement onStatsUpdate={() => {}} /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/alerts" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><AlertManagement onStatsUpdate={() => {}} /></Layout>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/area-management" element={
//               <ProtectedRoute requireRole="admin">
//                 <Layout><AdminAreaManagement /></Layout>
//               </ProtectedRoute>
//             } />

//             {/* Catch-all for Not Found pages */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;
