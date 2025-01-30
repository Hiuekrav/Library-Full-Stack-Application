
import {RegisterForm} from "@/components/form/RegisterForm.tsx";

export function Register() {
    return (
        <>
            <h1 className="text-3xl font-bold text-center">Register as reader</h1>
            <div className="m-5"><RegisterForm /></div>
        </>
    )
}