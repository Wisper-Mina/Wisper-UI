import { MainLogo } from "@/components/common/MainLogo";
import { Navigation } from "./Navigation";
import { Cover } from "./Cover";
import { TextContainer } from "./TextContainer";
import { ToggleTheme } from "./ToggleTheme";
import { ConnectWallet } from "./ConnectWallet";

const HomePage = () => {
  return (
    <div className="h-screen w-full relative">
      <div className="absolute z-30 left-[50px] top-[54px]">
        <MainLogo />
      </div>
      <div className="absolute z-40 right-[50px] flex items-center gap-x-6 top-[54px] ">
        <ToggleTheme />
        <Navigation />
      </div>
      <Cover />
      <div className="absolute left-[32px] top-[40%] z-30">
        <TextContainer />
        <ConnectWallet />
      </div>
    </div>
  );
};

export default HomePage;
