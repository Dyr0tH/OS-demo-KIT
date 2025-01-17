import React, { useState } from 'react';
import { Lock, Play, Plus, Minus, RefreshCw, AlertCircle } from 'lucide-react';
import Navigation from './Navigation';

interface Process {
  id: string;
  allocation: number[];
  max: number[];
  need?: number[];
}

interface ResourceAllocationNode {
  id: string;
  type: 'process' | 'resource';
  x: number;
  y: number;
}

interface ResourceAllocationEdge {
  from: string;
  to: string;
  type: 'request' | 'allocation';
}

export default function DeadlockPage() {
  // Banker's Algorithm State
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P0', allocation: [0, 1, 0], max: [7, 5, 3] },
    { id: 'P1', allocation: [2, 0, 0], max: [3, 2, 2] },
    { id: 'P2', allocation: [3, 0, 2], max: [9, 0, 2] },
  ]);
  const [available, setAvailable] = useState<number[]>([3, 3, 2]);
  const [bankerResult, setBankerResult] = useState<{
    safe: boolean;
    sequence?: string[];
    steps?: string[];
  } | null>(null);

  // Resource Allocation Graph State
  const [nodes, setNodes] = useState<ResourceAllocationNode[]>([
    { id: 'P1', type: 'process', x: 100, y: 100 },
    { id: 'P2', type: 'process', x: 300, y: 100 },
    { id: 'R1', type: 'resource', x: 200, y: 200 },
    { id: 'R2', type: 'resource', x: 400, y: 200 },
  ]);
  const [edges, setEdges] = useState<ResourceAllocationEdge[]>([
    { from: 'P1', to: 'R1', type: 'request' },
    { from: 'R1', to: 'P2', type: 'allocation' },
    { from: 'P2', to: 'R2', type: 'request' },
  ]);

  // Banker's Algorithm Implementation
  const runBankersAlgorithm = () => {
    const work = [...available];
    const finish = new Array(processes.length).fill(false);
    const safeSequence: string[] = [];
    const steps: string[] = [];

    const calculateNeed = () => {
      return processes.map(p => ({
        ...p,
        need: p.max.map((m, i) => m - p.allocation[i])
      }));
    };

    const processesWithNeed = calculateNeed();

    let found;
    do {
      found = false;
      for (let i = 0; i < processesWithNeed.length; i++) {
        if (!finish[i] && processesWithNeed[i].need!.every((n, j) => n <= work[j])) {
          steps.push(`Allocating resources to ${processesWithNeed[i].id}`);
          work.forEach((w, j) => work[j] += processesWithNeed[i].allocation[j]);
          finish[i] = true;
          safeSequence.push(processesWithNeed[i].id);
          found = true;
          steps.push(`Resources available after ${processesWithNeed[i].id}: [${work.join(', ')}]`);
        }
      }
    } while (found);

    const safe = finish.every(f => f);
    setBankerResult({ safe, sequence: safe ? safeSequence : undefined, steps });
  };

  // Resource Allocation Graph Implementation
  const checkForDeadlock = () => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter(e => e.from === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.to)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    const processNodes = nodes.filter(n => n.type === 'process');
    for (const node of processNodes) {
      if (hasCycle(node.id)) return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-4xl font-bold text-center mb-12">Deadlock Avoidance Algorithms</h1>

        {/* Banker's Algorithm Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Banker's Algorithm
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-xl font-medium mb-4">Resources</h3>
              
              {/* Available Resources */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Available Resources</label>
                <div className="flex gap-2">
                  {available.map((value, index) => (
                    <input
                      key={index}
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newAvailable = [...available];
                        newAvailable[index] = parseInt(e.target.value) || 0;
                        setAvailable(newAvailable);
                      }}
                      className="w-20 bg-gray-700 rounded px-3 py-2"
                    />
                  ))}
                </div>
              </div>

              {/* Processes */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Processes</h3>
                  <button
                    onClick={() => {
                      const newId = `P${processes.length}`;
                      setProcesses([...processes, {
                        id: newId,
                        allocation: [0, 0, 0],
                        max: [0, 0, 0]
                      }]);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {processes.map((process, pIndex) => (
                    <div key={pIndex} className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{process.id}</span>
                        <button
                          onClick={() => {
                            const newProcesses = processes.filter((_, i) => i !== pIndex);
                            setProcesses(newProcesses);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Allocation</label>
                          <div className="flex gap-2">
                            {process.allocation.map((value, index) => (
                              <input
                                key={index}
                                type="number"
                                value={value}
                                onChange={(e) => {
                                  const newProcesses = [...processes];
                                  newProcesses[pIndex].allocation[index] = parseInt(e.target.value) || 0;
                                  setProcesses(newProcesses);
                                }}
                                className="w-16 bg-gray-600 rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Max Need</label>
                          <div className="flex gap-2">
                            {process.max.map((value, index) => (
                              <input
                                key={index}
                                type="number"
                                value={value}
                                onChange={(e) => {
                                  const newProcesses = [...processes];
                                  newProcesses[pIndex].max[index] = parseInt(e.target.value) || 0;
                                  setProcesses(newProcesses);
                                }}
                                className="w-16 bg-gray-600 rounded px-2 py-1"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={runBankersAlgorithm}
                className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4" /> Run Algorithm
              </button>
            </div>

            {/* Results Section */}
            {bankerResult && (
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Results</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${bankerResult.safe ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {bankerResult.safe ? (
                        <span className="text-green-400">System is in safe state</span>
                      ) : (
                        <span className="text-red-400">System is in unsafe state</span>
                      )}
                    </div>
                    {bankerResult.sequence && (
                      <div>
                        <span className="font-medium">Safe Sequence: </span>
                        {bankerResult.sequence.join(' → ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Execution Steps:</h4>
                    <div className="bg-gray-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      {bankerResult.steps?.map((step, index) => (
                        <div key={index} className="mb-2 text-sm">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resource Allocation Graph Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <RefreshCw className="w-6 h-6" />
            Resource Allocation Graph
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graph Visualization */}
            <div className="bg-gray-900 rounded-lg p-4" style={{ height: '400px' }}>
              <svg width="100%" height="100%" viewBox="0 0 500 300">
                {/* Draw edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isRequest = edge.type === 'request';
                  return (
                    <g key={index}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isRequest ? '#60A5FA' : '#34D399'}
                        strokeWidth="2"
                        markerEnd={isRequest ? 'url(#arrowRequest)' : 'url(#arrowAllocation)'}
                      />
                    </g>
                  );
                })}

                {/* Draw nodes */}
                {nodes.map((node, index) => (
                  <g key={index}>
                    {node.type === 'process' ? (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        fill="#1F2937"
                        stroke="#60A5FA"
                        strokeWidth="2"
                      />
                    ) : (
                      <rect
                        x={node.x - 20}
                        y={node.y - 20}
                        width="40"
                        height="40"
                        fill="#1F2937"
                        stroke="#34D399"
                        strokeWidth="2"
                      />
                    )}
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dy=".3em"
                      fill="white"
                      fontSize="12"
                    >
                      {node.id}
                    </text>
                  </g>
                ))}

                {/* Arrow markers */}
                <defs>
                  <marker
                    id="arrowRequest"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#60A5FA" />
                  </marker>
                  <marker
                    id="arrowAllocation"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#34D399" />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* Graph Analysis */}
            <div className="space-y-6">
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Deadlock Analysis</h3>
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <p className="font-medium">
                      {checkForDeadlock() ? (
                        <span className="text-red-400">Deadlock Detected</span>
                      ) : (
                        <span className="text-green-400">No Deadlock Present</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      {checkForDeadlock()
                        ? "There is at least one circular wait in the system"
                        : "No circular wait conditions found"
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Legend</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400"></div>
                    <span>Process Node</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-green-400"></div>
                    <span>Resource Node</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-0.5 bg-blue-400"></div>
                    <span>Request Edge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-0.5 bg-green-400"></div>
                    <span>Allocation Edge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}