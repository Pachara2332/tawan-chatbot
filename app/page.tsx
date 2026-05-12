"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickPrompts = [
  "ช่วย debug โค้ดหน่อย",
  "คิดไอเดียโปรเจกต์",
  "จัดตารางฟิตเนส",
  "/analyst วิเคราะห์ให้หน่อย",
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "ดีครับอ้าย",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  function handleQuickPrompt(prompt: string) {
    setInput(prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

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
          content:
            data.reply?.content ??
            "ขอโทษครับ ตอนนี้ตะวันยังไม่มีคำตอบจากโมเดล",
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
    <main className="flex min-h-screen bg-[#f5f2ec] text-[#181713]">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-6">
        <header className="mb-4 rounded-lg border border-[#ded7c8] bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#173f35] text-sm font-black text-[#d9f99d]">
                T
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  Tawan Chatbot
                </h1>
                <p className="mt-0.5 text-sm text-[#6f6758]">
                  คุยง่าย ช่วยคิด ช่วยแก้ปัญหา แบบไม่เป็นทางการเกินไป
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-md border border-[#d8d0bf] bg-[#fbfaf6] px-3 py-2 text-sm font-medium text-[#514a3e] sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-[#28a46a]" />
              Online
            </div>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#ded7c8] bg-[#fffdf8] shadow-sm">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[88%] sm:max-w-[72%]`}>
                    <p
                      className={`mb-1 text-xs font-semibold ${
                        isUser ? "text-right text-[#68705a]" : "text-[#68705a]"
                      }`}
                    >
                      {isUser ? "คุณ" : "ตะวัน"}
                    </p>
                    <div
                      className={`rounded-lg px-4 py-3 text-base leading-7 shadow-sm ${
                        isUser
                          ? "bg-[#173f35] text-white"
                          : "border border-[#e5dece] bg-white text-[#24221d]"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-lg border border-[#e5dece] bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#173f35]" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#173f35] delay-150" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#173f35] delay-300" />
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#ded7c8] bg-[#fbfaf6] p-4"
          >
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="shrink-0 rounded-md border border-[#d8d0bf] bg-white px-3 py-2 text-sm font-medium text-[#514a3e] transition hover:border-[#173f35] hover:text-[#173f35]"
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                className="min-h-12 flex-1 resize-none rounded-lg border border-[#d8d0bf] bg-white px-4 py-3 text-base leading-6 outline-none transition placeholder:text-[#9b927f] focus:border-[#173f35] focus:ring-2 focus:ring-[#173f35]/15"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-12 min-w-20 rounded-lg bg-[#173f35] px-5 text-sm font-bold text-white transition hover:bg-[#22594b] disabled:cursor-not-allowed disabled:bg-[#bdb6a8]"
              >
                ส่ง
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
