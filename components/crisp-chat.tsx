"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("5676b0f2-c9b1-48cc-9207-991a9e3b76ca");
  }, []);

  return null;
};