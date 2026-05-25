"use client";

import Link from 'next/link';

export default function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      marginTop: '40px'
    }}>
      <div style={{ position: 'relative', width: '240px', height: '240px', marginBottom: '24px' }}>
        {/* Placeholder SVG matching the design */}
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" r="100" fill="#F3F4F6" />
          <path d="M120 40H80C68.9543 40 60 48.9543 60 60V180C60 191.046 68.9543 200 80 200H160C171.046 200 180 191.046 180 180V100L120 40Z" fill="white" />
          <path d="M120 40V100H180" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="85" y1="90" x2="115" y2="90" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <line x1="85" y1="120" x2="155" y2="120" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          <line x1="85" y1="150" x2="155" y2="150" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          <line x1="85" y1="180" x2="135" y2="180" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          
          <circle cx="150" cy="140" r="40" fill="#E8613C" fillOpacity="0.1" stroke="#E8613C" strokeWidth="6" />
          <path d="M178 168L210 200" stroke="#E8613C" strokeWidth="12" strokeLinecap="round" />
          <path d="M135 125L165 155M165 125L135 155" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
          
          <path d="M40 80C50 80 50 60 60 60" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
        No assignments yet
      </h2>
      
      <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '32px' }}>
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      
      <Link href="/assignments/create" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '12px 28px', backgroundColor: '#1A1A1A' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Create Your First Assignment
      </Link>
    </div>
  );
}
