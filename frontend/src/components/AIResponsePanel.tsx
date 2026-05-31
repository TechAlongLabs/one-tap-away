// =============================================================
// AIResponsePanel.tsx
// Renders AI response bubbles with Markdown support.
// Shows a typing indicator (animated dots) while the response is loading.
// =============================================================

import ReactMarkdown from "react-markdown";
import type { Message } from "../types";

interface AIResponsePanelProps {
  /** Array of AI response messages to display */
  responses: Message[];
  /** When true, hides responses and shows a typing indicator instead */
  loading: boolean;
}

export default function AIResponsePanel({
  responses,
  loading,
}: AIResponsePanelProps) {
  return (
    <>
      {/* Render each AI response as a Markdown-formatted bubble */}
      {responses.map((res, i) => (
        <div key={i} className="msg-row ai">
          {/* <div className="msg-avatar">ᴗ</div> */}
          {/* ReactMarkdown converts **bold**, links, etc. from the backend response into HTML */}
          <div className="bubble ai markdown-body">
            <ReactMarkdown>{res.text}</ReactMarkdown>
          </div>
        </div>
      ))}

      {/* Animated typing indicator — shown while waiting for the AI response */}
      {loading && (
        <div className="typing-row">
          {/* <div className="msg-avatar">ᴗ</div> */}
          <div className="typing-bubble">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      )}
    </>
  );
}
