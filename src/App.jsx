import './App.css'
import { useState, useEffect } from 'react'
import PokemonList from './assets/components/PokemonList'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [guess, setGuess] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [round, setRound] = useState(0)

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      const randomId = Math.floor(Math.random() * 1025) + 1

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        const data = await res.json()

        setPokemon({
          name: data.name,
          image: data.sprites.other['official-artwork'].front_default,
        })
      } catch (error) {
        console.error('Error al obtener el Pokémon:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [round]) 

   return (
    <>
    <div className="game">
      <h1>¿Quién es ese Pokémon?</h1>
      <p className="score">Puntos: {score}</p>

      {loading || !pokemon ? (
        <p>Cargando...</p>
      ) : (
        <img
          className={revealed ? 'pokemon-img revealed' : 'pokemon-img'}
          src={pokemon.image}
          alt="Pokémon misterioso"
        />
      )}

      <input
        type="text"
        placeholder="Escribe el nombre del Pokémon"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={loading || revealed}
      />


    </div>
    <PokemonList/>
    </>
  )
}

export default App
