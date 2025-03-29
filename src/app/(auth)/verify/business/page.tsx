"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "~/app/_components/Button";
import { FileUpload } from "~/app/_components/FileUpload";
import { KycSuccessModal } from "~/app/_components/KycSuccessModal";
import {
    type BusinessVerificationInput,
    businessVerificationSchema,
} from "~/lib/validations/business";
import { api } from "~/trpc/react";

const BusinessVerificationPage: NextPage = () => {
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const submitVerification = api.verification.submitBusinessVerification.useMutation({
        onSuccess: () => {
            toast.success("Verification documents submitted successfully!");
            setShowSuccessModal(true);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<BusinessVerificationInput>({
        resolver: zodResolver(businessVerificationSchema),
    });

    const idDocument = watch("idDocument");
    const cacDocument = watch("cacDocument");

    const onSubmit = async (data: BusinessVerificationInput) => {
        submitVerification.mutate(data);
    };

    const handleContinue = () => {
        router.push("/home");
    };

    return (
        <>
            <div className="mt-12">
                <h2 className="font-bold text-3xl text-gray-900">
                    Verify your Business
                </h2>
                <p className="mt-2 text-gray-600">
                    Verify your business to start accepting payments. Upload your business
                    documents and ID for quick approval.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div>
                        <h3 className="mb-4 font-medium text-gray-900 text-lg">
                            Upload ID (Driver's License, NIN, etc.)
                        </h3>
                        <FileUpload
                            onFileSelect={(file) => setValue("idDocument", file)}
                            error={errors.idDocument?.message}
                            value={idDocument}
                        />
                    </div>

                    <div>
                        <h3 className="mb-4 font-medium text-gray-900 text-lg">
                            Upload CAC docs (for businesses)
                        </h3>
                        <FileUpload
                            onFileSelect={(file) => setValue("cacDocument", file)}
                            error={errors.cacDocument?.message}
                            value={cacDocument}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-6 w-full"
                        isLoading={isSubmitting || submitVerification.isPending}
                    >
                        Verify Business
                    </Button>
                </form>
            </div>

            <KycSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onContinue={handleContinue}
            />
        </>
    );
};

export default BusinessVerificationPage;
