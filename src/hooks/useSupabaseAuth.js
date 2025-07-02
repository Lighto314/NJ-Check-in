import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzedbjyueqpsgmudssan.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZWRianl1ZXFwc2dtdWRzc2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjI2ODcsImV4cCI6MjA2Njk5ODY4N30.kQa3jo8sHvFGeNyV-OI9JrcMjcmW7hnNAqr7eWNfRtY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 测试 Supabase 连接
console.log('Supabase client initialized with URL:', supabaseUrl);

export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // 改为 false，避免初始加载
  const [error, setError] = useState(null);

  // 从本地存储恢复用户状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('supabase-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    // 设置一个超时，防止无限加载
    const timeout = setTimeout(() => {
      console.log('Auth check timeout, setting loading to false');
      setLoading(false);
    }, 3000);

    // 尝试获取当前用户，但不阻塞页面显示
    const getUser = async () => {
      try {
        console.log('Checking user session...');
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('Current user:', user, 'Error:', error);
        if (user) {
          setUser(user);
        }
        setLoading(false);
        clearTimeout(timeout);
      } catch (error) {
        console.error('Error getting user:', error);
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user);
        setUser(session?.user ?? null);
        setLoading(false);
        clearTimeout(timeout);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signUp = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      
      // 手动设置用户状态
      if (data.user) {
        setUser(data.user);
        // 保存到本地存储
        localStorage.setItem('supabase-user', JSON.stringify(data.user));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const signIn = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      // 使用用户名作为邮箱（临时方案）
      const email = `${username}@temp.com`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // 手动设置用户状态
      if (data.user) {
        setUser(data.user);
        // 保存到本地存储
        localStorage.setItem('supabase-user', JSON.stringify(data.user));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      localStorage.removeItem('supabase-user'); // 退出时清除本地用户
      setUser(null);
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