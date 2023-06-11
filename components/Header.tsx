"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CpuChipIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-xl">
        <div
          className="
          absolute
          top-0
          left-0
          w-full
          h-96
          bg-gradient-to-br
          from-[#56E1E8]
          to-[#590FB7]
          rounded-md
          filter
          blur-3xl
          opacity-50
          -z-50
          "
        />

        <Image
          src="/Logo.svg"
          alt="W.Task Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Pesquisar
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="Weslley Moura" round size="50" color="#1FD0D9" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm p-5 font-light pr-5 shadow-xl rounded-xl w-fit italic max-w-3xl text-[#096E73] bg-white">
          <CpuChipIcon
            className={`inline-block h-10 w-10 text-[#1FD0D9] mr-1
          ${loading && "animate-spin"}
          `}
          />
          {suggestion && !loading
            ? suggestion
            : "A inteligência GPT está organizando suas atividades de hoje..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
