import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Info, Command, ChevronRight, History, Keyboard } from 'lucide-react';
import Navigation from './Navigation';

export default function CompilerPage() {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<Array<{ type: 'command' | 'output' | 'error'; content: string }>>([
    { type: 'output', content: 'Welcome to Linux Terminal Simulator v1.0.0' },
    { type: 'output', content: 'Type "help" for a list of available commands.' },
  ]);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commonCommands = [
    { command: 'ls', description: 'List directory contents' },
    { command: 'pwd', description: 'Print working directory' },
    { command: 'whoami', description: 'Display current user' },
    { command: 'date', description: 'Show current date and time' },
    { command: 'uname', description: 'Print system information' },
    { command: 'echo', description: 'Display a line of text' },
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;

    // Handle help command locally
    if (command.trim().toLowerCase() === 'help') {
      setOutput(prev => [...prev, 
        { type: 'command', content: `$ ${command}` },
        { type: 'output', content: 'Available commands:\n' + commonCommands.map(cmd => 
          `${cmd.command.padEnd(10)} - ${cmd.description}`
        ).join('\n')}
      ]);
      setCommand('');
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      return;
    }

    // Handle clear command locally
    if (command.trim().toLowerCase() === 'clear') {
      setOutput([
        { type: 'output', content: 'Welcome to Linux Terminal Simulator v1.0.0' },
        { type: 'output', content: 'Type "help" for a list of available commands.' },
      ]);
      setCommand('');
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      return;
    }

    // List of potentially harmful commands
    const harmfulCommands = ["rm", "mv", "rmdir", "sudo"];
    
    if (harmfulCommands.some(cmd => command.trim().startsWith(cmd))) {
      setOutput(prev => [...prev,
        { type: 'command', content: `$ ${command}` },
        { type: 'error', content: 'Error: This command is restricted for security reasons.' }
      ]);
      setCommand('');
      return;
    }
  
    try {
      setOutput(prev => [...prev, { type: 'command', content: `$ ${command}` }]);
      
      const response = await fetch('http://localhost:5000/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOutput(prev => [...prev, { 
          type: 'output', 
          content: data.output || 'Command executed successfully (no output)' 
        }]);
      } else {
        setOutput(prev => [...prev, { 
          type: 'error', 
          content: `Error: ${data.error || 'Unknown error'}` 
        }]);
      }
    } catch (error) {
      setOutput(prev => [...prev, { 
        type: 'error', 
        content: 'Error: Could not connect to server. Please ensure the backend is running.' 
      }]);
    }

    setCommandHistory(prev => [...prev, command]);
    setCommand('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Terminal Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">Terminal</div>
              </div>

              {/* Terminal Output */}
              <div 
                ref={terminalRef}
                className="h-[500px] overflow-y-auto p-4 font-mono text-sm"
                onClick={() => inputRef.current?.focus()}
              >
                {output.map((line, index) => (
                  <div 
                    key={index} 
                    className={`mb-2 ${
                      line.type === 'command' ? 'text-green-400' :
                      line.type === 'error' ? 'text-red-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line.content}
                  </div>
                ))}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-green-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none"
                    autoFocus
                  />
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Commands */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Command className="w-5 h-5" />
                Quick Commands
              </h2>
              <div className="space-y-3">
                {commonCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => setCommand(cmd.command)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <code className="text-green-400 font-mono">{cmd.command}</code>
                    <span className="text-sm text-gray-400">{cmd.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Tips
              </h2>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>Use Up/Down arrows to navigate command history</span>
                </div>
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-blue-400" />
                  <span>Type 'clear' to reset the terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Type 'help' to see available commands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}