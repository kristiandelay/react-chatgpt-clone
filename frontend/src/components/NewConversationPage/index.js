import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BouncingDotsLoader from "../BouncingDotsLoader";

import api from "../../api";

function NewConversationPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const res = await api.post("/api/chatgpt/question", { prompt: question });
      console.log(res);
      setResponse(res.data);
      setLoading(false);

        // Redirect to the new chat page after submission
        navigate(`/chat/${res.data.chatId}`,{ replace: true });
        window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          type="text" 
          value={question}
          onChange={(event) => { 
            event.target.style.height = 'auto';
            event.target.style.height = `${Math.min(event.target.scrollHeight, 250)}px`;
            setQuestion(event.target.value)}
          }
          disabled={loading} 
           />
        {loading && <BouncingDotsLoader />}
        {!loading && <button type="submit">Ask</button>}
       
      </form>
      <p>{response.text}</p>
    </div>
  );
}

export default NewConversationPage;
