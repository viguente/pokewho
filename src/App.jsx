import './App.css'
import { useState, useEffect } from 'react'

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
      // ID aleatorio entre 1 y 1025
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

  return <div>{/* proximamente interfaz*/}</div>
}

export default App
