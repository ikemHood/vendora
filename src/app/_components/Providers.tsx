"use client";

import { useAtom } from "jotai";
import {
	receiveCryptoModalAtom,
	sendCryptoModalAtom,
	sendFiatModalAtom,
} from "~/app/_store/atoms";
import { ReceiveCryptoModal } from "./modals/ReceiveCryptoModal";
import { SendCryptoModal } from "./modals/SendCryptoModal";
import { SendFiatModal } from "./modals/SendFiatModal";

export function Providers({ children }: { children: React.ReactNode }) {
	const [isSendCryptoModalOpen, setIsSendCryptoModalOpen] =
		useAtom(sendCryptoModalAtom);
	const [isReceiveModalOpen, setIsReceiveModalOpen] = useAtom(
		receiveCryptoModalAtom,
	);
	const [isSendFiatModalOpen, setIsSendFiatModalOpen] =
		useAtom(sendFiatModalAtom);

	return (
		<>
			{children}

			<SendCryptoModal
				isOpen={isSendCryptoModalOpen}
				onClose={() => setIsSendCryptoModalOpen(false)}
			/>

			<ReceiveCryptoModal
				isOpen={isReceiveModalOpen}
				onClose={() => setIsReceiveModalOpen(false)}
			/>

			<SendFiatModal
				isOpen={isSendFiatModalOpen}
				onClose={() => setIsSendFiatModalOpen(false)}
			/>
		</>
	);
}
