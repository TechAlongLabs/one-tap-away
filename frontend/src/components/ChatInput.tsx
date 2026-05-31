// =============================================================
// ChatInput.tsx
// Bottom input bar component.
// Contains the text area, send button, suggestion chips, and footer links.
// =============================================================

import { useState, useRef } from "react";
import SendButton from "./SendButton";

/** Quick-select suggestion prompts shown to the user before their first message */
const SUGGESTION_CHIPS = [
  "I am not sure what to do.",
  "I need legal help for family matters.",
  "I need a safe place to go.",
  "I need someone to talk to confidentially.",
];

interface ChatInputProps {
  /** Callback invoked when the user submits a message; receives the message string */
  onSend: (message: string) => void;
  /** When true, disables the input and buttons (used while waiting for an AI response) */
  disabled?: boolean;
  /** When true, shows the Welcome-screen placeholder text and suggestion chips */
  isFirstMessage?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
  isFirstMessage = true,
}: ChatInputProps) {
  // Current value of the text input
  const [message, setMessage] = useState("");

  // Ref for the chips scroll container, used to programmatically scroll left/right
  const chipsRef = useRef<HTMLDivElement>(null);
  // Ref for the textarea, used to restore focus after sending a message
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Handles message submission.
   * If `text` is provided directly (e.g. from a chip click), it is used as-is.
   * Otherwise falls back to the current textarea value.
   *
   * @param text - The message to send (defaults to the current textarea content)
   */
  const handleSend = (text: string = message) => {
    const trimmed = text.trim();
    // Do nothing if the message is empty or the input is disabled
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
    textareaRef.current?.focus();
  };

  /**
   * Handles keyboard events inside the textarea.
   * Enter alone submits the message; Shift+Enter inserts a newline.
   */
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Scrolls the suggestion chips container left or right.
   * @param dir - Scroll direction: "left" or "right"
   */
  const scrollChips = (dir: "left" | "right") => {
    if (!chipsRef.current) return;
    chipsRef.current.scrollBy({
      left: dir === "left" ? -160 : 160,
      behavior: "smooth",
    });
  };

  return (
    <div className="input-bar">
      {/* ── Suggestion chips row — always visible ── */}
      <div className="chips-row">
        <button
          className="chips-chevron"
          onClick={() => scrollChips("left")}
          aria-label="Scroll chips left"
        >
          &#8249;
        </button>
        <div className="chips-container" ref={chipsRef}>
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              className="chip"
              onClick={() => handleSend(chip)}
              disabled={disabled}
            >
              {chip}
            </button>
          ))}
        </div>
        <button
          className="chips-chevron"
          onClick={() => scrollChips("right")}
          aria-label="Scroll chips right"
        >
          &#8250;
        </button>
      </div>

      {/* ── Text input row ── */}
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="input-field"
          rows={1}
          placeholder={
            isFirstMessage
              ? "What seems to be the biggest concern on your mind?"
              : "Type your response..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
        />
        <SendButton
          onClick={() => handleSend()}
          disabled={!message.trim() || disabled}
        />
      </div>

      {/* ── Privacy policy notice ── */}
      <div className="input-footer">
        Created by{" "}
        <a href="#" className="footer-link">
          TechAlong Labs
        </a>
        . By using this chat, you agree to our{" "}
        <a href="#" className="footer-link">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
