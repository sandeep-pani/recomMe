#!/usr/bin/env python3
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os


dirname = os.path.dirname(__file__)


# the following functions help in getting the tmdbIds based on the movies index and vice versa
def get_tmdbid_from_index(index):
    return df[df.index == index]["id"].values[0]


def get_index_from_tmdbId(tmdbId):
    return df[df.id == tmdbId]["index"].values[0]


# Read CSV File
movie_dataset_path = os.path.join(dirname, '../data/movie_dataset.csv')

df = pd.read_csv(movie_dataset_path)

# Selecting Features that'll be used to group movie ids
features = ['keywords', 'cast', 'genres', 'director']

# Creating a column in DF which combines all selected features
for feature in features:
    df[feature] = df[feature].fillna('')


def combine_features(row):
    try:
        return row['keywords'] + " "+row['cast']+" "+row["genres"]+" "+row["director"]
    except:
        print("Error:", row)


df["combined_features"] = df.apply(combine_features, axis=1)


# Creating count matrix from this new combined column
cv = CountVectorizer()

count_matrix = cv.fit_transform(df["combined_features"])

# Computing the Cosine Similarity based on the count_matrix
cosine_sim = cosine_similarity(count_matrix)


# function to get top n movies
def get_top_n_movies(tmdbId, n):
    # Get index of this movie from its tmdbId
    movie_index = get_index_from_tmdbId(tmdbId)

    similar_movies = list(enumerate(cosine_sim[movie_index]))

    # Geting a list of similar movies in descending order of similarity score
    sorted_similar_movies = sorted(
        similar_movies, key=lambda x: x[1], reverse=True)

    return [k for k, v in sorted_similar_movies[1:n+1]]


# function to get similar content-based movies from a set of input movies rated by user
def get_top_n_cb(movie_indices, n, all_ratings):
    # some preprcessing of userRatings before calling the get_top_n_moivies function so no repeatition occurs and we get n unique
    # movies everytime we call the function
    no_of_movies = int(n/len(movie_indices))
    extra_movies = n-no_of_movies*len(movie_indices)
    index_res = []
    c = 0
    my_set = set()
    for i in movie_indices:
        num = no_of_movies
        if(c == 0):
            num += extra_movies
        top_n_movies = get_top_n_movies(i, num)
        for j in top_n_movies:
            if str(get_tmdbid_from_index(j)) not in all_ratings:
                my_set.add(j)
                c = 1
    if n != len(my_set):
        arr = get_top_n_movies(movie_indices[0], 4000)
        i = 0
        while(len(my_set) < n):
            if str(get_tmdbid_from_index(arr[i])) not in all_ratings:
                my_set.add(arr[i])
            i += 1
            print(len(my_set))
    index_res = list(my_set)
    tmdbid_res = []
    for i in index_res:
        tmdbid_res.append(get_tmdbid_from_index(i))
    tmdbid_res = list(map(int, tmdbid_res))
    return tmdbid_res
