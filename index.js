// This application uses pure JavaScript. The index.tsx file has been removed.
import { getGeminiResponse } from './services/geminiService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('query-form');
  const queryInput = document.getElementById('query-input');
  const submitButton = document.getElementById('submit-button');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorMessageContainer = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const answerContainer = document.getElementById('answer');
  const placeholder = document.getElementById('placeholder');

  let isLoading = false;

  const setLoading = (loading) => {
    isLoading = loading;
    loadingIndicator.classList.toggle('hidden', !loading);
    queryInput.disabled = loading;
    
    if (loading) {
      placeholder.classList.add('hidden');
      answerContainer.classList.add('hidden');
      errorMessageContainer.classList.add('hidden');
    }
    
    updateSubmitButtonState();
  };

  const showError = (message) => {
    errorText.textContent = message;
    errorMessageContainer.classList.remove('hidden');
    placeholder.classList.add('hidden');
    answerContainer.classList.add('hidden');
  };
  
  const showAnswer = (text) => {
    // Use innerText to preserve line breaks from the response.
    answerContainer.innerText = text;
    answerContainer.classList.remove('hidden');
    placeholder.classList.add('hidden');
    errorMessageContainer.classList.add('hidden');
  }
  
  const updateSubmitButtonState = () => {
    submitButton.disabled = isLoading || !queryInput.value.trim();
  }
  
  queryInput.addEventListener('input', updateSubmitButtonState);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();
    if (!query || isLoading) return;

    setLoading(true);

    try {
      const response = await getGeminiResponse(query);
      showAnswer(response);
    } catch (err) {
      showError('Failed to get a response. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  queryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  });

  // Initial state
  updateSubmitButtonState();
});