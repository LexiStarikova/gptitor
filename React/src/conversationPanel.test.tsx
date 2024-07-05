import { render, fireEvent, waitFor } from '@testing-library/react';
import { ConversationPanel } from './conversationPanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import { Task } from './models/task';

jest.mock('node-fetch', () => require('jest-fetch-mock'));

beforeEach(() => {
    fetchMock.resetMocks();
});


test('sends a message with non-empty text', async () => {
    const setRequests = jest.fn();
    const setResponses = jest.fn();
    const setFeedback = jest.fn();
    const setCriteria = jest.fn();
    const setTask = jest.fn();
    
    fetchMock.mockResponseOnce(JSON.stringify({
        query_id: 1,
        response_id: 1,
        response_text: 'Response text',
        comment: 'Feedback comment',
        metrics: {
            criterion_1: 1.0,
            criterion_2: 2.0,
            criterion_3: 3.0,
            criterion_4: 4.0
        }
    }));

    const { getByRole } = render(
        <FeedbackContext.Provider value={{ feedback: '', setFeedback, criteria: new Metrics(0, 0, 0, 0), setCriteria, task: new Task(1, '', '', ''), setTask }}>
            <ConversationPanel 
                responses={[]} 
                setResponses={setResponses} 
                requests={[]} 
                setRequests={setRequests} 
                conversation_id={1} 
            />
        </FeedbackContext.Provider>
    );

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(getByRole('button', { name: /send/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith('http://10.100.30.244:8000/conversations/1/messages', expect.any(Object));
    expect(setRequests).toHaveBeenCalledWith(expect.any(Function));
    expect(setResponses).toHaveBeenCalledWith(expect.any(Function));
    expect(setFeedback).toHaveBeenCalledWith('Feedback comment');
    expect(setCriteria).toHaveBeenCalledWith(expect.any(Metrics));
});


