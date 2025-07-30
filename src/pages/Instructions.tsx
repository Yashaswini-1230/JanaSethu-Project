import React from "react";


const InstructionsPage: React.FC = () => {
  return (
    
      <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to Jana Sethu: Your Essential Guide to Community Empowerment!
        </h1>

        <p className="mb-6">
          <strong>Jana Sethu</strong> (ಜನ ಸೇತು - "People's Bridge") is more than just an app;
          it's your direct link to improving our shared community. We empower residents like you
          to easily report local issues, stay informed about neighborhood developments, and actively
          participate in creating a better living environment for everyone.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          How It Works: A Step-by-Step Guide to Reporting Issues
        </h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li><strong>Accessing the Platform:</strong> Sign up or log in. Navigate to the "Report Issue" section.</li>
          <li><strong>Describing the Issue:</strong> Add a title, category (e.g., Roads, Lighting, Water), and a detailed description.</li>
          <li><strong>Pinpointing the Location:</strong> Use the interactive map or GPS button to set your exact location.</li>
          <li><strong>Adding Visual Evidence:</strong> Upload up to 8 photos or capture directly from your device camera. Location is auto-tagged.</li>
          <li><strong>Review and Submit:</strong> Confirm the details and submit. Track progress from "My Complaints".</li>
        </ol>

        <h2 className="text-xl font-semibold mt-10 mb-2">Complaint Statuses</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Pending:</strong> Report received, awaiting admin review.</li>
          <li><strong>In Progress:</strong> Admin has acknowledged and started processing.</li>
          <li><strong>Resolved:</strong> The issue has been fixed and closed.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-2">User Verification</h2>
        <p className="mb-4">
          Verified users help maintain trust. Upload your Aadhaar and complete face verification to unlock full access and faster response to your complaints.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-2">Beyond Reporting</h2>
        <ul className="list-disc pl-6 mb-4">
          <li> <strong>Events:</strong> Explore or propose local events and gatherings</li>
          <li><strong>Polls:</strong> Participate in decision-making through community polls</li>
          <li> <strong>Alerts:</strong> Receive live updates on emergencies, outages, or roadblocks</li>
          <li> <strong>Community Chat:</strong> Connect with neighbors and discuss local topics</li>
        </ul>

        <p className="mt-10 text-center font-semibold">
          Thank you for using Jana Sethu. Together, we can build a more responsive and vibrant city! 
        </p>
      </div>
    
  );
};

export default InstructionsPage;
