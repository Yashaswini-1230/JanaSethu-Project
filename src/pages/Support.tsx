import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, MessageCircle, Mail, Ticket } from 'lucide-react';

const Support = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState({
    issueType: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setTicketData(prev => ({
      ...prev,
      issueType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate ticket submission
    setTimeout(() => {
      toast({
        title: "✅ Ticket Submitted",
        description: "Your ticket has been submitted. Our support team will respond soon.",
      });
      
      // Reset form
      setTicketData({
        issueType: '',
        description: ''
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-black">
            🛠 Support & Help Center
          </h1>
          <p className="text-xl text-muted-foreground">
            Need assistance? Find answers to common questions below or raise a support ticket for personalized help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I report an issue?</AccordionTrigger>
                    <AccordionContent>
                      Go to the Report Issue page, fill in the details, and submit your complaint. You can add photos, location, and detailed descriptions to help us understand the problem better.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I track my complaint status?</AccordionTrigger>
                    <AccordionContent>
                      Navigate to My Complaints to check the status of your submitted issues. You'll see real-time updates as your complaint progresses through different stages.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I verify my account?</AccordionTrigger>
                    <AccordionContent>
                      Go to Account → Verify and upload your government ID (Aadhar, Voter ID, or utility bill). This helps us ensure authentic community participation and gives you access to additional features.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do polls work?</AccordionTrigger>
                    <AccordionContent>
                      Community polls allow you to participate in local decision-making. Visit the Polls page to see active polls and vote on community issues that matter to you.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do I join community chat?</AccordionTrigger>
                    <AccordionContent>
                      Once your account is verified, you can access colony-specific chat rooms to discuss local issues with your neighbors and stay connected with your community.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Live Chat Support</p>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@janasethu.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Ticket Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Raise a Support Ticket
              </CardTitle>
              <CardDescription>Can't find what you're looking for? Submit a support ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueType">Issue Type *</Label>
                  <Select value={ticketData.issueType} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="account">Account Issue</SelectItem>
                      <SelectItem value="complaint">Complaint Related</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="verification">Verification Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={ticketData.description}
                    onChange={handleInputChange}
                    placeholder="Explain your issue clearly. Include steps to reproduce if it's a bug, or provide as much detail as possible."
                    rows={8}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading || !ticketData.issueType || !ticketData.description}>
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips for Better Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">📝 Be Specific</h4>
                <p className="text-sm text-muted-foreground">
                  Provide detailed descriptions of your issue, including what you were trying to do and what happened instead.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📱 Include Device Info</h4>
                <p className="text-sm text-muted-foreground">
                  Mention your device type (mobile/desktop) and browser if you're experiencing technical issues.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📸 Add Screenshots</h4>
                <p className="text-sm text-muted-foreground">
                  If possible, include screenshots or photos that help illustrate your problem.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">⏰ Response Time</h4>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours. Urgent issues are prioritized.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
};

export default Support;
// -----------------------------------------------------------------
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
//     { label: "Communities Served", value: "150+", color: "text-blue-800" },
//     { label: "Issues Resolved", value: "2,500+", color: "text-green-800" },
//     { label: "Active Citizens", value: "5,000+", color: "text-purple-800" },
//     { label: "Response Time", value: "< 24hrs", color: "text-orange-800" }
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
//               <div className={`text-lg font-bold ${stat.color}`}>
//                 {stat.value}
//               </div>
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
//           <h2 className="text-3xl font-bold mb-4 text-black">What We Offer</h2>
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
//           <CardTitle className="text-2xl flex items-center justify-center gap-2 text-black">
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
