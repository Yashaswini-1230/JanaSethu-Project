// import { useAuth } from '@/hooks/useAuth';
// import { Navigate } from 'react-router-dom';
// import Layout from '@/components/Layout';
// import AdminDashboard from './admin/AdminDashboard';

// const Index = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/auth" replace />;
//   }

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
//   Welcome to Jana Sethu
// </h1>


//           <p className="text-xl text-muted-foreground">
//             From Streets to Seats bridging the gap, bringing You Closer to the System
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
//           <a href="/report" className="group">
//             <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth">
//               <h3 className="font-semibold mb-2 group-hover:text-primary">Report an Issue</h3>
//               <p className="text-muted-foreground">Submit civic issues for community improvement</p>
//             </div>
//           </a>
//           <a href="/complaints" className="group">
//             <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth">
//               <h3 className="font-semibold mb-2 group-hover:text-primary">My Complaints</h3>
//               <p className="text-muted-foreground">Track your submitted complaints and their status</p>
//             </div>
//           </a>
//           <a href="/events" className="group">
//             <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth">
//               <h3 className="font-semibold mb-2 group-hover:text-primary">Community Events</h3>
//               <p className="text-muted-foreground">Stay updated with local community events</p>
//             </div>
//           </a>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Index;


import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Welcome to Jana Sethu
          </h1>
          <p className="text-xl text-muted-foreground">
            From Streets to Seats bridging the gap, bringing You Closer to the System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Link to="/report" className="group h-full">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth h-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2 group-hover:text-primary">Report an Issue</h3>
              <p className="text-muted-foreground">Submit civic issues for community improvement</p>
            </div>
          </Link>

          <Link to="/complaints" className="group h-full">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth h-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2 group-hover:text-primary">My Complaints</h3>
              <p className="text-muted-foreground">Track your submitted complaints and their status</p>
            </div>
          </Link>

          <Link to="/events" className="group h-full">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth h-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2 group-hover:text-primary">Community Events</h3>
              <p className="text-muted-foreground">Stay updated with local community events and take part</p>
            </div>
          </Link>
          <Link to="/alerts" className="group h-full">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth h-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2 group-hover:text-primary">Alerts</h3>
              <p className="text-muted-foreground">View important alerts and notifications</p>
            </div>
            </Link>

            <Link to="/instructions" className="group h-full">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth h-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2 group-hover:text-primary">Instructions</h3>
              <p className="text-muted-foreground">Know everything about our page</p>
            </div>
            </Link>
            <Link to="/polls" className="group h-full">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-elegant transition-smooth h-full flex flex-col justify-between">
              <h3 className="font-semibold mb-2 group-hover:text-primary">Polls</h3>
              <p className="text-muted-foreground">View Community Polls</p>
            </div>
            </Link>


          
        </div>
      </div>
    </Layout>
  );
};

export default Index;
