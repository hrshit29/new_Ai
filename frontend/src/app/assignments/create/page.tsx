"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../../store/assignmentStore';

export default function CreateAssignment() {
  const router = useRouter();
  const createAssignment = useAssignmentStore(state => state.createAssignment);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    dueDate: '',
    questionTypes: [] as string[],
    numberOfQuestions: 10,
    totalMarks: 20,
    instructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (type: string) => {
    setFormData(prev => {
      const types = prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type];
      return { ...prev, questionTypes: types };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.grade.trim()) newErrors.grade = 'Grade is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.questionTypes.length === 0) newErrors.questionTypes = 'Select at least one question type';
    if (formData.numberOfQuestions <= 0) newErrors.numberOfQuestions = 'Must be greater than 0';
    if (formData.totalMarks <= 0) newErrors.totalMarks = 'Must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newId = await createAssignment(formData);
      router.push(`/assignments/${newId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Assignment</h1>
          <p className="page-subtitle">Configure AI parameters to generate a custom question paper.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group col-span-1 md:col-span-2">
              <label className="form-label form-label-required">Assignment Title</label>
              <input 
                type="text" 
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Quiz on Electricity"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Subject</label>
              <div className="select-wrapper">
                <select 
                  className={`form-select ${errors.subject ? 'error' : ''}`}
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="">Select Subject</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Grade/Class</label>
              <div className="select-wrapper">
                <select 
                  className={`form-select ${errors.grade ? 'error' : ''}`}
                  value={formData.grade}
                  onChange={e => setFormData({...formData, grade: e.target.value})}
                >
                  <option value="">Select Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                </select>
              </div>
              {errors.grade && <span className="form-error">{errors.grade}</span>}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-bold text-gray-900">AI Configuration</h2>
          </div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label form-label-required">Question Types</label>
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { id: 'mcq', label: 'Multiple Choice Questions' },
                  { id: 'short_answer', label: 'Short Answer Questions' },
                  { id: 'long_answer', label: 'Long Answer Questions' },
                  { id: 'true_false', label: 'True / False' }
                ].map(type => (
                  <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                      checked={formData.questionTypes.includes(type.id)}
                      onChange={() => handleTypeChange(type.id)}
                    />
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.questionTypes && <span className="form-error mt-1">{errors.questionTypes}</span>}
            </div>

            <div className="space-y-6">
              <div className="form-group">
                <label className="form-label form-label-required">Total Questions</label>
                <input 
                  type="number" 
                  min="1" max="50"
                  className={`form-input ${errors.numberOfQuestions ? 'error' : ''}`}
                  value={formData.numberOfQuestions}
                  onChange={e => setFormData({...formData, numberOfQuestions: parseInt(e.target.value) || 0})}
                />
                {errors.numberOfQuestions && <span className="form-error">{errors.numberOfQuestions}</span>}
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Total Marks</label>
                <input 
                  type="number" 
                  min="1" max="100"
                  className={`form-input ${errors.totalMarks ? 'error' : ''}`}
                  value={formData.totalMarks}
                  onChange={e => setFormData({...formData, totalMarks: parseInt(e.target.value) || 0})}
                />
                {errors.totalMarks && <span className="form-error">{errors.totalMarks}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label form-label-required">Due Date</label>
                <input 
                  type="date" 
                  className={`form-input ${errors.dueDate ? 'error' : ''}`}
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
                {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
              </div>
            </div>

            <div className="form-group col-span-1 md:col-span-2 mt-2">
              <label className="form-label">Additional Instructions for AI</label>
              <textarea 
                className="form-textarea"
                placeholder="E.g., Include questions related to real-life applications. Make it challenging."
                value={formData.instructions}
                onChange={e => setFormData({...formData, instructions: e.target.value})}
              ></textarea>
              <span className="form-hint">These instructions will be sent to the AI to customize the generated paper.</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner spinner-sm spinner-white"></div>
                Generating...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Generate Question Paper
              </>
            )}
          </button>
        </div>
      </form>
      
      <style>{`
        .space-y-6 > * + * { margin-top: 24px; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:col-span-2 { grid-column: span 2 / span 2; }
        }
        .gap-6 { gap: 24px; }
        .gap-3 { gap: 12px; }
        .mt-2 { margin-top: 8px; }
        .mt-8 { margin-top: 32px; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-end { justify-content: flex-end; }
        .w-4 { width: 16px; }
        .h-4 { height: 16px; }
        .rounded { border-radius: 4px; }
        .text-sm { font-size: 14px; }
        .font-medium { font-weight: 500; }
        .text-gray-700 { color: #374151; }
        .text-gray-900 { color: #111827; }
        .text-lg { font-size: 18px; }
        .font-bold { font-weight: 700; }
        .max-w-3xl { max-width: 48rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .pb-12 { padding-bottom: 48px; }
      `}</style>
    </div>
  );
}
