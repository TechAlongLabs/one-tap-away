// =============================================================
// types.ts
// Shared TypeScript type definitions used across the entire app.
// Define interfaces here once instead of duplicating them in each component file.
// =============================================================

/**
 * Represents a single chat message displayed in the chat window.
 * - text: the message content
 * - ts: the time the message was created, as a display string (e.g. "02:35 PM")
 */
export interface Message {
  text: string;
  ts: string;
}
