import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import { consumerFirebase } from '../../config';
import { StateContext } from '../../session/store';
import BarSession from './Bar/BarSession';
import DrawerLeft from './Bar/BarSession';


const styles = theme => ({
 sectionDesktop : { 
   display: "none",
   [theme.breakpoints.up("md")] : {
     display: "flex"
   }
 },
 sectionMobile: {
   display: "flex",
   [theme.breakpoints.up("md")]:{
     display: "none"
   }
 }
});

class NavBar extends Component{

  static contextType = StateContext;

  state = {
    firebase : null
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

  render(){
    
    const [{session}, dispatch] = this.context;

    return session ? ( session.authenticated ? (
      <div>
        <BarSession/>
      </div>
    )
    :null
    )
    :null;
  }
}

export default compose(
  consumerFirebase,
  withStyles(styles, { withTheme: true })
)(NavBar);