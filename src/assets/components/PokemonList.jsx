import { useState, useEffect } from "react";

function PokemonList({ discovered }){
    const[pokemons, setPokemons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    let cancelled = false

    const fetchList = async () => {
      if (discovered.length === 0) {
        setPokemons([])
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const details = await Promise.all(
          discovered.map(async (id) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            if (!response.ok) throw new Error(`Error al obtener el Pokémon ${id}`)
            return response.json()
          })
        )

        const formatted = details.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.sprites.other['official-artwork'].front_default,
          types: p.types.map((t) => t.type.name),
        }))

        if (!cancelled) setPokemons(formatted)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('No se pudo cargar la Pokédex')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchList()
    return () => {
      cancelled = true
    }
  }, [discovered])

  if (loading) return <p>Cargando Pokédex...</p>
  if (error) return <p>{error}</p>

  
  return (
    <section className="pokedex">
      <h2>Pokédex</h2>
      <div className="pokemon-grid">
        {pokemons.map((p) => (
          <article key={p.id} className="pokemon-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="types">Tipo: {p.types.join(', ')}</p>
          </article>
        ))}
      </div>
      {pokemons.length === 0 && <p>Aún no has adivinado ningún Pokémon.</p>}
    </section>
  )
}

export default PokemonList