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
        className="w-full max-w-lg backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-10 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2">GlucoNova</h1>
        <p className="text-xl font-semibold text-emerald-400 text-center mb-8">Create Account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-200 text-sm mb-2 block">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              placeholder="Enter your full name"
              required
              data-testid="input-name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-200 text-sm mb-2 block">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              placeholder="email@example.com"
              required
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-200 text-sm mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              placeholder="Create a strong password"
              required
              data-testid="input-password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-200 text-sm mb-2 block">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              placeholder="Re-enter your password"
              required
              data-testid="input-confirm-password"
            />
          </div>

          <div>
            <Label className="text-gray-200 text-sm mb-2 block">Role</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setRole('patient')}
                className={role === 'patient' ? 'flex-1 bg-emerald-600 hover:bg-emerald-500 text-white' : 'flex-1 bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10'}
                variant={role === 'patient' ? 'default' : 'outline'}
                data-testid="button-role-patient"
              >
                Patient
              </Button>
              <Button
                type="button"
                onClick={() => setRole('doctor')}
                className={role === 'doctor' ? 'flex-1 bg-emerald-600 hover:bg-emerald-500 text-white' : 'flex-1 bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10'}
                variant={role === 'doctor' ? 'default' : 'outline'}
                data-testid="button-role-doctor"
              >
                Healthcare Provider
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {role === 'patient' 
                ? 'Manage your diabetes with personalized predictions'
                : 'Access patient records and provide remote care'}
            </p>
          </div>

          <Card className="p-3 bg-white/5 border-white/10">
            <p className="text-xs text-white/60">
              Your account will be reviewed by our admin team. You'll receive an email notification upon approval.
            </p>
          </Card>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/25" 
            disabled={isLoading} 
            data-testid="button-create-account"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-200 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors" data-testid="link-login">
            Log in
          </a>
        </p>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
