import { create } from 'zustand';
interface UserStore {
    isAdmin : boolean;
    isAdminResolved: boolean;
    setIsAdmin :(value: boolean) => void 
    setIsAdminResolved: (value: boolean) => void
}
export const useUserStore = create<UserStore>((set)=>({
    isAdmin: false, 
    isAdminResolved: false,
    setIsAdmin : (value) => set({isAdmin: value}),
    setIsAdminResolved: (value) => set({isAdminResolved: value})
}))
