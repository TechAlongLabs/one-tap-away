// =============================================================
// backendApiService.ts
// Handles all communication with the backend API.
// Only sendChatMessage() is exported — internal helpers stay private to this module.
// =============================================================

/** URL of the backend chat endpoint */
const API_URL = "/chat_with_semantic_search";

/** HTTP headers shared across all requests */
const HEADERS = {
  "Content-Type": "application/json",
};

/**
 * Serializes the user message into the JSON format the backend expects.
 * @param message - The user's message string
 * @returns A JSON string, e.g. '{"message":"hello"}'
 */
function _buildRequestBody(message: string): string {
  return JSON.stringify({ message });
}

/**
 * Validates the fetch response and parses it as JSON.
 * Throws an error if the HTTP status indicates a failure (4xx / 5xx).
 *
 * @param response - The Response object returned by fetch()
 * @returns The parsed backend response object: { response: string }
 */
async function _handleApiResponse(
  response: Response,
): Promise<{ response: string }> {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Sends the user's message to the backend and returns the AI response.
 * Called by handleSend() in App.tsx.
 *
 * @param message - The user's message string
 * @returns A promise resolving to { response: string }
 */
export async function sendChatMessage(
  message: string,
): Promise<{ response: string }> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: _buildRequestBody(message),
  });
  return _handleApiResponse(response);
}
