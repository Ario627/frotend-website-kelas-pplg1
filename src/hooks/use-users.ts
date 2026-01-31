import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import type { UpdateUserDto, ApproveUserDto, RejectUserDto } from "@/types/user.types";
import { toast } from "./use-toast";
import { use } from "react";

export function userUser(page = 1, limit = 20, status?: string) {
  return useQuery({
    queryKey: ['users', { page, limit, status }],
    queryFn: () => usersApi.getAll(page, limit, status),
  });
}

export function usePendingUsers() {
  return useQuery({
    queryKey: ['users', 'pending'],
    queryFn: () => usersApi.getPending(),
    refetchInterval: 30000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'User di update',
        description: 'User information has been update successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was an error updating the user.',
        variant: 'destructive',
      });
    },
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectUserDto) => usersApi.reject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'pending'] });
      toast({
        title: 'User rejected',
        description: 'The user has been rejected successfully.',
      });
    },
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApproveUserDto) => usersApi.approve(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'pending'] });
      toast({
        title: 'User diterima',
        description: 'The user has been approved successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was an error approving the user.',
        variant: 'destructive',
      });
    },
  });
}


