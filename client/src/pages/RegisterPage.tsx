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
      <div className="relative w-full max-w-lg">
        {/* Floating Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 animate-float-slow -z-10"></div>
        
        {/* Enhanced Glass Card */}
        <Card 
          className="w-full p-10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl"
          style={{
            background: 'radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent text-center mb-8">
            Create Your GlucoNova Account
          </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-cyan-100">Full Name</Label>
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
            <Label htmlFor="email" className="text-cyan-100">Email</Label>
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
            <Label htmlFor="password" className="text-cyan-100">Password</Label>
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
            <Label htmlFor="confirmPassword" className="text-cyan-100">Confirm Password</Label>
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
            <Label className="text-cyan-100 mb-2 block">Role</Label>
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
            <p className="text-sm text-cyan-100/70 mt-2">
              {role === 'patient' 
                ? 'Manage your diabetes with personalized predictions'
                : 'Access patient records and provide remote care'}
            </p>
          </div>

          <Card className="p-3 bg-white/5 border-white/10">
            <p className="text-xs text-cyan-100/70">
              Your account will be reviewed by our admin team. You'll receive an email notification upon approval.
            </p>
          </Card>

          <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg" disabled={isLoading} data-testid="button-create-account">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-cyan-100/70 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-cyan-300 hover:underline" data-testid="link-login">
            Log in
          </a>
        </p>
        </Card>
      </div>
    </PublicLayout>
  );
}
