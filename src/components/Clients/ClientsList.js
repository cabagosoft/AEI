import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Table, TableContainer, Button, TableHead, TableRow, TableBody, TableCell, Avatar} from '@material-ui/core';
import { withStyles, makeStyles, StylesProvider } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { consumerFirebase } from '../../config';



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
   paper: {
      marginTop: "2em",
      display: "flex",
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
      paddingLeft: "4em",
      paddingBottom: "2em",
      paddingRight: "4em",
      alignContent: "center",
      width: "100%"
   }
}



class ClientsList extends Component {
   

   state = {
      clients: [],
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
           .collection("Clients")
           .orderBy("name")
           .where("keywords", "array-contains", self.state.searchText.toLowerCase());

           if(self.state.searchText.trim()===""){
              objectQuery = this.props.firebase.db
              .collection("Clients")
              .orderBy("name");
           }

           objectQuery.get().then(snapshot => {
              const arrayClient = snapshot.docs.map(doc=>{
                 let data = doc.data();
                 let id = doc.id;
                 return {id, ...data};
              })
              this.setState({
                 clients: arrayClient
              })
           })
        }, 500)
     })
   }

   async componentDidMount(){
      let objectQuery = this.props.firebase.db.collection("Clients").orderBy("name");

      const snapshot = await objectQuery.get();

      const arrayClient = snapshot.docs.map(doc => {
         let data = doc.data();
         let id = doc.id;
         return { id, ...data};
      })

      this.setState({
         clients: arrayClient
      })
   }

   dropClient = id => {
      this.props.firebase.db
      .collection("Clients")
      .doc(id)
      .delete()
      .then(success => {
         this.dropClientToList(id);
      })
   }

   dropClientToList = id => {
      const clientListNew = this.state.clients.filter (
         client => client.id!==id
      )
      this.setState({
         clients: clientListNew
      })
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
                        <Typography color="textPrimary">Clientes</Typography>
                     </Breadcrumbs>
                  </Grid>
                  <Grid item xs={12} sm={4} style={style.gridTextField}>
                     <TextField
                        name="searchText"
                        label="Buscar Cliente"
                        variant="outlined"
                        fullWidth
                        onChange={this.changeSearchText}
                        value={this.state.searchText}
                     />
                  </Grid>
                  
                  <Grid item xs={12} md={12}>
                     <Grid container spacing={4}>
                        <Grid item xs={12} md={12}>
                           <Paper style={style.paper} justify="center">
                              <TableContainer style={style.tablecontainer} justify="center">
                                 <Table style={style.table} justify="center" aria-label="simple table">
                                    <TableHead style={style.head}>
                                       <TableRow style={style.row}>
                                          <TableCell align="center">Nombre</TableCell>
                                          <TableCell align="center">Nit</TableCell>
                                          <TableCell align="center">Contacto</TableCell>
                                          <TableCell align="center">Dirección</TableCell>
                                          <TableCell align="center">Email</TableCell>
                                          <TableCell align="center">Celular</TableCell>
                                          <TableCell align="center">Teléfono</TableCell>
                                       </TableRow>
                                    </TableHead>
                                    <TableBody>
                                       {this.state.clients.map(info => (
                                          <TableRow key={info.id}>
                                             <TableCell component="th" scope="row">{info.name}</TableCell>
                                             <TableCell align="center">{info.nit}</TableCell>
                                             <TableCell align="center">{info.contact_name}</TableCell>
                                             <TableCell align="center">{info.address}</TableCell>
                                             <TableCell align="center">{info.email}</TableCell>
                                             <TableCell align="center">{info.cell_phone}</TableCell>
                                             <TableCell align="center">{info.phone}</TableCell>
                                             <Button size="small" color="primary">
                                                Editar
                                             </Button>
                                             <Button size="small" color="primary" onClick={() => this.dropClient(info.id)}>
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
export default consumerFirebase(ClientsList)