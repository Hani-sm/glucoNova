import { useState, FormEvent, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { User, Stethoscope } from 'lucide-react';

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    
    if (!roleParam || (roleParam !== 'patient' && roleParam !== 'doctor')) {
      navigate('/role-selection');
      return;
    }
    
    setRole(roleParam as 'patient' | 'doctor');
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      navigate('/role-selection');
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      toast({
        title: 'Registration successful',
        description: 'Your account will be reviewed by our admin team',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return null;
  }

  return (
    <PublicLayout>
      <Card 
        className="w-full max-w-7xl backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl px-32 py-16 shadow-2xl"
      >
        <h1 className="text-5xl font-bold tracking-tight text-white text-center mb-4">GlucoNova</h1>
        <p className="text-3xl font-semibold text-emerald-400 text-center mb-10">Create Account</p>
        
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
            {role === 'patient' ? (
              <User className="h-6 w-6 text-emerald-400" />
            ) : (
              <Stethoscope className="h-6 w-6 text-emerald-400" />
            )}
            <span className="text-lg font-medium text-emerald-400">
              {role === 'patient' ? 'Patient Account' : 'Healthcare Provider Account'}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <Label htmlFor="name" className="text-gray-200 text-lg font-medium mb-3 block">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-6 bg-white/5 border border-white/10 text-white text-xl placeholder-gray-400 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              placeholder="Enter your full name"
              required
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-200 text-lg font-medium mb-3 block">Email</Label>
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
              placeholder="Create a strong password"
              required
              data-testid="input-password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-200 text-lg font-medium mb-3 block">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 px-6 bg-white/5 border border-white/10 text-white text-xl placeholder-gray-400 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              placeholder="Re-enter your password"
              required
              data-testid="input-confirm-password"
            />
          </div>

          <Card className="p-5 bg-white/5 border-white/10">
            <p className="text-base text-white/60">
              Your account will be reviewed by our admin team. You'll receive an email notification upon approval.
            </p>
          </Card>

          <Button 
            type="submit" 
            className="w-full h-14 text-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30" 
            disabled={isLoading} 
            data-testid="button-create-account"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-base text-gray-200 mt-10">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors" data-testid="link-login">
            Log in
          </Link>
        </p>

        <p className="text-center text-base text-white/60 mt-6">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
