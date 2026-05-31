// =============================================================
// UserPanel.tsx
// Renders the user's chat message bubbles, aligned to the right.
// =============================================================

import type { Message } from "../types";

interface UserPanelProps {
  /** Array of user messages to display */
  messages: Message[];
}

export default function UserPanel({ messages }: UserPanelProps) {
  return (
    <>
      {messages.map((msg, i) => (
        <div key={i} className="msg-row user">
          <div className="bubble user">{msg.text}</div>
        </div>
      ))}
    </>
  );
}
