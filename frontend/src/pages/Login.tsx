import {LoginForm} from "@/components/form/LoginForm.tsx";

export function Login() {
    return (
        <>
            <h1 className="text-3xl font-bold text-center">Sign in to your account</h1>
            <div className="flex w-full justify-center p-6 md:p-10">
                <div className="w-full max-w-sm ">
                    <LoginForm/>
                </div>
            </div>
        </>
    )
}