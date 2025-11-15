import { create } from 'zustand';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { fetchServer } from '@/lib/fetchServer';
import { urlBuilder } from "@/lib/utils";
import type { UserResponse, RegisterUserRequest, LoginUserRequest, LoginUserResponse } from "./types";

interface UserStore {
  list: UserResponse[];
  default: UserResponse;
  model: UserResponse | RegisterUserRequest;
  loading: boolean;
  tableAttributes: Array<{
    accessorKey: string;
    header: string;
  }>;

  setModel: (model?: UserResponse | RegisterUserRequest) => void;
  RegisterUser: (token: string, payload: RegisterUserRequest) => Promise<any>;
  GetListUser: (token: string) => Promise<any>;
  // LoginUser: (payload: LoginUserRequest) => Promise<any>;
  // GetCurrentUser: (token: string) => Promise<any>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  list: [],
  default: { id: 0, username: "", name: "", role: "" },
  model: { id: 0, username: "", name: "", role: "" },
  loading: false,
  tableAttributes: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
  ],

  setModel(model) {
    const currentModel = get().model;
    const newModel = model || get().default;
    if (JSON.stringify(currentModel) !== JSON.stringify(newModel)) {
      set({ model: newModel });
    }
  },

  RegisterUser: async (token, payload) => {
    set({ loading: true });
    try {
      const response = await fetchServer(token, urlBuilder('/users'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  GetListUser: async (token) => {
    try {
      set({ loading: true });
      const response = await fetchServer(token, urlBuilder('/users'), {
        method: 'GET',
      });

      const data = response.data;
      console.log(data);

      set({ list: data?.data || [] });
      return data;
    } catch (error) {
      console.error('Error getting list of users:', error);
      return error;
    } finally {
      set({ loading: false });
    }
  },

  // LoginUser: async (payload) => {
  //   set({ loading: true });
  //   try {
  //     const response = await fetchServer('', urlBuilder('/users/login'), {
  //       method: 'POST',
  //       body: JSON.stringify(payload),
  //     });

  //     const data = response.data;
  //     console.log("Login response:", data);

  //     // Store token if login successful
  //     if (data.token) {
  //       localStorage.setItem('auth_token', data.token);
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //     return error;
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  // GetCurrentUser: async (token) => {
  //   try {
  //     set({ loading: true });
  //     const response = await fetchServer(token, urlBuilder('/users/'), {
  //       method: 'GET',
  //     });

  //     const data = response.data;
  //     console.log("GetCurrentUser response:", data);

  //     set({ model: data.data || data });
  //     return data;
  //   } catch (error: any) {
  //     console.error('Error getting current user:', error);
  //     // Clear token if unauthorized
  //     if (error?.message?.includes('401')) {
  //       // Note: This should be updated to clear cookies instead of localStorage
  //       // when the auth system is fully migrated
  //     }
  //     return error;
  //   } finally {
  //     set({ loading: false });
  //   }
  // }
}));

// Legacy hooks for backward compatibility
export function useGetAllUser() {
  const [cookies] = useCookies(['authToken']);
  const { list, loading, GetListUser } = useUserStore();

  return {
    data: list,
    isLoading: loading,
    refetch: () => GetListUser(cookies.authToken || ''),
  };
}

export function useCreateUser() {
  const [cookies] = useCookies(['authToken']);
  const { RegisterUser, loading } = useUserStore();

  return {
    mutateAsync: (userData: RegisterUserRequest) => RegisterUser(cookies.authToken || '', userData),
    isPending: loading,
  };
}

// Login functionality moved to auth feature

// export function useGetCurrentUser() {
//   const [, , removeCookie] = useCookies(['authToken', 'userData']);
//   const { model, loading } = useUserStore();

//   // Try to get user data from cookies first
//   const getUserFromCookies = () => {
//     try {
//       const cookies = document.cookie.split(';').reduce((acc, cookie) => {
//         const [key, value] = cookie.trim().split('=');
//         acc[key] = decodeURIComponent(value);
//         return acc;
//       }, {} as Record<string, string>);

//       const userData = cookies['userData'];
//       if (userData) {
//         const parsedUser = JSON.parse(userData);
//         // Update the store with cookie data
//         useUserStore.setState({ model: parsedUser });
//         return parsedUser;
//       }
//     } catch (error) {
//       console.error('Error parsing user data from cookies:', error);
//     }
//     return null;
//   };

//   // Get user data from cookies on mount
//   useEffect(() => {
//     getUserFromCookies();
//   }, []);

//   return {
//     data: model,
//     isLoading: loading,
//     refetch: getUserFromCookies,
//   };
// }

// Logout functionality moved to auth feature

// Form logic moved to page components - features only handle data fetching
