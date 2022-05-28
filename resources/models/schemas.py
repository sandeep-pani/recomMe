from flask_mongoengine import MongoEngine
from mongoengine.fields import BooleanField, ListField, StringField, DictField
db = MongoEngine()


# user schema
class Users(db.Document):
    name = StringField(required=True)
    username = StringField(required=True)
    password = StringField(required=True)
    newUser = BooleanField(required=True)


# userInfo schema
class UserRatings(db.Document):
    username = StringField(Required=True)
    ratings = DictField(Required=True)


# user wishlist schema
class UserWishlist(db.Document):
    username = StringField(Required=True)
    wishList = ListField(Required=True)
