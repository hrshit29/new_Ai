"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssignmentStore } from '../../store/assignmentStore';

export default function Sidebar() {
  const pathname = usePathname();
  const assignments = useAssignmentStore(state => state.assignments);

  const navItems = [
    { label: 'Home', href: '/home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'My Groups', href: '/groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Assignments', href: '/assignments', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'AI Teacher\'s Toolkit', href: '/ai-toolkit', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'My Library', href: '/library', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">V</div>
        <div className="sidebar-logo-text">
          Veda<span>AI</span>
        </div>
      </div>
      
      <Link href="/assignments/create" className="sidebar-create-btn">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: 16, height: 16}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Create Assignment
      </Link>

      <div className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
              </svg>
              {item.label}
              {item.label === 'Assignments' && assignments.length > 0 && (
                <span className="nav-badge">{assignments.length}</span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-school-card">
          <div className="sidebar-school-avatar">DPS</div>
          <div className="sidebar-school-info">
            <div className="sidebar-school-name">Delhi Public School</div>
            <div className="sidebar-school-location">Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}