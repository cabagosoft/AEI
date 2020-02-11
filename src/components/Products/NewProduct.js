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

class NewProduct extends Component {

   state = {
      product:{
         name: '',
         sku: '',
         sale_price: '',
         purchase_price: '',
         description: '',
         stock: '',
         images: [],
      },
      files:[]
   };

   dataIntoState = e => {
      let product_ = Object.assign({}, this.state.product);
      product_[e.target.name] = e.target.value;
      this.setState({
         product: product_
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

   saveProduct = () => {

      const { files, product } = this.state;

      //Crear a cada imagen (archivo) un alias
      Object.keys(files).forEach(function(key){
         let dinamicValue = Math.floor(new Date().getTime()/1000);
         let name = files[key].name;
         let extension = name.split(".").pop();
         files[key].alias = (name.split(".")[0] + "_" + dinamicValue + "." + extension).replace(/\s/g,"_").toLowerCase();
      })

      const searchText = product.name + ' ' + product.description + ' ' + product.sku;
      let keywords = createKeyword(searchText);

      this.props.firebase.saveDocuments(files).then(arrayUrls => {
         product.images = arrayUrls;
         product.keywords = keywords;

         this.props.firebase.db
         .collection("Products")
         .add(product)
         .then(success => {
            this.props.history.push("/");
         })
         .catch(error => {
            openMensajePantalla({
               open: true,
               mensaje: error
            })
         })
      })
   }

   dropImage = nameImage => () => {
      this.setState({
         files: this.state.files.filter(file => {
            return file.name !== nameImage
         })
      })
   }

   render(){
      let imageKey = uuid.v4();

      return(
         <Container style={style.container} xs={12} md={8}>
            <Paper style={style.paper}>
               
               <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                     <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" style={style.link} href="/">
                           <HomeIcon style={style.homeIcon}/>
                        </Link>
                        <Typography color="textPrimary">Nuevo Producto</Typography>
                     </Breadcrumbs>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="name"
                        label="Nombre"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.product.name}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="sku"
                        label="SKU"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.product.sku}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="stock"
                        label="Stock"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.product.stock}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="purchase_price"
                        label="Precio de compra"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.product.purchase_price}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="sale_price"
                        label="Precio de venta"
                        fullWidth
                        onChange={this.dataIntoState}
                        value={this.state.product.sale_price}
                     />
                  </Grid>
                  <Grid item xs={12} md={12}>
                     <TextField
                        name="description"
                        label="Descripción"
                        fullWidth
                        multiline
                        onChange={this.dataIntoState}
                        value={this.state.product.description}
                     />
                  </Grid>
               </Grid>
               <Grid container justify="center">
                  <Grid item xs={12} sm={6}>
                     <ImageUploader
                        key = {imageKey}
                        withIcon = {true}
                        buttonText="Seleccione las imagenes"
                        onChange={this.uploadImages}
                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                        maxFileSize={5242880}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Table>
                        <TableBody>
                           {
                              this.state.files.map((file, i) => (
                                 <TableRow key={i}>
                                    <TableCell align="left">
                                       <img src={file.urlTemp} style={style.image}/>
                                    </TableCell>
                                    <TableCell>
                                       <Button
                                          variant="contained"
                                          color="secondary"
                                          size="small"
                                          onClick={this.dropImage(file.name)}
                                       >
                                          Eliminar
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))
                           }
                        </TableBody>
                     </Table>
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
                        onClick={this.saveProduct}
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

export default consumerFirebase(NewProduct); 