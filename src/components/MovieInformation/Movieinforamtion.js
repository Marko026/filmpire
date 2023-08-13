import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, UseMediaQuery, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack, BorderColor } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB';
import useStyles from './styles';
import generIcons from '../../assets/genres';
import { selectGenreOrCategory } from '../../features/currentGenerOrCategory';
import { MovieList } from '..';
import { userSelector } from '../../features/auth';
import 'react-toastify/dist/ReactToastify.css';

const Movieinforamtion = () => {
  const { user } = useSelector(userSelector);

  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ list: 'recommendations', movie_id: id });
  const { data: favoriteMovies, isFetching: isFavoriteMoviesFetched } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchListMovies, isFetching: isWachListedFetched } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  const notify = () => {
    toast.warning('You need to be logged in to add to Favorites');
  };
  const notify2 = () => {
    toast.warning('You need to be logged in to add to Watchlist');
  };

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchListed, setIsMovieWatchListed] = useState(false);

  const addToFavorites = async () => {
    if (!user.id && !localStorage.getItem('session_id')) {
      notify();
      return;
    }
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited,
    });

    setIsMovieFavorited((prev) => !prev);
  };
  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchListed(!!watchListMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchListMovies, data]);

  const addToWatchList = async () => {
    if (!user.id && !localStorage.getItem('session_id')) {
      notify2();
      return;
    }
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchListed,
    });

    setIsMovieWatchListed((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box className="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something has gone wrong </Link>
      </Box>
    );
  }
  if (isRecommendationsFetching) {
    return (
      <Box className="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <ToastContainer position="top-center" />
      <Grid item sm={12} lg={4} mx="auto">
        <img className={classes.poster} src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} alt={data?.title} />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h4" align="center" gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" alignItems="center">
            <Rating readOnly value={data.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {data?.vote_average.toFixed(1)}/10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}min | Language:  {data?.spoken_languages[0].name}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link key={genre.name} to="/" className={classes.links} onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
              <img src={generIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} />
              <Typography color="textPrimary" variant="subtitle">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginTop: '10px' }}>{data?.overview}</Typography>
        <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data
            && data.credits?.cast?.map(
              (character, i) => (
                character.profile_path && (
                  <Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
                    <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`} alt={character.name} />
                    <Typography color="textPrimary">{character.name}</Typography>
                    <Typography color="textSecondary">{character.character.split(' ')[0]}</Typography>
                  </Grid>
                )
              ),
            ).slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonContainer}>
              <ButtonGroup size="small" variant="outlined">
                <Button sx={{ fontSize: '10px' }} target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>Website</Button>
                <Button sx={{ fontSize: '10px' }} target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                <Button sx={{ fontSize: '10px' }} onClick={() => { setOpen(true); }} href="#" endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonContainer}>
              <ButtonGroup size="small" variant="outlined">
                <Button sx={{ fontSize: '10px' }} onClick={addToFavorites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>{isMovieFavorited ? 'Unfavortie' : 'Favorite'}</Button>
                <Button sx={{ fontSize: '10px' }} onClick={addToWatchList} endIcon={isMovieWatchListed ? <Remove /> : <PlusOne />}>{isMovieWatchListed ? ' Watchlist' : ' Watchlist'}</Button>
                <Button sx={{ fontSize: '10px' }} endIcon={<ArrowBack />}>
                  <Typography sx={{ fontSize: '10px' }} component={Link} style={{ textDecoration: 'none' }} to="/" color="inherit" variant="subtitle2">
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {recommendations.results.length > 0
          ? <MovieList movies={recommendations} numberOfMovies={12} />
          : (
            <Box display="flex" justifyContent="center">
              Sorry nothing was found
            </Box>
          )}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => { setOpen(false); }}
      >
        {data?.videos?.results?.length > 0
          && (
            <iframe autoPlay frameBorder="0" className={classes.video} title="Trailer" src={`https://www.youtube.com/embed/${data.videos.results[0].key}`} allow="autoPlay" />
          )}
      </Modal>
    </Grid>
  );
};
export default Movieinforamtion;
