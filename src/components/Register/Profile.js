import React, {useState, useEffect } from 'react';
import { useStateValue } from '../../session/store';
import { Container, Avatar, Grid, TextField, Button, Typography} from '@material-ui/core';
import { openMensajePantalla } from '../../session/actions/snackbarAction'
import { consumerFirebase } from '../../config/';


const style = {
   paper : {
      marginTop: "1em",
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

const Profile = props => {
   const [{session}, dispatch] = useStateValue();
   const firebase = props.firebase;

   let [ state, changeState ] = useState({
      name: "",
      fullname: "",
      email: "",
      id: "",
      avatar: ""
   });

   const changeInfo = e => {
      const {name, value } = e.target;
      changeState(prev => ({
         ...prev,
         [name] : value
      }))
   }

   useEffect(() => {
      if(state.id === ""){
         if(session){
            changeState(session.user)
         }
      }
   })
   
   const handleSubmit = e => {
      e.preventDefault();

      firebase.db
      .collection("Users")
      .doc(firebase.auth.currentUser.uid)
      .set(state, {merge: true})
      .then(success => {

         dispatch({
            type: "START_SESSION",
            session: state,
            authenticated: true
         })
         openMensajePantalla(dispatch, {
            open : true,
            mensaje: "Cambios guardados correctamente"
         })
      })
      .catch(error => {
         openMensajePantalla(dispatch, {
            open : true,
            mensaje: "Erro al guardar" + error
         })
      })
   }

   return (session 
            ?(
               <Container component="main" maxWidth="xs" justify="center">
                  <div style={style.paper}>
                     <Avatar style={style.avatar} src={state.avatar}/>
                     <Typography component="h1" variant="h5">
                        Perfil
                     </Typography>
                     <form style={style.form} justify="center">
                        <Grid container spacing={3} justify="center">
                           <Grid item xs={12} md={12} justify="center">
                              <TextField
                                 name="name"
                                 variant="outlined"
                                 fullWidth
                                 label="Nombre"
                                 value={state.name}
                                 onChange={changeInfo}
                              />
                           </Grid>
                           <Grid item xs={12} md={12} justify="center">
                              <TextField
                                 name="fullname"
                                 variant="outlined"
                                 fullWidth
                                 label="Apellidos"
                                 value={state.fullname}
                                 onChange={changeInfo}
                              />
                           </Grid>
                           <Grid item xs={12} md={12} justify="center">
                              <TextField
                                 name="email"
                                 variant="outlined"
                                 fullWidth
                                 label="Email"
                                 value={state.email}
                                 onChange={changeInfo}
                              />
                           </Grid>
                        </Grid>
                        <Grid container justify="center">
                           <Grid item xs={12} md={6}>
                              <Button
                                 type="submit"
                                 fullWidth
                                 variant="contained"
                                 size="large"
                                 color="primary"
                                 style={style.submit}
                                 onClick={handleSubmit}
                              >
                                 Actualizar
                              </Button>
                           </Grid>
                        </Grid>
                     </form>
                  </div>
               </Container>
            )     
            :null
         );
}

export default consumerFirebase(Profile);