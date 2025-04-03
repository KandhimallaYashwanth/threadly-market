
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

// Define valid table names to ensure type safety
type TableName = 'products' | 'profiles';

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T>(
  queryKey: string[],
  tableName: TableName,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    eq?: [string, any];
    limit?: number;
    order?: { column: string; ascending?: boolean };
    single?: boolean;
  } = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select(options.columns || '*');
      
      // Apply eq filter if provided
      if (options.eq) {
        query = query.eq(options.eq[0], options.eq[1]);
      }
      
      // Apply filters if provided
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      // Apply order if provided
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }
      
      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Execute as single or multiple
      if (options.single) {
        const { data, error } = await query.single();
        if (error) throw error;
        return data as T;
      } else {
        const { data, error } = await query;
        if (error) throw error;
        return data as T[];
      }
    },
  });
}

// Hook for inserting data into Supabase
export function useSupabaseInsert<T>(
  tableName: TableName,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[];
  } = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newData: any) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert(newData)
        .select()
        .single();
      
      if (error) throw error;
      return data as T;
    },
    onSuccess: (data) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      toast.success(`Added successfully`);
    },
    onError: (error: Error) => {
      if (options.onError) {
        options.onError(error);
      }
      
      toast.error('Error adding item', { 
        description: error.message 
      });
    },
  });
}

// Hook for updating data in Supabase
export function useSupabaseUpdate<T>(
  tableName: TableName,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[];
    column?: string; // Column to match on, default is "id"
  } = {}
) {
  const queryClient = useQueryClient();
  const column = options.column || 'id';
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: any
    }) => {
      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(data)
        .eq(column, id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData as T;
    },
    onSuccess: (data) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      toast.success(`Updated successfully`);
    },
    onError: (error: Error) => {
      if (options.onError) {
        options.onError(error);
      }
      
      toast.error('Error updating item', { 
        description: error.message 
      });
    },
  });
}

// Hook for deleting data from Supabase
export function useSupabaseDelete(
  tableName: TableName,
  options: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[];
    column?: string; // Column to match on, default is "id"
  } = {}
) {
  const queryClient = useQueryClient();
  const column = options.column || 'id';
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(column, id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess();
      }
      
      toast.success(`Deleted successfully`);
    },
    onError: (error: Error) => {
      if (options.onError) {
        options.onError(error);
      }
      
      toast.error('Error deleting item', { 
        description: error.message 
      });
    },
  });
}

// Hook for realtime subscriptions using the newer channel-based API
export function useRealtimeSubscription(
  tableName: TableName,
  eventTypes: ('INSERT' | 'UPDATE' | 'DELETE')[],
  callback: (payload: any) => void
) {
  const channelName = `realtime-${tableName}`;
  
  const setupSubscription = () => {
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { 
          event: eventTypes, 
          schema: 'public', 
          table: tableName 
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  };
  
  return { setupSubscription };
}
