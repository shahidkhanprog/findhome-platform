// ─── Auth Event Bus ────────────────────────────────────────────────────────────
// Import and call authEvents.login() in your login page AFTER localStorage.setItem
// This instantly updates the Navbar without any page refresh.
//
// Usage in your Login component:
//   import { authEvents } from "./authEvents";
//   ...
//   localStorage.setItem("user", JSON.stringify(res.data));
//   authEvents.login();   // ← triggers Navbar to re-read localStorage immediately
//   navigate("/");

export const authEvents = {
  login:  () => window.dispatchEvent(new Event("auth-change")),
  logout: () => window.dispatchEvent(new Event("auth-change")),
};