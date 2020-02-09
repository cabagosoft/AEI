import React from 'react';
import { List, Link, ListItemText, ListItem, Avatar } from '@material-ui/core';


export const MenuRight = ({ 
   classes,
   user, 
   textUser, 
   avatarUser, 
   logOut
}) => (
   <div className={classes.list}> 
      <List>
         <ListItem button component={Link} to="/out">
            <Avatar
               //classes = {{primary: classes.avatarSize}}
               src={avatarUser}
            />
            <ListItemText 
               classes = {{primary: classes.listItemText}} 
               primary={textUser}
            />
         </ListItem>
         <ListItem button onClick={logOut}>
            <ListItemText 
               classes={{primary: classes.listItemText}} 
               primary="Salir"
            />
         </ListItem>
      </List>
   </div>
);