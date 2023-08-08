export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/setting/index',
    'pages/event/index',
    'pages/clock/index',
    'pages/token/index',
    'pages/words/index',
    'pages/login/index',
    'pages/pomodoro/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'Calendar',
    navigationBarTextStyle: 'white',
    navigationStyle: "custom",
  },
})
