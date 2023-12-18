import { Params, useParams } from "react-router-dom";
import { getFill } from "../dataLayer/data";
import IFill from "../interfaces/IFill";

import './fills.css';

export default function Fill() {
    let params: Readonly<Params<string>> = useParams();
    let requestedFillId = params.fillId === undefined ? -1 : parseInt(params.fillId, 10);
    let fill: IFill | undefined = requestedFillId === -1 ? undefined : getFill(requestedFillId);

    return (
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
        </main>
    );
}
