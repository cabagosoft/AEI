import React from 'react';
import { List, ListItemText, ListItem, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';


export const MenuRight = ({ 
   classes,
   user, 
   textUser, 
   avatarUser, 
   logOut
}) => (
   <div className={classes.list}> 
      <List>
         <ListItem button component={Link} to="/profile">
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