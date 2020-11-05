import { Typography, AppBar, Toolbar, Button, ButtonGroup } from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
  },
  active: {
    background: theme.palette.background.default,
    color: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.common.white}`,
    '&:hover': {
      background: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
  },
}));

interface Props {
  docVersions: Array<string>;
  changeVersion: (version: string) => void;
}

const Header = (props: Props) => {
  const classes = useStyles();
  const [currentVersion, setCurrentVersion] = useState<string>('');

  useEffect(() => {
    setCurrentVersion(props.docVersions[0]);
  }, [props.docVersions]);

  const changeVersion = (event: React.MouseEvent<HTMLButtonElement>, version: string) => {
    event.preventDefault();

    if (version === currentVersion) return;

    setCurrentVersion(version);
    props.changeVersion(version);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          API Docs
        </Typography>
        <span className={classes.grow} />

        <ButtonGroup size="small" color="inherit" variant="outlined">
          <Button>Versions</Button>
          {props.docVersions &&
            props.docVersions.map((version) => (
              <Button
                key={version}
                className={version == currentVersion ? classes.active : ''}
                onClick={(event) => changeVersion(event, version)}
              >
                {version}
              </Button>
            ))}
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
