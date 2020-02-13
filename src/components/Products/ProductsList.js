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

class ProductsList extends Component {
   

   state = {
      products: [],
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
           .collection("Products")
           .orderBy("name")
           .where("keywords", "array-contains", self.state.searchText.toLowerCase());

           if(self.state.searchText.trim()===""){
              objectQuery = this.props.firebase.db
              .collection("Products")
              .orderBy("name");
           }

           objectQuery.get().then(snapshot => {
              const arrayProduct = snapshot.docs.map(doc=>{
                 let data = doc.data();
                 let id = doc.id;
                 return {id, ...data};
              })
              this.setState({
                 products: arrayProduct
              })
           })
        }, 500)
     })
   }

   async componentDidMount(){
      let objectQuery = this.props.firebase.db.collection("Products").orderBy("name");

      const snapshot = await objectQuery.get();

      const arrayProduct = snapshot.docs.map(doc => {
         let data = doc.data();
         let id = doc.id;
         return { id, ...data};
      })

      this.setState({
         products: arrayProduct
      })
   }

   dropProduct = id => {
      this.props.firebase.db
      .collection("Products")
      .doc(id)
      .delete()
      .then(success => {
         this.dropProductToList(id);
      })
   }

   dropProductToList = id => {
      const productListNew = this.state.products.filter (
         product => product.id!==id
      )
      this.setState({
         products: productListNew
      })
   }


   editProduct = id => {
      this.props.history.push("/products/" + id);
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
                        <Typography color="textPrimary">Productos</Typography>
                     </Breadcrumbs>
                  </Grid>
                  <Grid item xs={12} sm={4} style={style.gridTextField}>
                     <TextField
                        name="searchText"
                        label="Buscar Producto"
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
                                          <TableCell align="center">Nombre</TableCell>
                                          <TableCell align="center">Descripción</TableCell>
                                          <TableCell align="center">SKU</TableCell>
                                          <TableCell align="center">Stock</TableCell>
                                          <TableCell align="center">Precio De Compra</TableCell>
                                          <TableCell align="center">Precio De Venta</TableCell>
                                       </TableRow>
                                    </TableHead>
                                    <TableBody>
                                       {this.state.products.map(info => (
                                          <TableRow key={info.id}>
                                             <TableCell component="th" scope="row">{info.name}</TableCell>
                                             <TableCell align="center">{info.description}</TableCell>
                                             <TableCell align="center">{info.sku}</TableCell>
                                             <TableCell align="center">{info.stock}</TableCell>
                                             <TableCell align="center">{info.purchase_price}</TableCell>
                                             <TableCell align="center">{info.sale_price}</TableCell>
                                             <Button size="small" color="primary" onClick={() => this.editProduct(info.id)}>
                                                Editar
                                             </Button>
                                             <Button size="small" color="primary" onClick={() => this.dropProduct(info.id)}>
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
export default consumerFirebase(ProductsList)