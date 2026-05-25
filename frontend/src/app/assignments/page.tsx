"use client";

import { useAssignmentStore } from '../../store/assignmentStore';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import EmptyState from '../../components/assignments/EmptyState';

export default function AssignmentsPage() {
  const assignments = useAssignmentStore(state => state.assignments);
  const searchQuery = useAssignmentStore(state => state.searchQuery);
  const setSearchQuery = useAssignmentStore(state => state.setSearchQuery);

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="assignments-page">
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Manage and create assignments for your classes.</p>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '32px',
        background: 'var(--color-bg-card)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '14px', borderRight: '1px solid var(--color-border)', paddingRight: '16px' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Filter By
        </div>
        
        <div className="search-bar" style={{ flex: 1, maxWidth: 'none', border: 'none' }}>
          <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ left: '8px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search Assignment" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              border: 'none', 
              background: 'transparent',
              outline: 'none',
              paddingLeft: '32px',
              fontSize: '14px',
              color: 'var(--color-text-primary)'
            }} 
          />
        </div>
      </div>

      <div className="assignment-grid">
        {filteredAssignments.map(assignment => (
          <AssignmentCard key={assignment.id} id={assignment.id} />
        ))}
      </div>
      
      {filteredAssignments.length === 0 && assignments.length > 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
          No assignments found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
