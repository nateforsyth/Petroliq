import * as React from "react";

import { Link, NavigateFunction } from "react-router-dom";

// MUI imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';

// App imports
import INavigationBarProps from "./INavigationBarProps";
import ILink from "../../interfaces/ILink";
import ILinkWithCallback from "../../interfaces/ILinkWithCallback";
import "./NavigationBar.css";
import IUser from "../../interfaces/API/IUser";
import { useNavigate } from "react-router-dom";

// Config imports
import LoginForm from "../loginForm/LoginForm";
import { AuthService } from "../../dataLayer/services/AuthService";
import IAuthResult from "../../interfaces/API/IAuthResult";
import { UserService } from "../../dataLayer/services/UserService";
import IDecodedJwt from "../../interfaces/API/IDecodedJwt";
import { jwtDecode } from "jwt-decode";

const pages: ILink[] = [{ label: 'New Fill', link: 'NewFill' }, { label: 'Fills', link: 'Fills' }, { label: 'Graphs', link: 'Graphs' }];

const NavigationBar: React.FunctionComponent<INavigationBarProps> = (props) => {

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    // canvas state
    const [loggingIn, setLoggingIn] = React.useState<boolean>(false);
    const [registering, setRegistering] = React.useState<boolean>(false);

    // auth state
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [loggedInUserId, setLoggedInUserId] = React.useState<string>("");
    const [userData, setUserData] = React.useState<IUser>({});

    // child component state for auth
    const [loginSuccess, setLoginSuccess] = React.useState<boolean>(false);
    const [loginFail, setLoginFail] = React.useState<boolean>(false);
    const [authFailMessage, setAuthFailMessage] = React.useState<string>("");
    const [authFailTimeoutSeconds, setAuthFailTimeoutSeconds] = React.useState<number>(5);

    const authSuccessTimeoutSeconds: number = 3;
    const navigate: NavigateFunction = useNavigate();

    // reset loginSuccess and loginFail state so another attempt can be made
    React.useEffect(() => {
        if (!loggingIn) {
            setLoginSuccess(false);
            setLoginFail(false);
            setAuthFailMessage("");
        }
    }, [loggingIn]);

    React.useEffect(() => {
        // check if user already logged in with valid browser token
        retrieveUserWithBrowserToken();
    }, []);

    const retrieveUserWithBrowserToken = async () => {
        const currentBearerToken: string = AuthService.getBrowserAuthToken();
        const currentBearerTokenExpiry: string = AuthService.getBrowserAuthTokenExpiry();
        const currentBearerTokenExpiryDt: Date = new Date(currentBearerTokenExpiry);
        const currentRefreshToken: string = AuthService.getBrowserRefreshToken();

        if (currentBearerToken !== null && currentBearerToken !== undefined && currentBearerToken !== "" && currentBearerTokenExpiryDt > new Date()) {
            console.log(`Retrieving user using cached access token`);
            const decodedJwt: IDecodedJwt = jwtDecode<IDecodedJwt>(currentBearerToken, { header: false });
            const authResult: IAuthResult = {
                jwt: currentBearerToken,
                refreshToken: currentRefreshToken,
                jwtExpiry: currentBearerTokenExpiry,
                decodedJwt: decodedJwt,
                resposeCode: 200,
                message: "Authorised using browser token"
            };

            console.log(`Retrieving user`);
            await getUser(authResult);
        }
        else { // attempt to refresh access token using refresh token
            console.log(`Refreshing access token`);
            const authResult: IAuthResult = await AuthService.refreshToken(currentBearerToken, currentRefreshToken);
            console.log(authResult);

            if (authResult !== null && (authResult.jwt !== null && authResult.jwt !== undefined && authResult.jwt !== "") && authResult.decodedJwt !== null) {
                if (authResult.decodedJwt?.Id !== null && authResult.decodedJwt?.Id !== undefined && authResult.decodedJwt?.Id !== "") {
                    console.log(`Retrieving user`);
                    await getUser(authResult);
                }
            }
            else {
                console.warn("Failed to refresh access token, user needs to log in again");
                handleLogOut();
            }
        }
    };

    const handleLoggingIn = () => {
        setLoggingIn(true);
        handleCloseUserMenu();
    };

    const handleRegistering = () => {
        setRegistering(true);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogin = async (email: string, password: string) => {
        logIn(email, password);
    };

    const logIn = async (email: string, password: string): Promise<void> => {
        const authResult: IAuthResult = await AuthService.login(email, password);

        if (authResult !== null && (authResult.jwt !== null && authResult.jwt !== undefined && authResult.jwt !== "") && authResult.decodedJwt !== null) {
            if (authResult.decodedJwt?.Id !== null && authResult.decodedJwt?.Id !== undefined && authResult.decodedJwt?.Id !== "") {
                await getUser(authResult);
            }
        }
        else {
            if (authResult !== null) {
                setAuthFailMessage(`${authResult.message}, you must wait ${authFailTimeoutSeconds} seconds before trying again, or cancel.`); // TODO implement account lock if login attemps exceed some specified threshold
            }

            setLoginFail(true);

            await new Promise(f => setTimeout(f, (authFailTimeoutSeconds * 1000)));

            setAuthFailTimeoutSeconds(authFailTimeoutSeconds * authFailTimeoutSeconds);
            setLoginFail(false);
        }
    };

    const getUser = async (authResult: IAuthResult) => {
        console.log(authResult);
        if (authResult.decodedJwt !== undefined && authResult.decodedJwt.Id !== undefined && authResult.jwt !== undefined && authResult.refreshToken !== undefined && authResult.jwtExpiry !== undefined) {
            const user: IUser = await UserService.getUserById(authResult.jwt, authResult.decodedJwt.Id);
            console.log(user);

            if (user !== null) {
                setLoggedIn(true);

                localStorage.setItem("token", authResult.jwt); // TODO replace with HttpOnly cookie
                localStorage.setItem("refresh", authResult.refreshToken); // TODO replace with HttpOnly cookie
                localStorage.setItem("tokenExpiry", authResult.jwtExpiry); // TODO replace with HttpOnly cookie

                setLoggedInUserId(authResult.decodedJwt?.Id);
                setUserData(user);
                props.userRetrievedCallback(user);
                setLoginSuccess(true);

                await new Promise(f => setTimeout(f, authSuccessTimeoutSeconds * 1000));
                setLoggingIn(false);
            }
        }
    };

    const handleLogOut = () => {
        setLoggedIn(false);
        setLoggedInUserId("");
        setUserData({});
        localStorage.setItem("token", ""); // TODO replace with HttpOnly cookie
        localStorage.setItem("refresh", ""); // TODO replace with HttpOnly cookie
        localStorage.setItem("tokenExpiry", ""); // TODO replace with HttpOnly cookie
        props.userRetrievedCallback(null);

        handleCloseUserMenu();

        navigate("/");
    };

    const settings: ILinkWithCallback[] = [{ label: 'Profile', link: 'Profile', isLink: true, callback: handleCloseUserMenu, hide: !loggedIn }, { label: 'Account', link: 'Account', isLink: true, callback: handleCloseUserMenu, hide: !loggedIn }, { label: 'Dashboard', link: 'Dashboard', isLink: true, callback: handleCloseUserMenu, hide: !loggedIn }, { label: 'Login', link: 'Login', isLink: false, callback: handleLoggingIn, hide: loggedIn }, { label: 'Logout', link: 'Logout', isLink: false, callback: handleLogOut, hide: !loggedIn }];

    const avatarAlt: string = loggedIn && userData !== null ?
        `${userData.Email}` :
        "";

    const userMenuItems: JSX.Element = loggedIn && userData !== null ?
        <div>
            <MenuItem key="userName">
                <Typography textAlign="center">Welcome <b>{userData.FirstName}</b></Typography>
            </MenuItem>
            <MenuItem key="userId">
                <Typography textAlign="center">Id: {loggedInUserId}</Typography>
            </MenuItem>
        </div> :
        <div>
            <MenuItem key="userId">
                <Typography textAlign="center">You are not logged in</Typography>
            </MenuItem>
        </div>;

    const loginForm: JSX.Element = loggingIn ?
        <div><LoginForm loginCallback={handleLogin} loginCancelCallback={setLoggingIn} loginSuccess={loginSuccess} loginFail={loginFail} authFailMessage={authFailMessage} authSuccessTimeoutSeconds={authSuccessTimeoutSeconds} authFailTimeoutSeconds={authFailTimeoutSeconds} /></div> :
        <div></div>;

    let htmlElement: JSX.Element = <AppBar position="static">
        {loginForm}
        <Container maxWidth="lg">
            <Toolbar disableGutters>
                <LocalGasStationOutlinedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Link className="navLink" to="Home">
                    <Typography
                        className="mainAppHeading"
                        variant="h6"
                        noWrap
                        component="span"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            // fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        PetrolIQ
                    </Typography>
                </Link>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >

                        {pages.map((page) => (
                            <MenuItem key={page.link} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">{page.label}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Link className="navLink" to="Home">
                    <Typography
                        className="mainAppHeading"
                        variant="h5"
                        noWrap
                        component="span"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            // fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        PetrolIQ
                    </Typography>
                </Link>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Link className="navLink" to={`${page.link}`} key={page.link}>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.label}
                            </Button>
                        </Link>
                    ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={avatarAlt} src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {userMenuItems}
                        <hr />
                        {settings.map((setting) => (
                            !setting.hide ?
                                (setting.isLink ?
                                    <Link className="navLink" to={`${setting.link}`} key={setting.link}>
                                        <MenuItem key={setting.link} onClick={setting.callback} >
                                            <Typography color={"rgba(0, 0, 0, 0.87);"} textAlign="center">{setting.label}</Typography>
                                        </MenuItem>
                                    </Link> :
                                    <MenuItem key={setting.link} onClick={setting.callback} >
                                        <Typography textAlign="center">{setting.label}</Typography>
                                    </MenuItem>) :
                                null
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>;

    return htmlElement;
}

export default NavigationBar;
