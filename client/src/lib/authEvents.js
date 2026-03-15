
export const authEvents = {
  login:  () => window.dispatchEvent(new Event("auth-change")),
  logout: () => window.dispatchEvent(new Event("auth-change")),
};