import { useState } from "react";
import {
  Bot,
  Send,
  User,
  Wind,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";


const suggestedQuestions = [
  "Is it safe to run outside?",
  "What should I do at AQI 145?",
  "When is the safer time for outdoor activity?",
  "Why should I reduce outdoor exposure?",
];


function getDemoResponse(question) {

  const text = question.toLowerCase();


  if (
    text.includes("run") ||
    text.includes("running") ||
    text.includes("exercise")
  ) {

    return {
      title: "Outdoor activity guidance",
      answer:
        "The current demo AQI is 85, while the forecast reaches AQI 102 around 3 PM. For prolonged or high-intensity outdoor exercise, consider choosing a lower-AQI period when possible.",
      type: "moderate",
    };

  }


  if (
    text.includes("145") ||
    text.includes("aqi")
  ) {

    return {
      title: "Understanding AQI 145",
      answer:
        "In this prototype, AQI 145 falls in the 'Unhealthy for Sensitive Groups' range. Consider reducing prolonged or high-intensity outdoor activity and monitor conditions before spending extended time outside.",
      type: "caution",
    };

  }


  if (
    text.includes("safer") ||
    text.includes("time") ||
    text.includes("when")
  ) {

    return {
      title: "Lower-risk forecast periods",
      answer:
        "The current demo forecast shows AQI below 100 at several displayed times, including Now, 1 PM, 2 PM, 4 PM, 5 PM and 6 PM. The highest displayed AQI is 102 at 3 PM.",
      type: "good",
    };

  }


  if (
    text.includes("why") ||
    text.includes("exposure")
  ) {

    return {
      title: "Why exposure matters",
      answer:
        "AirShield's prototype Exposure Index combines AQI, activity intensity and duration. More intense or prolonged outdoor activity can produce a higher prototype exposure score when air quality is elevated.",
      type: "info",
    };

  }


  return {
    title: "AirShield guidance",
    answer:
      "Based on the current demo conditions, monitor AQI and forecast changes before prolonged outdoor activity. For more specific guidance, ask about AQI, outdoor exercise, exposure or safer forecast periods.",
    type: "info",
  };

}


export default function Assistant() {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      title: "Welcome to AirShield Assistant",
      text:
        "I can help you understand air-quality conditions, exposure and forecast trends. Ask me what the current conditions could mean for your outdoor activity.",
      type: "info",
    },
  ]);


  function sendMessage(messageText = input) {

    const trimmed = messageText.trim();

    if (!trimmed) return;


    const response = getDemoResponse(trimmed);


    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };


    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      title: response.title,
      text: response.answer,
      type: response.type,
    };


    setMessages((current) => [
      ...current,
      userMessage,
      assistantMessage,
    ]);

    setInput("");

  }


  function handleSubmit(event) {

    event.preventDefault();

    sendMessage();

  }


  return (

    <main className="assistant-page">


      {/* HEADER */}

      <section className="assistant-header">

        <div>

          <span className="dashboard-label">
            AIRSHIELD INTELLIGENCE
          </span>

          <h1>
            AI Assistant
          </h1>

          <p>
            Ask questions about air quality, exposure,
            forecast conditions and practical precautions.
          </p>

        </div>


        <div className="assistant-status">

          <span className="assistant-status-dot" />

          Demo Assistant

        </div>

      </section>


      {/* MAIN GRID */}

      <section className="assistant-grid">


        {/* CHAT */}

        <div className="assistant-chat-card">


          {/* CHAT HEADER */}

          <div className="assistant-chat-header">

            <div className="assistant-bot-icon">
              <Bot size={21} />
            </div>

            <div>

              <h2>
                AirShield Assistant
              </h2>

              <p>
                Environmental decision support
              </p>

            </div>

          </div>


          {/* MESSAGES */}

          <div className="assistant-messages">

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "chat-message user-message"
                    : "chat-message assistant-message"
                }
              >

                <div className="message-avatar">

                  {message.role === "user"
                    ? <User size={15} />
                    : <Bot size={15} />
                  }

                </div>


                <div className="message-content">

                  {message.title && (

                    <strong>
                      {message.title}
                    </strong>

                  )}

                  <p>
                    {message.text}
                  </p>

                </div>

              </div>

            ))}

          </div>


          {/* INPUT */}

          <form
            className="assistant-input-area"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask about air quality or exposure..."
            />

            <button
              type="submit"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>

          </form>


          <p className="assistant-input-note">
            Demo responses currently use AirShield's
            illustrative environmental data.
          </p>

        </div>


        {/* SIDE PANEL */}

        <aside className="assistant-side">


          {/* CURRENT CONTEXT */}

          <div className="assistant-context-card">

            <div className="assistant-card-heading">

              <div className="assistant-small-icon">
                <Wind size={17} />
              </div>

              <div>

                <h3>
                  Current Context
                </h3>

                <p>
                  Data available to the assistant
                </p>

              </div>

            </div>


            <div className="context-row">

              <span>
                AQI
              </span>

              <strong>
                85
              </strong>

            </div>


            <div className="context-row">

              <span>
                PM2.5
              </span>

              <strong>
                42 µg/m³
              </strong>

            </div>


            <div className="context-row">

              <span>
                Exposure Index
              </span>

              <strong>
                32 /100
              </strong>

            </div>


            <div className="context-row">

              <span>
                Forecast Peak
              </span>

              <strong>
                102 · 3 PM
              </strong>

            </div>

          </div>


          {/* SUGGESTIONS */}

          <div className="assistant-suggestions-card">

            <div className="assistant-card-heading">

              <div className="assistant-small-icon">
                <Activity size={17} />
              </div>

              <div>

                <h3>
                  Try asking
                </h3>

                <p>
                  Quick questions
                </p>

              </div>

            </div>


            <div className="suggestion-list">

              {suggestedQuestions.map((question) => (

                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>

              ))}

            </div>

          </div>


          {/* SAFETY */}

          <div className="assistant-safety-card">

            <div className="assistant-safety-icon">
              <ShieldCheck size={18} />
            </div>

            <div>

              <strong>
                Evidence-aware guidance
              </strong>

              <p>
                The assistant should use available
                environmental data and clearly communicate
                uncertainty.
              </p>

            </div>

          </div>


        </aside>

      </section>


      {/* DISCLAIMER */}

      <div className="assistant-disclaimer">

        <AlertTriangle size={16} />

        <p>
          AirShield Assistant is an environmental
          decision-support prototype. It does not diagnose
          medical conditions, predict individual health
          outcomes or replace professional advice.
        </p>

      </div>


    </main>

  );

}