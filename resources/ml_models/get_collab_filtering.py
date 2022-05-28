#!/usr/bin/env python3
from flask_mongoengine import MongoEngine
from mongoengine.fields import BooleanField, StringField, DictField
from flask_restful import Resource
from flask import request
import json
from bson.objectid import ObjectId
from resources.models.schemas import UserRatings
from .content_based import get_top_n_cb
import pandas as pd
from .collaborative_filtering import get_top_n_movies_cf

db = MongoEngine()


# to get collaborative filtering recommendation
class GetCollaborativeFilteringMovies(Resource):
    def get(self, username, no_of_movies):
        userRatings = json.loads(
            UserRatings.objects(username=username).first().to_json())["ratings"]
        # using the funtion to get top n movies -collab filtering
        predictedMovieIds = get_top_n_movies_cf(userRatings, no_of_movies)

        print(type(predictedMovieIds[0]))
        return {"message": "Successfully got collaborative filtering recommendations", "predictedMovieIds": predictedMovieIds}
