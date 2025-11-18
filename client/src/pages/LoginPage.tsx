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
      <Card 
        className="w-full max-w-6xl backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-24 shadow-2xl"
      >
        <h1 className="text-6xl font-bold text-white text-center mb-4">GlucoNova</h1>
        <p className="text-3xl font-semibold text-emerald-400 text-center mb-12">Login</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label htmlFor="email" className="text-gray-200 text-lg mb-4 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 bg-white/5 border border-white/10 text-white text-xl placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              placeholder="email@example.com"
              required
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-200 text-lg mb-4 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 bg-white/5 border border-white/10 text-white text-xl placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              placeholder="Enter your password"
              required
              data-testid="input-password"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-4">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 h-6 w-6"
                data-testid="checkbox-remember"
              />
              <label htmlFor="remember" className="text-lg text-gray-200 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-lg text-emerald-400 hover:text-emerald-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 text-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/25" 
            disabled={isLoading} 
            data-testid="button-signin"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-lg text-gray-200 mt-10">
          Don't have an account?{' '}
          <a href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors" data-testid="link-register">
            Create one
          </a>
        </p>

        <p className="text-center text-base text-gray-400 mt-12">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
