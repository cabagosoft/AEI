import React, { Component, useState} from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, Button, AppBar, Toolbar, List, Typography, Divider, Avatar} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreIcon from '@material-ui/icons/MoreVert';
import { compose } from 'recompose';
import { consumerFirebase } from '../../../config';
import { StateContext } from '../../../session/store';
import { logOut } from '../../../session/actions/sessionActions';
import { MenuRight } from './MenuRight';
import { withRouter } from 'react-router-dom';
import ListItemsLeft from './ListItemsLeft'


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    marginLeft: 15
  },
  hide: {
    display: 'none',
  },
  drawer: {
    position: 'relative',
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]:{
      display: "none"
    }
  },
  sectionDesktop : { 
    display: "none",
    [theme.breakpoints.up("md")] : {
      display: "flex"
    }
  },
  grow: {
    flexGrow: 1
  },
  avatarSize :{
      width:40,
      height: 40
  },
  listItemText: {
      fontSize: "14px",
      fontWeight: 600,
      paddinLeft: "15px",
      color: "#212121"
  }
});


class BarSession extends Component {

  
  static contextType = StateContext;

  state = {
    open: false,
    firebase : null,
  };

  
  componentDidMount() {
    const { firebase } = this.state; //local state
    const [{ session }, dispatch ] = this.context; //global state

    if(firebase.auth.currentUser !== null && !session) {
      firebase.db
      .collection("Users")
      .doc(firebase.auth.currentUser.uid)
      .get()
      .then(doc => {
        const userDB = doc.data();
        dispatch({
          type : "START_SESSION",
          session: userDB,
          authenticated: true
        })
      })
    }

  }

  static getDerivedStateFromProps(nextProps, prevState){
    let newObj = {};
    if(nextProps.firebase !== prevState.firebase){
      newObj.firebase = nextProps.firebase
    }

    return newObj;
  }

  logOutApp = () => {
    const { firebase } = this.state; //local state
    const [{ session }, dispatch ] = this.context

    logOut(dispatch, firebase).then(success => {
       this.props.history.push("/");
    })
  }

  toggleDrawer = (side, open) => () =>  {
    this.setState(
       {
          [side] : open
       }
    )
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false }); 
  };



  render(){

    const { classes, theme } = this.props;
    const [{session}, dispatch] = this.context;
    const { user } = session;
    const textUser = user.name + " " + user.fullname



    return session ? ( session.authenticated ? (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, this.state.open && classes.hide)
              }
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              AEI
            </Typography>
            <div className={classes.grow}></div>
            <div className={classes.sectionDesktop}>
              <Button color="inherit" onClick={this.logOutApp}>
                Salir
              </Button>
              <Button color="inherit">{textUser}</Button>
              <Avatar src={user.image}></Avatar>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton 
                  
                  color="inherit"
                  onClick = {this.toggleDrawer("right", true)}
              >
                  <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
            open={this.state.right}
            onClose = {this.toggleDrawer("right", false)}
            anchor="right"
        >
            <div
              role = "button"
              onClick = {this.toggleDrawer("right", false)}
              onKeyDown = {this.toggleDrawer("right", false)}
            >
              <MenuRight 
                  classes={classes} 
                  user={user} 
                  textUser={textUser}
                  logOut={this.logOutApp} 
              />
            </div>
        </Drawer>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerOpen, !this.state.open && classes.drawerClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <ListItemsLeft/>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          
        </main>
      </div>
    )
    :null
    )
    :null;
  }
  
}

export default compose(
  withRouter,
  consumerFirebase,
  withStyles(styles, { withTheme: true })
)(BarSession);  