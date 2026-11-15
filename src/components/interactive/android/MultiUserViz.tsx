import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, User } from 'lucide-react';

// One device, several humans: how Android keeps users and work profiles
// apart with nothing more exotic than Linux UIDs and separate data dirs.

const APP_ID = 10057; // a typical appId for an installed app

export function MultiUserViz() {
  const [workProfile, setWorkProfile] = useState(false);

  const UserCard = ({
    userId,
    title,
    icon: I,
    badge,
    desc,
  }: {
    userId: number;
    title: string;
    icon: typeof User;
    badge?: boolean;
    desc: string;
  }) => {
    const uid = userId * 100000 + APP_ID;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex-1 rounded-xl border-2 border-[#8a7030] bg-[#1c1810] p-3"
      >
        <div className="mb-1 flex items-center gap-2">
          <I size={15} style={{ color: '#d7b155' }} />
          <span className="text-[13px] font-bold" style={{ color: '#f3dc9b' }}>{title}</span>
          <span className="ml-auto font-mono text-[10px]" style={{ color: '#9a874f' }}>userId = {userId}</span>
        </div>
        <div className="mb-2 text-[10.5px] italic" style={{ color: '#8d8268' }}>{desc}</div>

        {/* the same app, inside this user */}
        <div className="rounded-lg border border-[#4a3d1c] bg-[#161208] p-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-[#2a2310] text-[11px]">📝
              {badge && <Briefcase size={9} className="absolute -bottom-1 -right-1 rounded-sm bg-[#d7b155] p-[1px] text-[#1c1810]" />}
            </div>
            <span className="text-[11.5px] font-bold" style={{ color: '#ded4ba' }}>Notes app</span>
            <span className="ml-auto font-mono text-[9.5px]" style={{ color: '#9a874f' }}>appId {APP_ID}</span>
          </div>
          <div className="mt-1.5 space-y-0.5 font-mono text-[9.5px]" style={{ color: '#bda367' }}>
            <div>uid = {userId} × 100000 + {APP_ID} = <span className="font-bold" style={{ color: '#8fd48a' }}>{uid}</span></div>
            <div>data → /data/user/{userId}/com.notes/</div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        One Device, Separate Worlds <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        The same APK, installed once — but each user’s copy runs as a <strong>different Linux UID</strong> with its <strong>own data directory</strong>. The kernel does the separating.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <UserCard userId={0} title="Owner" icon={User} desc="user 0 — the human who set up the device" />
        <AnimatePresence>
          {workProfile && (
            <UserCard
              userId={10}
              title="Work profile"
              icon={Briefcase}
              badge
              desc="a profile user attached to the owner — managed by the company’s admin app"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={() => setWorkProfile((w) => !w)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#6a5624] px-3 py-1.5 text-xs font-bold text-[#d7b155] hover:bg-[#241e0e]"
        >
          <Briefcase size={13} /> {workProfile ? 'Remove the work profile' : 'Add a work profile'}
        </button>
        <span className="text-right text-[10.5px] italic" style={{ color: '#6f6549' }}>
          {workProfile
            ? 'Same code pages shared in RAM — but different uid, different data, different notifications.'
            : 'APK code is installed once and shared; profiles only add data + identity.'}
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-[#4a3d1c] bg-[#161208] px-3 py-2 font-mono text-[10.5px] leading-relaxed" style={{ color: '#bda367' }}>
        adb shell pm list users&nbsp;&nbsp;→&nbsp;&nbsp;UserInfo{'{'}0:Owner{'}'}{workProfile ? '  ·  UserInfo{10:Work profile}' : ''}
      </div>
    </div>
  );
}
