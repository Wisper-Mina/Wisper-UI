/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

import { useTheme } from "next-themes";
import Image from "next/image";

import { toast } from "react-toastify";

import { CloseIcon } from "@/assets/svg/CloseIcon";
import { ShareIcon } from "@/assets/svg/ShareIcon";
import InformationCircle from "@/assets/svg/information-circle.svg";
import { RightArrowIcon } from "@/assets/svg/RightArrowIcon";
import { useRouter } from "next/navigation";
import { APP_URL } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { createNewChat } from "@/redux/slices/chat/thunk";
import { closeModal } from "@/redux/slices/modal/slice";
import { usePageWidth } from "@/hooks/usePageWidth";

export const CreateChat = () => {
  const [state, setState] = useState<"create" | "start">("create");

  const [chat_id, setChatId] = useState<string>("");

  const dispatch = useAppDispatch();

  const { publicKeyBase58 } = useAppSelector((state) => state.session);
  const createChat = (receipientPublicKey: string) => {
    if (!publicKeyBase58) return;
    dispatch(
      createNewChat({ senderPublicKey: publicKeyBase58, receipientPublicKey })
    ).then((res: any) => {
      if (!res?.error) {
        setChatId(res?.payload?.chat_id);
        setState("start");
      }
    });
  };

  if (state === "create") {
    return <GetRecipientPublicKey createChat={createChat} />;
  }

  if (state === "start") {
    return <StartChat chat_id={chat_id} />;
  }
};

const GetRecipientPublicKey = ({
  createChat,
}: {
  createChat: (receipientPublicKey: string) => void;
}) => {
  const [receipientPublicKey, setReceipientPublicKey] = useState<string>("");

  const pageWidth = usePageWidth();

  return (
    <div
      className={`bg-white font-roboto dark:bg-dark-bg px-5 pt-9 pb-6 rounded-[20px] flex flex-col fixed z-50 ${
        pageWidth <= 700
          ? "left-4 right-4"
          : "left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]"
      } top-1/2`}
    >
      <h5 className="text-black dark:text-white text-sm font-semibold">
        Recipient’s Public Key
      </h5>
      <label
        htmlFor=""
        className="w-full mt-2 border border-[#808080] h-9 rounded-lg px-3 py-2 flex items-center gap-x-2"
      >
        <input
          type="text"
          placeholder="Enter recipient's public key"
          className="outline-none w-full bg-transparent"
          value={receipientPublicKey}
          onChange={(e) => setReceipientPublicKey(e.target.value)}
        />
        {receipientPublicKey && (
          <button
            onClick={() => createChat(receipientPublicKey)}
            className="text-[#793EEE] hover:text-secondary dark:text-secondary dark:hover:text-primary text-sm font-semibold"
          >
            Create
          </button>
        )}
      </label>
    </div>
  );
};

const StartChat = ({ chat_id }: { chat_id: string }) => {
  const { theme } = useTheme();

  const pageWidth = usePageWidth();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(closeModal());
  };

  const chat_link = `wisper/chat/${chat_id}`;

  const chat_link_url = `${APP_URL}/chats/${chat_id}`;

  const shareUrl = () => {
    window.navigator.clipboard.writeText(chat_link_url);
    toast.success("Copied !", {
      position: "top-right",
      autoClose: 2000,
    });

    close();
  };

  const goChat = () => {
    router.push(`/chat/${chat_id}`);
    close();
  };

  return (
    <div
      className={`bg-white font-roboto dark:bg-dark-bg px-5 pt-9 pb-6 rounded-[20px] flex flex-col fixed z-50 ${
        pageWidth <= 700
          ? "left-4 right-4"
          : "left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]"
      } top-1/2`}
    >
      <button onClick={() => close()} className="absolute top-1 right-2.5">
        <CloseIcon theme={theme} />
      </button>
      <button
        onClick={shareUrl}
        className="border-secondary border rounded-lg w-full p-2 flex items-center gap-x-2 justify-between"
      >
        <p className="text-sm font-semibold flex-1 truncate">{chat_link}</p>
        <ShareIcon theme={theme} />
      </button>
      <div className="flex items-center mt-2 gap-x-1">
        <Image
          src={InformationCircle}
          alt="information circle"
          width={16}
          height={16}
        />
        <p className="font-semibold text-[8px] text-[#808080]">
          Share this link with the recipient so they can join the chat as well.
        </p>
      </div>
      <div className="flex items-center justify-end mt-2">
        <button
          onClick={goChat}
          className="bg-secondary hover:bg-primary shadow-lg px-2 py-3 rounded-2xl flex items-center gap-x-1"
        >
          <div className="min-w-8 min-h-8 rounded-full flex items-center justify-center bg-white dark:bg-black">
            <RightArrowIcon theme={theme === "dark" ? "light" : "dark"} />
          </div>
          <span className="text-sm">Go Chat</span>
        </button>
      </div>
    </div>
  );
};
