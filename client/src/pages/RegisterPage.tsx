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
      <Card className="w-full max-w-lg p-10 bg-slate-900/70 backdrop-blur-lg border-white/10">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Create Your GlucoNova Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
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
            <Label htmlFor="email" className="text-foreground">Email</Label>
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
            <Label htmlFor="password" className="text-foreground">Password</Label>
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
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
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
            <Label className="text-foreground mb-2 block">Role</Label>
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
            <p className="text-sm text-muted-foreground mt-2">
              {role === 'patient' 
                ? 'Manage your diabetes with personalized predictions'
                : 'Access patient records and provide remote care'}
            </p>
          </div>

          <Card className="p-3 bg-secondary/30 border-white/10">
            <p className="text-xs text-muted-foreground">
              Your account will be reviewed by our admin team. You'll receive an email notification upon approval.
            </p>
          </Card>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading} data-testid="button-create-account">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-accent hover:underline" data-testid="link-login">
            Log in
          </a>
        </p>
      </Card>
    </PublicLayout>
  );
}
