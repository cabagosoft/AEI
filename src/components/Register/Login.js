import React, { Component } from 'react';
import { Container, Typography, Grid, TextField, Button } from '@material-ui/core';
import { compose } from 'recompose';
import { consumerFirebase } from '../../config';
import { logIn } from '../../session/actions/sessionActions';
import { openMensajePantalla } from '../../session/actions/snackbarAction'
import { StateContext } from '../../session/store'

const style = {
   paper: {
      
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

class Login extends Component {

   static contextType = StateContext;

   state = {
      firebase: null,
      user: {
         email: '',
         password: ''
      }
   }

   static getDerivedStateFromProps(nextprops, prevState){
      if(nextprops.firebase === prevState.firebase){
         return null;
      }

      return {
         firebase: nextprops.firebase
      }
   }

   handleChange = (e) => {
      let user = Object.assign({}, this.state.user);
      user[e.target.id] = e.target.value;
      this.setState({
        user : user
      })
   }

   handleSubmit = async e => {
      e.preventDefault();
      const [{session}, dispatch] = this.context
      const { firebase, user} = this.state;
      const { email, password } = user;

      let callback = await logIn(dispatch, firebase, email, password);
      if(callback.status) {
         this.props.history.push("/content")
      } else{
         openMensajePantalla(dispatch, {
            open : true,
            mensaje: callback.mensaje.message
         })
      }

   }

   render() {
      return (
         <Container maxWidth="xs">
            <div style={style.paper}>
               <Typography component="h1" variant="h5">
                  ¡Hola! Ingresa tu información
               </Typography>
               <form style={style.form} onSubmit={this.handleSubmit}>
                  <Grid container justify="center" spacing={3}>
                     <Grid item md={12} xs={12}>
                        <TextField 
                           name="email" 
                           id="email" 
                           value={this.state.user.email} 
                           onChange={this.handleChange} 
                           fullWidth 
                           label="Correo Electrónico" 
                           variant="outlined"
                        />
                     </Grid>
                     <Grid item md={12} xs={12}>
                        <TextField 
                           type="password" 
                           name="password" 
                           id="password" 
                           value={this.state.user.password} 
                           onChange={this.handleChange} 
                           fullWidth 
                           label="Contraseña" 
                           variant="outlined"
                        />
                     </Grid>
                  </Grid>
                  <Grid container justify="center">
                     <Grid item xs={12} md={12}>
                        <Button 
                           style={style.submit} 
                           type="submit" 
                           variant="contained" 
                           fullWidth 
                           size="large" 
                           color="primary"
                           onClick={this.handleSubmit}
                        >
                           Ingresar
                        </Button>
                     </Grid>
                  </Grid>
               </form>
            </div>
         </Container>
      );
   }
}

export default compose(consumerFirebase)(Login);