// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Users, Globe, Shield, Heart, Phone, Mail, MapPin, Award, Target, Eye } from 'lucide-react';

// export default function About() {
//   const features = [
//     {
//       icon: Users,
//       title: "Community Reporting",
//       description: "Citizens can easily report civic issues with photos and location tracking for quick resolution."
//     },
//     {
//       icon: Shield,
//       title: "Identity Verification", 
//       description: "Secure verification system ensures authentic community participation and builds trust."
//     },
//     {
//       icon: Globe,
//       title: "Real-time Updates",
//       description: "Stay informed with live updates on issue status, community events, and local announcements."
//     },
//     {
//       icon: Heart,
//       title: "Community Engagement",
//       description: "Participate in polls, attend events, and engage with your local community effectively."
//     }
//   ];

//   const stats = [
//     { label: "Communities Served", value: "150+", color: "bg-blue-100 text-blue-800" },
//     { label: "Issues Resolved", value: "2,500+", color: "bg-green-100 text-green-800" },
//     { label: "Active Citizens", value: "5,000+", color: "bg-purple-100 text-purple-800" },
//     { label: "Response Time", value: "< 24hrs", color: "bg-orange-100 text-orange-800" }
//   ];

//   return (
//     <div className="max-w-6xl mx-auto space-y-12">
//       {/* Hero Section */}
//       <div className="text-center space-y-6">
//         <div className="space-y-4">
//           <h1 className="text-5xl font-bold gradient-text">About Jana Sethu</h1>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             Bridging the gap between citizens and governance through innovative digital solutions. 
//             Empowering communities to participate, report, and engage in local civic activities.
//           </p>
//         </div>
        
//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="text-center">
//               <Badge className={`${stat.color} text-lg px-4 py-2 font-bold`}>
//                 {stat.value}
//               </Badge>
//               <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Mission & Vision */}
//       <div className="grid md:grid-cols-2 gap-8">
//         <Card className="shadow-elegant border-primary/20">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-2xl">
//               <Target className="h-6 w-6 text-primary" />
//               Our Mission
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg leading-relaxed">
//               To democratize civic engagement by providing accessible, transparent, and efficient digital tools 
//               that connect citizens with their local authorities, fostering stronger communities and responsive governance.
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-elegant border-secondary/20">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-2xl">
//               <Eye className="h-6 w-6 text-secondary" />
//               Our Vision
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg leading-relaxed">
//               A future where every citizen has a voice in their community's development, where civic issues are 
//               resolved efficiently, and where technology serves as a bridge to better governance and community well-being.
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Features */}
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Comprehensive tools designed to make civic participation simple, transparent, and effective for everyone.
//           </p>
//         </div>
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//                 <CardHeader>
//                   <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
//                     <Icon className="h-6 w-6 text-primary" />
//                   </div>
//                   <CardTitle className="text-lg">{feature.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-muted-foreground">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>

//       {/* Contact Section */}
//       <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl flex items-center justify-center gap-2">
//             <Award className="h-6 w-6 text-primary" />
//             Get Involved
//           </CardTitle>
//           <CardDescription className="text-lg">
//             Join thousands of citizens making a positive impact in their communities
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="text-center space-y-4">
//             <p className="text-lg">
//               Whether you're reporting civic issues, participating in community polls, or staying updated 
//               with local events, Jana Sethu provides all the tools you need to be an active, engaged citizen.
//             </p>
            
//             <div className="flex flex-wrap justify-center gap-4">
//               <Button size="lg" className="shadow-lg">
//                 Start Reporting Issues
//               </Button>
//               <Button variant="outline" size="lg">
//                 Join Community Discussions
//               </Button>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t">
//             <div className="text-center space-y-2">
//               <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//                 <Phone className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <p className="font-medium">📞 Helpline</p>
//                 <p className="text-sm text-muted-foreground">+91 98765 43210</p>
//               </div>
//             </div>
            
//             <div className="text-center space-y-2">
//               <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//                 <Mail className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <p className="font-medium">📧 Email</p>
//                 <a href="mailto:support@janasethu.com" className="text-sm text-primary hover:underline">
//                   support@janasethu.com
//                 </a>
//               </div>
//             </div>
            
//             <div className="text-center space-y-2">
//               <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//                 <Globe className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <p className="font-medium">🌐 Website</p>
//                 <a href="https://www.janasethu.com" className="text-sm text-primary hover:underline">
//                   www.janasethu.com
//                 </a>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Globe, Shield, Heart, Phone, Mail, Award, Target, Eye } from 'lucide-react';
import { useState } from 'react';

export default function AboutSection() {
  const features = [
    {
      icon: Users,
      title: "Community Reporting",
      description: "Citizens can easily report civic issues with photos and location tracking for quick resolution."
    },
    {
      icon: Shield,
      title: "Identity Verification", 
      description: "Secure verification system ensures authentic community participation and builds trust."
    },
    {
      icon: Globe,
      title: "Real-time Updates",
      description: "Stay informed with live updates on issue status, community events, and local announcements."
    },
    {
      icon: Heart,
      title: "Community Engagement",
      description: "Participate in polls, attend events, and engage with your local community effectively."
    }
  ];

  const stats = [
    { label: "Communities Served", value: "150+", color: "bg-blue-100 text-blue-800" },
    { label: "Issues Resolved", value: "2,500+", color: "bg-green-100 text-green-800" },
    { label: "Active Citizens", value: "5,000+", color: "bg-purple-100 text-purple-800" },
    { label: "Response Time", value: "< 24hrs", color: "bg-orange-100 text-orange-800" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold gradient-text">About Jana Sethu</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridging the gap between citizens and governance through innovative digital solutions. 
            Empowering communities to participate, report, and engage in local civic activities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <Badge className={`${stat.color} text-lg px-4 py-2 font-bold`}>
                {stat.value}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-elegant border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              To democratize civic engagement by providing accessible, transparent, and efficient digital tools 
              that connect citizens with their local authorities, fostering stronger communities and responsive governance.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Eye className="h-6 w-6 text-secondary" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              A future where every citizen has a voice in their community's development, where civic issues are 
              resolved efficiently, and where technology serves as a bridge to better governance and community well-being.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed to make civic participation simple, transparent, and effective for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Get Involved
          </CardTitle>
          <CardDescription className="text-lg">
            Join thousands of citizens making a positive impact in their communities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">
              Whether you're reporting civic issues, participating in community polls, or staying updated 
              with local events, Jana Sethu provides all the tools you need to be an active, engaged citizen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="shadow-lg">
                Start Reporting Issues
              </Button>
              <Button variant="outline" size="lg">
                Join Community Discussions
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t">
            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">📞 Helpline</p>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">📧 Email</p>
                <a href="mailto:support@janasethu.com" className="text-sm text-primary hover:underline">
                  support@janasethu.com
                </a>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">🌐 Website</p>
                <a href="https://www.janasethu.com" className="text-sm text-primary hover:underline">
                  www.janasethu.com
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
