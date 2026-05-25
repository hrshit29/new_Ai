"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../../store/assignmentStore';

export default function OutputPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const fetchAssignmentDetail = useAssignmentStore(state => state.fetchAssignmentDetail);
  const currentAssignment = useAssignmentStore(state => state.currentAssignment);
  const questionPaper = useAssignmentStore(state => state.questionPaper);
  const generationStatus = useAssignmentStore(state => state.generationStatus);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAssignmentDetail(id);
  }, [id, fetchAssignmentDetail]);

  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined' || !paperRef.current) return;
    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${currentAssignment?.title || 'question_paper'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(paperRef.current).save();
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!currentAssignment || generationStatus === 'idle') {
    return null;
  }

  if (generationStatus === 'generating') {
    return (
      <div className="loading-page">
        <div className="spinner spinner-lg"></div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Generating Question Paper...
        </h2>
        <p className="loading-text">
          Our AI is crafting the perfect questions based on your requirements.
        </p>
      </div>
    );
  }

  if (generationStatus === 'failed') {
    return (
      <div className="loading-page" style={{ color: 'var(--color-danger)' }}>
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Generation Failed</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>We couldn't generate the paper. Please try again.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.push('/assignments/create')}>
          Try Again
        </button>
      </div>
    );
  }

  if (!questionPaper) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="page-header mb-6">
        <button onClick={() => router.back()} className="btn btn-ghost" style={{ paddingLeft: 0 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Assignments
        </button>
      </div>

      <div style={{
        backgroundColor: '#1E1E1E',
        color: 'white',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
            Certainly! Here are customized Question Paper for your CBSE Grade {currentAssignment.grade} {currentAssignment.subject} classes.
          </h2>
        </div>
        <button onClick={handleDownloadPDF} className="btn" style={{ backgroundColor: 'white', color: '#1E1E1E' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download as PDF
        </button>
      </div>

      {/* The actual Paper */}
      <div 
        ref={paperRef}
        style={{
          backgroundColor: 'white',
          padding: '40px 48px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          color: 'black',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ color: '#22c55e' }}>▶</span> {questionPaper.schoolName}
          </h1>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            Subject: {questionPaper.subject}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            Class: {questionPaper.grade}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '24px', borderBottom: '2px solid black', paddingBottom: '16px' }}>
          <div>Time Allowed: {questionPaper.timeAllowed} minutes</div>
          <div>Maximum Marks: {questionPaper.maxMarks}</div>
        </div>

        <div style={{ marginBottom: '24px', fontStyle: 'italic', fontSize: '14px' }}>
          {questionPaper.generalInstructions}
        </div>

        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="student-field">Name: <span></span></div>
          <div className="student-field">Roll Number: <span></span></div>
          <div className="student-field">Class: {questionPaper.grade} Section: <span></span></div>
        </div>

        {questionPaper.sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '40px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              {section.title}
            </h3>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{section.sectionType}</div>
            <div style={{ fontStyle: 'italic', fontSize: '14px', marginBottom: '20px', color: '#4b5563' }}>
              {section.instruction}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 600, width: '24px' }}>{q.number}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline' }}>
                      <span className={`difficulty-badge diff-${q.difficulty.toLowerCase()}`}>
                        [{q.difficulty}]
                      </span>{' '}
                      {q.text}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>[{q.marks} Marks]</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', fontWeight: 700, marginTop: '48px', borderTop: '2px solid black', paddingTop: '16px' }}>
          End of Question Paper
        </div>

        {/* Answer Key */}
        <div style={{ marginTop: '48px', pageBreakBefore: 'always' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Answer Key:</h3>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questionPaper.sections.flatMap(s => s.questions).map(q => (
              <li key={q.number} style={{ fontSize: '14px', lineHeight: 1.6 }}>
                {q.answer}
              </li>
            ))}
          </ol>
        </div>

      </div>

      <style>{`
        .mb-6 { margin-bottom: 24px; }
        .mt-4 { margin-top: 16px; }
        .max-w-4xl { max-width: 56rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .pb-12 { padding-bottom: 48px; }
        
        .student-field {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          font-weight: 600;
        }
        .student-field span {
          flex: 1;
          border-bottom: 1px solid black;
          height: 20px;
          min-width: 200px;
        }
        
        .difficulty-badge {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          margin-right: 4px;
        }
        .diff-easy { color: #16a34a; }
        .diff-moderate { color: #d97706; }
        .diff-challenging { color: #dc2626; }
      `}</style>
    </div>
  );
}
