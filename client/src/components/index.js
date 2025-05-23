const baseURL = import.meta.env.VITE_API_URL;
export { default as Chat } from './content/chat'
export { default as New } from './content/new'
export { default as Menu } from './menu/menu'
export { default as RegisterPendings } from './auth/registerPendings'
export { default as LoginComponent } from './auth/login'
export { default as SignupComponent } from './auth/signup'
export { default as ForgotComponent } from './auth/forgot'