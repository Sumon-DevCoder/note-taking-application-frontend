"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function Home() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState([]);
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Note Form State
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingNote, setEditingNote] = useState<any>(null);

  // Check token on load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch notes when authenticated
  useEffect(() => {
    if (token) {
      loadNotes();
    }
  }, [token]);

  const loadNotes = async () => {
    try {
      const data = await fetchApi("/notes", "GET", null, token);
      setNotes(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await fetchApi(`/notes/${editingNote._id}`, "PUT", { title: newTitle, content: newContent }, token);
      } else {
        await fetchApi("/notes", "POST", { title: newTitle, content: newContent }, token);
      }
      setShowModal(false);
      setEditingNote(null);
      setNewTitle("");
      setNewContent("");
      loadNotes(); // Refresh notes
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditClick = (note: any) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setShowModal(true);
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this note?")) return;
    try {
      await fetchApi(`/notes/${id}`, "DELETE", null, token);
      loadNotes(); // Refresh notes
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const data = await fetchApi(endpoint, "POST", payload);
      
      setToken(data.token);
      setUser(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      // Reset fields after successful auth
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    setNotes([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:shadow-purple-500/20">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300 text-center mb-8">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  placeholder="John Doe"
                  required 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="you@example.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  placeholder="••••••••"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-purple-200 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-pink-300 hover:text-pink-200 transition-colors"
            >
              {isLogin ? "Sign up here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-[#302b63] to-[#24243e] text-white p-6 md:p-12">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Secure Notes
          </h1>
          <p className="text-gray-300 mt-1">
            Logged in as <span className="font-semibold text-white">{user?.name}</span> 
            {user?.role === "admin" && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">ADMIN</span>}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-4 md:mt-0 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all active:scale-95"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-100">Your Vault</h2>
          <button 
            onClick={() => {
              setEditingNote(null);
              setNewTitle("");
              setNewContent("");
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-1"
          >
            + New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-white/20 bg-white/5">
            <p className="text-xl text-gray-400">No notes found.</p>
            <p className="text-sm text-gray-500 mt-2">Create your first secure note to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note: any) => (
              <div key={note._id} className="group p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/30 hover:bg-white/15 transition-all shadow-xl hover:shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{note.title}</h3>
                {user?.role === 'admin' && note.author && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-gray-400">By: {note.author.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${note.author.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                      {note.author.role.toUpperCase()}
                    </span>
                  </div>
                )}
                <div 
                  className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4 max-w-none prose prose-invert overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/10 pt-4 mt-auto">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="space-x-3">
                    <button onClick={() => handleEditClick(note)} className="text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                    <button onClick={() => handleDeleteNote(note._id)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Note Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#1a1a2e] rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">{editingNote ? "Edit Secure Note" : "Create Secure Note"}</h2>
              <form onSubmit={handleSaveNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Secret Note Title..."
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                  <div className="bg-white text-black rounded-xl overflow-hidden pb-10">
                    <ReactQuill 
                      theme="snow"
                      value={newContent}
                      onChange={setNewContent}
                      className="h-48"
                      placeholder="Write your classified information here..."
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowModal(false);
                      setEditingNote(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
