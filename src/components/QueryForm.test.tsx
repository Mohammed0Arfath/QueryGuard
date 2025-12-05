/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QueryForm from '../components/QueryForm';

// Mock the API module
jest.mock('../lib/api');

describe('QueryForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders query form with textarea and submit button', () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    expect(screen.getByLabelText(/medical query/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze query/i })).toBeInTheDocument();
  });

  it('allows user to type in the textarea', async () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'What are the symptoms of diabetes?');
    
    expect(textarea.value).toBe('What are the symptoms of diabetes?');
  });

  it('displays character count', async () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i);
    await userEvent.type(textarea, 'Test query');
    
    expect(screen.getByText(/10\/1000/)).toBeInTheDocument();
  });

  it('disables submit button when query is empty', () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const submitButton = screen.getByRole('button', { name: /analyze query/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when query is valid', async () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i);
    await userEvent.type(textarea, 'What is diabetes?');
    
    const submitButton = screen.getByRole('button', { name: /analyze query/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('handles form submission for allowed query', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i);
    await userEvent.type(textarea, 'What are the symptoms of diabetes?');
    
    const submitButton = screen.getByRole('button', { name: /analyze query/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'What are the symptoms of diabetes?',
        { privacyNoise: false }
      );
    });
  });

  it('handles form submission for blocked query', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i);
    await userEvent.type(textarea, 'How to hack medical databases?');
    
    const submitButton = screen.getByRole('button', { name: /analyze query/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'How to hack medical databases?',
        { privacyNoise: false }
      );
    });
  });

  it('displays loading state during submission', () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={true} error={null} />);
    
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    
    const textarea = screen.getByLabelText(/medical query/i);
    expect(textarea).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Failed to analyze query';
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('validates query length exceeding maximum', async () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i);
    const longQuery = 'a'.repeat(1001); // Exceeds 1000 char limit
    
    await userEvent.type(textarea, longQuery);
    
    // Due to maxLength attribute, only 1000 chars should be in the textarea
    expect((textarea as HTMLTextAreaElement).value.length).toBe(1000);
  });

  it('toggles privacy noise checkbox', async () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const checkbox = screen.getByLabelText(/enable privacy noise/i) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    
    await userEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    
    await userEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('prevents submission when validation error exists', async () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    // Try to submit empty query
    const submitButton = screen.getByRole('button', { name: /analyze query/i });
    
    expect(submitButton).toBeDisabled();
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('has accessible form labels and aria attributes', () => {
    render(<QueryForm onSubmit={mockOnSubmit} isLoading={false} error={null} />);
    
    const textarea = screen.getByLabelText(/medical query/i);
    expect(textarea).toHaveAttribute('aria-describedby');
    
    const privacyCheckbox = screen.getByLabelText(/enable privacy noise/i);
    expect(privacyCheckbox).toBeInTheDocument();
  });
});