import * as React from "react";
import IAppContainerProps from "./IAppContainerProps";

import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavigationBar from './../../components/navigationBar/NavigationBar';

import Container from "@mui/material/Container";

import "./AppContainer.css"
import Home from "../../routes/Home";

const AppContainer: React.FunctionComponent<IAppContainerProps> = (props) => {
    const routePathName: string = useLocation().pathname;

    let htmlElement: JSX.Element =
        <div className="MaxHeightOvr">
            <header className="App-header">
                <NavigationBar />
            </header>
            <Container maxWidth="lg">
                <div className="contentWrapper">
                    {
                        routePathName === "/" ? 
                            <Home /> :
                            <Outlet />
                    }
                </div>
            </Container>
        </div>;

    return htmlElement;
}

export default AppContainer;
