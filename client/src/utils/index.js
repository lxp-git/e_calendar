import application from "./Application";

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const isDebug = () => process.env.NODE_ENV === 'development';

export const createAction = type => payload => ({ type, payload });

export const isLogin = () => {
  return application.loginUser && application.loginUser.id;
}
