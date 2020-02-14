import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Table, TableContainer, Button, TableHead, TableRow, TableBody, TableCell, Avatar} from '@material-ui/core';
import { withStyles, makeStyles, StylesProvider } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import { consumerFirebase } from '../../../config';



const style = {
  
   root: {
      width: '100%'
   },
   row: {
      color: "#ffffff"
   },
   body: {
      fontSize: 14,
   },
   cardGrid: {
      paddingLeft: "5em"

   },
   homeIcon: {
      width: 20,
      height: 20,
      marginRight: "4px"
   },
   link: {
      display: "flex",
   },
   gridTextField: {
      marginTop: "2em"
   },
   card: {
      height: "100%",
      display: "flex",
      flexDirection:"column"
   },
   cardMedia: {
      paddingTop: "56.25%"
   },
   cardContent: {
      flexGrow: 1
   },
   tablecontainer: {
      margin: "auto"
   },
   paper: {
      marginTop: "2em",
      paddingTop: "1em",
      paddingBottom: "2em",
      alignContent: "center",
      width: "100%"
   }
}

class ConfigInvoicesList extends Component {
   

   state = {
      configInvoices: [],
      searchText: ""
   }

   changeSearchText = e => {
     const self = this;
     self.setState({
        [e.target.name] : e.target.value
     })

     if(self.state.typingTimeout){
        clearTimeout(self.state.typingTimeout);
     }
     self.setState({
        name: e.target.value,
        typing: false,
        typingTimeout: setTimeout(goTime => {
           let objectQuery = this.props.firebase.db
           .collection("ConfigInvoices")
           .orderBy("prefix")
           .where("keywords", "array-contains", self.state.searchText.toLowerCase());

           if(self.state.searchText.trim()===""){
              objectQuery = this.props.firebase.db
               .collection("ConfigInvoices")
               .orderBy("prefix")
           }

           objectQuery.get().then(snapshot => {
              const arrayConfigInvoices = snapshot.docs.map(doc=>{
                 let data = doc.data();
                 let id = doc.id;
                 return {id, ...data};
              })
              this.setState({
                 configInvoices: arrayConfigInvoices
              })
           })
        }, 500)
     })
   }

   async componentDidMount(){
      let objectQuery = this.props.firebase.db.collection("ConfigInvoices").orderBy("prefix");

      const snapshot = await objectQuery.get();

      const arrayConfigInvoices = snapshot.docs.map(doc => {
         let data = doc.data();
         let id = doc.id;
         return { id, ...data};
      })

      this.setState({
         configInvoices: arrayConfigInvoices
      })
   }

   dropConfigInvoices = id => {
      this.props.firebase.db
      .collection("ConfigInvoices")
      .doc(id)
      .delete()
      .then(success => {
         this.dropConfigInvoicesToList(id);
      })
   }

   dropConfigInvoicesToList = id => {
      const configInvoiceListNew = this.state.products.filter (
         configInvoice => configInvoice.id!==id
      )
      this.setState({
         configInvoices: configInvoiceListNew
      })
   }


   editConfigInvoices = id => {
      this.props.history.push("/invoices/config/" + id);
   }

   render() {
      return (
         <Container style={style.cardGrid} xs={12} md={8}>
               <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                     <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" style={style.link} href="/">
                           <HomeIcon style={style.homeIcon}/>
                        </Link>
                        <Typography color="textPrimary">Facturación</Typography>
                        <Typography color="textPrimary">Configuración General</Typography>
                     </Breadcrumbs>
                  </Grid>
                  <Grid item xs={12} sm={4} style={style.gridTextField}>
                     <TextField
                        name="searchText"
                        label="Buscar Configuración"
                        variant="outlined"
                        fullWidth
                        onChange={this.changeSearchText}
                        value={this.state.searchText}
                     />
                  </Grid>
                  
                  <Grid item xs={12} md={12}>
                     <Grid container spacing={4}>
                        <Grid item xs={12} md={12}>
                           <Paper style={style.paper} justify="center" elevation={3} xs={12}>
                              <TableContainer style={style.tablecontainer} justify="center">
                                 <Table style={style.table} justify="center" aria-label="simple table">
                                    <TableHead style={style.head}>
                                       <TableRow style={style.row}>
                                          <TableCell align="center">Prefijo</TableCell>
                                          <TableCell align="center">Resolución</TableCell>
                                          <TableCell align="center">Fecha</TableCell>
                                          <TableCell align="center">Fecha Vencimiento</TableCell>
                                          <TableCell align="center">Rango Inicial</TableCell>
                                          <TableCell align="center">Rango Final</TableCell>
                                          <TableCell align="center">Factura Actual</TableCell>
                                       </TableRow>
                                    </TableHead>
                                    <TableBody>
                                       {this.state.configInvoices.map(info => (
                                          <TableRow key={info.id}>
                                             <TableCell align="center">{info.prefix}</TableCell>
                                             <TableCell align="center">{info.resolution}</TableCell>
                                             <TableCell align="center">{info.date}</TableCell>
                                             <TableCell align="center">{info.due_date}</TableCell>
                                             <TableCell align="center">{info.initial_range}</TableCell>
                                             <TableCell align="center">{info.final_range}</TableCell>
                                             <TableCell align="center">{info.current_invoice}</TableCell>
                                             <Button size="small" color="primary" onClick={() => this.editConfigInvoices(info.id)}>
                                                Editar
                                             </Button>
                                             <Button size="small" color="primary" onClick={() => this.dropConfigInvoices(info.id)}>
                                                Eliminar
                                             </Button> 
                                             
                                          </TableRow> 
                                       ))}                         
                                    </TableBody>
                                 </Table>
                              </TableContainer>
                           </Paper>
                        </Grid>   
                     </Grid>
                  </Grid>
               </Grid>   
         </Container>
      )
   }
}
export default consumerFirebase(ConfigInvoicesList)