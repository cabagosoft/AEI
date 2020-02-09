import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';

const style = {
   paper: {
      marginTop: "3em",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
   },
   form: {
      width: "100%",
      marginTop: "3em"
   },
   submit: {
      marginTop: "2em",
      marginBottom: "2.5em"
   }
   
}

class Out extends Component {


   render() {
      return (
         <Container maxWidth="md">
            <div style={style.paper}>
               <Typography component="h1" variant="h5">
                  Haz salido de la sesión
               </Typography>
            </div>
         </Container>
      );
   }
}

export default Out