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
import { UserSettings } from "../model/API/UserSettings";

type ContextType = { currentUser: User | null, currentUserSettings: UserSettings | null, userRetrievedCallback: any };

const AppContainer: React.FunctionComponent<IAppContainerProps> = (props) => {

    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [currentUserSettings, setCurrentUserSettings] = React.useState<UserSettings | null>(null);

    const routePathName: string = useLocation().pathname;

    const userRetrievedCallback = (user: User, userSettings: UserSettings) => {
        console.log(`userRetrievedCallback invoked`, user, userSettings);
        setCurrentUser(user);
        setCurrentUserSettings(userSettings);
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
                        <Outlet context={{currentUser, currentUserSettings, userRetrievedCallback}} />}
                </div>
            </Container>
        </div>;

    return htmlElement;
};

export default AppContainer;

export function useUser() {
    return useOutletContext<ContextType>();
}
