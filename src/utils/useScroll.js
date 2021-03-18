import { useRef } from "react";

export const useScroll = () => {
  const elRef = useRef();
  const executeScroll = () => elRef.current.scrollIntoView();

  return [executeScroll, elRef];
};
