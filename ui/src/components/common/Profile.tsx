import { useState } from "react";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { DownIcon } from "@/assets/svg/DownIcon";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import SignOutIcon from "@/assets/svg/signout.svg";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { DarkIcon } from "@/assets/svg/DarkIcon";
import { LightIcon } from "@/assets/svg/LightIcon";
import { closeOverlay, openOverlay } from "@/redux/slices/overlaySlice";
import { deletePublicKeyCookie } from "@/redux/slices/session/thunk";

export const Profile = () => {
  const { image } = useAppSelector((state) => state.session);

  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeDropdown = () => {
    setIsOpen(false);
    dispatch(closeOverlay());
  };

  const ref = useOutsideClick(closeDropdown);

  const handleDropdown = () => {
    setIsOpen((prev) => {
      dispatch(openOverlay());
      return !prev;
    });
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={handleDropdown} className="flex items-center gap-x-2">
        <Image alt="user" src={`/users/${image}.svg`} width={36} height={36} />
        <DownIcon theme={theme} />
      </button>
      {isOpen && <ProfileDropdown />}
    </div>
  );
};

const ProfileDropdown = () => {
  const { publicKeyBase58 } = useAppSelector((state) => state.session);

  const { theme, setTheme } = useTheme();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const toggleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const signout = () => {
    dispatch(deletePublicKeyCookie());
    router.push("/home");
  };

  const handleProfileSettings = () => {
    //TODO: handle profile settings
  };

  const darkMode = {
    icon: <DarkIcon />,
    text: "DARK",
    bgColor: "bg-[#303539]",
    translate: "translate-x-1",
  };

  const lightMode = {
    icon: <LightIcon />,
    text: "LIGHT",
    bgColor: "bg-purple",
    translate: "translate-x-6",
  };

  const mode = theme === "dark" ? darkMode : lightMode;

  return (
    <div className="absolute right-0 pb-5 font-roboto top-[52px] rounded-[20px] bg-white dark:bg-dark-bg flex flex-col w-[240px] z-50">
      <div className="p-5 flex flex-col gap-x-2.5 border-b border-light-grey">
        <p className="text-xs font-bold">
          {publicKeyBase58?.slice(0, 16) + "..." + publicKeyBase58?.slice(-6)}
        </p>
        <button onClick={signout} className="flex items-center gap-x-1">
          <span className="text-dark-grey font-bold text-xs">Sign Out</span>
          <Image src={SignOutIcon} alt="sign out" width={12} height={12} />
        </button>
      </div>
      <div
        onClick={handleProfileSettings}
        className="px-5 py-3 flex items-center gap-x-1 border-b border-light-grey"
      >
        <SettingsIcon theme={theme} size={20} />
        <span className="font-semibold text-sm">Profile Settings</span>
      </div>
      <div
        onClick={toggleTheme}
        className="px-5 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-x-2">
          {mode.icon}
          <span className="font-semibold text-sm">{mode.text}</span>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${mode.bgColor}`}
        >
          <span
            className={`${mode.translate} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
          />
        </button>
      </div>
    </div>
  );
};
