import * as React from "react";
import IDashboardProps from "./_adminProps/IDashboardProps";

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
    let htmlElement: JSX.Element =
        <main className={`subheadingElement`}>
            <h2 className="pageHeader">
                Dashboard
            </h2>
        </main>;

    return htmlElement;
}

export default Dashboard;
