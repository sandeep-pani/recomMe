
from flask_restful import Resource

from flask import request
import json
from passlib.apps import custom_app_context as pwd_context
from bson.objectid import ObjectId
from .models.schemas import UserWishlist, Users, UserRatings
from passlib.apps import ldap_context

# password hashing technique
ldap_context = ldap_context.replace(default="ldap_salted_md5")


# get,post methods for /register
class Register(Resource):
    # hashing the password
    def hash_password(self, password):
        self.password_hash = ldap_context.hash(password)
        return self.password_hash

    def get(self):
        return {"message": "ans"}

    def post(self):
        name, username, password, reEnterPassword = request.get_json().values()
        hashed_password = self.hash_password(password)
        if(Users.objects(username=username)):
            return {"message": "User already registered"}
        else:
            Users(name=name, username=username,
                  password=hashed_password, newUser=True).save()
            return {"message": "success"}


# get, post methods for /login
class Login(Resource):
    def verify_password(self, password, hashed_password):
        # return pwd_context.verify(password, hashed_password)
        return ldap_context.verify(password, hashed_password)

    def post(self):
        username, password = request.get_json().values()

        if(Users.objects(username=username)):
            user = Users.objects(username=username).get()
            # print(user.to_json())
            if(self.verify_password(password, user.password)):
                user = json.loads(user.to_json())
                user['_id'] = user["_id"]['$oid']
                return {"message": "Login Successful", "user": user}
            else:
                return {"message": "Password didn't match"}
        else:
            return {"message": "User not registered"}


# Used to set userStatus to new or old
class SetUserStatus(Resource):
    def post(self):
        user = request.get_json()
        user_obj = Users.objects(id=ObjectId(user["_id"]))
        # if user submitted the first cold start movies make user old User
        user_obj.update(set__newUser=False)
        # set user's initial preferences
        return {"message": "Successfully changed user status",
                "user": json.loads(user_obj[0].to_json())}


# saves movie rating of each movie into db
class MovieRatings(Resource):
    def post(self, username):
        movie_rating = request.get_json()
        movie_id, rating = list(movie_rating.items())[0]
        userInfo = UserRatings.objects(username=username)
        if(userInfo):
            userInfo.update(**{f"set__ratings__{movie_id}": rating})
        else:
            UserRatings(username=username, ratings={
                        movie_id: rating}).save()
        return {"message": "successfully saved rating"}


# get rating of the particular movie id given by user
class GetMovieRatingById(Resource):
    def get(self, username, movie_id):
        # checking if user has already rated the movie
        userRatings = UserRatings.objects(username=username,
                                          **{f"ratings__{movie_id}": {"$exists": True}})
        if(userRatings):
            rating = json.loads(userRatings[0].to_json())[
                "ratings"][str(movie_id)]
            return {"rating": rating}
        else:
            return 0


# save movie to wishlist
# post request acts like toggle, if id is in list, it removes it, else appends to the list
class WishList(Resource):
    def post(self, username, movie_id):
        userWishlist = UserWishlist.objects(
            username=username)
        if userWishlist:
            wishlist = UserWishlist.objects(
                username=username, wishList__in=[int(movie_id)])
            if(wishlist):
                userWishlist.update_one(pull__wishList=int(movie_id))
                return {"message": "removed from wishlist successfully"}
            else:
                userWishlist.update_one(push__wishList=int(movie_id))
                return {"message": "Saved to wishlist successfully"}
        else:
            UserWishlist(username=username, wishList=[movie_id]).save()
            return {"message": "Created a wishlist and saved successfully"}

    # used to get full list or else wish list status of a particular movie
    def get(self, username, movie_id=-1):
        if(movie_id == -1):
            wishListArr = UserWishlist.objects(username=username)
            if(wishListArr):
                return {"message": "Successfully returning list", "wishlist": json.loads(wishListArr.first().to_json())["wishList"]}
        else:
            wishList = UserWishlist.objects(
                username=username, wishList__in=[int(movie_id)])
            if wishList:
                return {"message": "True", "value": True}
            else:
                return{"message": "False", "value": False}


# used to get all ratings the user rated
class GetAllUserRatings(Resource):
    def get(self, username):
        userRatings = UserRatings.objects(username=username).first()
        if userRatings:
            return {"message": "found user", "userRatings": json.loads(userRatings.to_json())["ratings"]}
        else:
            return {"message": "user not found", "userRatings": []}
