import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BouncingDotsLoader from "../BouncingDotsLoader";

import "./CopyButton.scss";
import "./BotIcon.scss";

import api from "../../api";

function CopyToClipboardButton({ children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <CopyToClipboard text={children} onCopy={handleCopy}>
        <>
          <br />
          <button>Copy to clipboard with button</button>
        </>
      </CopyToClipboard>
      {copied && <div className="copy-message">Copied!</div>}
    </>
  );
}

const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={xonokai}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        <CopyToClipboardButton>{children}</CopyToClipboardButton>

        <SyntaxHighlighter
          style={xonokai}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </code>
    );
  },
};

function NewlineText(props) {
  let text = props.text;
  return (
    <div className="answer">
      <img
        className="bot-icon"
        src={process.env.PUBLIC_URL + "/bot-icon.png"}
        alt="bot"
      />
      <div className="answer-container">
        <ReactMarkdown components={CodeBlock}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

function ChatHistory() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [lastMessageID, setLastMessageID] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await toast.promise(
        api.get(`/api/chatgpt/${id}/messages`),
        {
          pending: "Loading conversation...",
          // success: "Finished loading conversation 👌",
          error: `Unable to load conversation ${id} 🤯`,
        }
      );

      setMessages(response.data);
      let lastMessageId = null;

      for (const message of response.data) {
        lastMessageId = message.messageId;
      }
      setLastMessageID(lastMessageId);
    } catch (error) {
      navigate(`/chat/`);

      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/api/chatgpt/question", {
        prompt: inputValue,
        parentMessageId: lastMessageID,
        chatId: id,
      });

      setLastMessageID(response.data.message_id);
      fetchMessages();
      setInputValue("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Chat History</h1>
      {messages.map((message, index) => (
        <>
          <div className="question">
            <img
              className="bot-icon"
              src={process.env.PUBLIC_URL + "/human-icon.png"}
              alt="bot"
            />
            <div className="question-container">
              <SyntaxHighlighter
                style={xonokai}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
              >
                {message.prompt}
              </SyntaxHighlighter>
            </div>
          </div>

          <NewlineText text={message.response} />
        </>
      ))}
      <form onSubmit={handleSubmit}>
        <textarea
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={loading}
        />
        {loading && <BouncingDotsLoader />}
        {!loading && <button type="submit">Ask</button>}
      </form>
    </div>
  );
}

export default ChatHistory;
