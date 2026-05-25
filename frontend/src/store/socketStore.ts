import { create } from 'zustand';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinAssignmentRoom,
  leaveAssignmentRoom,
} from '@/lib/socket';
import { useAssignmentStore } from './assignmentStore';
import { QuestionPaper } from '@/types';

interface SocketStore {
  isConnected: boolean;
  currentRoom: string | null;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (assignmentId: string) => void;
  leaveRoom: (assignmentId: string) => void;
}

export const useSocketStore = create((set, get) => ({
  isConnected: false,
  currentRoom: null,

  connect: () => {
    connectSocket();
    const socket = getSocket();

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    socket.on('generation:started', ({ assignmentId }: { assignmentId: string }) => {
      useAssignmentStore.getState().setGenerationStatus('generating');
      useAssignmentStore.getState().updateAssignmentStatus(assignmentId, 'generating');
    });

    socket.on(
      'generation:progress',
      ({ progress }: { progress: number }) => {
        useAssignmentStore.getState().setGenerationProgress(progress);
      }
    );

    socket.on(
      'generation:complete',
      ({ paper }: { paper: QuestionPaper }) => {
        useAssignmentStore.getState().setQuestionPaper(paper);
        useAssignmentStore
          .getState()
          .updateAssignmentStatus(paper.assignmentId, 'completed');
      }
    );

    socket.on(
      'generation:failed',
      ({ assignmentId }: { assignmentId: string }) => {
        useAssignmentStore.getState().setGenerationStatus('failed');
        useAssignmentStore
          .getState()
          .updateAssignmentStatus(assignmentId, 'failed');
      }
    );
  },

  disconnect: () => {
    disconnectSocket();
    set({ isConnected: false, currentRoom: null });
  },

  joinRoom: (assignmentId: string) => {
    const { currentRoom } = get();
    if (currentRoom && currentRoom !== assignmentId) {
      leaveAssignmentRoom(currentRoom);
    }
    joinAssignmentRoom(assignmentId);
    set({ currentRoom: assignmentId });
  },

  leaveRoom: (assignmentId: string) => {
    leaveAssignmentRoom(assignmentId);
    set({ currentRoom: null });
  },
}));