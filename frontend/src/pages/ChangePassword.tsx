
import {ChangePasswordForm} from "@/components/form/ChangePasswordForm.tsx";

export function ChangePassword() {
    return (
        <>
            <h1 className="text-3xl font-bold text-center">Change your password</h1>
            <div className="flex w-full justify-center p-6 md:p-10">
                <div className="w-full max-w-sm ">
                    <ChangePasswordForm/>
                </div>
            </div>
        </>
    )
}