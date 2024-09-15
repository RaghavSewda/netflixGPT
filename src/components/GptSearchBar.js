import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { API_OPTIONS, GOOGLEAI_KEY } from "../utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();

    return json.results;
  };

  const handleGptSearchClick = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GOOGLEAI_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const gptQuery =
        "Act as a Movie Recommendations system and suggest some movies for the query " +
        searchText.current.value +
        ". Only give me 5 movies, comma-separated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya.";

      const gptResults = await model.generateContent(gptQuery);

      // Log the entire response to understand its structure
      console.log("GPT Results:", gptResults);

      // Access the result properly based on actual response format
      const gptMovies =
        gptResults?.response?.candidates[0]?.content?.parts[0]?.text
          .split(",")
          .map((movie) => movie.trim());

      console.log("Parsed Movies:", gptMovies);

      if (!gptMovies) throw new Error("No movies returned");

      // Fetch details from TMDB API for each movie
      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
      const tmdbResults = await Promise.all(promiseArray);

      console.log("TMDB Results:", tmdbResults);

      dispatch(
        addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
      );
    } catch (error) {
      if (error.message.includes("SAFETY")) {
        console.error("Content was blocked due to safety concerns.");
      } else {
        console.error("Error fetching GPT results:", error);
      }
    }
  };

  return (
    <div className="pt-[10%] flex justify-center">
      <form
        className=" w-1/2 bg-black grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 col-span-9"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg"
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
