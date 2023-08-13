import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  toolbar: {
    height: '70px',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    marginTop: '1rem',
    [theme.breakpoints.up('sm')]:
    {
      padding: '2em',
      paddingRight: '1em',
    },
  },
}));
