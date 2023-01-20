//css
import './App.css';

//react
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from "./data/words";

//components

import StartScren from './components/StartScren';
import GameOver from './components/GameOver';
import { Game } from './components/Game';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 5

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

const [pickedWord, setPickedWord] = useState("");
const [pickedCategory, setPickedCategory] = useState("");
const [letters, setLetters] =  useState([]);

const [guessedLetters, setGuessedLetters] = useState([])
const [wrongLetters, setWrongLetters] = useState([])
const [guesses, setGuesses] = useState(guessesQty)
const [score, setScore] = useState(0)

const pickWordAndCategory = useCallback(() => {
  //pick a random category
  const categories = Object.keys(words)
  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

  console.log(category);

    //pick a random word
  const word = words[category][Math.floor(Math.random() * words[category].length)];

  console.log(word);
  return { word, category };
}, [words]);
//começo do jogo
 const startGame = useCallback(() => {
  // clear all letters 
  clearLetterStates();

  //pick word and pick category
 const{ word, category } = pickWordAndCategory();

 // creat an array of letters
 let wordLetters = word.split("");

 wordLetters = wordLetters.map((l) => l.toLowerCase());

 // fill states
 setPickedWord(word);
 setPickedCategory(category);
 setLetters(wordLetters);

  setGameStage(stages[1].name)
 }, [pickWordAndCategory]);

 // processo das letras
 const verifyLetter = (letter) => {
  
    const normalizedLetter =  letter.toLowerCase()

    // checar se a letra ja foi utilizada

    if(guessedLetters.includes(normalizedLetter) ||
     wrongLetters.includes(normalizedLetter)){
      return;
    }

    //fazer a verificação se as letras vao para o certo ou errado
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    }else{
      setWrongLetters((actualWrongLetters) => [
       ...actualWrongLetters,
       normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1 );
    }    
 };

const clearLetterStates = () => {
  setGuessedLetters([]);
  setWrongLetters([]);
};
 
//check if guesses ended
 useEffect(() =>{

  if(guesses <= 0){
    //resetar o estado
    clearLetterStates();

    setGameStage(stages[2].name);
  }
 },  [guesses]);
//check win condition
useEffect(() => {

  const uniqueLetters = [...new Set(letters)];

  //win condition
  if(guessedLetters.length === uniqueLetters.length){

    // add score
    setScore((actualScore) => actualScore += 100);

    //restart game with new word
    startGame();
  }
},[guessedLetters, letters, startGame]);

 // restarts do jogo
 const retry = () => {
  setScore(0);
  setGuesses(guessesQty);

  setGameStage(stages[0].name);
 }

  return (
    <div className="App">
    {gameStage === "start" && <StartScren startGame={startGame} />}
    {gameStage === "game" && <Game
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters} 
      guesses={guesses}
      score={score} />}
    {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
