# recomMe
#### A web application that uses Machine learning to fetch recommendations based on user's rating history.
![image](https://user-images.githubusercontent.com/80412459/170861115-b3589b15-3e14-429c-8e4d-cea8249c9982.png)
![Screenshot 2022-05-29 145425](https://user-images.githubusercontent.com/80412459/170861281-58f4b33c-f2d6-4c0e-8907-fc8e4a765281.jpg)

<br/><br/>

Video at: https://www.youtube.com/watch?v=HfnsXtljXu0 <br/>
Hosted at: https://recomme-engine.vercel.app/ <br/>
- Note: <br/>
  - The backend is deployed on Heroku on a free account, so the application sleeps if not pinged every 30 minutes. Please wait after pressing register until you see a "Success" message/alert and only then proceed to login.<br/>
  - I would recommend cloning the repository and running it locally to get the full experience.

## Datasets:
- Used 100k MovieLens Dataset, filtered it to use about 2300 movies and 100,000 user ratings.

## Tech Stack and APIs:
![MS Engage Flowchart resized](https://user-images.githubusercontent.com/80412459/170856449-fc6253c9-5ab8-4949-ad54-51c0091957b1.png)




## Features:

1. Star rating: The user can rate movies on a scale of 0 to 5, which is saved in the database to recommend movies. <br/>
2. **Cold-start problem**: (when a new user has no history of ratings so recommendations can't be fetched) 
    - Prevented by asking users to rate a few movies before fetching recommendations.<br/>
3. **Content Based Recommendations**: *(refer to "content_based.py" and "get_content_based.py")*
    - Uses cast, genres, director, and keywords as features/parameters.
    - Movies are found by applying count vectorization on the aggregated features and sorting movies based on cosine similarity.<br/>
4. **Collaborative Filtering**: *(refer to "createSimilarityMatrix.py" and "collaborative_filtering.py"
)*<br/>
    - Capable of capturing the tastes of users and providing recommendations across genres.
    - Using the ratings of every movie, the Pearson correlation is calculated and stored to form an item-item similarity matrix.
    - The movies' ratings given by a new user are used to find similar movies by fetching the rows of the movie rated, from the similarity matrix and sorting it.
5. **Search Engine**: *(refer to "createTableForSearch.py" and "getSearchResults.py")*
    - The features/tags of the movies are aggregated and used to find the best match using a regular expression created from the search query.
    - This fetches and shows the movies with the highest "points" first.
    - "points" factor is calculated using movie popularity, vote_average, vote_count
    - Query is not limited to movie titles. Users can also search by genres/directors/cast/year of release or related keywords. ex: "Comedy movies", "Christopher Nolan movies", "Avatar"
6. Movie Info: Clicking on the movie card gives the user a brief about the movie.
    - Also displays movies similar to the particular movie clicked.
7. User Fact: Finds a keyword common in user's top-rated movies and displays it as a fact.
8. Wishlist: Users can save movies to their wishlist for later.
9. Refresh Recommendation Button: To get instant recommendations based on the movies rated.
10. Login System: Provided a fully responsive register/login system. 
11. User Interface: 
    - Provided an interactive user-friendly interface.
    - ***Fully optimized for smaller screens as well.***

## Installation Guide
- Make sure you have node and python installed.
1. Backend:
```
cd backend
```
install dependencies:
```
pip install -r requirements.txt
```
run server (running at port 5000):
```
python app.py
```
2. Frontend:
```
cd frontend
```
install dependencies:
```
npm i
```
run server (running at port 3000):
```
npm start
```
