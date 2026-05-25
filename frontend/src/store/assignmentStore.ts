import { create } from 'zustand';
import { Assignment, CreateAssignmentDTO, QuestionPaper, GenerationStatus } from '../types';

interface AssignmentStore {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  questionPaper: QuestionPaper | null;
  generationStatus: GenerationStatus | 'idle';
  searchQuery: string;

  // Actions
  createAssignment: (data: CreateAssignmentDTO) => Promise<string>;
  deleteAssignment: (id: string) => Promise<void>;
  fetchAssignmentDetail: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  simulateGeneration: (id: string) => Promise<void>;
}

const mockGeneratedPaper: QuestionPaper = {
  assignmentId: "", // will be set dynamically
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  subject: "Science",
  grade: "8th",
  timeAllowed: 45,
  maxMarks: 20,
  generalInstructions: "All questions are compulsory unless stated otherwise.",
  sections: [
    {
      title: "Section A",
      sectionType: "Short Answer Questions",
      instruction: "Attempt all questions. Each question carries 2 marks",
      marksPerQuestion: 2,
      questions: [
        { number: 1, text: "Define electroplating. Explain its purpose.", difficulty: "Easy", marks: 2, answer: "Electroplating is the process of depositing a thin layer of metal..." },
        { number: 2, text: "What is the role of a conductor in the process of electrolysis?", difficulty: "Moderate", marks: 2, answer: "A conductor allows the flow of electric current..." },
        { number: 3, text: "Why does a solution of copper sulfate conduct electricity?", difficulty: "Easy", marks: 2, answer: "Copper sulfate solution contains free copper and sulfate ions..." },
        { number: 4, text: "Describe one example of the chemical effect of electric current in daily life.", difficulty: "Moderate", marks: 2, answer: "An example is the electroplating of silver..." },
        { number: 5, text: "Explain why electric current is said to have chemical effects.", difficulty: "Moderate", marks: 2, answer: "Electric current causes the movement of ions..." },
        { number: 6, text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", difficulty: "Challenging", marks: 2, answer: "Sodium hydroxide is formed at the cathode..." },
        { number: 7, text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", difficulty: "Challenging", marks: 2, answer: "At the cathode: water is reduced to hydrogen gas..." },
        { number: 8, text: "Mention the type of current used in electroplating and justify why it is used.", difficulty: "Easy", marks: 2, answer: "Direct current (DC) is used in electroplating..." },
        { number: 9, text: "What is the importance of electric current in the field of metallurgy?", difficulty: "Moderate", marks: 2, answer: "Electric current is used for extraction of metals..." },
        { number: 10, text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.", difficulty: "Challenging", marks: 2, answer: "Cu2+ + 2e- -> Cu..." },
      ]
    }
  ],
  generatedAt: new Date().toISOString()
};

const initialAssignments: Assignment[] = [
  {
    id: "1",
    title: "Quiz on Electricity",
    subject: "Science",
    grade: "8th",
    dueDate: "2025-06-21T00:00:00Z",
    questionTypes: ["short_answer", "mcq"],
    numberOfQuestions: 10,
    totalMarks: 20,
    instructions: "",
    status: "completed",
    createdAt: "2025-06-20T00:00:00Z",
    updatedAt: "2025-06-20T00:00:00Z"
  }
];

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: initialAssignments,
  currentAssignment: null,
  questionPaper: { ...mockGeneratedPaper, assignmentId: "1" },
  generationStatus: 'idle',
  searchQuery: '',

  createAssignment: async (data: CreateAssignmentDTO) => {
    const newId = Math.random().toString(36).substring(7);
    const newAssignment: Assignment = {
      ...data,
      id: newId,
      status: "generating",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set((state) => ({
      assignments: [newAssignment, ...state.assignments],
      currentAssignment: newAssignment,
      generationStatus: "generating",
      questionPaper: null
    }));

    // Trigger mock generation
    get().simulateGeneration(newId);
    
    return newId;
  },

  deleteAssignment: async (id: string) => {
    set((state) => ({
      assignments: state.assignments.filter(a => a.id !== id),
      currentAssignment: state.currentAssignment?.id === id ? null : state.currentAssignment,
      questionPaper: state.questionPaper?.assignmentId === id ? null : state.questionPaper
    }));
  },

  fetchAssignmentDetail: async (id: string) => {
    const { assignments } = get();
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      set({ 
        currentAssignment: assignment,
        generationStatus: assignment.status,
        questionPaper: assignment.status === 'completed' ? { ...mockGeneratedPaper, assignmentId: id, subject: assignment.subject, grade: assignment.grade } : null
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  simulateGeneration: async (id: string) => {
    try {
      const { assignments } = get();
      const assignment = assignments.find(a => a.id === id);
      
      if (!assignment) return;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: assignment.title,
          subject: assignment.subject,
          grade: assignment.grade,
          numberOfQuestions: assignment.numberOfQuestions,
          totalMarks: assignment.totalMarks,
          questionTypes: assignment.questionTypes,
          instructions: assignment.instructions
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate paper');
      }

      set((state) => {
        const updatedAssignments = state.assignments.map(a => 
          a.id === id ? { ...a, status: "completed" as GenerationStatus } : a
        );
        
        return {
          assignments: updatedAssignments,
          currentAssignment: updatedAssignments.find(a => a.id === id) || null,
          generationStatus: "completed",
          questionPaper: { ...data.paper, assignmentId: id, generatedAt: new Date().toISOString() }
        };
      });

    } catch (error) {
      console.error("Generation failed:", error);
      set((state) => {
        const updatedAssignments = state.assignments.map(a => 
          a.id === id ? { ...a, status: "failed" as GenerationStatus } : a
        );
        
        return {
          assignments: updatedAssignments,
          currentAssignment: updatedAssignments.find(a => a.id === id) || null,
          generationStatus: "failed"
        };
      });
    }
  }
}));