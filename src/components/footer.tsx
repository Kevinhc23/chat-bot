"use client";

import { useRef, useCallback, useState } from "react";

export const Playground = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      if (textarea.scrollHeight > 60) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }
  }, []);

  return (
    <>
      <div className="py-8 px-5 w-full sticky bottom-0 bg-[#212121] border-t border-[#505050]">
        <div className="">
          <form className="">
            <textarea
              ref={textareaRef}
              onInput={adjustTextareaHeight}
              className={`w-full bg-[#2f2f2f] py-4 px-16 text-white focus:border-0 relative focus:outline-none text-xl placeholder:text-white h-auto overflow-hidden resize-none ${
                isExpanded ? "rounded-2xl" : "rounded-full"
              }`}
              placeholder="Envia una nota de audio"
              rows={1}
            />
            <button className="absolute left-8 bottom-12 p-2 rounded-full">
              <PaperClip />
            </button>
            <button
              className="absolute right-8 bottom-12 bg-[#505050] p-2 rounded-full"
              type="submit"
            >
              <ArrowUpIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#212121"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5v14" />
    <path d="M18 11l-6 -6" />
    <path d="M6 11l6 -6" />
  </svg>
);

export const PaperClip = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-paperclip"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5" />
  </svg>
);
