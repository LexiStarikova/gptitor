import { render, fireEvent, waitFor } from '@testing-library/react';
import { ConversationPanel } from './conversationPanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import { Task } from './models/task';

global.fetch = jest.fn();

describe('handleSend', () => {
    const mockSetRequests = jest.fn();
    const mockSetResponses = jest.fn();
    const mockSetFeedback = jest.fn();
    const mockSetCriteria = jest.fn();
    const mockSetTask = jest.fn();
  
    const initialProps = {
      responses: [],
      setResponses: mockSetResponses,
      requests: [],
      setRequests: mockSetRequests,
      conversation_id: 1,
    };

    const task: Task = {task_id: 1, task_name: "", category: "", description: ""};
    const metrics: Metrics = {
        criterion_1: 1,
        criterion_2: 2,
        criterion_3: 3,
        criterion_4: 4
    };

    const renderComponent = (props = initialProps) =>
        render(
          <FeedbackContext.Provider value={{ feedback: '', setFeedback: mockSetFeedback, criteria: metrics, setCriteria: mockSetCriteria, task, setTask: mockSetTask }}>
            <ConversationPanel {...props} />
          </FeedbackContext.Provider>
        );

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should not send an empty message', async () => {
    const { getByRole } = renderComponent();
    fireEvent.click(getByRole('button', { name: /send/i }));

    expect(mockSetRequests).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should update requests and responses correctly on successful send', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        query_id: 1,
        response_id: 1,
        response_text: 'response',
        comment: 'feedback',
        metrics: {
          criterion_1: 1,
          criterion_2: 2,
          criterion_3: 3,
          criterion_4: 4,
        },
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { getByRole, getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Write Your Prompt Here.');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockSetRequests).toHaveBeenCalledWith(expect.any(Function));
      expect(mockSetResponses).toHaveBeenCalledWith(expect.any(Function));
      expect(mockSetRequests).toHaveBeenCalledTimes(2); 
      expect(mockSetResponses).toHaveBeenCalledTimes(1); 
      expect(mockSetFeedback).toHaveBeenCalledWith('feedback');
      expect(mockSetCriteria).toHaveBeenCalledWith(expect.any(Object));
    });

    
  });

  it('should handle failed send', async () => {
    const mockResponse = {
      ok: false,
      text: async () => 'error message',
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { getByRole, getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Write Your Prompt Here.');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockSetRequests).toHaveBeenCalledWith(expect.any(Function));
    });

    expect(mockSetResponses).not.toHaveBeenCalled();
    expect(mockSetFeedback).not.toHaveBeenCalled();
    expect(mockSetCriteria).not.toHaveBeenCalled();
  });

  it('should update input field height after sending a message', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        query_id: 1,
        response_id: 1,
        response_text: 'response',
        comment: 'feedback',
        metrics: {
          criterion_1: 1,
          criterion_2: 2,
          criterion_3: 3,
          criterion_4: 4,
        },
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { getByRole, getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Write Your Prompt Here.');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(input.style.height).toBe('auto');
    });
  });

  it('should log metrics correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const mockResponse = {
      ok: true,
      json: async () => ({
        query_id: 1,
        response_id: 1,
        response_text: 'response',
        comment: 'feedback',
        metrics: {
          criterion_1: 1,
          criterion_2: 2,
          criterion_3: 3,
          criterion_4: 4,
        },
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { getByRole, getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Write Your Prompt Here.');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('task_id = 1, conversation_id = 1');
      expect(consoleSpy).toHaveBeenCalledWith('Message sent successfully');
      expect(consoleSpy).toHaveBeenCalledWith(
        'query_id = 1',
        'criterion_1 = 1 \n',
        'criterion_2 = 2 \n',
        'criterion_3 = 3 \n',
        'criterion_4 = 4 \n',
      );
    });

    consoleSpy.mockRestore();
  });
});