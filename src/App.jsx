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
    e.preventDefault()

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
    setGuess('')
    setRevealed(false)
    setRound((r) => r + 1)
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>APIMON</span>
        </div>
        <span className="header-label">Adivina y completa tu colección</span>
      </header>

      <section className="game" aria-labelledby="game-title">
        <div className="game-heading">
          <div>
            <p className="eyebrow">Desafío Pokémon</p>
            <h1 id="game-title">¿Quién es ese Pokémon?</h1>
          </div>
          <p className="score">Puntos: {score}</p>
        </div>

        <div className="game-content">
          <div className="pokemon-stage">
            <span className="stage-label">POKÉMON MISTERIOSO</span>
            {loading || !pokemon ? (
              <p>Cargando Pokémon...</p>
            ) : (
              <img
                className={revealed ? 'pokemon-img revealed' : 'pokemon-img'}
                src={pokemon.image}
                alt="Pokémon misterioso"
              />
            )}
          </div>

          <div className="game-controls">
            <p className="eyebrow">Tu turno</p>
            <h2>Escribe tu respuesta</h2>
            <p className="game-help">
              Observa la silueta y escribe el nombre para añadirlo a tu Pokédex.
            </p>

            <form className="guess-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre del Pokémon"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                disabled={loading || revealed}
                aria-label="Nombre del Pokémon"
              />
              <button type="submit" disabled={loading || revealed}>
                Adivinar
              </button>
            </form>

            <div className="game-actions">
              {revealed && pokemon ? (
                <p className="success">
                  ¡Correcto! Es <strong>{pokemon.name}</strong>
                </p>
              ) : (
                <span />
              )}
              <button type="button" onClick={handleNext} disabled={loading}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>

      <PokemonList discovered={discovered} />
    </main>
  )
}

export default App
