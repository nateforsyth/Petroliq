import * as React from "react";

import { Link } from "react-router-dom";

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

// API imports
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Config imports
import settingsJson from "./../../settings.json";
import IDecodedJwt from "../../interfaces/API/IDecodedJwt";
import LoginForm from "../loginForm/LoginForm";
import { AuthService } from "../../dataLayer/services/AuthService";
import IAuthResult from "../../interfaces/API/IAuthResult";
import { UserService } from "../../dataLayer/services/UserService";

const pages: ILink[] = [{ label: 'New Fill', link: 'NewFill' }, { label: 'Fills', link: 'Fills' }, { label: 'Graphs', link: 'Graphs' }];

const NavigationBar: React.FunctionComponent<INavigationBarProps> = (props) => {

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    // canvas state
    const [loggingIn, setLoggingIn] = React.useState<boolean>(false);
    const [registering, setRegistering] = React.useState<boolean>(false);

    // auth state
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [bearerToken, setBearerToken] = React.useState<string>("");
    const [loggedInUserId, setLoggedInUserId] = React.useState<string>("");
    const [userData, setUserData] = React.useState<IUser>({});

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

    const logIn = async (email: string, password: string) => {

        const authResult: IAuthResult = await AuthService.login(email, password);

        if (authResult !== null && (authResult.jwt !== null && authResult.jwt !== undefined && authResult.jwt !== "") && authResult.decodedJwt !== null) {
            if (authResult.decodedJwt?.Id !== null && authResult.decodedJwt?.Id !== undefined && authResult.decodedJwt?.Id !== "") {
                const user: IUser = await UserService.getUserById(authResult.jwt, authResult.decodedJwt.Id);

                if (user !== null) {
                    setLoggedIn(true);
                    setLoggedInUserId(authResult.decodedJwt?.Id);
                    setUserData(user);
                    props.userRetrievedCallback(user);
                    setLoggingIn(false);
                }
            }
        }
    };

    const handleLogOut = () => {
        setLoggedIn(false);
        setLoggedInUserId("");
        setUserData({});
        props.userRetrievedCallback(null);

        handleCloseUserMenu();
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
        <div><LoginForm loginCallback={handleLogin} loginCancelCallback={setLoggingIn} /></div> :
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
