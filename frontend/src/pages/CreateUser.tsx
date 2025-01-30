import CreateUserForm from "../components/form/CreateUserForm.tsx";

function CreateUser() {
    return (
        <>
            <h1 className="text-3xl font-bold text-center">User creation form</h1>
            <div className="m-5"><CreateUserForm /></div>

        </>
    )
}

export default CreateUser;