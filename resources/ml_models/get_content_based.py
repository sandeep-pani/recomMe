#!/usr/bin/env python3
import os
from flask_mongoengine import MongoEngine
from mongoengine.fields import BooleanField, StringField, DictField
from flask_restful import Resource
from flask import request
import json
from bson.objectid import ObjectId
from resources.models.schemas import UserRatings
from .content_based import get_top_n_cb
import pandas as pd

db = MongoEngine()


dirname = os.path.dirname(__file__)


# get n top rated movies
class GetMostRatedMovies(Resource):
    def get(self, username, n):

        ########################## Reading CSV #####################################
        links_path = os.path.join(dirname, '../data/links.csv')
        link_df = pd.read_csv(links_path)
        ratings_path = os.path.join(dirname, '../data/ratings.csv')
        ratings_df = pd.read_csv(ratings_path)
        ###############################################################################

        movie_ids = ratings_df.groupby(["movieId"])['rating'].count().reset_index(
            name='Count').sort_values(['Count'], ascending=False)

        # used to get tmdb id from the links.csv file
        merged = pd.merge(movie_ids, link_df)

        userRatings = json.loads(
            UserRatings.objects(username=username).first().to_json())["ratings"]
        print(merged['tmdbId'][0])
        res = []
        count = 0
        for i in merged['tmdbId']:
            if count == n:
                break
            if str(int(i)) not in userRatings:
                res.append(int(i))
                count += 1

        return res


# to get content based recommendation
class GetContentBasedMovies(Resource):
    # sorting id:ratings object based on the ratings
    def sort_ratings(self, ratings):
        return dict(sorted(ratings.items(), key=lambda x: x[1], reverse=True))

    def get(self, username, no_of_movies):
        userRatings = json.loads(
            UserRatings.objects(username=username).first().to_json())["ratings"]
        sortedUserRatings = self.sort_ratings(userRatings)
        ratedMovieIds = []
        count = 0
        for k, v in sortedUserRatings.items():
            if count == 10:
                break
            if v >= 3:
                ratedMovieIds.append(k)
            count += 1

        ratedMovieIds = list(map(int, ratedMovieIds))
        predictedMovieIds = []
        # if no movie is rated 3 stars or more, show mostRated movies
        if(len(ratedMovieIds) == 0):
            mostRated = GetMostRatedMovies()
            predictedMovieIds = mostRated.get(username, no_of_movies)
        else:
            # calling the function with ids, no_of_movies and all ratings as parameters
            predictedMovieIds = get_top_n_cb(
                ratedMovieIds, no_of_movies, sortedUserRatings)

        print(type(predictedMovieIds[0]))
        return {"message": "Successfully got content based movies", "predictedMovieIds": predictedMovieIds}

    # getting similar movies to particular movieId
    def post(self, movie_id, no_of_movies):
        predictedMovieIds = get_top_n_cb([movie_id], no_of_movies, {})
        return {"message": "Successfully got content based movies", "predictedMovieIds": predictedMovieIds}
