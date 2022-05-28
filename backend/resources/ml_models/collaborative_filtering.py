#!/usr/bin/env python3
# THIS FILE IS USED TO FIND OUT SIMILAR MOVIES USING KNN BASED ON OTHER USER RATINGS

import pandas as pd
import numpy as np
import os


dirname = os.path.dirname(__file__)
similarity_matrix_path = os.path.join(dirname, '../data/similarity_matrix.csv')

# reading the item-item similarity matrix
item_similarity_df = pd.read_csv(similarity_matrix_path, index_col=0)


# function to get movies list with their predicted scores (this is not sorted, it'll be sorted later) from user_rating of a particular movie_id
def get_similar_movies(tmdbId, user_rating):
    try:
        # using the user_rating to normalise it
        similar_score = item_similarity_df[str(tmdbId)]*(user_rating-2.5)
    except:
        print("Movie not present in Model")
        similar_score = pd.Series([], dtype=object)
    return similar_score


# function to get top n similar movies
def get_top_n_movies_cf(userRatings, n):
    userRatingsList = list(userRatings.items())
    similar_movies = pd.DataFrame()
    # passing each rating individually to get_similar_movies and storing it in a dataframe
    for tmdbId, rating in userRatingsList:
        similar_movies = pd.concat([similar_movies,
                                    pd.DataFrame.from_records([get_similar_movies(tmdbId, rating)])])

    # now that we have the predicted scores of all the movies based on the ratings of the user,
    # the predicted scores of all the movies are added and then sorted
    similar_movies_to_user = similar_movies.sum().sort_values(ascending=False)

    # getting n unique movies from similar_movies_to_user
    res = []
    count = 0
    for tid, score in similar_movies_to_user.items():
        if count == n:
            break
        if str(tid) not in userRatings:
            res.append(tid)
            count += 1

    return res
