import { ExternalLink, CheckCircle2, Clock, Circle } from 'lucide-react';

function About() {
  const feedbackFormUrl = 'https://forms.gle/YOUR_FORM_ID_HERE'; // Replace with actual Google Form URL

  const roadmapItems = [
    {
      id: 1,
      title: 'Browse Weekly Events',
      status: 'done',
      description: 'Discover and filter recurring weekly events in your area',
    },
    {
      id: 2,
      title: 'User Comments & Chat',
      status: 'in-progress',
      description: 'Engage with event organizers and attendees through comments',
    },
    {
      id: 3,
      title: 'Mobile Push Notifications',
      status: 'planned',
      description: 'Get notified about new events and updates in real-time',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Done
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            <Circle className="w-3.5 h-3.5" />
            Planned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Shape Linqs
          </h1>
          <p className="text-lg text-gray-600">
            Your feedback drives what we build next
          </p>
        </div>

        {/* The Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Linqs Exists
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 leading-relaxed">
              Linqs is a student-built project designed to make local event discovery easier and more accessible. 
              We believe that real connections happen when people come together in person, and our mission is to 
              help you find those meaningful moments in your community. Whether you're looking for weekly meetups, 
              one-time events, or micro-communities that share your interests, Linqs is here to help you discover 
              what's happening around you.
            </p>
          </div>
        </section>

        {/* Live Roadmap Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What's Being Built
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <ul className="space-y-4">
              {roadmapItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Feedback Call-to-Action Section */}
        <section className="mb-12">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 md:p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Spot a bug? Have a feature idea? Let me know.
              </h2>
              <p className="text-gray-600 mb-6">
                Your feedback helps us improve Linqs and build features that matter to you.
              </p>
              <a
                href={feedbackFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Open Feedback Form
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Connect Footer Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Created by{' '}
              <a
                href="https://www.linkedin.com/in/azizbek-nurmatov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Azizbek Nurmatov
              </a>
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/azizbek-nurmatov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
