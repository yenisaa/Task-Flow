"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AuthPage() {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-linear-to-br from-primary/10 via-background to-secondary/10">
      <div className="mb-4 flex items-center flex-col text-center">
        <h1 className="text-5xl font-bold mb-4 text-linear-to-br from-indigo-600/80 to-indigo-800 text-indigo-600 px-6 py-3 rounded-lg transition-colors">
          Task Flow
        </h1>
        <p className="text-xl text-gray-500">
          The beautiful way to manage your daily tasks
        </p>
      </div>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold  text-primary mb-4">Welcome</h2>
          <p className=" text-gray-500">
            Sign in to your account or create a new one
          </p>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <form className="space-y-4">
              <Input
                name="email"
                placeholder="example@email.com"
                className="border p-3"
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
              <Input
                type="password"
                name="password"
                placeholder="•••••••••"
                className="border p-3"
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <Button className="w-full bg-indigo-600">Login</Button>
            </form>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register">
            <form className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                className="border p-3"
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />
              <Input
                name="email"
                placeholder="Email"
                className="border p-3"
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-3"
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />
              <Button className="w-full bg-indigo-600">Register</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
