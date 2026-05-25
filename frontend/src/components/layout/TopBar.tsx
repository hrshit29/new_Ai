"use client";

import { usePathname, useRouter } from 'next/navigation';

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Simple breadcrumb logic based on pathname
  let breadcrumb = "Home";
  if (pathname.includes('/assignments/create')) {
    breadcrumb = "Create Assignment";
  } else if (pathname.includes('/assignments/')) {
    breadcrumb = "Assignment Details";
  } else if (pathname.includes('/assignments')) {
    breadcrumb = "Assignments";
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        {pathname !== '/assignments' && (
          <button onClick={() => router.back()} className="topbar-back">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
        )}
        <div className="topbar-breadcrumb">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{opacity: 0.5}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          <span className="topbar-breadcrumb-current">{breadcrumb}</span>
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="topbar-icon-btn">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="topbar-notification-dot"></span>
        </button>
        <div className="topbar-user">
          <div className="topbar-avatar">JD</div>
          <span className="topbar-username">John Doe</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{opacity: 0.5}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </header>
  );
}