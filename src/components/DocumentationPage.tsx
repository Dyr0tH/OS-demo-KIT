import {Cpu, HardDrive, Terminal, Layout } from 'lucide-react';
import Navigation from './Navigation';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-4xl font-bold text-center mb-12">Documentation</h1>

        {/* Operating System Overview */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Layout className="w-6 h-6" />
            What is an Operating System?
          </h2>
          <p className="text-gray-300 mb-4">
            An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between computer hardware and the user.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Types of Operating Systems</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Single-user Operating Systems (e.g., MS-DOS)</li>
            <li>Multi-user Operating Systems (e.g., Linux, Unix)</li>
            <li>Real-time Operating Systems (RTOS)</li>
            <li>Distributed Operating Systems</li>
            <li>Network Operating Systems</li>
          </ul>
        </section>

        {/* CPU Scheduling */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            CPU Scheduling Algorithms
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">First Come First Serve (FCFS)</h3>
              <p className="text-gray-300">Processes are executed in the order they arrive in the ready queue.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Shortest Job First (SJF)</h3>
              <p className="text-gray-300">Process with the smallest burst time is executed first.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Round Robin</h3>
              <p className="text-gray-300">Each process gets a small unit of CPU time (time quantum), and processes are executed in circular order.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Priority Scheduling</h3>
              <p className="text-gray-300">Processes are executed based on priority values assigned to them.</p>
            </div>
          </div>
        </section>

        {/* Page Replacement */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <HardDrive className="w-6 h-6" />
            Page Replacement Algorithms
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">First In First Out (FIFO)</h3>
              <p className="text-gray-300">Replaces the oldest page in memory when a new page needs to be loaded.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Least Recently Used (LRU)</h3>
              <p className="text-gray-300">Replaces the page that hasn't been used for the longest period.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Optimal Replacement</h3>
              <p className="text-gray-300">Replaces the page that will not be used for the longest period in the future.</p>
            </div>
          </div>
        </section>

        {/* Linux Commands */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            Linux Command Terminal
          </h2>
          <p className="text-gray-300 mb-4">
            Our Linux Command Terminal provides a web-based interface for executing basic Linux commands. Users can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Execute common Linux commands</li>
            <li>View command output in real-time</li>
            <li>Learn about various Linux commands and their usage</li>
            <li>Practice Linux command-line operations in a safe environment</li>
          </ul>
        </section>
      </div>
    </div>
  );
}