"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";

export function useOtpInput(length: number = 6) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const focusInput = (index: number) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index]?.focus();
        }
    };

    const handleChange = (value: string, index: number) => {
        if (value.length > 1) {
            // Handle paste
            const chars = value.split("").slice(0, length);
            const newOtp = [...otp];
            chars.forEach((char, i) => {
                if (index + i < length) {
                    newOtp[index + i] = char;
                }
            });
            setOtp(newOtp);
            focusInput(Math.min(index + chars.length, length - 1));
        } else {
            // Handle single character input
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < length - 1) {
                focusInput(index + 1);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                focusInput(index - 1);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1) {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        handleChange(pastedData, index);
    };

    return {
        otp,
        setOtp,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        getValue: () => otp.join(""),
    };
} 