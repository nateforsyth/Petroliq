import * as React from "react";
import IAppContainerProps from "./IAppContainerProps";

import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import NavigationBar from './../../components/navigationBar/NavigationBar';

import Container from "@mui/material/Container";

import "./AppContainer.css"
import Home from "../../routes/Home";
import { User } from "../model/API/User";

type ContextType = { currentUser: User | null };

const AppContainer: React.FunctionComponent<IAppContainerProps> = (props) => {

    const [currentUser, setCurrentUser] = React.useState<User | null>(null);

    const routePathName: string = useLocation().pathname;

    const userRetrievedCallback = (user: User) => {
        setCurrentUser(user);
    };

    let htmlElement: JSX.Element =
        <div className="MaxHeightOvr">
            <header className="App-header">
                <NavigationBar userRetrievedCallback={userRetrievedCallback} />
            </header>
            <Container maxWidth="lg">
                <div className="contentWrapper">
                    {routePathName === "/" ?
                        <Home /> :
                        <Outlet context={{currentUser}} />}
                </div>
            </Container>
        </div>;

    return htmlElement;
};

export default AppContainer;

export function useUser() {
    return useOutletContext<ContextType>();
}
