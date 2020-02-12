import React, { useEffect } from 'react';
import NavBar from './components/Nav/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid, Snackbar } from '@material-ui/core';
import SignUp from './components/Register/SignUp';
import Login from './components/Register/Login';
import ContentApp from './components/Content/ContentApp';
import { FirebaseContext } from './config';
import { useStateValue } from './session/store';
import RouteAuthenticated from './components/Security/RouteAuthenticated';
import Profile from './components/Register/Profile';
import NewProduct from './components/Products/NewProduct';
import ProductsList from './components/Products/ProductsList';
import NewClient from './components/Clients/NewClient';
import ClientList from './components/Clients/ClientsList';


function App() {
  let firebase = React.useContext(FirebaseContext);
  const [authStarted, setupFirebaseStarted] = React.useState(false);

  const [{openSnackbar}, dispatch] = useStateValue();

  useEffect(() => {
    firebase.isStarted().then(val=>{
      setupFirebaseStarted(val);
    })
  })

  return  authStarted !== false ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin = {{vertical: "bottom", horizontal: "center"}}
        open = {openSnackbar ? openSnackbar.open : false}
        autoHideDuration = {5000}
        ContentProps = {{
          "aria-describedby" : "message-id"
        }}
        message = {
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose = {()=>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje : {
              open: false,
              mensaje: ""
            }
          })
        }
      >

      </Snackbar>
      <Router>
        <NavBar/>
        <Grid container>
          <Switch>
            <RouteAuthenticated exact path="/content" 
              authFirebase={firebase.auth.currentUser} 
              component={ContentApp}
            />
            <RouteAuthenticated 
              exact path="/profile" 
              authFirebase={firebase.auth.currentUser} 
              component={Profile}
            />
            <RouteAuthenticated 
              exact path="/products" 
              authFirebase={firebase.auth.currentUser} 
              component={ProductsList}
            />
            <RouteAuthenticated 
              exact path="/products/new" 
              authFirebase={firebase.auth.currentUser} 
              component={NewProduct}
            />
            <RouteAuthenticated 
              exact path="/clients" 
              authFirebase={firebase.auth.currentUser} 
              component={ClientList}
            />
            <RouteAuthenticated 
              exact path="/clients/new" 
              authFirebase={firebase.auth.currentUser} 
              component={NewClient}
            /> 
            <Route path="/registration" exact component={SignUp}/>
            <Route path="/" exact component={Login}></Route>
          </Switch>
        </Grid>
      </Router>
    </React.Fragment>
  )
  :null
  ;
}

export default App;
