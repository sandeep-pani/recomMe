# THIS FILE WAS USED TO CREATE THE ITEM-ITEM SIMILARITY MATRIX "similarity_matrix.csv" AND DOESN'T RUN IN THE BACKEND

import pandas as pd

import os

# opening the csv files required
dirname = os.path.dirname(__file__)
ratings_path = os.path.join(dirname, '../data/ratings.csv')
links_path = os.path.join(dirname, '../data/links.csv')
store_path = os.path.join(dirname, '../data/similarity_matrix.csv')

ratings = pd.read_csv(ratings_path)
links = pd.read_csv(links_path)


# ratings is a merged data frame of rating and tmdbId
ratings = pd.merge(links, ratings).drop(["timestamp"], axis=1)
ratings = ratings[ratings["tmdbId"].notna()]
ratings["tmdbId"] = ratings["tmdbId"].astype(int)


# matrix of userid
user_ratings = ratings.pivot_table(index=['userId'], columns=[
                                   'tmdbId'], values='rating')


# removing movies which have less than 10 users who rated it and filling remaining Nan with 0
user_ratings = user_ratings.dropna(thresh=10, axis=1).fillna(0)

# building our similarity matrix
item_similarity_df = user_ratings.corr(method="pearson")
item_similarity_df.head()

# storing it in a directory
item_similarity_df.to_csv(store_path)
