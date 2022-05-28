#!/usr/bin/env python3
# THIS FILE IS USED TO GET THE INITIAL MOVIES THAT THE USER HAS TO RATE AFTER LOGGING IN

from typing_extensions import Required
from flask_mongoengine import MongoEngine
from mongoengine.fields import DictField, StringField, BooleanField
from flask_restful import Resource
from flask import request
import json
import pandas as pd

import os


dirname = os.path.dirname(__file__)
links_path = os.path.join(dirname, 'data/links.csv')
ratings_path = os.path.join(dirname, 'data/ratings.csv')


# return tmdb movie_ids of 30 highest rated movies:
class GetColdStartMovies(Resource):
    def get(self):
        link_df = pd.read_csv(links_path)
        ratings_df = pd.read_csv(ratings_path)

        movie_ids = ratings_df.groupby(["movieId"])['rating'].count().reset_index(
            name='Count').sort_values(['Count'], ascending=False)

        # used to get tmdb id from the links.csv file
        merged = pd.merge(movie_ids.head(30), link_df)

        return merged['tmdbId'].tolist()
