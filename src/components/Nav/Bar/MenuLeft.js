import React from 'react';
import { List, Link, ListItemText, ListItem, Avatar, Divider } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AddBoxIcon from '@material-ui/icons/AddBox';

export const MenuLeft = ({ classes }) => (
   <div className={classes.list}> 
      <List>
         <ListItem component={Link} button to="/out">
            <AccountBoxIcon/>
            <ListItemText 
               classes = {{primary: classes.listItemText}} 
               primary="Perfil"
            />
         </ListItem>
      </List>
      <Divider/>
      <List>
         <ListItem component={Link} button to="">
            <AddBoxIcon/>
            <ListItemText classes = {{primary: classes.listItemText}} primary="Clientes"/>
         </ListItem>
         <ListItem component={Link} button to="">
            <AddBoxIcon/>
            <ListItemText classes = {{primary: classes.listItemText}} primary="Productos"/>
         </ListItem>
         <ListItem component={Link} button to="">
            <AddBoxIcon/>
            <ListItemText classes = {{primary: classes.listItemText}} primary="Facturación"/>
         </ListItem>

      </List>
   </div>
);