'use client';

import { useState } from 'react';
import { Filter, ChevronUp, ChevronDown, X, MessageSquare, LayoutGrid, Table as TableIcon, ExternalLink, RefreshCw, Dices, Brain, Timer, Zap, Hash, Laugh, Meh, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const swatches = [
  { name: "base", cssVar: "--ctp-mocha-base" },
  { name: "mantle", cssVar: "--ctp-mocha-mantle" },
  { name: "crust", cssVar: "--ctp-mocha-crust" },
  { name: "surface0", cssVar: "--ctp-mocha-surface0" },
  { name: "surface1", cssVar: "--ctp-mocha-surface1" },
  { name: "surface2", cssVar: "--ctp-mocha-surface2" },
  { name: "text", cssVar: "--ctp-mocha-text" },
  { name: "subtext1", cssVar: "--ctp-mocha-subtext1" },
  { name: "blue", cssVar: "--ctp-mocha-blue" },
  { name: "mauve", cssVar: "--ctp-mocha-mauve" },
  { name: "green", cssVar: "--ctp-mocha-green" },
  { name: "peach", cssVar: "--ctp-mocha-peach" },
  { name: "red", cssVar: "--ctp-mocha-red" },
];

const FILTER_OPTIONS = ['Qwen3', 'Moonshot', 'Google', 'NVIDIA', 'z', 'DeepSeek'];

// Mock data for the table
const mockModels = [
  {
    id: 'nousresearch/hermes-3-llama-3.1-405b:free',
    name: 'Nous: Hermes 3 405B Instruct (free)',
    prompt: 'how much wood could a woodchuck chuck if a wood chuck could chuck wood?',
    thinkingEnabled: true,
    thinkingBudget: 2048,
    ttft: 1250,
    thinkingDuration: 3200,
    duration: 4500,
    tps: 45.2,
    promptTokens: 25,
    completionTokens: 180,
    cost: 0.000012,
    content: 'A woodchuck would chuck as much wood as a woodchuck could chuck if a woodchuck could chuck wood.'
  },
  {
    id: 'nvidia/nemotron-nano-9b-v2:free',
    name: 'NVIDIA: Nemotron Nano 9B V2 (free)',
    prompt: 'how much wood could a woodchuck chuck if a wood chuck could chuck wood?',
    thinkingEnabled: true,
    thinkingBudget: 100,
    ttft: 890,
    thinkingDuration: 1500,
    duration: 2400,
    tps: 52.8,
    promptTokens: 25,
    completionTokens: 120,
    cost: 0.000008,
    content: 'If a woodchuck could chuck wood, it would chuck approximately 700 pounds of wood.'
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    name: 'NVIDIA: Nemotron 3 Nano 30B A3B (free)',
    prompt: 'how much wood could a woodchuck chuck if a wood chuck could chuck wood?',
    thinkingEnabled: true,
    thinkingBudget: 100,
    ttft: 1100,
    thinkingDuration: 2100,
    duration: 3200,
    tps: 38.5,
    promptTokens: 25,
    completionTokens: 115,
    cost: 0.000009,
    content: 'A woodchuck would chuck about 700 pounds of wood if a woodchuck could chuck wood.'
  },
];

export default function StylesPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>(FILTER_OPTIONS);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'duration', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [rating, setRating] = useState<'funny' | 'not_funny' | undefined>(undefined);
  const [thinkingEnabled, setThinkingEnabled] = useState(true);
  const [thinkingBudget, setThinkingBudget] = useState(2048);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  return (
    <main className="mx-auto max-w-6xl space-y-10 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Styles</h1>
        <p className="text-sm opacity-80">
          Tailwind v4 + Catppuccin (Mocha) sanity-check components.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Header Style (from freellm evaluator)</h2>
        <div className="p-4 bg-mocha-mantle border border-mocha-surface1 rounded-2xl shadow-xl flex-shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-mocha-blue flex items-center gap-2 uppercase tracking-tighter">
              <MessageSquare className="w-6 h-6" />
              Evaluation Lab
            </h2>
            <p className="text-xs text-mocha-subtext1 font-medium mt-1 uppercase tracking-widest opacity-70">
              preliminary evaluation mechanism for a rag pipeline, more features coming soon.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Table Toggle
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Typography</h2>
        <div className="space-y-2 rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-4">
          <div className="text-3xl font-semibold tracking-tight">Heading 1</div>
          <div className="text-xl font-semibold tracking-tight opacity-95">Heading 2</div>
          <p className="text-sm opacity-85">
            Body text with <a className="underline" href="#">
              link
            </a>{" "}
            and <span className="rounded bg-[color:var(--ctp-mocha-surface1)] px-1">inline code</span>.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-lg bg-[color:var(--ctp-mocha-blue)] px-3 py-2 text-sm font-medium text-[color:var(--ctp-mocha-base)]"
            type="button"
          >
            Primary
          </button>
          <button
            className="rounded-lg border border-[color:var(--ctp-mocha-surface2)] bg-[color:var(--ctp-mocha-mantle)] px-3 py-2 text-sm"
            type="button"
          >
            Secondary
          </button>
          <button
            className="rounded-lg border border-[color:var(--ctp-mocha-surface2)] px-3 py-2 text-sm opacity-60"
            disabled
            type="button"
          >
            Disabled
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Inputs</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <div className="opacity-80">Text</div>
            <input
              className="w-full rounded-lg border border-[color:var(--ctp-mocha-surface2)] bg-[color:var(--ctp-mocha-mantle)] px-3 py-2 outline-none focus:border-[color:var(--ctp-mocha-blue)]"
              placeholder="Type here…"
            />
          </label>
          <label className="space-y-2 text-sm">
            <div className="opacity-80">Select</div>
            <select className="w-full rounded-lg border border-[color:var(--ctp-mocha-surface2)] bg-[color:var(--ctp-mocha-mantle)] px-3 py-2 outline-none focus:border-[color:var(--ctp-mocha-blue)]">
              <option>Alpha</option>
              <option>Beta</option>
              <option>Gamma</option>
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Badges</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[color:var(--ctp-mocha-surface1)] px-2 py-1">neutral</span>
          <span className="rounded-full bg-[color:var(--ctp-mocha-green)] px-2 py-1 text-[color:var(--ctp-mocha-base)]">
            success
          </span>
          <span className="rounded-full bg-[color:var(--ctp-mocha-peach)] px-2 py-1 text-[color:var(--ctp-mocha-base)]">
            warning
          </span>
          <span className="rounded-full bg-[color:var(--ctp-mocha-red)] px-2 py-1 text-[color:var(--ctp-mocha-base)]">
            danger
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Cards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-4">
            <div className="text-sm font-semibold">Card title</div>
            <p className="mt-1 text-sm opacity-80">
              Card body content. This validates borders, backgrounds, and spacing.
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-4">
            <div className="text-sm font-semibold">Another card</div>
            <p className="mt-1 text-sm opacity-80">
              Uses Catppuccin variables directly for consistent theme.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Quick Filters</h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2 text-mocha-subtext1">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">Quick Filters:</span>
            </div>
            {FILTER_OPTIONS.map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => toggleFilter(filter)}
                className="rounded-full px-4"
              >
                {filter}
              </Button>
            ))}
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilters([])}
                className="text-mocha-red hover:text-mocha-red/80 ml-2"
              >
                Clear
              </Button>
            )}
          </div>
          {activeFilters.length > 0 && (
            <p className="text-[11px] text-mocha-subtext0 italic ml-1">
              Just the big players are filtered, press clear to include the little guys.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Table View</h2>
        <div className="bg-mocha-mantle border border-mocha-surface1 rounded-xl overflow-hidden">
          <div className="overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-mocha-surface0 z-10">
                <tr className="border-b border-mocha-surface1">
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Model {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider">Prompt</th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider">Thinking</th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider">Budget</th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('ttft')}>
                    <div className="flex items-center gap-1">
                      TTFT {sortConfig.key === 'ttft' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('thinkingDuration')}>
                    <div className="flex items-center gap-1">
                      Thinking Time {sortConfig.key === 'thinkingDuration' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('duration')}>
                    <div className="flex items-center gap-1">
                      Total Time {sortConfig.key === 'duration' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('tps')}>
                    <div className="flex items-center gap-1">
                      TPS {sortConfig.key === 'tps' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('tokenCount')}>
                    <div className="flex items-center gap-1">
                      iTokens {sortConfig.key === 'tokenCount' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                    <div className="flex gap-2 mt-1 text-[9px] font-black opacity-40 tracking-tighter">
                      <span>IN</span>
                      <span className="opacity-30">/</span>
                      <span>OUT</span>
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider cursor-pointer hover:text-mocha-blue" onClick={() => handleSort('cost')}>
                    <div className="flex items-center gap-1">
                      Cost {sortConfig.key === 'cost' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider">Content</th>
                  <th className="p-4 text-xs font-bold text-mocha-overlay2 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mocha-surface1">
                {mockModels.map((model) => (
                  <tr key={model.id} className="hover:bg-mocha-surface0/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-mocha-text">{model.name}</div>
                      <div className="text-[10px] text-mocha-subtext0 font-mono opacity-60">{model.id}</div>
                    </td>
                    <td className="p-4 text-mocha-text max-w-[150px]">
                      <div className="text-xs truncate opacity-70" title={model.prompt}>
                        {model.prompt || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                        model.thinkingEnabled ? "bg-mocha-green/20 text-mocha-green" : "bg-mocha-red/20 text-mocha-red"
                      )}>
                        {model.thinkingEnabled ? 'On' : 'Off'}
                      </span>
                    </td>
                    <td className="p-4 text-mocha-text font-mono text-xs">
                      {model.thinkingBudget}
                    </td>
                    <td className="p-4 text-mocha-text">
                      {model.ttft ? `${model.ttft}ms` : '-'}
                    </td>
                    <td className="p-4 text-mocha-text">
                      {model.thinkingDuration ? `${model.thinkingDuration}ms` : '-'}
                    </td>
                    <td className="p-4 text-mocha-text">
                      {model.duration ? `${(model.duration / 1000).toFixed(2)}s` : '-'}
                    </td>
                    <td className="p-4 text-mocha-text">
                      {model.tps ? `${model.tps.toFixed(1)}` : '-'}
                    </td>
                    <td className="p-4 text-mocha-text">
                      <div className="flex flex-col">
                        <div className="text-xs font-mono">
                          {model.promptTokens || '-'}<span className="mx-1 opacity-30">/</span>{model.completionTokens || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-mocha-text font-mono text-[10px]">
                      {model.cost !== undefined ? `$${model.cost.toFixed(6)}` : '-'}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-mocha-subtext1 line-clamp-2 max-w-md">
                        {model.content || '-'}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-mocha-overlay0 hover:text-mocha-red h-8 w-8 p-0"
                        title="Remove from log"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Full Model Container Card (from freellm evaluator)</h2>
        <div className="w-[400px]">
          <div className="flex flex-col bg-mocha-mantle border border-mocha-surface1 rounded-xl overflow-hidden shadow-lg group/container">
            {/* Header */}
            <div className="p-3 bg-mocha-surface0 border-b border-mocha-surface1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-bold text-mocha-lavender truncate">TNG: DeepSeek R1T Chimera (free)</h3>
                  <a
                    href="#"
                    className="text-mocha-overlay0 hover:text-mocha-blue transition-colors flex-shrink-0"
                    title="View on OpenRouter"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-mocha-overlay0 hover:text-mocha-green transition-colors"
                  title="Re-run prompt for this model"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Try again</span>
                </button>
                <button
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-mocha-overlay0 hover:text-mocha-yellow transition-colors"
                  title="Swap for a random model and re-run"
                >
                  <Dices className="w-3 h-3" />
                  <span>Random other model</span>
                </button>
              </div>
            </div>

            {/* Thinking Slider */}
            <div className="p-4 bg-mocha-surface0/50 border-b border-mocha-surface1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-mocha-mauve rounded border-mocha-surface1 bg-mocha-surface0 cursor-pointer"
                    checked={thinkingEnabled}
                    onChange={(e) => setThinkingEnabled(e.target.checked)}
                    title="Toggle Thinking Mode"
                  />
                  <span className="text-xs font-bold text-mocha-mauve uppercase tracking-wider">Thinking Budget</span>
                </div>
                <span className={`text-3xl font-mono font-bold transition-opacity ${thinkingEnabled ? 'text-mocha-subtext1' : 'text-mocha-overlay0 opacity-50'}`}>
                  {thinkingBudget.toLocaleString()} <span className="text-sm">tokens</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8192"
                step="128"
                value={thinkingBudget}
                onChange={(e) => setThinkingBudget(parseInt(e.target.value))}
                className={`w-full h-3 accent-mocha-mauve cursor-pointer transition-opacity ${thinkingEnabled ? '' : 'opacity-30 pointer-events-none'}`}
                disabled={!thinkingEnabled}
              />
              <div className="flex justify-between mt-2 text-xs text-mocha-overlay0 font-mono font-bold">
                <span>0</span>
                <span>2K</span>
                <span>4K</span>
                <span>6K</span>
                <span>8K</span>
              </div>
            </div>

            {/* Thinking Status Bar */}
            <div className="border-b border-mocha-surface1">
              <button
                onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-mocha-surface0 transition-colors group"
              >
                <div className="flex items-center gap-2 text-mocha-mauve font-black text-sm uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>Thinking</span>
                  {isThinkingExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                <div className="flex gap-4 text-base font-mono font-bold text-mocha-overlay1">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" />
                    15.10s
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" />
                    348 tokens
                  </span>
                </div>
              </button>
              {isThinkingExpanded && (
                <div className="px-4 pb-4 text-xs text-mocha-overlay1 italic whitespace-pre-wrap border-t border-mocha-surface0/50 pt-2 font-mono">
                  Analyzing the prompt structure and determining the best approach to generate a meta-humorous response...
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-4 font-sans text-mocha-text whitespace-pre-wrap min-h-[200px]">
              <div className="space-y-4">
                <p className="italic">
                  "I tried to write a joke so meta it would make Larry David cringe... and now I'm just staring at a mirror arguing with myself about the punchline."
                </p>
                <p>
                  "I was going to tell a self-referential joke, but then I realized... wait, this is it."
                </p>
              </div>
            </div>

            {/* Rating Buttons */}
            <div className="p-4 bg-mocha-surface0/30 border-t border-mocha-surface1 flex flex-row gap-3">
              <button
                onClick={() => setRating(rating === 'funny' ? undefined : 'funny')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-4 transition-all font-black text-xl",
                  rating === 'funny' 
                    ? 'bg-mocha-green border-mocha-green text-mocha-base scale-[1.02] shadow-xl shadow-mocha-green/40' 
                    : 'bg-mocha-surface0 border-mocha-surface1 text-mocha-green hover:border-mocha-green hover:scale-[1.05]',
                  rating && rating !== 'funny' ? 'opacity-20' : ''
                )}
              >
                <Laugh className="w-6 h-6" />
                FUNNY
              </button>
              <button
                onClick={() => setRating(rating === 'not_funny' ? undefined : 'not_funny')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-4 transition-all font-black text-xl",
                  rating === 'not_funny' 
                    ? 'bg-mocha-red border-mocha-red text-mocha-base scale-[1.02] shadow-xl shadow-mocha-red/40' 
                    : 'bg-mocha-surface0 border-mocha-surface1 text-mocha-red hover:border-mocha-red hover:scale-[1.05]',
                  rating && rating !== 'not_funny' ? 'opacity-20' : ''
                )}
              >
                <Meh className="w-6 h-6" />
                NOT FUNNY
              </button>
            </div>

            {/* Performance Metrics */}
            <div className="p-4 bg-mocha-crust border-t border-mocha-surface1 flex flex-wrap gap-x-8 gap-y-4 text-2xl font-bold text-mocha-subtext1">
              <div className="flex items-center gap-3">
                <Timer className="w-8 h-8 text-mocha-blue" />
                <div className="flex flex-col">
                  <span>17.25s</span>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm font-black uppercase tracking-widest text-mocha-overlay0 opacity-80">TTFT: 1487ms</span>
                    <span className="text-sm font-black uppercase tracking-widest text-mocha-mauve opacity-80 flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      THINK: 15.10s
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-mocha-yellow" />
                <span>38.03 TPS</span>
              </div>
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-mocha-green" />
                <div className="flex flex-col">
                  <span className="leading-none">iTokens</span>
                  <div className="flex gap-3 mt-1">
                    <span className="text-sm font-black uppercase tracking-widest text-mocha-overlay0 opacity-80">IN: 92</span>
                    <span className="text-sm font-black uppercase tracking-widest text-mocha-green opacity-80">OUT: 308</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-mocha-lavender font-mono">$</span>
                <span>0.000000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">Color tokens</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {swatches.map((s) => (
            <div
              className="rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-3"
              key={s.name}
            >
              <div
                className="h-10 w-full rounded-lg border border-[color:var(--ctp-mocha-surface2)]"
                style={{ background: `var(${s.cssVar})` }}
              />
              <div className="mt-2 text-xs">
                <div className="font-medium">{s.name}</div>
                <div className="opacity-70">{s.cssVar}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

