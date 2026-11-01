import { useState, useEffect } from "react";

function PokemonList(){
    const[pokemons, setPokemons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
        if (!res.ok) throw new Error('Error al obtener la lista')
        const data = await res.json()

        const details = await Promise.all(
          data.results.map(async (item) => {
            const r = await fetch(item.url)
            return r.json()
          })
        )

        const formatted = details.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.sprites.other['official-artwork'].front_default,
          types: p.types.map((t) => t.type.name),
        }))

        setPokemons(formatted)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar la Pokédex')
      } finally {
        setLoading(false)
      }
    }

    fetchList()
  }, []) 

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
    </section>
  )
}

export default PokemonList