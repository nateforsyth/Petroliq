import * as React from "react";

// MUI imports
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { Link, Outlet } from "react-router-dom";
import getFills from "../../dataLayer/data"
import IFill from "../../interfaces/IFill";

import FillForm from "../../components/fillForm/fillForm";

import './Fills.css';
import IFillsProps from "./_fillsProps/IFillsProps";

const Fills: React.FunctionComponent<IFillsProps> = (props) => {
    const fills: IFill[] = getFills();

    let htmlElement: JSX.Element =
        <div>
            <div className={`subheadingElement`}>
                <h2 className="pageHeader">
                    Fills
                </h2>
            </div>
            <div className="fillsElement">
                <nav className={`fillElementNav`}>
                    {
                        fills.map(fill => (
                            <Link
                                style={{ display: "block", margin: "1rem 0" }}
                                to={`/fills/${fill.index}`}
                                key={fill.index}
                            >
                                {fill.date.format("DD/MM/YYYY")}
                            </Link>
                        ))
                    }
                </nav>
                <Outlet />
                <FillForm />
            </div>
        </div>;

    return htmlElement;
}

export default Fills;
