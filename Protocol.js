import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  History, 
  Flame, 
  AlertTriangle, 
  Brain, 
  Dumbbell, 
  Code2, 
  PenTool, 
  X,
  ShieldAlert,
  Plus,
  Trash2,
  Target
} from 'lucide-react';

// --- DATA & CONFIG ---

const PROTOCOL_CONFIG = {
  duration: 30, // days
  tasks: {
    focus: { id: 'focus', label: 'Focus Block', sub: 'One task. Phone away.', duration: 60, icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    body: { id: 'body', label: 'Body Discipline', sub: 'Run / Gym / Calisthenics', duration: 30, icon: Dumbbell, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    skill: { id: 'skill', label: 'Skill Block', sub: 'Theory / CS Core / Systems', duration: 45, icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  },
  mantras: [
    "Mood is irrelevant.",
    "I am the kind of person who finishes what he starts.",
    "Consistency > Intensity.",
    "Never miss twice.",
    "You are not allowed to negotiate with yourself."
  ]
};

// --- COMPONENTS ---

const Header = ({ streak, warning }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/10 mb-8 gap-4">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
        THE PROTOCOL <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400">V2.3</span>
      </h1>
      <p className="text-gray-500 text-sm mt-1 font-mono uppercase tracking-widest">
        Dec 17, 2025 — May 17, 2026
      </p>
    </div>
    
    <div className="flex items-center gap-4">
      {warning && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-bold animate-pulse">
          <ShieldAlert size={16} />
          <span>EMERGENCY PROTOCOL</span>
        </div>
      )}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded border border-white/5">
        <Flame className={streak > 0 ? "text-orange-500" : "text-gray-600"} size={18} />
        <span className="text-white font-mono font-bold">{streak} DAY STREAK</span>
      </div>
    </div>
  </header>
);

const TimerModal = ({ isOpen, onClose, task, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(task ? task.duration * 60 : 0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    if (isOpen && task) {
      setTimeLeft(task.duration * 60);
      setIsActive(false);
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((task.duration * 60 - timeLeft) / (task.duration * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center space-y-8">
          <div>
            <task.icon className={`w-12 h-12 mx-auto mb-4 ${task.color}`} />
            <h2 className="text-2xl font-bold text-white">{task.label}</h2>
            <p className="text-gray-400 mt-2">Rule: {task.sub}</p>
          </div>

          <div className="text-7xl font-mono font-bold text-white tracking-tighter">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`p-6 rounded-full transition-all ${isActive ? 'bg-zinc-800 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimeLeft(task.duration * 60); }}
              className="p-6 rounded-full bg-zinc-800 text-gray-400 hover:text-white transition-all"
            >
              <RotateCcw size={32} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">
            {isActive ? "Execution in progress..." : "Ready to begin"}
          </p>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ taskConfig, isCompleted, onToggle, onOpenTimer }) => {
  const Icon = taskConfig.icon;
  
  return (
    <div 
      className={`relative p-6 rounded-xl border transition-all duration-300 group
        ${isCompleted 
          ? 'bg-zinc-900/50 border-emerald-500/30' 
          : 'bg-zinc-900 border-white/5 hover:border-white/10'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${taskConfig.bg} ${taskConfig.color}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
              {taskConfig.label}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{taskConfig.sub}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-gray-400">
                {taskConfig.duration} MIN
              </span>
              <button 
                onClick={onOpenTimer}
                className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-1"
              >
                <Play size={10} /> LAUNCH TIMER
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onToggle}
          className={`transition-all duration-200 ${isCompleted ? 'text-emerald-500 scale-110' : 'text-zinc-700 hover:text-zinc-500'}`}
        >
          {isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
        </button>
      </div>
    </div>
  );
};

const ChecklistSection = ({ items, onAdd, onToggle, onDelete }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 md:p-8 h-full">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-purple-400" size={24} />
        <div>
          <h2 className="text-xl font-bold text-white">Tactical Plan</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Daily Targets</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add task..."
          className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button 
          onClick={handleAdd}
          className="bg-zinc-800 hover:bg-purple-500/20 hover:text-purple-400 text-white p-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => onToggle(item.id)}
                  className={`transition-colors ${item.completed ? 'text-purple-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span className={`text-sm truncate ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                  {item.text}
                </span>
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-700 text-sm italic">
            No targets set for today.
          </div>
        )}
      </div>
    </div>
  );
};

const JournalSection = ({ data, onChange }) => (
  <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 md:p-8 h-full">
    <div className="flex items-center gap-3 mb-6">
      <PenTool className="text-amber-400" size={24} />
      <div>
        <h2 className="text-xl font-bold text-white">Night Closure</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Debrief</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-mono uppercase text-gray-500">What I did (Facts Only)</label>
        <textarea 
          value={data.facts || ''}
          onChange={(e) => onChange('facts', e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors h-20 resize-none"
          placeholder="Studied 45m. Ran 3km..."
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-mono uppercase text-gray-500">What I Avoided</label>
        <textarea 
          value={data.avoided || ''}
          onChange={(e) => onChange('avoided', e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-rose-500 transition-colors h-20 resize-none"
          placeholder="No Reels. No sugar..."
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-mono uppercase text-gray-500">Improvement for Tomorrow</label>
        <textarea 
          value={data.better || ''}
          onChange={(e) => onChange('better', e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition-colors h-20 resize-none"
          placeholder="Start 15 mins earlier..."
        />
      </div>
    </div>
  </div>
);

const CalendarGrid = ({ history }) => {
  // Generate dates from Dec 17, 2025 to May 17, 2026
  const startDate = new Date('2025-12-17');
  const endDate = new Date('2026-05-17');
  const days = [];
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getStatusColor = (dateObj) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    const entry = history[dateStr];
    
    // Check if it's today (for border highlight)
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    const isPast = dateObj < new Date(); // If date is in the past and no entry -> Failed

    if (!entry) {
        return isToday ? 'border-white bg-transparent' : 'bg-zinc-800/30'; 
    }

    const completedCount = ['focus', 'body', 'skill'].filter(k => entry[k]).length;
    
    if (completedCount === 3) return 'bg-emerald-500 shadow-emerald-500/20 shadow-lg'; // All 3 done
    if (completedCount >= 1) return 'bg-yellow-600'; // Partial
    return 'bg-red-900/50'; // Failed (0 done but entry exists)
  };

  // Group by Month for labels
  const months = {};
  days.forEach(d => {
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!months[key]) months[key] = [];
    months[key].push(d);
  });

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="text-blue-400" size={24} />
          <div>
            <h2 className="text-xl font-bold text-white">The Campaign</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Dec 2025 - May 2026</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-gray-500 font-mono hidden md:flex">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-800/30 rounded-sm"></div> FUTURE</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-600 rounded-sm"></div> GRIND</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> PERFECT</div>
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.entries(months).map(([monthName, monthDays]) => (
            <div key={monthName} className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-white/5 pb-4 last:border-0">
                <div className="w-20 text-xs font-mono text-gray-500 uppercase shrink-0">{monthName}</div>
                <div className="flex flex-wrap gap-1.5">
                    {monthDays.map(d => {
                        const dateStr = d.toISOString().split('T')[0];
                        return (
                        <div 
                            key={dateStr}
                            className={`w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all relative group border border-transparent ${getStatusColor(d)}`}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none">
                                {dateStr}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({
    focus: false,
    body: false,
    skill: false,
    checklist: [], 
    journal: { facts: '', avoided: '', better: '' }
  });
  const [history, setHistory] = useState({});
  const [activeTimerTask, setActiveTimerTask] = useState(null);
  const [streak, setStreak] = useState(0);
  const [emergency, setEmergency] = useState(false);
  const [randomMantra, setRandomMantra] = useState(PROTOCOL_CONFIG.mantras[0]);

  // Load Data
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('protocol_history') || '{}');
    setHistory(savedHistory);

    const todayEntry = savedHistory[date] || {
      focus: false,
      body: false,
      skill: false,
      checklist: [],
      journal: { facts: '', avoided: '', better: '' }
    };
    setData(todayEntry);

    // Calculate Streak & Emergency Status
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 1);
    const yesterday = tempDate.toISOString().split('T')[0];
    
    // Check yesterday status
    const wasYesterdayPerfect = savedHistory[yesterday] && 
      savedHistory[yesterday].focus && 
      savedHistory[yesterday].body && 
      savedHistory[yesterday].skill;

    const yesterdayEntry = savedHistory[yesterday];
    // Missed if entry exists BUT incomplete
    const missedYesterday = yesterdayEntry && (!yesterdayEntry.focus || !yesterdayEntry.body || !yesterdayEntry.skill);
    
    setEmergency(!!missedYesterday);

    // Simple streak calc
    let currentStreak = 0;
    if (wasYesterdayPerfect) {
      currentStreak = 1;
      let d = new Date();
      d.setDate(d.getDate() - 2);
      while (true) {
        const dStr = d.toISOString().split('T')[0];
        const entry = savedHistory[dStr];
        if (entry && entry.focus && entry.body && entry.skill) {
          currentStreak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
    }
    setStreak(currentStreak);

    setRandomMantra(PROTOCOL_CONFIG.mantras[Math.floor(Math.random() * PROTOCOL_CONFIG.mantras.length)]);
  }, [date]);

  // Save Data
  const saveData = (newData) => {
    setData(newData);
    const newHistory = { ...history, [date]: newData };
    setHistory(newHistory);
    localStorage.setItem('protocol_history', JSON.stringify(newHistory));
  };

  const toggleTask = (taskId) => {
    const newData = { ...data, [taskId]: !data[taskId] };
    saveData(newData);
  };

  const updateJournal = (field, value) => {
    const newData = { ...data, journal: { ...data.journal, [field]: value } };
    saveData(newData);
  };

  // Checklist Handlers
  const addChecklistItem = (text) => {
    const newItem = { id: Date.now(), text, completed: false };
    const newData = { ...data, checklist: [...(data.checklist || []), newItem] };
    saveData(newData);
  };

  const toggleChecklistItem = (id) => {
    const newChecklist = (data.checklist || []).map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    const newData = { ...data, checklist: newChecklist };
    saveData(newData);
  };

  const deleteChecklistItem = (id) => {
    const newChecklist = (data.checklist || []).filter(item => item.id !== id);
    const newData = { ...data, checklist: newChecklist };
    saveData(newData);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        
        <Header streak={streak} warning={emergency} />

        {/* MANTRA BANNER */}
        <div className="bg-zinc-900/50 border-l-4 border-indigo-500 p-4 mb-8 rounded-r-lg">
          <p className="text-indigo-200 italic font-serif text-lg">"{randomMantra}"</p>
        </div>

        {/* CORE TASKS GRID (Now 3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.values(PROTOCOL_CONFIG.tasks).map(task => (
            <TaskCard 
              key={task.id}
              taskConfig={task}
              isCompleted={data[task.id]}
              onToggle={() => toggleTask(task.id)}
              onOpenTimer={() => setActiveTimerTask(task)}
            />
          ))}
        </div>

        {/* JOURNAL & CHECKLIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChecklistSection 
            items={data.checklist} 
            onAdd={addChecklistItem}
            onToggle={toggleChecklistItem}
            onDelete={deleteChecklistItem}
          />
          <JournalSection data={data.journal} onChange={updateJournal} />
        </div>

        {/* CALENDAR */}
        <div className="mb-8">
          <CalendarGrid history={history} />
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-zinc-600 text-xs font-mono uppercase tracking-widest">
          The Protocol is Absolute.<br/>
          Built for the Comeback.
        </div>

      </div>

      {/* MODALS */}
      <TimerModal 
        isOpen={!!activeTimerTask} 
        onClose={() => setActiveTimerTask(null)} 
        task={activeTimerTask}
        onComplete={() => {
          if(activeTimerTask) toggleTask(activeTimerTask.id);
        }}
      />
    </div>
  );
};

export default App;
