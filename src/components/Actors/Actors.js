import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { useGetActorDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import { MovieList, Pagination } from '..';

const Actors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isFetching: isFetchingByActorId } = useGetMoviesByActorIdQuery({ id, page });
  const { data: actorDetails, isFetching } = useGetActorDetailsQuery({ actor_id: id });
  const classes = useStyles();

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isFetchingByActorId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid item container alignItems="center" className={classes.containerSpaceAround}>
      <Grid sx={{ xl: { display: 'flex' } }} item sm={12} lg={5} xl={4} sx={{ mx: 'auto' }}>
        <img className={classes.poster} src={`https://image.tmdb.org/t/p/w500/${actorDetails?.profile_path}`} alt={actorDetails?.name} />
      </Grid>
      <Grid item container direction="column" lg={7} xl={8}>
        <Typography variant="h3" gutterBottom fontWeight={400}>
          {actorDetails?.name}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Born: {new Date(actorDetails?.birthday).toDateString()}
        </Typography>
        <Typography variant="body1" align="justify" color="#9e9e9e" marginBottom="2rem" paragraph>
          {actorDetails?.biography || 'Sorry, no biography yet...'}
        </Typography>
        <Box display="flex" justifyContent="space-around">
          <Button variant="contained" target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/name/${actorDetails?.imdb_id}`}>
            IMDB
          </Button>
          <Button variant="text" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Grid>
      <Typography variant="h2" mx="auto" my={5}>Movies</Typography>
      {data.results && <MovieList movies={data} numberOfMovies={12} />}
      <Box mx="auto">
        <Pagination currentPage={page} setCurrentPage={setPage} totalPages={data?.total_pages} />
      </Box>
    </Grid>
  );
};

export default Actors;
