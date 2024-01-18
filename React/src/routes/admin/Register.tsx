import * as React from "react";
import IRegisterProps from "./_adminProps/IRegisterProps";
import RegisterNewUserForm from "../../components/registerNewUserForm/RegisterNewUserForm";

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
    const [resetForm, setResetForm] = React.useState<boolean>(false);
    const userRegistrationSubmitCallback = () => {
        console.log(`userRegistrationSubmitCallback invoked`);
    };

    let htmlElement: JSX.Element =
        <div>
            <main className={`subheadingElement`}>
                <h2 className="pageHeader">
                    Register for PetrolIQ
                </h2>
            </main>
            <RegisterNewUserForm resetForm={resetForm} userRegistrationSubmitCallback={userRegistrationSubmitCallback} />
        </div>;

    return htmlElement;
}

export default Register;
