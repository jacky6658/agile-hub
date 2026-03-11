import type { Member } from '../types';

interface MemberAvatarProps {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizeMap = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const colors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500'
];

export default function MemberAvatar({ member, size = 'md', showName = false }: MemberAvatarProps) {
  const colorIndex = member.id % colors.length;

  return (
    <div className="flex items-center gap-2">
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={member.display_name}
          className={`${sizeMap[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeMap[size]} ${colors[colorIndex]} rounded-full text-white flex items-center justify-center font-medium`}>
          {member.display_name.charAt(0).toUpperCase()}
        </div>
      )}
      {showName && <span className="text-sm text-slate-700">{member.display_name}</span>}
    </div>
  );
}
