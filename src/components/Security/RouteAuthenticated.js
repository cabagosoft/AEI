import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../../session/store';

function RouteAuthenticated({component: Component, authFirebase, ...rest}) {

   const [{auth}, dispatch] = useStateValue();

   return(
      <Route
         {...rest}
         render={(props) => (auth === true || authFirebase !== null)
         ? <Component {...props} {...rest} />
         :<Redirect to="login"/>
         }   
      />
   )
}

export default RouteAuthenticated;
