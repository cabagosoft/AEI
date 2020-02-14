import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PeopleIcon from '@material-ui/icons/People';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ClearAllRoundedIcon from '@material-ui/icons/ClearAllRounded';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function ListItemsLeft() {
  const classes = useStyles();
  const [
    open, setOpen, openC, setOpenC
  ] = React.useState(false);

  const handleClickProduct = () => {
    setOpen(!open);
  };
  const handleClickClient= () => {
    setOpen(!open);
  };

  return (
    <>
    <List>
      <ListItem button component={Link} to="/profile">
        <ListItemIcon>
          <AccountCircleIcon/>
        </ListItemIcon>
        <ListItemText primary="Perfil" />
      </ListItem>

      <ListItem button component={Link} to="/products" onClick={handleClickProduct}>
        <ListItemIcon>
          <ClearAllRoundedIcon/>
        </ListItemIcon>
        <ListItemText primary="Productos" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button component={Link} to="/products/new" className={classes.nested}>
            <ListItemIcon>
              <AddBoxIcon/>
            </ListItemIcon>
            <ListItemText primary="Nuevo Producto" />
          </ListItem>
        </List>
      </Collapse>

      <ListItem button component={Link} to="/clients" onClick={handleClickClient}>
        <ListItemIcon>
          <PeopleIcon/>
        </ListItemIcon>
        <ListItemText primary="Clientes" />
        {open? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button component={Link} to="/clients/new" className={classes.nested}>
            <ListItemIcon>
              <AddBoxIcon/>
            </ListItemIcon>
            <ListItemText primary="Nuevo Cliente" />
          </ListItem>
        </List>
      </Collapse>

      <ListItem button component={Link} to="/invoices" onClick={handleClickClient}>
        <ListItemIcon>
          <ListAltIcon/>
        </ListItemIcon>
        <ListItemText primary="Facturas" />
        {open? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button component={Link} to="/invoices/new" className={classes.nested}>
            <ListItemIcon>
              <AddBoxIcon/>
            </ListItemIcon>
            <ListItemText primary="Nueva Factura" />
          </ListItem>
        </List>
        <List component="div" disablePadding>
          <ListItem button component={Link} to="/invoices/config" className={classes.nested}>
            <ListItemIcon>
              <SettingsIcon/>
            </ListItemIcon>
            <ListItemText primary="Nueva Factura" />
          </ListItem>
        </List>
      </Collapse>
    </List>
    </>
  );
}