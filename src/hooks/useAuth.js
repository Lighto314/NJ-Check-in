import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 获取初始会话
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (username, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const email = `${username}@temp.com`
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })
      
      if (error) throw error
      
      // 注册成功后直接登录
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      
      setUser(signInData.user)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const signIn = async (username, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const email = `${username}@temp.com`
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      setUser(data.user)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut
  }
} 