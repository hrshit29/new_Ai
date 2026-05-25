"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Assignments', href: '/assignments', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Library', href: '/library', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'AI Toolkit', href: '/ai-toolkit', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 90
      }} className="mobile-only">
        <Link href="/assignments/create" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--color-accent)',
          color: 'white',
          borderRadius: '50%',
          boxShadow: 'var(--shadow-lg)',
          textDecoration: 'none'
        }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </Link>
      </div>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1c1c1c',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '16px 8px 24px',
        zIndex: 100
      }} className="mobile-only">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: isActive ? 'white' : '#6b7280',
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
              </svg>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 500 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <style>{`
        @media (min-width: 768px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
