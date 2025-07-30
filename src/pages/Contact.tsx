import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: '✅ Thank you!',
        description: 'We\'ve received your message and will get back to you shortly.',
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-black">
            📬 Get in Touch with Us
          </h1>
          <p className="text-xl text-muted-foreground">
            We're here to help! If you have any questions, suggestions, or issues, please reach out using the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your query"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your concern in detail"
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Helpline</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">support@janasethu.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Website</p>
                    <p className="text-muted-foreground">www.janasethu.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>Stay connected with our community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Facebook">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Instagram">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Twitter">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
// ---------------------------------------------------------------------------------
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Users, Globe, Shield, Heart, Phone, Mail, Award, Target, Eye } from 'lucide-react';
// import { useState } from 'react';

// export default function AboutSection() {
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
//           <h1 className="text-5xl font-bold text-primary">About Jana Sethu</h1>
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
//       <Card className="bg-white border-primary/20">
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
// -------------------------------------------------------------------------------------------------
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Users, Globe, Shield, Heart, Phone, Mail, Award, Target, Eye } from 'lucide-react';
// import { useState } from 'react';

// export default function AboutSection() {
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
//           <h1 className="text-5xl font-bold text-black">About Jana Sethu</h1>
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
//       <Card className="bg-white border-primary/20">
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
// ----------------------------------------------------------------------------------------------------
