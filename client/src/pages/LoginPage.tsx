import { useState, FormEvent } from 'react';
import { useLocation, Link } from 'wouter';
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
        className="w-full max-w-4xl backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-20 shadow-2xl"
      >
        <h1 className="text-5xl font-bold tracking-tight text-white text-center mb-4">GlucoNova</h1>
        <p className="text-3xl font-semibold text-emerald-400 text-center mb-10">Login</p>
        
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <Label htmlFor="email" className="text-gray-200 text-lg font-medium mb-3 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-6 bg-white/5 border border-white/10 text-white text-xl placeholder-gray-400 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              placeholder="email@example.com"
              required
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-200 text-lg font-medium mb-3 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-6 bg-white/5 border border-white/10 text-white text-xl placeholder-gray-400 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              placeholder="Enter your password"
              required
              data-testid="input-password"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white/20 bg-white/5 text-emerald-400 focus:ring-emerald-400 h-6 w-6"
                data-testid="checkbox-remember"
              />
              <label htmlFor="remember" className="text-base text-gray-200 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-base text-emerald-400 hover:text-emerald-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30" 
            disabled={isLoading} 
            data-testid="button-signin"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-base text-gray-200 mt-10">
          Don't have an account?{' '}
          <Link href="/role-selection" className="text-emerald-400 hover:text-emerald-300 transition-colors" data-testid="link-register">
            Create one
          </Link>
        </p>

        <p className="text-center text-base text-white/60 mt-6">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
