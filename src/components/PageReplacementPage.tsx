import React, { useState } from 'react';
import { Terminal, RefreshCw, BarChart } from 'lucide-react';
import Navigation from './Navigation';

interface FrameState {
  pageNumber: number | null;
  isHit: boolean;
  isNew: boolean;
}

export default function PageReplacementPage() {
  const [referenceString, setReferenceString] = useState<string>('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1');
  const [frameCount, setFrameCount] = useState<number>(3);
  const [algorithm, setAlgorithm] = useState<'fifo' | 'lru' | 'optimal'>('fifo');
  const [frames, setFrames] = useState<FrameState[][]>([]);
  const [statistics, setStatistics] = useState({ hits: 0, faults: 0 });

  const parseReferenceString = (str: string): number[] => {
    return str.trim().split(/\s+/).map(Number);
  };

  const runFIFO = (pages: number[], frameCount: number) => {
    const frames: FrameState[][] = [];
    const queue: number[] = [];
    let hits = 0;
    let currentFrame: FrameState[] = Array(frameCount).fill({ pageNumber: null, isHit: false, isNew: false });
    frames.push([...currentFrame]);

    pages.forEach((page) => {
      const newFrame = [...currentFrame];
      if (queue.includes(page)) {
        hits++;
        newFrame[queue.indexOf(page)] = { pageNumber: page, isHit: true, isNew: false };
      } else {
        if (queue.length < frameCount) {
          queue.push(page);
          newFrame[queue.length - 1] = { pageNumber: page, isHit: false, isNew: true };
        } else {
          const removedPage = queue.shift();
          queue.push(page);
          newFrame[queue.length - 1] = { pageNumber: page, isHit: false, isNew: true };
        }
      }
      currentFrame = newFrame;
      frames.push([...newFrame]);
    });

    return { frames, statistics: { hits, faults: pages.length - hits } };
  };

  const runLRU = (pages: number[], frameCount: number) => {
    const frames: FrameState[][] = [];
    const queue: number[] = [];
    let hits = 0;
    let currentFrame: FrameState[] = Array(frameCount).fill({ pageNumber: null, isHit: false, isNew: false });
    frames.push([...currentFrame]);

    pages.forEach((page) => {
      const newFrame = [...currentFrame];
      if (queue.includes(page)) {
        hits++;
        const index = queue.indexOf(page);
        queue.splice(index, 1);
        queue.push(page);
        newFrame[index] = { pageNumber: page, isHit: true, isNew: false };
      } else {
        if (queue.length < frameCount) {
          queue.push(page);
          newFrame[queue.length - 1] = { pageNumber: page, isHit: false, isNew: true };
        } else {
          queue.shift();
          queue.push(page);
          newFrame[queue.indexOf(page)] = { pageNumber: page, isHit: false, isNew: true };
        }
      }
      currentFrame = newFrame;
      frames.push([...newFrame]);
    });

    return { frames, statistics: { hits, faults: pages.length - hits } };
  };

  const runOptimal = (pages: number[], frameCount: number) => {
    const frames: FrameState[][] = [];
    const memory: number[] = [];
    let hits = 0;
    let currentFrame: FrameState[] = Array(frameCount).fill({ pageNumber: null, isHit: false, isNew: false });
    frames.push([...currentFrame]);

    const findFurthest = (pages: number[], memory: number[], startIndex: number): number => {
      let furthest = -1;
      let furthestIndex = -1;

      memory.forEach((page, index) => {
        const nextIndex = pages.indexOf(page, startIndex);
        if (nextIndex === -1) {
          return index;
        }
        if (nextIndex > furthestIndex) {
          furthestIndex = nextIndex;
          furthest = index;
        }
      });

      return furthest === -1 ? 0 : furthest;
    };

    pages.forEach((page, index) => {
      const newFrame = [...currentFrame];
      if (memory.includes(page)) {
        hits++;
        newFrame[memory.indexOf(page)] = { pageNumber: page, isHit: true, isNew: false };
      } else {
        if (memory.length < frameCount) {
          memory.push(page);
          newFrame[memory.length - 1] = { pageNumber: page, isHit: false, isNew: true };
        } else {
          const replaceIndex = findFurthest(pages, memory, index + 1);
          memory[replaceIndex] = page;
          newFrame[replaceIndex] = { pageNumber: page, isHit: false, isNew: true };
        }
      }
      currentFrame = newFrame;
      frames.push([...newFrame]);
    });

    return { frames, statistics: { hits, faults: pages.length - hits } };
  };

  const runAlgorithm = () => {
    const pages = parseReferenceString(referenceString);
    let result;

    switch (algorithm) {
      case 'fifo':
        result = runFIFO(pages, frameCount);
        break;
      case 'lru':
        result = runLRU(pages, frameCount);
        break;
      case 'optimal':
        result = runOptimal(pages, frameCount);
        break;
    }

    setFrames(result.frames);
    setStatistics(result.statistics);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <h1 className="text-4xl font-bold text-center mb-12">Page Replacement Algorithms</h1>

        {/* Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Reference String</label>
              <input
                type="text"
                value={referenceString}
                onChange={(e) => setReferenceString(e.target.value)}
                className="w-full bg-gray-700 rounded px-3 py-2"
                placeholder="Enter space-separated numbers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Frame Count</label>
              <input
                type="number"
                value={frameCount}
                onChange={(e) => setFrameCount(parseInt(e.target.value))}
                className="w-full bg-gray-700 rounded px-3 py-2"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'fifo' | 'lru' | 'optimal')}
                className="w-full bg-gray-700 rounded px-3 py-2"
              >
                <option value="fifo">First In First Out (FIFO)</option>
                <option value="lru">Least Recently Used (LRU)</option>
                <option value="optimal">Optimal</option>
              </select>
            </div>
          </div>
          <button
            onClick={runAlgorithm}
            className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Run Algorithm
          </button>
        </div>

        {/* Visualization */}
        {frames.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Memory State Visualization</h2>
            <div className="overflow-x-auto">
              <div className="inline-flex gap-2">
                {frames.map((frame, timeIndex) => (
                  <div key={timeIndex} className="flex flex-col items-center">
                    {frame.map((state, frameIndex) => (
                      <div
                        key={frameIndex}
                        className={`w-12 h-12 border ${
                          state.isHit
                            ? 'border-green-500 bg-green-500/20'
                            : state.isNew
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-gray-600 bg-gray-700'
                        } flex items-center justify-center mb-1`}
                      >
                        {state.pageNumber !== null ? state.pageNumber : '-'}
                      </div>
                    ))}
                    <div className="text-xs text-gray-400 mt-1">T{timeIndex}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        {frames.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Hit/Miss Ratio</h3>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(statistics.hits / (statistics.hits + statistics.faults)) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-green-500">Hits: {statistics.hits}</span>
                  <span className="mx-2">|</span>
                  <span className="text-red-500">Faults: {statistics.faults}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Hit Rate</h3>
                <div className="text-4xl font-bold">
                  {((statistics.hits / (statistics.hits + statistics.faults)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}