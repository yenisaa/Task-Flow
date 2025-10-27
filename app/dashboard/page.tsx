"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Check,
  Pencil,
  Trash2,
  LogOut,

} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = (e: any) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setIsAdding(true);

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };

    setTodos([todo, ...todos]);
    setNewTodo("");
    setIsAdding(false);
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleClick = () => {
    window.location.href = "/";
  };

  const saveEdit = (id: number) => {
    if (!editedText.trim()) return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editedText } : todo
      )
    );
    setEditingId(null);
    setEditedText("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-linear-to-br from-primary/10 via-background to-secondary/10">
      <header className="flex justify-between w-5xl mt-10">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-indigo-600">Task Flow</h1>
          <p className="text-gray-500 mt-2">Welcome back, User!</p>
        </div>
        <div className="">
          <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* ✅ Add Todo Form */}
      <Card className="mt-10 mb-5 w-5xl p-6 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="flex gap-2">
            <Input
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isAdding}>
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ✅ Todo List */}
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between w-full max-w-5xl bg-white shadow-sm rounded-lg p-4 mb-3"
        >
          {/* Left: Checkbox + Text or Edit Input */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
              className="h-5 w-5 cursor-pointer"
            />

            {editingId === todo.id ? (
              <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="border p-1 rounded text-gray-800 w-200"
                autoFocus
              />
            ) : (
              <span
                className={`text-md ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {todo.text}
              </span>
            )}
          </div>

          {/* Right: Edit or Save + Delete Buttons */}
          <div className="flex items-center gap-4">
            {editingId === todo.id ? (
              <Check
                className="cursor-pointer text-green-600"
                onClick={() => saveEdit(todo.id)}
              />
            ) : (
              <Pencil
                className="cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setEditingId(todo.id);
                  setEditedText(todo.text);
                }}
              />
            )}

            <Trash2
              className="cursor-pointer hover:text-red-600"
              onClick={() => deleteTodo(todo.id)}
            />
          </div>
        </div>
      ))}
    </main>
  );
}
