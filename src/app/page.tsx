"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
});

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function VoiceBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I&apos;m your AI interview assistant. I&apos;m here to help you practice for your 100x interview. You can ask me questions about my background, skills, and experiences. Try asking about my life story, superpower, or how I push boundaries!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isConnected] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      const transcription = data.text;

      if (transcription.trim()) {
        await handleUserMessage(transcription);
        if (data.demo) {
          console.log(
            "Using demo transcription - add your OpenAI API key for real speech recognition"
          );
        }
      } else {
        throw new Error("No speech detected");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Error processing audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const getResponseFromAPI = async (question: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("API Error:", error);
      return "I&apos;m sorry, I&apos;m having trouble connecting right now. Please try again in a moment.";
    }
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await getResponseFromAPI(text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      speakText(response);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I&apos;m sorry, I&apos;m having trouble responding right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        handleUserMessage(inputText.trim());
        setInputText("");
      }
    }
  };

  const suggestedQuestions = [
    "What should we know about your life story?",
    "What is your #1 superpower?",
    "What are the top 3 areas you would like to grow in?",
    "What misconception do your coworkers have about you?",
    "How do you push your boundaries and limits?",
    "Tell me about your technical background",
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${manrope.className}`}
    >
      {/* Background with gradient blobs - Fixed to viewport */}
      <div className="fixed inset-0 bg-white overflow-hidden pointer-events-none z-0">
        {/* Pink blob */}
        <div
          className="fixed w-220 h-220 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #FF86E1 30%, transparent 70%)",
            top: "80%",
            left: "40%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        {/* Blue blob */}
        <div
          className="fixed w-280 h-240 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #89BCFF 0%, transparent 70%)",
            top: "70%",
            right: "35%",
            transform: "translate(50%, -50%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-20 pb-12">
          <div className="mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-normal text-gray-900">
            AI Interview Assistant
          </h1>

          {/* Connection Status Indicator */}
          <div className="mt-4 flex text-center max-w-4xl items-center space-x-2">
            <span
              className={`text-md font-medium ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isConnected ? (
                <>
                  Hi there! I&apos;m your AI interview coach.
                  <br />
                  I&apos;m here to help you practice for interviews and build
                  confidence through realistic simulations
                </>
              ) : (
                <>
                  Hi there! I&apos;m [Bot Name], your AI interview coach.
                  <br />
                  I&apos;m here to help you practice for interviews and build
                  confidence through realistic simulations
                </>
              )}
            </span>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col justify-end">
          {/* Messages Container */}
          <div className="mb-8 max-w-[883px] mx-auto w-full px-6">
            {messages.length === 1 ? (
              /* Suggestion Buttons */
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-700 mb-6">
                    Suggestions on what to ask Our AI
                  </h2>
                </div>

                {/* Suggestion Buttons - 2 rows with 3 buttons each */}
                <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleUserMessage(question)}
                      disabled={isLoading || !isConnected}
                      className="bg-white/60 hover:bg-white/80 border border-white/40 rounded-lg px-4 py-3 text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-left text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Actual Messages */
              <div className="space-y-6">
                {messages.slice(1).map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div className="max-w-lg">
                      <div className="text-sm font-medium text-gray-600 mb-2 flex items-center justify-between">
                        <span>
                          {message.sender === "user" ? "ME" : "OUR AI"}
                        </span>
                        {message.sender === "bot" && (
                          <button
                            onClick={
                              isPlaying
                                ? stopSpeaking
                                : () => speakText(message.text)
                            }
                            disabled={isLoading}
                            className={`p-1 rounded-full transition-colors ${
                              isPlaying
                                ? "bg-blue-500 text-white animate-pulse"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            } disabled:opacity-50`}
                            title={isPlaying ? "Stop speaking" : "Read aloud"}
                          >
                            {isPlaying ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="bg-white/50 border-white border-1 rounded-lg px-4 py-3">
                        <div className="text-gray-900">
                          <p className="m-0">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-lg">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        <span>OUR AI</span>
                      </div>
                      <div className="bg-white/50 border-white border-1 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isTranscribing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-lg">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        <span>ME</span>
                      </div>
                      <div className="bg-white/50 border-white border-1 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            Transcribing...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="pb-8 w-full px-6">
            <div className="relative max-w-[883px] mx-auto">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isRecording
                    ? "Listening..."
                    : "Ask me anything about your interview"
                }
                disabled={isLoading || !isConnected || isRecording}
                className="w-full bg-white border border-gray-200 rounded-lg px-6 py-4 pr-24 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#160211]/30 focus:border-transparent shadow-sm"
              />

              {/* Microphone Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || !isConnected}
                className={`absolute right-14 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } disabled:bg-gray-50 disabled:opacity-50`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Send Button */}
              <button
                onClick={() => {
                  if (inputText.trim()) {
                    handleUserMessage(inputText.trim());
                    setInputText("");
                  }
                }}
                disabled={!inputText.trim() || isLoading || !isConnected}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:opacity-50 rounded-full transition-colors"
              >
                <Send className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
