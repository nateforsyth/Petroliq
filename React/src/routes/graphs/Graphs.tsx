import * as React from "react";
import IGraphsProps from "./_graphsProps/IGraphsProps";

const Graphs: React.FunctionComponent<IGraphsProps> = (props) => {
    let htmlElement: JSX.Element =
        <main className={`subheadingElement`}>
            <h2 className="pageHeader">
                Graphs
            </h2>
        </main>;

    return htmlElement;
}

export default Graphs;
