// =============================================================
// App.tsx
// Root component of the application.
// Manages chat state, message send/reset logic, and the overall
// layout (navbar + chat area + input bar).
// =============================================================

import { useState, useRef, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import UserPanel from "./components/UserPanel";
import AIResponsePanel from "./components/AIResponsePanel";
import { sendChatMessage } from "./services/backendApiService";
import type { Message } from "./types";
import "./App.css";

const GREETING_MESSAGE = `I am here to support you today!

Before we start, I would like to let you know that my information is for **organizations in BC, Canada,** primarily in **Metro Vancouver**.

The information has been carefully selected in partnership with Vancouver & Lower Mainland Multicultural Family Support Services Society (VLMFSS).

Each time you use the chatbot, your internet browser may store conversation history.

Please also note your internet browser may store conversation history.
If you want to remove all traces of the websites you have browsed, please clear your browser's cache.
- [Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4)
- [Google Chrome](https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DDesktop&hl=en&oco=1)
- [Firefox](https://support.mozilla.org/en-US/kb/how-clear-firefox-cache)
- [Safari](https://www.macrumors.com/how-to/clear-safari-cache/)`;

function now(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [aiResponses, setAiResponses] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  // Greeting message shown once after "Start Chat" is clicked
  const [greetingMessage, setGreetingMessage] = useState<Message | null>(null);

  // Ref attached to an invisible div at the bottom of the message list,
  // used to auto-scroll to the latest message
  const bottomRef = useRef<HTMLDivElement>(null);

  // True before the user sends any message — controls Welcome screen visibility
  const isFirstMessage = userMessages.length === 0;

  // Scroll to the bottom whenever a new message is added or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, aiResponses, loading]);

  /**
   * Called when the user submits a message.
   * 1) Appends the user message to the list
   * 2) Calls the backend API
   * 3) Appends the AI response to the list
   *
   * @param message - The text string the user submitted
   */
  const handleSend = async (message: string) => {
    setUserMessages((prev) => [...prev, { text: message, ts: now() }]);
    setLoading(true);
    try {
      const { response } = await sendChatMessage(message);
      setAiResponses((prev) => [...prev, { text: response, ts: now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserMessages([]);
    setAiResponses([]);
    setGreetingMessage(null);
    setChatStarted(false);
  };

  // Show typing indicator then inject the greeting message
  const handleStartChat = async () => {
    setChatStarted(true);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGreetingMessage({ text: GREETING_MESSAGE, ts: now() });
    setLoading(false);
  };

  /**
   * Called when the user clicks "Quick Exit".
   * Uses window.location.replace() to redirect to Google immediately.
   * replace() overwrites the current history entry so the user cannot
   * navigate back to this app using the browser's back button —
   * an important safety behaviour for sensitive resource apps.
   */
  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  // Build a chronologically interleaved array of user and AI messages:
  // userMessages[0] → aiResponses[0] → userMessages[1] → aiResponses[1] ...
  const maxLen = Math.max(userMessages.length, aiResponses.length);
  const interleaved = Array.from({ length: maxLen }).flatMap((_, i) => {
    const items = [];
    if (userMessages[i])
      items.push({ type: "user" as const, data: userMessages[i] });
    if (aiResponses[i])
      items.push({ type: "ai" as const, data: aiResponses[i] });
    return items;
  });

  return (
    <div className="page">
      <div className="chat-box">
        <nav className="nav" aria-label="Main navigation">
          <span className="nav__logo">TechAlong Labs</span>
          <a href="#about" className="nav__link">
            About
          </a>
          <a href="#projects" className="nav__link">
            Projects
          </a>
          <a href="#donate" className="nav__link">
            Donate
          </a>
          <a href="#contact" className="nav__link">
            Contact
          </a>
        </nav>
        {/* ── Top navigation bar ── */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-left">
              {/* <span className="nav-brand">TechAlong Labs</span> */}
              {/* FAQ links SFU (Not defined yet) */}
              <a
                href="https://www.sfu.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                FAQ
              </a>
              {/* Clears all messages and returns to the Welcome screen */}
              <button className="nav-link nav-btn-reset" onClick={handleReset}>
                Reset Chat
              </button>
            </div>
            {/* Redirects to Google immediately; back-navigation is blocked via replace() */}
            <button
              className="nav-quick-exit"
              onClick={handleQuickExit}
              aria-label="Quick exit – navigate away immediately"
            >
              Quick Exit
            </button>
          </div>
        </nav>

        {/* ── Main chat area ── */}
        <main className="main-content">
          <div className="chat-inner">
            {/* Welcome screen — only shown before the user clicks "Start Chat" */}
            {!chatStarted && (
              <div className="welcome">
                <div className="welcome-logo">
                  <img src="/logo-gif.gif" alt="One Tap Away logo" />
                </div>
                <div className="welcome-chat-starter">
                  <button
                    className="welcome-start-btn"
                    onClick={handleStartChat}
                  >
                    Start Chat
                  </button>
                  <p className="welcome-footer-text">
                    {`Created by `}
                    <a
                      href="https://www.sfu.ca/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      TechAlong Labs
                    </a>
                    {`. By using this chat, you agree to our `}
                    <a href="#" className="footer-link">
                      Privacy Policy
                    </a>
                    {`. `}
                  </p>
                </div>
              </div>
            )}

            {/* Message list — shown once chat has started */}
            {chatStarted && (
              <div className="messages">
                {/* Greeting message injected after Start Chat */}
                {greetingMessage && (
                  <AIResponsePanel
                    responses={[greetingMessage]}
                    loading={false}
                  />
                )}
                {interleaved.map((item, i) =>
                  item.type === "user" ? (
                    <UserPanel key={i} messages={[item.data]} />
                  ) : (
                    <AIResponsePanel
                      key={i}
                      responses={[item.data]}
                      loading={false}
                    />
                  ),
                )}
                {/* Typing indicator for greeting load and subsequent AI responses */}
                {loading && <AIResponsePanel responses={[]} loading={true} />}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </main>

        {/* ── Bottom input bar — hidden on welcome screen ── */}
        {chatStarted && (
          <div className="input-wrapper">
            <div className="input-wrapper-inner">
              <ChatInput
                onSend={handleSend}
                disabled={loading}
                isFirstMessage={isFirstMessage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
