import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true, error: null }),
  logout: () => set({ user: null, isLoggedIn: false }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
}));

onAuthStateChanged(auth, (user) => {
  if (user) {
    useAuthStore.getState().login(user);
  } else {
    useAuthStore.getState().logout();
  }
  useAuthStore.getState().setLoading(false);
});

export default useAuthStore;
