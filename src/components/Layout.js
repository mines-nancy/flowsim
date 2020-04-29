import React from 'react';
import { MainAppBar } from './appBar/MainAppBar';
import { AppBar, Toolbar, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    container: {
        paddingTop: ({ withoutAppbar }) => (withoutAppbar ? 0 : 64),
        minHeight: '98vh',
    },
    footer: {
        height: 32,
    },
    toolbar: {
        minHeight: 32,
        display: 'flex',
        justifyContent: 'space-between',
    },
    link: {
        color: 'white',
    },
});

const Layout = ({ className, children, withoutAppbar, ...props }) => {
    const classes = useStyles({ withoutAppbar });

    return (
        <div className={className}>
            {!withoutAppbar && <MainAppBar {...props} />}
            <div className={classes.container}>{children}</div>
            <AppBar position="relative" className={classes.footer}>
                <Toolbar classes={{ root: classes.toolbar }}>
                    <Link to="/mentions-legales">
                        <Typography className={classes.link} variant="subtitle2">
                            Mentions Légales
                        </Typography>
                    </Link>
                    <a href="https://github.com/mines-nancy/commando-covid">
                        <Typography className={classes.link} variant="subtitle2">
                            GitHub
                        </Typography>
                    </a>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Layout;
