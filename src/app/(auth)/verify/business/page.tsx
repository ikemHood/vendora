"use client";

import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileUpload } from "~/app/_components/FileUpload";
import { Button } from "~/app/_components/Button";
import { KycSuccessModal } from "~/app/_components/KycSuccessModal";
import {
    businessVerificationSchema,
    type BusinessVerificationInput,
} from "~/lib/validations/business";
import { useState } from "react";

const BusinessVerificationPage: NextPage = () => {
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        try {
            // TODO: Implement API call here
            console.log("Form submitted:", data);


            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleContinue = () => {
        // Navigate to the next step or dashboard
        // router.push("/dashboard");
    };

    return (
        <>
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900">Verify your Business</h2>
                <p className="mt-2 text-gray-600">
                    Verify your business to start accepting payments. Upload your business
                    documents and ID for quick approval.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900">
                            Upload ID (Driver's License, NIN, etc.)
                        </h3>
                        <FileUpload
                            onFileSelect={(file) => setValue("idDocument", file)}
                            error={errors.idDocument?.message}
                            value={idDocument}
                        />
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-medium text-gray-900">
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
                        isLoading={isSubmitting}
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