"use client";

import Link from 'next/link';
import { useAssignmentStore } from '../../store/assignmentStore';

export default function AssignmentCard({ id }: { id: string }) {
  const assignment = useAssignmentStore(state => state.assignments.find(a => a.id === id));
  const deleteAssignment = useAssignmentStore(state => state.deleteAssignment);

  if (!assignment) return null;

  // Format dates
  const assignedDate = new Date(assignment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const dueDate = new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

  return (
    <div className="assignment-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {assignment.title}
        </h3>
        <div style={{ position: 'relative', cursor: 'pointer' }} className="dropdown-trigger">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-tertiary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
          
          {/* Simple CSS-only dropdown for demo */}
          <div className="dropdown-menu" style={{
            position: 'absolute',
            right: 0,
            top: '20px',
            backgroundColor: 'white',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            width: '160px',
            zIndex: 10,
            display: 'none'
          }}>
            <Link href={`/assignments/${assignment.id}`} style={{ display: 'block', padding: '8px 12px', fontSize: '14px', color: 'var(--color-text-primary)', textDecoration: 'none', borderRadius: '4px' }}>
              View Assignment
            </Link>
            <button 
              onClick={(e) => { e.preventDefault(); deleteAssignment(assignment.id); }}
              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '14px', color: 'var(--color-danger)', borderRadius: '4px', cursor: 'pointer', background: 'none', border: 'none' }}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Assigned on : </span>
          {assignedDate}
        </div>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Due : </span>
          {dueDate}
        </div>
      </div>

      {assignment.status === 'generating' && (
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600 }}>
          <div className="spinner spinner-sm" style={{ borderTopColor: 'var(--color-accent)' }}></div>
          Generating AI Paper...
        </div>
      )}

      <style>{`
        .dropdown-trigger:hover .dropdown-menu {
          display: block !important;
        }
        .dropdown-menu a:hover, .dropdown-menu button:hover {
          background-color: var(--color-bg-main);
        }
      `}</style>
    </div>
  );
}
