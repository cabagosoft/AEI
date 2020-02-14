import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { consumerFirebase } from '../../../config';
import { openMensajePantalla } from '../../../session/actions/snackbarAction'


const style = {
   container: {
      paddingLeft: "5em"
   },
   paper: {
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
   },
   paperForm: {
      padding: "2em",
      marginTop: "2em",
      paddingBottom: "4em"
   }
}

class EditConfigInvoices extends Component {

   state = {
      configInvoice:{
        prefix: '',
        resolution: '',
        date: '',
        due_date: '',
        initial_range: '',
        final_range: '',
        current_invoice:''
      },
   };

   dataIntoState = e => {
      let configInvoice_ = Object.assign({}, this.state.configInvoice);
      configInvoice_[e.target.name] = e.target.value;
      this.setState({
         configInvoice: configInvoice_
      })
   }

   async componentDidMount() {
      const {id} = this.props.match.params 

      const configInvoicesCollection = this.props.firebase.db.collection("ConfigInvoices");
      const configInvoicesDB = await configInvoicesCollection.doc(id).get();

      this.setState({
         configInvoices : configInvoicesDB.data()
      })
   }

   saveConfigInvoices = () => {

      const { configInvoice } = this.state;
      const { id } = this.props.match.params;



         this.props.firebase.db
         .collection("ConfigInvoices")
         .doc(id)
         .set(configInvoice, {merge: true})
         .then( success => {
            this.props.history.push("/invoices/config");
         })
   
   }


   render(){
      return(
         <Container style={style.container} xs={12} md={8}>
            <Paper style={style.paper}>
               <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                     <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" style={style.link} href="/">
                           <HomeIcon style={style.homeIcon}/>
                        </Link>
                        <Typography color="textPrimary">Configuración</Typography>
                     </Breadcrumbs>
                  </Grid>
               </Grid>
            </Paper> 
            <Paper style={style.paperForm}>
               <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="prefix"
                        label="Prefijo"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.prefix}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="resolution"
                        label="No Resolución"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.resolution}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="date"
                        label="Fecha Inicio"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.date}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="due_date"
                        label="Fecha Vencimiento"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.due_date}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="initial_range"
                        label="Rango Inicial"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.initial_range}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="final_range"
                        label="Rango Final"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.final_range}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="current_invoice"
                        label="Factura Actual"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.configInvoice.current_invoice}
                     />
                  </Grid>
               </Grid>
            </Paper>   
            <Grid container justify="center">
               <Grid item xs={12} md={6}>
                  <Button
                     type="button"
                     fullWidth
                     variant="contained"
                     size="large"
                     color="primary"
                     style={style.submit}
                     onClick={this.saveConfigInvoices}
                  >
                     Guardar
                  </Button>
               </Grid>
            </Grid>
         </Container>
      );
   }
}

export default consumerFirebase(EditConfigInvoices); 