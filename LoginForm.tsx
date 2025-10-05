import { useState } from 'react';

import { Button } from './ui/button';

import { Input } from './ui/input';

import { Label } from './ui/label';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

import { authApi } from '@/lib/api';

import { useToast } from './ui/use-toast';
 
interface LoginFormProps {

  onLoginSuccess: () => void;

}
 
export function LoginForm({ onLoginSuccess }: LoginFormProps) {

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
 
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!username || !password) {

      toast({

        title: "Error",

        description: "Please enter both username and password",

        variant: "destructive",

      });

      return;

    }
 
    setIsLoading(true);

    try {

      await authApi.login(username, password);

      toast({

        title: "Success",

        description: "Logged in successfully",

      });

      onLoginSuccess();

    } catch (error) {

      toast({

        title: "Login Failed",

        description: error instanceof Error ? error.message : "Invalid credentials",

        variant: "destructive",

      });

    } finally {

      setIsLoading(false);

    }

  };
 
  return (
<div className="flex items-center justify-center min-h-screen bg-background">
<Card className="w-full max-w-md">
<CardHeader>
<CardTitle>Login</CardTitle>
<CardDescription>

            Enter your credentials to access the channels
</CardDescription>
</CardHeader>
<CardContent>
<form onSubmit={handleSubmit} className="space-y-4">
<div className="space-y-2">
<Label htmlFor="username">Username</Label>
<Input

                id="username"

                type="text"

                value={username}

                onChange={(e) => setUsername(e.target.value)}

                placeholder="Enter your username"

                disabled={isLoading}

              />
</div>
<div className="space-y-2">
<Label htmlFor="password">Password</Label>
<Input

                id="password"

                type="password"

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                placeholder="Enter your password"

                disabled={isLoading}

              />
</div>
<Button 

              type="submit" 

              className="w-full" 

              disabled={isLoading}
>

              {isLoading ? "Logging in..." : "Login"}
</Button>
</form>
</CardContent>
</Card>
</div>

  );

}
 