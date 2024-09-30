import Image from "next/image";

import CoverImage from "@/assets/png/main-desktop.png";

export const Cover = () => {
  return (
    <div className="absolute right-0">
      <Image src={CoverImage} alt="cover" />
    </div>
  );
};
