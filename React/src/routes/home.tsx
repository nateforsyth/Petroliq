import * as React from "react";
import IHomeProps from "./IHomeProps";

const Home: React.FunctionComponent<IHomeProps> = (props) => {
    let htmlElement: JSX.Element = 
    <main className={`subheadingElement`}>
            <h2 className="pageHeader">
                Home
            </h2>
        </main>;

        return htmlElement;
}

export default Home;
