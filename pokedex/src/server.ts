import { serve } from "bun";
import index from "./index.html";
import pokemonData from "./data/pokemon-stats.json";
const PORT = "8007";

const server = serve({
    port: PORT,
    routes: {
        // Serve index.html for all unmatched routes.
        "/*": index,

        "/api/pokemon": {
            async GET(req) {
                const url = new URL(req.url);
                const search = url.searchParams.get('search');

                let filteredPokemon = pokemonData;

                if (search) {
                    const searchLower = search.toLowerCase();
                    filteredPokemon = pokemonData.filter(pokemon =>
                        pokemon.name.toLowerCase().includes(searchLower) ||
                        pokemon.types.some(type => type.toLowerCase().includes(searchLower)) ||
                        pokemon.abilities.some(ability => ability.toLowerCase().includes(searchLower))
                    );
                }

                return Response.json(filteredPokemon);
            },
        },

        "/api/pokemon/:name": async (req) => {
            const name = req.params.name.toLowerCase();
            const pokemon = pokemonData.find(p => p.name.toLowerCase() === name);

            if (!pokemon) {
                return Response.json({ error: "Pokemon not found" }, { status: 404 });
            }

            return Response.json(pokemon);
        },

        "/api/hello": {
            async GET(req) {
                return Response.json({
                    message: "Hello, world!",
                    method: "GET",
                });
            },
            async PUT(req) {
                return Response.json({
                    message: "Hello, world!",
                    method: "PUT",
                });
            },
        },

        "/api/hello/:name": async (req) => {
            const name = req.params.name;
            return Response.json({
                message: `Hello, ${name}!`,
            });
        },
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
