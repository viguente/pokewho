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

  return (
    <section className="pokedex">
      <div className="pokedex-heading">
        <div>
          <p className="eyebrow">Tu colección</p>
          <h2>Pokédex</h2>
        </div>
        <span className="pokedex-count">{discovered.length} descubiertos</span>
      </div>

      {loading ? (
        <p className="pokedex-message">Cargando Pokédex...</p>
      ) : error ? (
        <p className="pokedex-message">{error}</p>
      ) : pokemons.length === 0 ? (
        <p className="pokedex-message">Aún no has adivinado ningún Pokémon.</p>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((p) => (
            <article key={p.id} className="pokemon-card">
              <div className="pokemon-card-art">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="pokemon-card-info">
                <span className="pokemon-card-number">
                  N.º {String(p.id).padStart(3, '0')}
                </span>
                <h3>{p.name}</h3>
                <div className="types">
                  {p.types.map((type) => (
                    <span className="type-tag" key={type}>{type}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default PokemonList