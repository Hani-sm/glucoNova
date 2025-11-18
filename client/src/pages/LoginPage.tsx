import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome back to GlucoNova',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="w-full max-w-md">
        <Card 
          className="w-full p-8 backdrop-blur-sm bg-[#1e2a3a]/80 border border-slate-600/50 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-1">GlucoNova</h1>
          <p className="text-emerald-400 text-center mb-8">Login</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white text-sm font-normal mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white text-sm font-normal mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
              data-testid="input-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                data-testid="checkbox-remember"
              />
              <label htmlFor="remember" className="text-sm text-white cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-emerald-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isLoading} data-testid="button-signin">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-emerald-400 hover:underline" data-testid="link-register">
            Create one
          </a>
        </p>

        <p className="text-center text-xs text-white/40 mt-8">
          © 2025 GlucoNova. All rights reserved.
        </p>
        </Card>
      </div>
    </PublicLayout>
  );
}
