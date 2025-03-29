import { atom } from "jotai";

export const sendCryptoModalAtom = atom(false);
export const receiveCryptoModalAtom = atom(false);
export const sendFiatModalAtom = atom(false);
export const activeWalletTabAtom = atom<"crypto" | "fiat">("crypto"); 