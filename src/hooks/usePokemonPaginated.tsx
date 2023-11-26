import { useEffect, useRef, useState } from "react";
import { pokemonApi } from "../api/pokemonApi";
import { PokemonPaginatedResponse, Result, SimplePokemon } from "../interfaces/pokemonInterfaces";

export const usePokemonPaginated = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [simplePokemonList, setsimplePokemonList] = useState<SimplePokemon[]>([])
    const nextPageUrl = useRef('https://pokeapi.co/api/v2/pokemon?limit=40') 


    const loadPokemons = async() => {
        console.log('Llamado');
        setIsLoading(true);
        // console.log(nextPageUrl.current);
        const resp = await pokemonApi.get<PokemonPaginatedResponse>(nextPageUrl.current);
        console.log("next: ",resp.data.next);
        nextPageUrl.current = resp.data.next;
        mapPokemonList(resp.data.results);

    }

    const mapPokemonList = (pokemonList: Result[]) => {
        const newPokemonList: SimplePokemon[] = pokemonList.map(({name, url}) => {
            //https://pokeapi.co/api/v2/berry/41/
            const urlPaths = url.split('/');
            const id = urlPaths[urlPaths.length - 2]
            const picture = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;


            return {
                id,
                picture,
                name
            }

        });

        setsimplePokemonList([...simplePokemonList, ...newPokemonList]);
        setIsLoading(false);
    }


    useEffect(() => {
        loadPokemons();
    }, [])

    return {
        isLoading, 
        simplePokemonList,
        loadPokemons
    }
}