"use client";
import ZkProgramWorkerClient from "@/lib/zkProgramWorkerClient";
import { timeout } from "@/utils/timeout";
import React from "react";

const PageTest = () => {
  const [displayText, setDisplayText] = React.useState<string>("");

  const handle = async () => {
    console.log("Starting processing...");
    setDisplayText("Starting processing...");

    const zkProgramClient = new ZkProgramWorkerClient();

    await timeout(30);

    setDisplayText("Setting active instance to devnet...");
    await zkProgramClient.setActiveInstanceToDevnet();

    setDisplayText("Loading program...");
    console.log("Loading program...");
    await zkProgramClient.loadProgram();
    setDisplayText("Program loaded.");

    console.log("Compiling program...");
    setDisplayText("Compiling program...");
    await zkProgramClient.compileProgram();
    setDisplayText("Program compiled.");

    console.log("Program loaded and compiled.");
  };
  return (
    <div>
      <button onClick={handle}>Click</button>
      <p>{displayText} </p>
    </div>
  );
};

export default PageTest;
