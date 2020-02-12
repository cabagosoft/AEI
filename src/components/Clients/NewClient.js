import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { consumerFirebase } from '../../config';
import { openMensajePantalla } from '../../session/actions/snackbarAction'
import ImageUploader from 'react-images-upload';
import uuid from 'uuid';
import { createKeyword } from '../../session/actions/keyword';


const style = {
   container: {
      paddingLeft: "5em"
   },
   paper: {
      marginTop: "2em",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
   },
   link: {
      display: "flex"
   },
   homeIcon: {
      width: 20,
      height: 20,
      marginRight: "4px"
   },
   submit: {
      marginTop: "3em",
      marginBottom: "2em"
   },
   image: {
      height: "100px",
   }
}

class NewClient extends Component {

   state = {
      client:{
         name: '',
         nit: '',
         contact_name: '',
         address: '',
         email: '',
         city: '',
         phone: '',
         cell_phone:''
      },
      files: [],
   };

   dataIntoState = e => {
      let client_ = Object.assign({}, this.state.client);
      client_[e.target.name] = e.target.value;
      this.setState({
         client: client_
      })
   }

   uploadImages = documents => {
      Object.keys(documents).forEach(function(key) {
         documents[key].urlTemp = URL.createObjectURL(documents[key])
      })

      this.setState({
         files : this.state.files.concat(documents)
      })
   }

   saveClient = () => {

      const { files, client } = this.state;

      Object.keys(files).forEach(function(key){
         let dinamicValue = Math.floor(new Date().getTime()/1000);
         let name = files[key].name;
         let extension = name.split(".").pop();
         files[key].alias = (name.split(".")[0] + "_" + dinamicValue + "." + extension).replace(/\s/g,"_").toLowerCase();
      })

      const searchText = client.name + ' ' + client.nit + ' ' + client.contac_name;
      let keywords = createKeyword(searchText);

      this.props.firebase.saveDocuments(files).then(arrayUrls => {
         client.images = arrayUrls;
         client.keywords = keywords;

         this.props.firebase.db
         .collection("Clients")
         .add(client)
         .then(success => {
            this.props.history.push("/clients");
         })
         .catch(error => {
            openMensajePantalla({
               open: true,
               mensaje: error
            })
         })
      })
     
   
   }

   render(){
      return(
         <Container style={style.container} xs={12} md={8}>
            <Paper style={style.paper}>
               
               <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                     <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" style={style.link} href="/">
                           <HomeIcon style={style.homeIcon}/>
                        </Link>
                        <Typography color="textPrimary">Nuevo Cliente</Typography>
                     </Breadcrumbs>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="name"
                        label="Nombre"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.client.name}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="nit"
                        label="Nit"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.client.nit}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="contact_name"
                        label="Contacto"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.client.contact_name}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="address"
                        label="Dirección"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.client.address}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="email"
                        label="Email"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.client.email}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="city"
                        label="Ciudad"
                        fullWidth
                        multiline
                        onChange={this.dataIntoState}
                        value={this.state.client.city}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="phone"
                        label="Teléfono"
                        fullWidth
                        multiline
                        onChange={this.dataIntoState}
                        value={this.state.client.phone}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="cell_phone"
                        label="Celular"
                        fullWidth
                        multiline
                        onChange={this.dataIntoState}
                        value={this.state.client.cell_phone}
                     />
                  </Grid>
               </Grid>
               <Grid container justify="center">
                  <Grid item xs={12} md={6}>
                     <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        style={style.submit}
                        onClick={this.saveClient}
                     >
                        Guardar
                     </Button>
                  </Grid>
               </Grid>
            </Paper>
         </Container>
      );
   }
}

export default consumerFirebase(NewClient); 