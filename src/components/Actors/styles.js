import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  containerSpaceAround: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px !important',
    padding: '0px !important',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      textAlign: 'center',
    },
  },
  poster: {
    borderRadius: '20px',
    boxShadow: '0.5em 1em 1em rgb(64,64,70)',
    width: '80%',
    [theme.breakpoints.down('lg')]: {
      width: '40%',
      marginBottom: '20px',
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      width: '50%',
      height: '350px',
      marginBottom: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '30px',
      width: '100%',
      height: '350px',
    },
  },

}));
