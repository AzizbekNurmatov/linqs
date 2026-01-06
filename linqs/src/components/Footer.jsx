function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 h-24 flex items-center mt-auto">
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#636E72] text-sm">
          &copy; 2025 Linqs. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[#636E72] text-sm hover:text-[#6C5CE7] transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-[#636E72] text-sm hover:text-[#6C5CE7] transition-colors duration-200">
            Terms of Service
          </a>
          <a 
            href="https://www.linkedin.com/in/azizbek-nurmatov/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#636E72] text-sm hover:text-[#6C5CE7] transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
