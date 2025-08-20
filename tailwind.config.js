module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"微软雅黑"',
          'Noto Sans SC',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },
      colors: {
        primary: '#007BFF', // 按钮蓝色
        green: '#28A745',   // 完成绿色
        red: '#FF4040',     // 高优先级红色
        orange: '#FF9800',  // 中优先级橙色
        blue: '#2196F3',    // 低优先级蓝色
        graybg: '#F5F5F5'   // 浅灰背景
      }
    }
  },
  plugins: []
} 