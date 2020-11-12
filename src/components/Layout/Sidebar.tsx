import { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { ApiRounded } from '@material-ui/icons';
import clsx from 'clsx';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  grow: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.action.active,
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'hidden',
    borderTop: `1px solid rgba(255, 255, 255, 0.08)`,

    '& button': {
      flex: 1,
      color: 'rgba(255, 255, 255, 0.8)',
      height: theme.spacing(5),

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  active: {
    backgroundColor: theme.palette.action.selected,
    '&:before': {
      content: "''",
      height: '100%',
      width: '4px',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

type Props = {
  open: boolean;
  toggle: () => void;
  docNames: Array<string>;
  changeDoc: (name: string) => void;
};

const Sidebar = (props: Props) => {
  const classes = useStyles();
  const [currentDocName, setCurrentDocName] = useState<string>('');

  useEffect(() => {
    setCurrentDocName(props.docNames[0]);
  }, [props.docNames]);

  const changeDoc = (event: React.MouseEvent<HTMLDivElement>, docName: string) => {
    event.preventDefault();

    if (docName === currentDocName) return;

    setCurrentDocName(docName);
    props.changeDoc(docName);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.open,
        [classes.drawerClose]: !props.open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        }),
      }}
      open={props.open}
    >
      <div className={classes.toolbar} />
      <List component="nav" aria-label="secondary mailbox folders">
        {props.docNames &&
          props.docNames.map((docName) => (
            <div key={docName}>
              <ListItem
                button
                onClick={(event) => changeDoc(event, docName)}
                className={docName === currentDocName ? classes.active : ''}
              >
                <ListItemIcon>
                  <ApiRounded color={docName === currentDocName ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={docName} />
              </ListItem>
            </div>
          ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
