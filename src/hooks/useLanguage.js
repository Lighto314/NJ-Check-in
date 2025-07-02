import { useState, useEffect } from 'react';

const LANGS = {
  zh: {
    // 登录页面
    title: 'NJ Check-in',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    login: '登录',
    register: '注册',
    noAccount: '没有账号？注册',
    hasAccount: '已有账号？登录',
    loginSuccess: '登录成功！',
    registerSuccess: '注册成功！正在自动登录...',
    passwordMismatch: '两次输入的密码不一致！',
    loading: '加载中...',
    checkingAuth: '正在检查登录状态...',
    redirecting: '正在跳转到打卡界面...',
    
    // 默认打卡页面
    welcome: '欢迎回来，',
    welcomeSubtitle: '创建任务开始你的打卡之旅吧！',
    newTask: '新任务名称',
    add: '添加',
    enterCheckin: '进入签到',
    delete: '删除',
    logout: '退出',
    
    // 打卡页面
    prev: '上月',
    next: '下月',
    reset: '重置',
    confirmReset: '确定要重置本月所有签到吗？',
    checkin: '签到',
    cancel: '取消',
    date: '日期：',
    onlyToday: '只能签到今天！',
    
    // 通用
    loadingText: '加载中...',
  },
  en: {
    // 登录页面
    title: 'NJ Check-in',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    login: 'Login',
    register: 'Register',
    noAccount: 'No account? Register',
    hasAccount: 'Have account? Login',
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful! Auto-logging in...',
    passwordMismatch: 'Passwords do not match!',
    loading: 'Loading...',
    checkingAuth: 'Checking authentication...',
    redirecting: 'Redirecting to check-in page...',
    
    // 默认打卡页面
    welcome: 'Welcome back, ',
    welcomeSubtitle: 'Create tasks to start your check-in journey!',
    newTask: 'New task name',
    add: 'Add',
    enterCheckin: 'Enter Check-in',
    delete: 'Delete',
    logout: 'Logout',
    
    // 打卡页面
    prev: 'Prev',
    next: 'Next',
    reset: 'Reset',
    confirmReset: 'Are you sure to reset all check-ins this month?',
    checkin: 'Check In',
    cancel: 'Cancel',
    date: 'Date: ',
    onlyToday: 'Can only check in today!',
    
    // 通用
    loadingText: 'Loading...',
  }
};

export function useLanguage() {
  const [lang, setLang] = useState('zh');

  useEffect(() => {
    // 从 localStorage 恢复语言设置
    const savedLang = localStorage.getItem('checkin-lang');
    if (savedLang && LANGS[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang) => {
    if (LANGS[newLang]) {
      setLang(newLang);
      localStorage.setItem('checkin-lang', newLang);
    }
  };

  const t = (key) => {
    return LANGS[lang]?.[key] || LANGS.zh[key] || key;
  };

  return {
    lang,
    changeLang,
    t,
    LANGS
  };
} 