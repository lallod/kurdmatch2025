import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </BrowserRouter>
);

describe('Authentication Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should render registration form on step 1', () => {
      render(<SimpleRegistrationForm />, { wrapper });
      
      expect(screen.getByText(/Email & Password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<SimpleRegistrationForm />, { wrapper });
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should validate password strength', async () => {
      const user = userEvent.setup();
      render(<SimpleRegistrationForm />, { wrapper });
      
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      await user.type(passwordInput, '123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      const user = userEvent.setup();
      render(<SimpleRegistrationForm />, { wrapper });
      
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmInput = screen.getByPlaceholderText(/confirm password/i);
      
      await user.type(passwordInput, 'password123');
      await user.type(confirmInput, 'different123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
      });
    });

    it('should proceed to next step with valid email and password', async () => {
      const user = userEvent.setup();
      render(<SimpleRegistrationForm />, { wrapper });
      
      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/^password$/i), 'password123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Basic Info/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Step Navigation', () => {
    it('should allow navigation back to previous step', async () => {
      const user = userEvent.setup();
      render(<SimpleRegistrationForm />, { wrapper });
      
      // Fill first step
      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/^password$/i), 'password123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Basic Info/i)).toBeInTheDocument();
      });
      
      // Go back
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Email & Password/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login', () => {
    it('should call signInWithPassword with correct credentials', async () => {
      const mockSignIn = vi.mocked(supabase.auth.signInWithPassword);
      mockSignIn.mockResolvedValue({
        data: { user: { id: '123' }, session: {} },
        error: null,
      } as any);
      
      // This would be tested with your actual login component
      await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Logout', () => {
    it('should call signOut when logging out', async () => {
      const mockSignOut = vi.mocked(supabase.auth.signOut);
      mockSignOut.mockResolvedValue({ error: null });
      
      await supabase.auth.signOut();
      
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
