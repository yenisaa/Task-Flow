"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form); // will connect to API soon
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-indigo-600/10 to-indigo-800/5 px-6 py-3 rounded-lg transition-colors">
        <div className="mb-6">
            <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
              TaskFlow
            </h1>
            <p className="text-muted-foreground">Manage your tasks beautifully
            
            </p>
        </div>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="">
            <h1 className="text-2xl font-bold text-primary mb-2">
              Welcome
            </h1>
            <p className="mb-2 text-muted-foreground">Sign in to your account or create a new one</p>
        </div> 
        <div className="">
            
        </div>



        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="****"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg"
          >
            Register
          </button>
        </form>


      </div>
    </main>
  );
}
