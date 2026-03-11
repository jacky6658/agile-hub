import { useState } from 'react';
import { Plus, Calendar, User, AlertTriangle, ChevronLeft, ChevronRight, KeyRound, Shield, UserPlus } from 'lucide-react';
import type { Project, Member, StandupNote, AuthUser } from '../types';
import MemberAvatar from '../components/MemberAvatar';

interface TeamPageProps {
  project: Project | null;
  members: Member[];
  standups: StandupNote[];
  onStandupCreate: (data: Partial<StandupNote>) => void;
  onMemberCreate: (data: Partial<Member>) => void;
  authUser: AuthUser | null;
  onRefreshMembers: () => void;
}

export default function TeamPage({ project, members, standups, onStandupCreate, onMemberCreate, authUser, onRefreshMembers }: TeamPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewMember, setShowNewMember] = useState(false);
  const [newMember, setNewMember] = useState({ display_name: '', email: '', password: '', role: 'member' });
  const [showNewStandup, setShowNewStandup] = useState(false);
  const [newStandup, setNewStandup] = useState({ member_id: 0, yesterday: '', today: '', blockers: '' });
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [adminMsg, setAdminMsg] = useState('');
  const [adminError, setAdminError] = useState('');

  const isAdmin = authUser?.role === 'admin';
  const todayStandups = standups.filter(s => s.date === selectedDate);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const getToken = () => localStorage.getItem('agile_hub_token') || '';

  // Admin: 建立新帳號（含密碼）
  const handleCreateMember = async () => {
    if (!newMember.display_name.trim()) return;
    setAdminMsg('');
    setAdminError('');

    if (isAdmin && newMember.password) {
      // 使用 admin API（含密碼）
      try {
        const res = await fetch('/api/admin/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(newMember),
        });
        const data = await res.json();
        if (!res.ok) { setAdminError(data.error || '建立失敗'); return; }
        setAdminMsg(`已建立帳號：${data.display_name}`);
        onRefreshMembers();
      } catch { setAdminError('無法連線到伺服器'); return; }
    } else {
      // 舊版無密碼建立
      onMemberCreate(newMember);
    }
    setNewMember({ display_name: '', email: '', password: '', role: 'member' });
    setShowNewMember(false);
  };

  // Admin: 重設密碼
  const handleResetPassword = async () => {
    if (!resetPasswordId || !resetPassword) return;
    setAdminMsg('');
    setAdminError('');
    try {
      const res = await fetch(`/api/admin/members/${resetPasswordId}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ newPassword: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setAdminError(data.error || '重設失敗'); return; }
      setAdminMsg(data.message);
    } catch { setAdminError('無法連線到伺服器'); }
    setResetPasswordId(null);
    setResetPassword('');
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
          {isAdmin && (
            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Shield size={12} /> 管理員
            </span>
          )}
          <button onClick={() => { setShowNewMember(true); setAdminMsg(''); setAdminError(''); }} className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            <UserPlus size={14} /> 新增成員
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

              {/* 訊息提示 */}
              {adminMsg && (
                <div className="mb-3 px-3 py-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg">{adminMsg}</div>
              )}
              {adminError && (
                <div className="mb-3 px-3 py-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">{adminError}</div>
              )}

              {/* New member form */}
              {showNewMember && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg space-y-2">
                  <input
                    type="text"
                    placeholder="顯示名稱 *"
                    value={newMember.display_name}
                    onChange={e => setNewMember(m => ({ ...m, display_name: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newMember.email}
                    onChange={e => setNewMember(m => ({ ...m, email: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isAdmin && (
                    <>
                      <input
                        type="password"
                        placeholder="登入密碼 *（至少 6 字元）"
                        value={newMember.password}
                        onChange={e => setNewMember(m => ({ ...m, password: e.target.value }))}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={newMember.role}
                        onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="member">Member（一般成員）</option>
                        <option value="admin">Admin（管理員）</option>
                      </select>
                    </>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowNewMember(false)} className="px-2 py-1 text-xs text-slate-500">取消</button>
                    <button onClick={handleCreateMember} className="px-2 py-1 text-xs text-white bg-blue-600 rounded-lg">建立帳號</button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {members.map(member => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50">
                      <MemberAvatar member={member} showName />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${member.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                          {member.role === 'admin' ? 'Admin' : 'Member'}
                        </span>
                        {isAdmin && member.id !== authUser?.id && (
                          <button
                            onClick={() => { setResetPasswordId(resetPasswordId === member.id ? null : member.id); setResetPassword(''); setAdminMsg(''); setAdminError(''); }}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="重設密碼"
                          >
                            <KeyRound size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* 重設密碼表單 */}
                    {isAdmin && resetPasswordId === member.id && (
                      <div className="mx-3 mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700 mb-1.5">重設 {member.display_name} 的密碼</p>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            placeholder="新密碼（至少 6 字元）"
                            value={resetPassword}
                            onChange={e => setResetPassword(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button onClick={() => setResetPasswordId(null)} className="px-2 py-1 text-xs text-slate-500">取消</button>
                          <button onClick={handleResetPassword} className="px-2 py-1 text-xs text-white bg-amber-600 rounded-lg">確認</button>
                        </div>
                      </div>
                    )}
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
