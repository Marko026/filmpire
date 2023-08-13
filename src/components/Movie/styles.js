import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  movie: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  links: {
    alignItems: 'center',
    fontWeight: 'bolder',
    [theme.breakpoints.up('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  image: {
    borderRadius: '20px',
    height: '240px',
    marginBottom: '10px',
    transition: '0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  title: {
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    width: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginTop: '10px',
    marginBottom: '0px',
    textAlign: 'center',
  },
}));
