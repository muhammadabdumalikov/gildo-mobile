import { Task } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { tasksApi, CreateTaskRequest, UpdateTaskRequest } from '../api/tasks';

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
          const tasks = await tasksApi.getAll();
          set({ tasks, isLoading: false });
        } catch (error: any) {
          console.error('Error loading tasks:', error);
          // Don't clear existing tasks on network error, just stop loading
          set({ isLoading: false });
          // Only log error, don't throw - allow app to continue with cached data
        }
      },

      addTask: async (taskData) => {
        const createRequest: CreateTaskRequest = {
          title: taskData.title,
          description: taskData.description,
          coinReward: taskData.coinReward,
          dueDate: taskData.dueDate,
          assigner: taskData.assigner,
        };

        const newTask = await tasksApi.create(createRequest);
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask;
      },

      updateTask: async (id, updates) => {
        const updateRequest: UpdateTaskRequest = {
          title: updates.title,
          description: updates.description,
          coinReward: updates.coinReward,
          isCompleted: updates.isCompleted,
          dueDate: updates.dueDate,
          assigner: updates.assigner,
        };

        const updated = await tasksApi.update(id, updateRequest);
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
        }));
      },

      deleteTask: async (id) => {
        await tasksApi.delete(id);
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTaskComplete: async (id) => {
        const updated = await tasksApi.complete(id);
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
        }));
      },

      toggleTaskIncomplete: async (id) => {
        const updated = await tasksApi.incomplete(id);
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
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

