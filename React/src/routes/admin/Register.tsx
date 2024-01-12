import * as React from "react";
import IRegisterProps from "./_adminProps/IRegisterProps";

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
    let htmlElement: JSX.Element =
        <main className={`subheadingElement`}>
            <h2 className="pageHeader">
                Register
            </h2>
        </main>;

    return htmlElement;
}

export default Register;
