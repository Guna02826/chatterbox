import { Users, Circle } from "lucide-react";

export default function Sidebar({ users, currentUser }) {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h2 className="flex items-center gap-2 text-white font-bold text-lg">
          <Users className="w-5 h-5 text-blue-400" />
          Online Now
          <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded text-xs">
            {users.length}
          </span>
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {users.map((user, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              user === currentUser ? "bg-blue-600/10 text-blue-400" : "hover:bg-slate-800"
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase border border-slate-600">
                {user.charAt(0)}
              </div>
              <Circle className="w-3 h-3 text-green-500 fill-green-500 absolute -bottom-0.5 -right-0.5 border-2 border-slate-900 rounded-full" />
            </div>
            <span className="font-medium truncate">
              {user} {user === currentUser && <span className="text-[10px] opacity-60 ml-1">(You)</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">
            {currentUser.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-bold truncate">{currentUser}</p>
            <p className="text-slate-500 text-xs truncate">Active Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}
