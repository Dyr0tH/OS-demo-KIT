import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, RefreshCw } from 'lucide-react';
import Navigation from './Navigation';

interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime?: number;
}

export default function SchedulingPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
  ]);
  const [quantum, setQuantum] = useState(2);
  const [activeAlgorithm, setActiveAlgorithm] = useState<string | null>(null);
  const [result, setResult] = useState<{ waitingTime: number; turnaroundTime: number; ganttChart: string[] }>({
    waitingTime: 0,
    turnaroundTime: 0,
    ganttChart: [],
  });

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1, priority: 1 }]);
  };

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const updateProcess = (index: number, field: keyof Process, value: number) => {
    const newProcesses = [...processes];
    newProcesses[index] = { ...newProcesses[index], [field]: value };
    setProcesses(newProcesses);
  };

  // FCFS Algorithm
  const runFCFS = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const ganttChart: string[] = [];

    sortedProcesses.forEach((process) => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }
      totalWaitingTime += currentTime - process.arrivalTime;
      ganttChart.push(...Array(process.burstTime).fill(process.id));
      currentTime += process.burstTime;
      totalTurnaroundTime += currentTime - process.arrivalTime;
    });

    setResult({
      waitingTime: totalWaitingTime / processes.length,
      turnaroundTime: totalTurnaroundTime / processes.length,
      ganttChart,
    });
  };

  // SJF Algorithm
  const runSJF = () => {
    const remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const ganttChart: string[] = [];

    while (remainingProcesses.length > 0) {
      const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
      
      if (availableProcesses.length === 0) {
        currentTime++;
        continue;
      }

      const shortestJob = availableProcesses.reduce((prev, curr) => 
        prev.burstTime < curr.burstTime ? prev : curr
      );

      const index = remainingProcesses.findIndex(p => p.id === shortestJob.id);
      ganttChart.push(shortestJob.id);
      currentTime++;

      if (--remainingProcesses[index].remainingTime! === 0) {
        totalTurnaroundTime += currentTime - shortestJob.arrivalTime;
        totalWaitingTime += currentTime - shortestJob.arrivalTime - shortestJob.burstTime;
        remainingProcesses.splice(index, 1);
      }
    }

    setResult({
      waitingTime: totalWaitingTime / processes.length,
      turnaroundTime: totalTurnaroundTime / processes.length,
      ganttChart,
    });
  };

  // Round Robin Algorithm
  const runRoundRobin = () => {
    const remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const ganttChart: string[] = [];

    while (remainingProcesses.length > 0) {
      const process = remainingProcesses.shift()!;
      
      if (process.arrivalTime <= currentTime) {
        const executeTime = Math.min(quantum, process.remainingTime!);
        ganttChart.push(...Array(executeTime).fill(process.id));
        currentTime += executeTime;
        process.remainingTime! -= executeTime;

        if (process.remainingTime! > 0) {
          remainingProcesses.push(process);
        } else {
          totalTurnaroundTime += currentTime - process.arrivalTime;
          totalWaitingTime += currentTime - process.arrivalTime - process.burstTime;
        }
      } else {
        remainingProcesses.push(process);
        currentTime++;
      }
    }

    setResult({
      waitingTime: totalWaitingTime / processes.length,
      turnaroundTime: totalTurnaroundTime / processes.length,
      ganttChart,
    });
  };

  // Priority Scheduling Algorithm
  const runPriorityScheduling = () => {
    const remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const ganttChart: string[] = [];

    while (remainingProcesses.length > 0) {
      const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
      
      if (availableProcesses.length === 0) {
        currentTime++;
        continue;
      }

      const highestPriority = availableProcesses.reduce((prev, curr) => 
        (prev.priority || 0) < (curr.priority || 0) ? prev : curr
      );

      const index = remainingProcesses.findIndex(p => p.id === highestPriority.id);
      ganttChart.push(highestPriority.id);
      currentTime++;

      if (--remainingProcesses[index].remainingTime! === 0) {
        totalTurnaroundTime += currentTime - highestPriority.arrivalTime;
        totalWaitingTime += currentTime - highestPriority.arrivalTime - highestPriority.burstTime;
        remainingProcesses.splice(index, 1);
      }
    }

    setResult({
      waitingTime: totalWaitingTime / processes.length,
      turnaroundTime: totalTurnaroundTime / processes.length,
      ganttChart,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">

      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <h1 className="text-4xl font-bold text-center mb-12">CPU Scheduling Algorithms</h1>

        {/* Process Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Processes</h2>
            <button
              onClick={addProcess}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              Add Process
            </button>
          </div>

          <div className="space-y-4">
            {processes.map((process, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 items-center">
                <div className="font-semibold">{process.id}</div>
                <input
                  type="number"
                  value={process.arrivalTime}
                  onChange={(e) => updateProcess(index, 'arrivalTime', parseInt(e.target.value))}
                  className="bg-gray-700 rounded px-3 py-2"
                  placeholder="Arrival Time"
                />
                <input
                  type="number"
                  value={process.burstTime}
                  onChange={(e) => updateProcess(index, 'burstTime', parseInt(e.target.value))}
                  className="bg-gray-700 rounded px-3 py-2"
                  placeholder="Burst Time"
                />
                <input
                  type="number"
                  value={process.priority}
                  onChange={(e) => updateProcess(index, 'priority', parseInt(e.target.value))}
                  className="bg-gray-700 rounded px-3 py-2"
                  placeholder="Priority"
                />
                <button
                  onClick={() => removeProcess(index)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithms Section */}
        <div className="space-y-6">
          {/* FCFS */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setActiveAlgorithm(activeAlgorithm === 'fcfs' ? null : 'fcfs')}
            >
              <h2 className="text-xl font-semibold">First Come First Serve (FCFS)</h2>
              {activeAlgorithm === 'fcfs' ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {activeAlgorithm === 'fcfs' && (
              <div className="mt-4">
                <p className="text-gray-300 mb-4">
                  FCFS is the simplest scheduling algorithm. Processes are executed in the order they arrive.
                </p>
                <button
                  onClick={runFCFS}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Run FCFS
                </button>
              </div>
            )}
          </div>

          {/* SJF */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setActiveAlgorithm(activeAlgorithm === 'sjf' ? null : 'sjf')}
            >
              <h2 className="text-xl font-semibold">Shortest Job First (SJF)</h2>
              {activeAlgorithm === 'sjf' ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {activeAlgorithm === 'sjf' && (
              <div className="mt-4">
                <p className="text-gray-300 mb-4">
                  SJF selects the process with the smallest burst time first.
                </p>
                <button
                  onClick={runSJF}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Run SJF
                </button>
              </div>
            )}
          </div>

          {/* Round Robin */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setActiveAlgorithm(activeAlgorithm === 'rr' ? null : 'rr')}
            >
              <h2 className="text-xl font-semibold">Round Robin</h2>
              {activeAlgorithm === 'rr' ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {activeAlgorithm === 'rr' && (
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-4">
                  <label>Time Quantum:</label>
                  <input
                    type="number"
                    value={quantum}
                    onChange={(e) => setQuantum(parseInt(e.target.value))}
                    className="bg-gray-700 rounded px-3 py-2 w-24"
                  />
                </div>
                <p className="text-gray-300 mb-4">
                  Round Robin assigns a fixed time quantum to each process in a circular queue.
                </p>
                <button
                  onClick={runRoundRobin}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Run Round Robin
                </button>
              </div>
            )}
          </div>

          {/* Priority Scheduling */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setActiveAlgorithm(activeAlgorithm === 'priority' ? null : 'priority')}
            >
              <h2 className="text-xl font-semibold">Priority Scheduling</h2>
              {activeAlgorithm === 'priority' ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {activeAlgorithm === 'priority' && (
              <div className="mt-4">
                <p className="text-gray-300 mb-4">
                  Priority scheduling executes processes based on their priority value.
                </p>
                <button
                  onClick={runPriorityScheduling}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Run Priority Scheduling
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result.ganttChart.length > 0 && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Gantt Chart</h3>
                <div className="flex overflow-x-auto">
                  {result.ganttChart.map((id, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-12 h-12 border border-gray-600 flex items-center justify-center bg-gray-700"
                    >
                      {id}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p>Average Waiting Time: {result.waitingTime.toFixed(2)} units</p>
                <p>Average Turnaround Time: {result.turnaroundTime.toFixed(2)} units</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}