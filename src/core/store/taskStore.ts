import { Task } from '@/src/core/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { tasksApi, CreateTaskRequest, UpdateTaskRequest } from '../api/tasks';

// Cache duration: 60 seconds (tasks change frequently)
const CACHE_DURATION = 60000;

interface TaskState {
  tasks: Task[];
  loadTasks: (force?: boolean) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: 'SUBSCRIPTION_LIMIT_REACHED' | 'OTHER'; task?: Task }>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  toggleTaskIncomplete: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  isLoading: boolean;
  error: string | null;
  lastLoadedAt?: number; // Timestamp of last successful load
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
      lastLoadedAt: undefined,

      loadTasks: async (force = false) => {
        const state = get();
        const now = Date.now();
        
        // Use cache if recent and not forced
        if (!force && state.lastLoadedAt && (now - state.lastLoadedAt) < CACHE_DURATION) {
          return Promise.resolve();
        }
        
        set({ isLoading: true });
        try {
          const tasks = await tasksApi.getAll();
          set({ tasks, isLoading: false, lastLoadedAt: now });
          
          // Update subscription usage count
          const { useSubscriptionStore } = await import('./subscriptionStore');
          useSubscriptionStore.getState().setCurrentUsage({ tasks: tasks.length });
        } catch (error: any) {
          console.error('Error loading tasks:', error);
          // Don't clear existing tasks on network error, just stop loading
          set({ isLoading: false });
          // Only log error, don't throw - allow app to continue with cached data
        }
      },

      addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
          // Check subscription limits before adding - use actual tasks count
          const { useSubscriptionStore } = await import('./subscriptionStore');
          const subscriptionStore = useSubscriptionStore.getState();
          const currentTasks = get().tasks;
          const currentCount = currentTasks.length;
          
          // Ensure subscription is loaded
          if (!subscriptionStore.limits || !subscriptionStore.plan) {
            console.warn('Subscription not loaded, loading now...');
            await subscriptionStore.loadSubscription();
          }
          
          // Premium users have unlimited access
          if (subscriptionStore.plan !== 'premium') {
            // Check against freemium limits (default to 5 if limits not set)
            const limit = subscriptionStore.limits?.tasks ?? 5;
            if (currentCount >= limit) {
              set({ isLoading: false, error: 'Task limit reached. Upgrade to premium for unlimited tasks.' });
              return { success: false, error: 'SUBSCRIPTION_LIMIT_REACHED' };
            }
          }

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
            isLoading: false,
          }));

          // Update subscription usage count with new count
          subscriptionStore.setCurrentUsage({ tasks: get().tasks.length });

          return { success: true, task: newTask };
        } catch (error: any) {
          // Check if it's a subscription limit error from backend (expected behavior)
          if (error?.response?.status === 403 || error?.message?.includes('maximum number of tasks')) {
            // This is expected - don't log as error
            set({ 
              error: 'Task limit reached. Upgrade to premium for unlimited tasks.', 
              isLoading: false 
            });
            return { success: false, error: 'SUBSCRIPTION_LIMIT_REACHED' };
          } else {
            // Only log unexpected errors
            console.error('Error adding task:', error);
            set({ error: 'Failed to add task', isLoading: false });
            return { success: false, error: 'OTHER' };
          }
        }
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
      // Persist tasks array and cache timestamp, not loading/error states
      partialize: (state) => ({ 
        tasks: state.tasks,
        lastLoadedAt: state.lastLoadedAt,
      }),
    }
  )
);

