import axios from "axios";
import Movie from "../models/movie.js";
import Show from "../models/show.js";
import { inngest } from "../inngest/index.js";

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    const movies = data.results;
    res.json({
      success: true,
      movies: movies,
    });
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

// new show add database

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      const [movieDetailResponse, movieCreditResponce] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);
      const movieApiData = movieDetailResponse.data;
      const movieCreditData = movieCreditResponce.data;
      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      }
      movie = await Movie.create(movieDetails);
    }
    const showsToCreate = [];
    showsInput.forEach(element => {
      const showDate = element.date;
      element.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}
        })
      })
    });

    if(showsToCreate.length > 0){
      await Show.insertMany(showsToCreate);
    }

    await inngest.send({
      name: "app/show.added",
      data:{movieTitle: movie.title}
    })
    res.json({
      status: 200,
      success: true,
      message: "Shows created successfully",
    })
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
export const getShows = async (req,res)=>{
  try {
    const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate("movie").sort({showDateTime: 1});
   
    const uniqueshows = new Set(shows.map(show => show.movie))

    res.json({
      success: true,
      message: "Shows fetched successfully",
      shows: Array.from(uniqueshows),
    })
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
}

export const getshow = async (req,res)=>{
  try {
    const {movieId} = req.params;
    const shows = await Show.find({movie: movieId , showDateTime:{ $gte: new Date()}})

    const movie = await Movie.findById(movieId);
    const dateTime = {};
    shows.forEach(show => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if(!dateTime[date]){
        dateTime[date] = [];
      }
      dateTime[date].push({time: show.showDateTime, showId:show._id});
    })
    res.json({
      success: true,
      movie,
      dateTime,
    })
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
}