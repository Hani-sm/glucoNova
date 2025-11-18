import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
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
      navigate('/dashboard');
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

  return (
    <PublicLayout>
      <Card 
        className="relative w-full p-10 backdrop-blur-xl bg-[#1e2a3a]/50 border border-slate-500/30 rounded-2xl shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-1">GlucoNova</h1>
        <p className="text-emerald-400 text-center mb-8">Create Account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white text-sm font-normal mb-2 block">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              required
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white text-sm font-normal mb-2 block">Email</Label>
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

          <div>
            <Label htmlFor="confirmPassword" className="text-white text-sm font-normal mb-2 block">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
              required
              data-testid="input-confirm-password"
            />
          </div>

          <div>
            <Label className="text-white text-sm font-normal mb-2 block">Role</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setRole('patient')}
                className={role === 'patient' ? 'flex-1 bg-primary text-primary-foreground' : 'flex-1'}
                variant={role === 'patient' ? 'default' : 'outline'}
                data-testid="button-role-patient"
              >
                Patient
              </Button>
              <Button
                type="button"
                onClick={() => setRole('doctor')}
                className={role === 'doctor' ? 'flex-1 bg-primary text-primary-foreground' : 'flex-1'}
                variant={role === 'doctor' ? 'default' : 'outline'}
                data-testid="button-role-doctor"
              >
                Healthcare Provider
              </Button>
            </div>
            <p className="text-sm text-white/60 mt-2">
              {role === 'patient' 
                ? 'Manage your diabetes with personalized predictions'
                : 'Access patient records and provide remote care'}
            </p>
          </div>

          <Card className="p-3 bg-slate-700/30 border-slate-600/50">
            <p className="text-xs text-white/60">
              Your account will be reviewed by our admin team. You'll receive an email notification upon approval.
            </p>
          </Card>

          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isLoading} data-testid="button-create-account">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-400 hover:underline" data-testid="link-login">
            Log in
          </a>
        </p>

        <p className="text-center text-xs text-white/40 mt-8">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
