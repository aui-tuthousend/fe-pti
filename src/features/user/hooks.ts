import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UserService } from './service';
import { UserResponse, RegisterUserRequest, LoginUserRequest, LoginUserResponse } from './types';

export const userKeys = {
    all: ['user'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    current: () => [...userKeys.all, 'current'] as const,
}

export function useGetAllUser() {
  return useQuery({
      queryKey: userKeys.lists(),
      queryFn: () => UserService.getAllUser(),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterUserRequest) => UserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Login hook
export function useLoginUser() {
  const queryClient = useQueryClient();

  return useMutation<LoginUserResponse, Error, LoginUserRequest>({
    mutationFn: (loginData: LoginUserRequest) => UserService.loginUser(loginData),
    onSuccess: (data: LoginUserResponse) => {
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      // Invalidate current user query to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}

// Get current user hook
export function useGetCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: () => UserService.getCurrentUser(),
    enabled: !!localStorage.getItem('auth_token'), // Only run if token exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Logout function
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('auth_token');
    queryClient.clear(); // Clear all cached data
  };
}

// Registration form hook - encapsulates all form logic
export function useRegisterForm() {
  const createUserMutation = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<RegisterUserRequest>({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterUserRequest>>({});

  const updateField = (field: keyof RegisterUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterUserRequest> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (): Promise<{ success: boolean; error?: string }> => {
    if (!validateForm()) {
      return { success: false, error: 'Mohon lengkapi semua field dengan benar' };
    }

    setIsLoading(true);

    try {
      await createUserMutation.mutateAsync(formData);

      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error?.message || 'Terjadi kesalahan saat mendaftar';
      return { success: false, error: errorMessage };
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
    });
    setErrors({});
    setIsLoading(false);
  };

  return {
    // Form state
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,

    // Actions
    updateField,
    setShowPassword,
    setShowConfirmPassword,
    register,
    resetForm,
    validateForm,
  };
}

// Login form hook
export function useLoginForm() {
  const loginMutation = useLoginUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginUserRequest>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginUserRequest>>({});

  const updateField = (field: keyof LoginUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginUserRequest> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (): Promise<{ success: boolean; error?: string; data?: LoginUserResponse }> => {
    if (!validateForm()) {
      return { success: false, error: 'Mohon lengkapi semua field dengan benar' };
    }

    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync(formData);

      setIsLoading(false);
      return { success: true, data: result };
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error?.message || 'Email atau password salah';
      return { success: false, error: errorMessage };
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
    });
    setErrors({});
    setIsLoading(false);
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    updateField,
    setShowPassword,
    login,
    resetForm,
    validateForm,
  };
}
