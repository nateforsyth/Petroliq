import * as React from "react";
import INavigationBarProps from "./INavigationBarProps";

import { Link } from "react-router-dom";

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

import ILink from "../../interfaces/ILink";
import ILinkWithCallback from "../../interfaces/ILinkWithCallback";
import "./NavigationBar.css";
import IUser from "../../interfaces/API/IUser";

const pages: ILink[] = [{ label: 'New Fill', link: 'NewFill' }, { label: 'Fills', link: 'Fills' }, { label: 'Graphs', link: 'Graphs' }];

const NavigationBar: React.FunctionComponent<INavigationBarProps> = (props) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [bearerToken, setBearerToken] = React.useState<string>("");
    const [userData, setUserData] = React.useState<IUser>({});
    // const user: IUser = {
    //     Id: "";
    //     FirstName
    // };

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

    const handleLogIn = () => {
        console.log(`handleLogin invoked`);

        setLoggedIn(true);

        handleCloseUserMenu();
    };

    const handleLogOut = () => {
        console.log(`handleLogOut invoked`);

        setLoggedIn(false);

        handleCloseUserMenu();
    };

    const settings: ILinkWithCallback[] = [{ label: 'Profile', link: 'Profile', callback: handleCloseUserMenu }, { label: 'Account', link: 'Account', callback: handleCloseUserMenu }, { label: 'Dashboard', link: 'Dashboard', callback: handleCloseUserMenu }, { label: 'Login', link: 'Login', callback: handleLogIn, hide: loggedIn }, { label: 'Logout', link: 'Logout', callback: handleLogOut, hide: !loggedIn }];

    let htmlElement: JSX.Element = <AppBar position="static">
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
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                        {settings.map((setting) => (
                            !setting.hide ? 
                                <MenuItem key={setting.link} onClick={setting.callback}>
                                    <Typography textAlign="center">{setting.label}</Typography>
                                </MenuItem> :
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