import React, { useState } from 'react';
import { Terminal, Send, Info } from 'lucide-react';
import Navigation from './Navigation';

export default function CompilerPage() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  
  const commonCommands = [
    { command: 'ls', description: 'List directory contents' },
    { command: 'cd', description: 'Change directory' },
    { command: 'pwd', description: 'Print working directory' },
    { command: 'mkdir', description: 'Create a new directory' },
    { command: 'rm', description: 'Remove files or directories' },
    { command: 'cp', description: 'Copy files and directories' },
    { command: 'mv', description: 'Move/rename files and directories' },
    { command: 'cat', description: 'Display file contents' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // List of potentially harmful commands
    const harmfulCommands = ["del", "rm", "mv", "rmdir", "sudo rm", "sudo del"];
    
    // Check if the command is harmful
    if (harmfulCommands.some((hc) => command.trim().startsWith(hc))) {
      setOutput("Unable to execute the command. Reason: harmful");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput('Error: Could not connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-4xl font-bold text-center mb-12">Linux Command Terminal</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Terminal Section */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Terminal className="w-5 h-5 text-green-500" />
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                    placeholder="Enter Linux command..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Execute Command
                </button>
              </form>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Output
              </h2>
              <pre className="bg-gray-700 rounded p-4 overflow-x-auto">
                {output || 'Command output will appear here...'}
              </pre>
            </div>
          </div>

          {/* Commands Guide */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Common Linux Commands
            </h2>
            <div className="space-y-4">
              {commonCommands.map((cmd, index) => (
                <div key={index} className="border-b border-gray-700 pb-4">
                  <code className="text-green-500 font-mono">{cmd.command}</code>
                  <p className="text-gray-300 mt-1">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}