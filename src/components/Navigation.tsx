import { useState } from 'react';
import { Terminal, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Terminal className="w-8 h-8 text-blue-500" />
            <span className="ml-2 text-white font-bold text-xl">OS Demo Kit</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/scheduling" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Scheduling</a>
              <a href="/page-replacement" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Page Replacement</a>
              <a href="/compiler" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Compiler</a>
              <a href="/documentation" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Documentation</a>
              <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About Developer</a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/scheduling" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Scheduling</a>
            <a href="/page-replacement" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Page Replacement</a>
            <a href="/compiler" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Compiler</a>
            <a href="/documentation" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Documentation</a>
            <a href="/about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About Developer</a>
          </div>
        </div>
      )}
    </nav>
  );
}