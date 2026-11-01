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
  const [discovered, setDiscovered] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('discovered')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('discovered', JSON.stringify(discovered))
  }, [discovered])

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      const randomId = Math.floor(Math.random() * 1025) + 1

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        const data = await res.json()

        setPokemon({
          id: data.id,
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

   const handleSubmit = (e) => {
    e.preventDefault() // evita que el formulario recargue la página

    if (!pokemon || revealed) return

    const isCorrect =
      guess.trim().toLowerCase() === pokemon.name.toLowerCase()

    if (isCorrect) {
      setRevealed(true)
      setScore((prev) => prev + 1)
      setDiscovered((prev) =>
  prev.includes(pokemon.id) ? prev : [...prev, pokemon.id]
    )
    }
  }
  const handleNext = () => {
    setGuess('')          // limpia el input
    setRevealed(false)    // vuelve a poner la silueta negra
    setRound((r) => r + 1) // dispara el useEffect -> nuevo Pokémon
  }

   return (
    <>
    <div className="game">
       {revealed && pokemon && (
        <p className="success">
          ¡Correcto! Es <strong>{pokemon.name}</strong> 🎉
        </p>
      )}

      <button onClick={handleNext} disabled={loading}>
        Siguiente
      </button>
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

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe el nombre del Pokémon"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={loading || revealed}
        />
        <button type="submit" disabled={loading || revealed}>
          Adivinar
        </button>
      </form>

      {revealed && pokemon && (
        <p className="success">
          ¡Correcto! Es <strong>{pokemon.name}</strong>
        </p>
      )}


    </div>
    <PokemonList discovered={discovered} />
    </>
  )
}

export default App
