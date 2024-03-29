import * as React from "react";
import IAccountProps from "./_adminProps/IAccountProps";

const Account: React.FunctionComponent<IAccountProps> = (props) => {
    let htmlElement: JSX.Element =
        <main className={`subheadingElement`}>
            <h2 className="pageHeader">
                Account
            </h2>
        </main>;

    return htmlElement;
}

export default Account;
