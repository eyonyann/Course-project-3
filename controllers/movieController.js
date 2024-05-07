const path = require('path');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const User = require('../models/User');



exports.getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            res.status(404).send('Movie not found');
            return;
        }

        // Include the User model to fetch the username
        const reviews = await Review.findAll({
            where: { movieId: movieId },
            include: [{
                model: User,
                attributes: ['username'] // Only fetch the username from the User model
            }]
        });

        res.render(path.join(__dirname, '..', 'public', 'html', 'movie.ejs'), {
            movie: movie,
            reviews: reviews
        });
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.postMovieDetails = async (req, res) => {
    const { movieId, userRating, reviewEpigraph, reviewText } = req.body;
    let userId = req.session.user.id;

    try {
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Handle ratings
        if (userRating !== undefined) { // Check if rating update was sent
            const existingRating = await Rating.findOne({
                where: { userId: userId, movieId: movieId }
            });

            if (existingRating) {
                if (existingRating.rating == userRating) {
                    // User clicked the same rating, remove the rating
                    await Rating.destroy({
                        where: { userId: userId, movieId: movieId }
                    });
                    movie.countOfRatings--;
                    movie.rating = movie.countOfRatings > 0 ? ((movie.rating * (movie.countOfRatings + 1)) - userRating) / movie.countOfRatings : 0;
                } else {
                    // Update the existing rating
                    const oldRating = existingRating.rating;
                    existingRating.rating = userRating;
                    await existingRating.save();
                    // Recalculate the movie rating
                    movie.rating = ((movie.rating * movie.countOfRatings) - oldRating + userRating) / movie.countOfRatings;
                }
            } else if (userRating !== null) {
                // Add new rating
                await Rating.create({
                    userId: userId,
                    movieId: movieId,
                    rating: userRating
                });
                movie.countOfRatings++;
                movie.rating = ((movie.rating * (movie.countOfRatings - 1)) + userRating) / movie.countOfRatings;
            }
        }

        // Handle reviews
        if (reviewEpigraph !== undefined || reviewText !== undefined) { // Check if review update was sent
            const existingReview = await Review.findOne({
                where: { userId: userId, movieId: movieId }
            });

            if (existingReview) {
                existingReview.reviewEpigraph = reviewEpigraph;
                existingReview.reviewText = reviewText;
                await existingReview.save();
            } else {
                await Review.create({
                    userId: userId,
                    movieId: movieId,
                    reviewEpigraph: reviewEpigraph,
                    reviewText: reviewText
                });
            }
        }

        await movie.save();
        res.send({ success: true, rating: movie.rating, movieId: movie.id, message: "Rating and/or review updated successfully" });
    } catch (error) {
        console.error('Error updating movie details:', error);
        res.status(500).send('Internal Server Error');
    }
};

