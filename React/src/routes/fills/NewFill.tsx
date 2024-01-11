import * as React from "react";
import INewFillProps from "./_fillsProps/INewFillProps";

const NewFill: React.FunctionComponent<INewFillProps> = (props) => {
    let htmlElement: JSX.Element = 
    <main className={`subheadingElement`}>
            <h2 className="pageHeader">
                New Fill
            </h2>
        </main>;

        return htmlElement;
}

export default NewFill;
