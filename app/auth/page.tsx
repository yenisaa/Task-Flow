"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/**
 * Minimal toast system (self-contained)
 */
type ToastItem = { id: string; message: string; type?: "success" | "error" };

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  function push(message: string, type: "success" | "error" = "success") {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((t) => [...t, { id, message, type }]);
    // auto-dismiss
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }
  function remove(id: string) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }
  return { toasts, push, remove } as const;
}

export default function AuthPage() {
  const signUpHook = useSignUp();
  const signInHook = useSignIn();
  const router = useRouter();
  const toast = useToast();

  // form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ email: "", password: "" });

  // verification step state
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const [verificationEmailFor, setVerificationEmailFor] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // inline errors
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // disable while async
  const [loading, setLoading] = useState(false);

  // ensure clerk hooks loaded
  const signUpLoaded = signUpHook.isLoaded && !!signUpHook.signUp;
  const signInLoaded = signInHook.isLoaded && !!signInHook.signIn;

  // ---- Register handler (starts verification flow) ----
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setVerifyError(null);

    if (!signUpLoaded) {
      setRegisterError("Auth not ready — try again.");
      return;
    }

    if (!registerForm.email || !registerForm.password) {
      setRegisterError("Please provide email and password.");
      return;
    }

    try {
      setLoading(true);
      // create signup
      const createResult = await signUpHook.signUp.create({
        emailAddress: registerForm.email,
        password: registerForm.password,
      });

      // prepare verification (use code strategy)
      // prepareEmailAddressVerification may accept args in some Clerk versions; keep simple:
      await signUpHook.signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerificationEmailFor(registerForm.email);
      setIsAwaitingVerification(true);
      toast.push("Verification code sent — check your email", "success");
    } catch (err: any) {
      console.error("Register error:", err);
      const message =
        err?.errors?.[0]?.message || err?.message || "Registration failed";
      setRegisterError(message);
      toast.push(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---- Verify code handler ----
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifyError(null);

    if (!signUpLoaded) {
      setVerifyError("Auth not ready — try again.");
      return;
    }
    if (!verificationCode.trim()) {
      setVerifyError("Please enter the verification code.");
      return;
    }

    try {
      setIsVerifying(true);
      const attempt = await signUpHook.signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      // Clerk returns a status; when complete, we can set active session
      if ((attempt as any).status === "complete") {
        // some Clerk versions return createdSessionId on attempt
        const sessionId = (attempt as any).createdSessionId;
        if (sessionId) {
          await signUpHook.setActive({ session: sessionId });
        }
        toast.push("Email verified — signed in", "success");
        router.push("/dashboard");
        return;
      }

      // If not complete, show message
      setVerifyError("Verification failed — check code and try again.");
      toast.push("Verification failed", "error");
    } catch (err: any) {
      console.error("Verify error:", err);
      const msg = err?.errors?.[0]?.message || err?.message || "Verification failed";
      setVerifyError(msg);
      toast.push(msg, "error");
    } finally {
      setIsVerifying(false);
    }
  };

  // ---- Login handler ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!signInLoaded) {
      setLoginError("Auth not ready — try again.");
      return;
    }
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Please provide email and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await signInHook.signIn.create({
        identifier: loginForm.email,
        password: loginForm.password,
      });

      if ((result as any).status === "complete") {
        const sessionId = (result as any).createdSessionId;
        if (sessionId) {
          await signInHook.setActive({ session: sessionId });
        }
        toast.push("Logged in", "success");
        router.push("/dashboard");
        return;
      }

      // If clerk demands email verification, inform user
      if ((result as any).status === "needs_email_verification") {
        setIsAwaitingVerification(true);
        setVerificationEmailFor(loginForm.email);
        toast.push("Email verification required. Check your email.", "error");
        setLoginError("Email verification required. Check your email.");
        return;
      }

      setLoginError("Sign-in not completed.");
      toast.push("Sign-in not completed", "error");
      console.log("signIn result:", result);
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err?.errors?.[0]?.message || err?.message || "Login failed";
      setLoginError(msg);
      toast.push(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // reset errors when user changes tab or modifies input
  useEffect(() => {
    setLoginError(null);
    setRegisterError(null);
  }, [loginForm.email, loginForm.password, registerForm.email, registerForm.password]);

  // render toast UI
  function Toasts() {
    return (
      <div className="fixed right-4 top-6 z-50 flex flex-col gap-2">
        {toast.toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow ${
              t.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Toasts />

      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-linear-to-br from-primary/10 via-background to-secondary/10">
        <div className="mb-4 flex items-center flex-col text-center">
          <h1 className="text-5xl font-bold mb-4 text-indigo-600 px-6 py-3 rounded-lg transition-colors">
            Task Flow
          </h1>
          <p className="text-xl text-gray-500">The beautiful way to manage your daily tasks</p>
        </div>

        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-primary mb-4">Welcome</h2>
            <p className="text-gray-500">Sign in to your account or create a new one</p>
          </div>

          {/* If awaiting verification show verification input */}
          {isAwaitingVerification ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                A verification code was sent to <strong>{verificationEmailFor}</strong>. Enter it here:
              </p>

              <form
                onSubmit={handleVerify}
                className="flex gap-2 items-center"
              >
                <Input
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </form>

              {verifyError && <p className="text-sm text-red-600">{verifyError}</p>}

              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // allow users to resend by re-triggering prepareEmailAddressVerification
                    if (!signUpLoaded) {
                      toast.push("Auth not ready", "error");
                      return;
                    }
                    signUpHook.signUp
                      .prepareEmailAddressVerification({ strategy: "email_code" })
                      .then(() => toast.push("Verification code resent", "success"))
                      .catch((err) => {
                        console.error(err);
                        toast.push("Failed to resend code", "error");
                      });
                  }}
                >
                  Resend code
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    // let the user go back to tabbed forms
                    setIsAwaitingVerification(false);
                    setVerificationCode("");
                    setVerifyError(null);
                    setVerificationEmailFor(null);
                  }}
                >
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent value="login">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <Input
                    name="email"
                    placeholder="example@email.com"
                    className="border p-3"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                  <Input
                    type="password"
                    name="password"
                    placeholder="•••••••••"
                    className="border p-3"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  {loginError && <p className="text-sm text-red-600">{loginError}</p>}
                  <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER TAB */}
              <TabsContent value="register">
                <form className="space-y-4" onSubmit={handleRegister}>
                  <Input
                    name="email"
                    placeholder="Email"
                    className="border p-3"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-3"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                  {registerError && <p className="text-sm text-red-600">{registerError}</p>}
                  <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </>
  );
}
