import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });
    try {
        //storing the reference of a user in users scheme with uid into docRef.
        const docRef = doc(db, "users", uid);
        //getting data of that user using getDoc method.
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            set( {currentUser:docSnap.data(), isLoading:false})
        }
        else{
            set({ currentUser: null, isLoading: false }); 
        }
    } catch (error) {
      toast.error(error.message);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));

export default useUserStore;
