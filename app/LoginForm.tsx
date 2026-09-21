"use client";

import { useState, useActionState } from "react";
import { signIn, signUp, continueAsGuest, type FormState } from "./actions";

const initialState: FormState = { status: "idle", message: "" };

export default function LoginForm() {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [resetNote, setResetNote] = useState(false);

  const action = mode === "create" ? signUp : signIn;
  const [state, formAction, pending] = useActionState(action, initialState);

  const switchMode = (selected: "signin" | "create") => {
    setMode(selected);
    setResetNote(false);
  };

  return (
    <>
      <div className="login-header">
        <h2>{mode === "create" ? "Create your account" : "Welcome back"}</h2>
        <p>
          {mode === "create"
            ? "Start connecting your social media insights today."
            : "Sign in to access your FlowTech Media dashboard."}
        </p>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={mode === "signin" ? "tab active" : "tab"}
          onClick={() => switchMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={mode === "create" ? "tab active" : "tab"}
          onClick={() => switchMode("create")}
        >
          Create account
        </button>
      </div>

      {(state.message || resetNote) && (
        <div className={`message show ${state.status === "error" && !resetNote ? "error" : ""}`}>
          {resetNote
            ? "Password reset by email is not wired up yet. See the project README for what to connect."
            : state.message}
        </div>
      )}

      <form action={formAction}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              minLength={mode === "create" ? 8 : 1}
              required
            />
            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="remember">
            <input type="checkbox" name="remember" />
            Remember me
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setResetNote(true);
            }}
          >
            Forgot password?
          </a>
        </div>

        <button className="primary-button" type="submit" disabled={pending}>
          {pending
            ? "One moment..."
            : mode === "create"
              ? "Create account"
              : "Sign in to dashboard"}
        </button>
      </form>

      <div className="divider">OR</div>

      <form action={continueAsGuest}>
        <button className="guest-button" type="submit">
          Continue as Guest
        </button>
      </form>

      <p className="secure-note">
        By continuing, you agree to the FlowTech Media Solutions terms
        and account policies.
      </p>
    </>
  );
}
