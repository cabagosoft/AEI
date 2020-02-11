import React, {useState, useEffect } from 'react';
import { useStateValue } from '../../session/store';
import { Container, Avatar, Grid, TextField, Button, Typography} from '@material-ui/core';
import { openMensajePantalla } from '../../session/actions/snackbarAction'
import { consumerFirebase } from '../../config/';
import ImageUploader from 'react-images-upload';
import uuid from 'uuid';


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
   },
   avatar: {
      width: 90,
      height: 90,
    },
}

const Profile = props => {
   const [{session}, dispatch] = useStateValue();
   const firebase = props.firebase;

   let [ state, changeState ] = useState({
      name: "",
      fullname: "",
      email: "",
      id: "",
      image: "",
      phone:""
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

   const uploadImage = images => {
      
      const image = images[0];  //1. Capturar la imagen

      const uniqueKeyimage = uuid.v4();  //2. Renombrar la imagen

      const nameImage = image.name; //3. Obtener el nombre de la imagen

      const extensionImage = nameImage.split('.').pop(); //4. Obtener extension de la imagen

      //5. Asignar nuevo nombre a la imagen - alias
      const alias = (nameImage.split('.')[0] + "_" + uniqueKeyimage + "." +
                     extensionImage).replace(/\s/g,"_").toLowerCase();

      firebase.saveDocument(alias, image).then(metadata => {
         firebase.returnDocument(alias).then(urlImage => {

            state.image = urlImage;

            firebase.db
               .collection("Users")
               .doc(firebase.auth.currentUser.uid)
               .set(
                  {
                     image : urlImage
                  },
                  {merge: true}
               )
               .then(userDB => {
                  dispatch({
                     type: "START_SESSION",
                     session: state,
                     authenticated: true
                  })
               })
         })
      })
   }
   
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
            mensaje: "Error al guardar" + error
         })
      })
   }

   let imageKey = uuid.v4();

   return (session 
            ?(
               <Container component="main" maxWidth="md" justify="center">
                  <div style={style.paper}>
                     <Avatar style={style.avatar} src={state.image}/>
                     <form style={style.form} justify="center">
                        <Grid container spacing={3} justify="center">
                           <Grid item xs={12} md={6} justify="center">
                              <TextField
                                 name="name"
                                 variant="outlined"
                                 fullWidth
                                 label="Nombre"
                                 value={state.name}
                                 onChange={changeInfo}
                              />
                           </Grid>
                           <Grid item xs={12} md={6} justify="center">
                              <TextField
                                 name="fullname"
                                 variant="outlined"
                                 fullWidth
                                 label="Apellidos"
                                 value={state.fullname}
                                 onChange={changeInfo}
                              />
                           </Grid>
                           <Grid item xs={12} md={6} justify="center">
                              <TextField
                                 name="email"
                                 variant="outlined"
                                 fullWidth
                                 label="Email"
                                 value={state.email}
                                 onChange={changeInfo}
                              />
                           </Grid>
                           <Grid item xs={12} md={6} justify="center">
                              <TextField
                                 name="phone"
                                 variant="outlined"
                                 fullWidth
                                 label="Teléfono"
                                 value={state.phone}
                                 onChange={changeInfo}
                              />
                           </Grid>
                           <Grid item xs={12} md={12}>
                              <ImageUploader
                                 withIcon={false}
                                 key={imageKey}
                                 singleImage={true}
                                 buttonText="Seleccione una imágen"
                                 onChange={uploadImage}
                                 imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                                 maxFileSize={5242880}
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