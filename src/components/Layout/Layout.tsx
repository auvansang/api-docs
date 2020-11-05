import { useState, ReactChild } from 'react';

import { Theme, makeStyles } from '@material-ui/core/styles';

import Header from './Header';
import Sidebar from './Sidebar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

type Props = {
  docNames: Array<string>;
  docVersions: Array<string>;

  changeDoc: (name: string) => void;
  changeVersion: (version: string) => void;

  children?: ReactChild;
};

const Layout = (props: Props) => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const classes = useStyles();

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };
  return (
    <div className={classes.root}>
      <Header docVersions={props.docVersions} changeVersion={props.changeVersion} />
      <Sidebar
        open={openSidebar}
        toggle={toggleSidebar}
        docNames={props.docNames}
        changeDoc={props.changeDoc}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
