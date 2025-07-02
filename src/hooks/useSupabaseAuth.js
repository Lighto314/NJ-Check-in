import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzedbjyueqpsgmudssan.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZWRianl1ZXFwc2dtdWRzc2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjI2ODcsImV4cCI6MjA2Njk5ODY4N30.kQa3jo8sHvFGeNyV-OI9JrcMjcmW7hnNAqr7eWNfRtY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username, password) => {
    try {
      setError(null);
      // 使用用户名作为邮箱（临时方案，后续可以改为真正的用户名系统）
      const email = `${username}@temp.com`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      if (error) throw error;
      
      // 注册成功后直接登录
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
    } catch (err) {
      setError(err.message);
    }
  };

  const signIn = async (username, password) => {
    try {
      setError(null);
      // 使用用户名作为邮箱（临时方案）
      const email = `${username}@temp.com`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
} 