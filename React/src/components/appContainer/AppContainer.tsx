import * as React from "react";
import IAppContainerProps from "./IAppContainerProps";

import { Link, Outlet } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavigationBar from './../../components/navigationBar/NavigationBar';

import "./AppContainer.css"

const AppContainer: React.FunctionComponent<IAppContainerProps> = (props) => {
    let htmlElement: JSX.Element =
        <div className="MuiContainer-root MuiContainer-maxWidthXl MaxHeightOvr">
            <header className="App-header">
                <NavigationBar />
            </header>
            <div className="appWrapper">
                <div className="contentWrapper">
                    <Outlet />
                </div>
            </div>
        </div>;

    return htmlElement;
}

export default AppContainer;
