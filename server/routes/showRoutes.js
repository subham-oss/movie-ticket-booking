import express from 'express';
import { addShow, getNowPlayingMovies, getshow, getShows } from '../controllers/showControllers.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin,getNowPlayingMovies)
showRouter.post('/add',protectAdmin,addShow)
showRouter.get('/all',getShows)
showRouter.get('/:movieId',getshow)
export default showRouter;