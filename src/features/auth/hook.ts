import { urlBuilder } from '@/lib/utils';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import type { LoginRequest, LoginResponse, AuthUser } from './types';

export const useAuthStore = () => {
  const [, setCookie, removeCookie] = useCookies(['authToken', 'userData']);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const response = await fetch(urlBuilder('/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseJson = await response.json();
      const data = responseJson.data;
      console.log('Login response:', data.token);

      if (data.token) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 2); // 2 days expiry
        // console.log("fuck fuck jancok")

        setCookie('authToken', data.token, { path: '/', expires });
        setCookie('userData', JSON.stringify({
          id: data.id,
          username: data.username,
          name: data.name,
          role: data.role
        }), { path: '/', expires });
      }

      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error authenticating user:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    removeCookie('authToken', { path: '/' });
    removeCookie('userData', { path: '/' });
  };

  const getCurrentUser = (): AuthUser | null => {
    // This would typically be implemented differently, but for now returning null
    // The actual user data retrieval should be handled by the user store
    return null;
  };

  return {
    loading,
    setLoading,
    login,
    logout,
    getCurrentUser
  };
};
