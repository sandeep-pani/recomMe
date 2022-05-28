# THIS FILE IS USED TO CREATE A TABLE WITH MOVIE ID AND ITS FEATURES/TAGS FOR THE SEARCH ENGINE
# THIS FILE DOES NOT RUN IN THE BACKEND

import pandas as pd  # data processing, CSV file I/O (e.g. pd.read_csv)
import os

# opening the required csv files
dirname = os.path.dirname(__file__)
movie_dataset_path = os.path.join(dirname, '../data/movie_dataset.csv')
store_path = os.path.join(dirname, '../data/features.csv')

df = pd.read_csv(movie_dataset_path)

# sorting the dataframe
df["points"] = df["vote_average"]*df.popularity * \
    df.vote_count  # creating a parameter to sort


# now using this points system we can rank movies on the basis of actual popularity
# sorting:
df = df.sort_values(["points"], ascending=False)


features = ['genres', 'keywords', 'title', 'cast', 'director', 'release_date']


# combining all the required features
def combine_features(row):
    return (row['title']+" "+row['keywords']+" "+row['cast']+" "+row['genres']+" "+row['director']+" "+str(row["release_date"]).split("-")[0]+" "+"film films movies movie actor actress director").lower()


for feature in features:
    df[feature] = df[feature].fillna('')  # filling all NaNs with blank string


# applying combine_features() method over each rows of dataframe and storing the combined str
df["combined_features"] = df.apply(combine_features, axis=1)
df = df.filter(["id", "combined_features", "popularity",
               "vote_average", "points", "release_date"])

# storing the file in a directory
df.to_csv(store_path)
