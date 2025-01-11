import { Terminal, Cpu, HardDrive, Book } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchedulingPage from './components/SchedulingPage';
import PageReplacementPage from './components/PageReplacementPage';
import CompilerPage from './components/CompilerPage';
import DocumentationPage from './components/DocumentationPage';
import AboutPage from './components/AboutPage';
import Navigation from './components/Navigation';

function HomePage() {
  const features = [
    {
      title: "Scheduling Algorithms",
      icon: <Cpu className="w-6 h-6" />,
      description: "Interactive simulations of FCFS, SJF, Round Robin, and Priority Scheduling algorithms."
    },
    {
      title: "Linux Compiler",
      icon: <Terminal className="w-6 h-6" />,
      description: "Real-time code execution environment with Linux command tutorials."
    },
    {
      title: "Page Replacement",
      icon: <HardDrive className="w-6 h-6" />,
      description: "Simulations for FIFO, LRU, and Optimal Replacement algorithms."
    },
    {
      title: "Documentation",
      icon: <Book className="w-6 h-6" />,
      description: "Comprehensive guide to operating system concepts and features."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navigation />
      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Operating System</span>
            <span className="block text-blue-500">Demo Kit</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Interactive learning platform for operating system concepts, algorithms, and practical implementations.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="/scheduling"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="text-blue-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/page-replacement" element={<PageReplacementPage />} />
        <Route path="/compiler" element={<CompilerPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;