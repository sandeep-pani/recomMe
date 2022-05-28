#!/usr/bin/env python3
import pandas as pd
from flask_mongoengine import MongoEngine
from mongoengine.fields import BooleanField, StringField, DictField
from flask_restful import Resource
from flask import request
import json
from bson.objectid import ObjectId
from resources.models.schemas import UserRatings
from .content_based import get_top_n_cb
from .collaborative_filtering import get_top_n_movies_cf
import os


dirname = os.path.dirname(__file__)
features_path = os.path.join(dirname, '../data/features.csv')


df = pd.read_csv(features_path)

# function that returns results to search query


def search_movies(search_query, df, n):
    # splitting the search query and turning it into a reqular expression
    search_query = ".*".join(search_query.split()).lower()

    # using simple regex to search for item in features.csv
    regex = ".*"+search_query+".*"

    # if feature is found append to dataframe, since features.csv is already sorted according to popularity score,
    # we don't need to sort the results
    res_df = df[df.combined_features.str.match(regex)]
    ans = list(res_df.id)

    # if n is not provided return all the movies, else return top n movies
    if(n == -1):
        return ans
    return ans[:n]


# calling the search_movies funtion using this,
# created to add some preprocessing to the results later if required
def search(search_query, n):
    return search_movies(search_query, df, n)


# api requests to get search results
class GetSearchResults(Resource):
    # gets all results if n parameter is not given, gets n results if given
    def get(self, query, n=-1):
        query = " ".join(query.split("+"))
        print(query)
        tmdbIds = search(query, n)

        no_of_results = len(tmdbIds)
        r = "result" if no_of_results == 1 else "results"
        message = f"Top {no_of_results} {r} for '{query}'" if no_of_results > 0 else f"No result found for '{query}'"
        return {"message": message, "searchResults": tmdbIds}
