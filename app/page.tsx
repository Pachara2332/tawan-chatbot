"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "สวัสดีครับ ผมคือ Tawan ยินดีให้คำปรึกษาและพูดคุยกับคุณครับ",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    if (!content || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "ไม่สามารถเรียก API ได้");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply?.content ?? "ขอโทษครับ ผมยังตอบไม่ได้ตอนนี้",
        },
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

      setError(message);
      setMessages((current) => current.slice(0, -1));
      setInput(content);
      requestAnimationFrame(() => inputRef.current?.focus());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#f6f4ee] text-[#191814]">
      <section className="mx-auto flex w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[#ded8ca] pb-4">
          <div>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Tawan Chatbot
            </h1>
          </div>
          <div className="hidden rounded-full border border-[#d6c8ae] bg-white px-4 py-2 text-sm font-medium text-[#5d4b32] shadow-sm sm:block">
            Gemini 2.5 Flash
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col py-5">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[86%] rounded-lg px-4 py-3 text-base leading-7 shadow-sm sm:max-w-[72%] ${message.role === "user"
                    ? "bg-[#1d7a6f] text-white"
                    : "border border-[#ded8ca] bg-white text-[#24221d]"
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border border-[#ded8ca] bg-white px-4 py-3 text-[#5d4b32] shadow-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1d7a6f]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1d7a6f] delay-150" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1d7a6f] delay-300" />
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-5 border-t border-[#ded8ca] pt-4"
          >
            {error ? (
              <p className="mb-3 rounded-md border border-[#e0b4a2] bg-[#fff7f3] px-3 py-2 text-sm text-[#92412c]">
                {error}
              </p>
            ) : null}

            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="พิมพ์ข้อความของคุณ..."
                rows={1}
                className="min-h-12 flex-1 resize-none rounded-lg border border-[#d6c8ae] bg-white px-4 py-3 text-base leading-6 outline-none transition focus:border-[#1d7a6f] focus:ring-2 focus:ring-[#1d7a6f]/20"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-12 rounded-lg bg-[#191814] px-5 text-sm font-semibold text-white transition hover:bg-[#2b2923] disabled:cursor-not-allowed disabled:bg-[#bdb6a8]"
              >
                ส่ง
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
