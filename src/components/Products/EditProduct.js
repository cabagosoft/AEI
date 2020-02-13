import React, { Component } from "react"
import { consumerFirebase } from '../../config'
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button,
         Table, TableBody, TableRow, TableCell
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import ImageUploader from 'react-images-upload';
import uuid from 'uuid';
import { createKeyword } from '../../session/actions/keyword';

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
   paperForm: {
      padding: "2em",
      marginTop: "2em",
      paddingBottom: "4em"
   },
   submit: {
      marginTop: "3em",
      marginBottom: "2em"
   },
   image: {
      height: "100px",
   },
}

class EditProduct extends Component {

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
   };

   changeData = e => {
      let product_ = Object.assign({}, this.state.product);
      product_[e.target.name] = e.target.value;
      this.setState({
         product: product_
      })
   }

   uploadImages = images => {
      const { product } = this.state;
      const { id } = this.props.match.params;

      Object.keys(images).forEach(key => {
         let dinamicCode = uuid.v4();
         let nameImage = images[key].name;
         let extension = nameImage.split(".").pop();
         images[key].alias = (nameImage.split(".")[0] + "_" + dinamicCode + "." + extension).replace(/\s/g,"_").toLowerCase();
      })

      this.props.firebase.saveDocuments(images).then(urlImages => {
         product.images = product.images.concat(urlImages);

         this.props.firebase.db
         .collection("Products")
         .doc(id)
         .set(product, { merge : true})
         .then(success => {
            this.setState({
               product
            })
         })
      })
   }

   dropImage = imageUrl => async () => {
      const { product } = this.state;
      const { id } = this.props.match.params;

      let imageID = imageUrl.match(/[\w-]+.(jpg|png|jpeg|gif|svg)/);
      imageID = imageID[0];
      
      await this.props.firebase.dropDocument(imageID);

      let imageList = this.state.product.images.filter(image => {
         return image !== imageUrl;
      })

      product.images = imageList;

      this.props.firebase.db
      .collection("Products")
      .doc(id)
      .set(product, {merge: true})
      .then(success => {
         this.setState({
            product
         })
      })
   }

   async componentDidMount() {
      const {id} = this.props.match.params 

      const productCollection = this.props.firebase.db.collection("Products");
      const productDB = await productCollection.doc(id).get();

      this.setState({
         product : productDB.data()
      })
   }

   saveProduct = () => {
      const { product } = this.state;
      const { id } = this.props.match.params;

      const searchText = product.name + ' ' + product.description + ' ' + product.sku;
      const keywords = createKeyword(searchText);

      product.keywords = keywords;

      this.props.firebase.db
      .collection("Products")
      .doc(id)
      .set(product, {merge: true})
      .then( success => {
         this.props.history.push("/products");
      })

   }

   render(){
      let imageKey = uuid.v4();

      return (
         <Container style={style.container} xs={12} md={8}>
            <Paper style={style.paper}>
               <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                     <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" style={style.link} href="/products">
                           <HomeIcon style={style.homeIcon}/>
                        </Link>
                        <Typography color="textPrimary">Editar Producto</Typography>
                     </Breadcrumbs>
                  </Grid>
               </Grid>
            </Paper>
            <Paper style={style.paperForm}>
               <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="name"
                        label="Nombre"
                        fullWidth
                        onChange={this.changeData}
                        value={this.state.product.name}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="sku"
                        label="SKU"
                        fullWidth
                        onChange={this.changeData}
                        value={this.state.product.sku}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="stock"
                        label="Stock"
                        fullWidth
                        onChange={this.changeData}
                        value={this.state.product.stock}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="purchase_price"
                        label="Precio de compra"
                        fullWidth
                        onChange={this.changeData}
                        value={this.state.product.purchase_price}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="sale_price"
                        label="Precio de venta"
                        fullWidth
                        onChange={this.changeData}
                        value={this.state.product.sale_price}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        name="description"
                        label="Descripción"
                        fullWidth
                        multiline 
                        onChange={this.changeData}
                        value={this.state.product.description}
                     />
                  </Grid>
               </Grid>   
            </Paper>
            <Grid container justify="center">
               <Grid item xs={12} md={12}>
                  <ImageUploader
                     key = {imageKey}
                     withIcon={false}
                     buttonText="Seleccione las imagenes"
                     onChange={this.uploadImages}
                     imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                     maxFileSize={5242880}
                  />
               </Grid>
            </Grid>  
            <Grid item xs={12} md={4} justify="center">
               <Table>
                  <TableBody>
                     {
                        this.state.product.images
                        ?this.state.product.images.map((image, i) =>  (
                           <TableRow key={i}>
                              <TableCell align="left">
                                 <img src={image} style={style.image}/>
                              </TableCell>
                              <TableCell>
                                 <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={this.dropImage(image)}
                                 >
                                    Eliminar
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))
                        :""
                     }
                  </TableBody>
               </Table>
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
                     Editar
                  </Button>
               </Grid>
            </Grid>

         </Container>
      )
   }
}

export default consumerFirebase(EditProduct);