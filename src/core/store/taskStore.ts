import { Task } from '@/src/core/types';
import { generateId } from '@/src/core/utils/generateId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TaskState {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  toggleTaskIncomplete: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  isLoading: boolean;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,

      loadTasks: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would fetch from an API
          // For now, tasks are persisted via zustand persist middleware
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading tasks:', error);
          set({ isLoading: false });
        }
      },

      addTask: async (taskData) => {
        const now = Date.now();
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask;
      },

      updateTask: async (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: Date.now() }
              : task
          ),
        }));
      },

      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTaskComplete: async (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isCompleted: true, updatedAt: Date.now() }
              : task
          ),
        }));
      },

      toggleTaskIncomplete: async (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isCompleted: false, updatedAt: Date.now() }
              : task
          ),
        }));
      },
      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

