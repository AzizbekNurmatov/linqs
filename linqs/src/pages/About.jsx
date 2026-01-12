import { ExternalLink } from 'lucide-react';

function About() {
  const feedbackFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe-x3r72lS2CurhJlTPjtvNTwaCBiVj6JEO4UCtDfYSHwialw/viewform?usp=header';

  const knownIssues = [
    'Image upload might take a moment',
    'No mobile version yet, but expected to change with an increase in users',
    'More communities and events will be added soon',
    'More features will be added soon',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mission Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Built for Charleston. Built by a student.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Linqs is a passion project started to help people find community and events without the noise of traditional social media.
          </p>
        </div>

        {/* Beta Note Callout */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Beta Version
          </h2>
          <p className="text-gray-700 mb-4">
            Linqs is currently in Beta. We're actively improving the platform based on your feedback.
          </p>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Known Issues:
            </h3>
            <ul className="space-y-2">
              {knownIssues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback CTA Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Report a Bug or Suggest a Feature
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            I'm fixing bugs every day. Help me find them by filling out the quick form below.
          </p>
          <a
            href={feedbackFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Open Feedback Form
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Personal Touch / Hosted By Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 text-center">
          <p className="text-gray-600 mb-2">
            Hosted by{' '}
            <a
              href="https://www.linkedin.com/in/azizbek-nurmatov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Azizbek Nurmatov
            </a>
          </p>
          <a
            href="https://www.linkedin.com/in/azizbek-nurmatov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
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
    </div>
  );
}

export default About;
