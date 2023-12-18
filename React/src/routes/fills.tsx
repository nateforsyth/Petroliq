import { Link, Outlet } from "react-router-dom";
import getFills from "../dataLayer/data"
import IFill from "../interfaces/IFill";

import './fills.css';

export default function Fills() {
    let fills: IFill[] = getFills();
    return(
        <div>
            <div className={`subheadingElement paddingLeftOvr`}>
                <h2 className="pageHeader">
                    Fills
                </h2>
            </div>
            <div className="fillsElement paddingLeftOvr">
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
            </div>
        </div>
    )
}
