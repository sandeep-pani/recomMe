#!/usr/bin/env python3
from flask_mongoengine import MongoEngine
from mongoengine.fields import BooleanField, StringField, DictField
from flask_restful import Resource
from flask import request
import json
from bson.objectid import ObjectId
from resources.models.schemas import UserRatings
import pandas as pd
import os

# reading csv
dirname = os.path.dirname(__file__)
features_path = os.path.join(dirname, '../data/features.csv')
features = pd.read_csv(features_path)


# gets a fact about the user
class GetUserFact(Resource):
    def get(self, username):
        userRatings = UserRatings.objects(username=username)
        ratedMoviesObj = json.loads(
            userRatings.first().to_json())["ratings"]
        # storing movies rated 4 star or above by user in one array
        allRatedMovieIds = []
        for k, v in ratedMoviesObj.items():
            if v >= 4:
                allRatedMovieIds.append(k)
        # if user didn't like at least 10 movies, then the feature remains locked.
        if len(allRatedMovieIds) < 10:
            return {"message": "User has not unlocked fact feature", "value": False}

        # storing the the ratedMovies in a dataframe for easy processing
        df = pd.DataFrame({"id": allRatedMovieIds})
        df['id'] = df['id'].astype(int)
        df = df.merge(features)

        # list of unwanted features - this includes some basic english words, which the user might not be interested in.
        unwanted_features = ['film', 'films', 'movies',
                             'movie', 'actor', 'actress', 'director', "the", "and", "an", "a", "good"]
        all_features = " ".join(df["combined_features"]).split()

        # storing all the features in a dict with their count in the array
        feature_with_count = {}
        for i in list(set(all_features)):
            feature_with_count[i] = all_features.count(i)

        # finding the feature which occured max number of times
        sorted_features = sorted(
            list(feature_with_count.items()), key=lambda x: x[1], reverse=True)
        max_occuring_feature = ""
        for k, v in sorted_features:
            if k not in unwanted_features:
                max_occuring_feature = k
                break

        return {"message": "User has unlocked the feature", "value": max_occuring_feature}
