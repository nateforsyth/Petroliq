import * as React from "react";
import IFillProps from "./_fillsProps/IFillProps";

import { Params, useParams } from "react-router-dom";
import { getFill } from "../../dataLayer/data";
import IFill from "../../components/model/interfaces/IFill";

import './Fills.css';

const Fill: React.FunctionComponent<IFillProps> = (props) => {
    let params: Readonly<Params<string>> = useParams();
    let requestedFillId = params.fillId === undefined ? -1 : parseInt(params.fillId, 10);
    let fill: IFill | undefined = requestedFillId === -1 ? undefined : getFill(requestedFillId);

    let htmlElement: JSX.Element = 
    <main className={`fillElementContent`}>
            <h3>Fill: {fill?.index}</h3>
            <p>
                Date: {fill?.date.format("DD/MM/YYYY")}
                <br />
                Spend: ${fill?.spend}
                <br />
                Volume: {fill?.totalVolume}
                <br />
                Applied Discount: {fill?.discountApplied}
            </p>
        </main>;

        return htmlElement;
}

export default Fill;
