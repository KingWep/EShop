import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    // TODO: Implement actual login logic
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 py-8 glass-card rounded-2xl">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Login</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign in to your account</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-9 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Demo credentials: admin@example.com / password
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
