import { useState } from 'react';
import { Plus, Calendar, User, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project, Member, StandupNote } from '../types';
import MemberAvatar from '../components/MemberAvatar';

interface TeamPageProps {
  project: Project | null;
  members: Member[];
  standups: StandupNote[];
  onStandupCreate: (data: Partial<StandupNote>) => void;
  onMemberCreate: (data: Partial<Member>) => void;
}

export default function TeamPage({ project, members, standups, onStandupCreate, onMemberCreate }: TeamPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewMember, setShowNewMember] = useState(false);
  const [newMember, setNewMember] = useState({ display_name: '', email: '' });
  const [showNewStandup, setShowNewStandup] = useState(false);
  const [newStandup, setNewStandup] = useState({ member_id: 0, yesterday: '', today: '', blockers: '' });

  const todayStandups = standups.filter(s => s.date === selectedDate);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleCreateMember = () => {
    if (!newMember.display_name.trim()) return;
    onMemberCreate(newMember);
    setNewMember({ display_name: '', email: '' });
    setShowNewMember(false);
  };

  const handleCreateStandup = () => {
    if (!newStandup.member_id) return;
    onStandupCreate({ ...newStandup, project_id: project?.id, date: selectedDate });
    setNewStandup({ member_id: 0, yesterday: '', today: '', blockers: '' });
    setShowNewStandup(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          {project?.icon} 團隊協作
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNewMember(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300">
            <Plus size={14} /> 新成員
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Members Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <User size={16} /> 團隊成員
                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{members.length}</span>
              </h3>

              {/* New member form */}
              {showNewMember && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg space-y-2">
                  <input
                    type="text"
                    placeholder="姓名"
                    value={newMember.display_name}
                    onChange={e => setNewMember(m => ({ ...m, display_name: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={e => setNewMember(m => ({ ...m, email: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowNewMember(false)} className="px-2 py-1 text-xs text-slate-500">取消</button>
                    <button onClick={handleCreateMember} className="px-2 py-1 text-xs text-white bg-blue-600 rounded-lg">新增</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50">
                    <MemberAvatar member={member} showName />
                    <span className="text-xs text-slate-400 capitalize">{member.role}</span>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="text-sm text-slate-400 text-center py-4">尚無成員</div>
                )}
              </div>
            </div>
          </div>

          {/* Standup Notes */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              {/* Date Navigator */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar size={16} /> 站會紀錄
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeDate(-1)} className="p-1 rounded hover:bg-slate-100">
                    <ChevronLeft size={16} className="text-slate-500" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 min-w-[100px] text-center">{selectedDate}</span>
                  <button onClick={() => changeDate(1)} className="p-1 rounded hover:bg-slate-100">
                    <ChevronRight size={16} className="text-slate-500" />
                  </button>
                  <button
                    onClick={() => setShowNewStandup(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-blue-600 rounded-lg ml-2"
                  >
                    <Plus size={12} /> 新增
                  </button>
                </div>
              </div>

              {/* New standup form */}
              {showNewStandup && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-3">
                  <select
                    value={newStandup.member_id}
                    onChange={e => setNewStandup(s => ({ ...s, member_id: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>選擇成員</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.display_name}</option>)}
                  </select>
                  <textarea
                    placeholder="昨天完成..."
                    value={newStandup.yesterday}
                    onChange={e => setNewStandup(s => ({ ...s, yesterday: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <textarea
                    placeholder="今天計畫..."
                    value={newStandup.today}
                    onChange={e => setNewStandup(s => ({ ...s, today: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <textarea
                    placeholder="阻礙 / Blockers..."
                    value={newStandup.blockers}
                    onChange={e => setNewStandup(s => ({ ...s, blockers: e.target.value }))}
                    rows={1}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowNewStandup(false)} className="px-3 py-1.5 text-sm text-slate-600">取消</button>
                    <button onClick={handleCreateStandup} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg">儲存</button>
                  </div>
                </div>
              )}

              {/* Standup List */}
              <div className="space-y-3">
                {todayStandups.map(standup => {
                  const member = members.find(m => m.id === standup.member_id);
                  return (
                    <div key={standup.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {member && <MemberAvatar member={member} size="sm" showName />}
                      </div>
                      {standup.yesterday && (
                        <div className="mb-1.5">
                          <span className="text-xs font-medium text-green-600">✅ 昨天完成：</span>
                          <p className="text-sm text-slate-700 mt-0.5">{standup.yesterday}</p>
                        </div>
                      )}
                      {standup.today && (
                        <div className="mb-1.5">
                          <span className="text-xs font-medium text-blue-600">📋 今天計畫：</span>
                          <p className="text-sm text-slate-700 mt-0.5">{standup.today}</p>
                        </div>
                      )}
                      {standup.blockers && (
                        <div>
                          <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                            <AlertTriangle size={12} /> 阻礙：
                          </span>
                          <p className="text-sm text-slate-700 mt-0.5">{standup.blockers}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
                {todayStandups.length === 0 && (
                  <div className="text-center py-8 text-sm text-slate-400">
                    {selectedDate} 尚無站會紀錄
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
