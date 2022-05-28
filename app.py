#!/usr/bin/env python3
# run this code to start backend app
import sys
import os

# dirname = os.path.dirname(__file__)
# resources_path = os.path.join(dirname, 'resources')
# print("############# this is my my command: #######" ,resources_path)
# sys.path.append(resources_path)

# from resources.cold_start import GetColdStartMovies
from resources.cold_start import GetColdStartMovies
from resources.basicCommands import Register, Login
from resources.ml_models.get_content_based import GetContentBasedMovies
from resources.ml_models.get_collab_filtering import GetCollaborativeFilteringMovies
from resources.ml_models.getUserFact import GetUserFact
from resources.ml_models.getSearchResults import GetSearchResults
from resources.basicCommands import GetAllUserRatings, MovieRatings, GetMovieRatingById, SetUserStatus, WishList
from flask import Flask
from flask_restful import Api
from flask_mongoengine import MongoEngine
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)
CORS(app)


# connecting to mongoatlas
DB_URI = "mongodb+srv://engage:msengage123@mymovierecommendationdb.2sebs3i.mongodb.net/?retryWrites=true&w=majority"

app.config["MONGODB_HOST"] = DB_URI

# app.config['MONGODB_SETTINGS'] = {
#     'db': 'myMovieRecommendationDB',
#     'host': 'localhost',
#     'port': 27017
# }
try:
    db = MongoEngine(app)
    print("connected todb")
except:
    print("error connecting to db")

# all the api calls used in the project
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(GetColdStartMovies, '/getcoldstartmovies')
api.add_resource(SetUserStatus, '/setuserstatus')
api.add_resource(GetContentBasedMovies,
                 '/getcontentbasedmovies/<string:username>/<int:no_of_movies>', '/getcontentbasedmovies/<int:movie_id>/<int:no_of_movies>')
api.add_resource(MovieRatings, '/movieratings/<string:username>')
api.add_resource(
    GetMovieRatingById, '/getmovieratingbyid/<string:username>/<int:movie_id>')
api.add_resource(
    WishList, "/addorremovefromwishlist/<string:username>", '/addorremovefromwishlist/<string:username>/<int:movie_id>')
api.add_resource(
    GetCollaborativeFilteringMovies, '/getcfmovies/<string:username>/<int:no_of_movies>')
api.add_resource(GetSearchResults, '/getsearchresults/<string:query>/',
                 '/getsearchresults/<string:query>/<int:n>')
api.add_resource(GetUserFact, '/getuserfact/<string:username>')
api.add_resource(GetAllUserRatings, '/getuserratings/<string:username>')


if __name__ == "__main__":
    app.run(debug=True)
