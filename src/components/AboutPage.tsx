import React from 'react';
import myImage from '../assets/shahid.jpg';
import { Code, Palette, Box, Brain, Mail, Github, Linkedin } from 'lucide-react';
import Navigation from './Navigation';

export default function AboutPage() {
  const skills = [
    {
      title: "Web Development",
      icon: <Code className="w-6 h-6" />,
      description: "Creating interactive web applications with modern technologies"
    },
    {
      title: "Design",
      icon: <Palette className="w-6 h-6" />,
      description: "Crafting stunning posters and logos with creative flair"
    },
    {
      title: "3D Modeling",
      icon: <Box className="w-6 h-6" />,
      description: "Building immersive 3D creations using Blender"
    },
    {
      title: "Machine Learning",
      icon: <Brain className="w-6 h-6" />,
      description: "Exploring AI and implementing innovative ML solutions"
    }
  ];

  // Rest of the component remains the same
  const projects = [
    {
      title: "News Prism",
      description: "A global news platform facilitating worldwide information sharing and community discussions.",
      tech: ["React", "Node.js", "MongoDB"]
    },
    {
      title: "MailBot",
      description: "Python-based email automation using Gmail API for efficient bulk communication.",
      tech: ["Python", "Gmail API", "OAuth"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <img
            src={myImage}
            alt="Shahid Ali"
            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500"
          />
          <h1 className="text-4xl font-bold mb-4">Shahid Ali</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A developer driven by creativity, passion, and the pursuit of innovative solutions.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <a href="mailto:shahid.ali.2004.12@gmail.com" className="text-gray-300 hover:text-white">
              <Mail className="w-6 h-6" />
            </a>
            <a href="https://github.com/Dyr0tH" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/shahid-ali-14bb61248/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-duration-200">
                <div className="text-blue-500 mb-4">{skill.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-gray-400">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">My Journey</h2>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            As a current engineering student, I'm on a mission to turn my passion for technology and design into impactful creations. 
            My heart lies in building stunning websites, designing exotic posters, and diving into cutting-edge projects in Machine Learning and Web Development.
          </p>
          <div className="mt-8">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=shahid.ali.2004.12@gmail.com" target="_blank" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-colors">
              <Mail className="w-5 h-5" />
              Let's Create Together
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}