const path = require('path');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const ReviewLike = require('../models/ReviewLike');
const User = require('../models/User');
const fs = require('fs/promises');



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

        let reviewLikes = await ReviewLike.findAll({
            where: { userId: req.session.user.id },
        });

        if (reviewLikes.length === 0) {
            reviewLikes = undefined;
        }

        reviews.forEach(review => {
            review.reviewText = decodeURIComponent(review.reviewText);
        });


        const userReview = await Review.findOne({
            where: { userId: req.session.user.id }
        });

        if (userReview) {
            userReview.reviewText = decodeURIComponent(userReview.reviewText);
        }

        const userRating = await Rating.findOne({
            where: { userId: req.session.user.id },
        });




        res.render(path.join(__dirname, '..', 'public', 'html', 'movie.ejs'), {
            movie: movie,
            reviews: reviews,
            reviewLikes: reviewLikes,
            userRating: userRating,
            userReview: userReview,
            session: req.session
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


exports.deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            res.status(404).send('Movie not found');
            return;
        }

        if (movie.poster) {
            const posterPath = path.join(__dirname, '..', 'public', 'res', 'posters', movie.poster);
            await fs.unlink(posterPath);
        }

        // Удаление всех рейтингов, связанных с фильмом
        await Rating.destroy({
            where: { movieId: movieId }
        });

        // Удаление всех рецензий, связанных с фильмом
        await Review.destroy({
            where: { movieId: movieId }
        });

        // Удаление самого фильма
        await Movie.destroy({
            where: { id: movieId }
        });

        res.sendStatus(200); // Отправляем успешный статус ответа
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.deleteReview = async (req, res) => {
    try {
        const movieId = req.params.id;
        const userId = req.query.userId;

        const review = await Review.findOne({
            where: {
                movieId: movieId,
                userId: userId
            }
        });

        if (!review) {
            res.status(404).send('Movie not found');
            return;
        }

        await ReviewLike.destroy({
            where: { id: review.id }
        });

        // Удаление всех рецензий, связанных с фильмом
        await Review.destroy({
            where: {
                movieId: review.movieId,
                userId: review.userId
            }
        });

        res.sendStatus(200); // Отправляем успешный статус ответа
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send('Internal Server Error');
    }
};


// Server-side code (assuming you're using Express.js)

// Route to handle setting a like for a review
exports.postLikeReview = async (req, res) => {
    try {
        const { userId, reviewId } = req.body;

        // Check if the user has already liked the review
        const existingLike = await ReviewLike.findOne({
            where: { userId, reviewId }
        });

        if (existingLike) {
            // User has already liked the review, so remove the like
            await ReviewLike.destroy({
                where: { userId, reviewId }
            });
            res.json({ liked: false });
        } else {
            // User hasn't liked the review, so add a like
            await ReviewLike.create({
                userId,
                reviewId
            });
            res.json({ liked: true });
        }
    } catch (error) {
        console.error('Error setting like for review:', error);
        res.status(500).json({ error: 'Failed to set like for review' });
    }
};





