import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();
	const _apiBase = 'https://gateway.marvel.com/v1/public/';
	const _publicKey = '2e665bda3b9b106abd3cc35c919c32ca';
	const _baseOffset = 210;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request({ url: `${_apiBase}characters?limit=9&offset=${offset}&apikey=${_publicKey}`} );
		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		console.log(id, 'id');
		const res = await request({ url: `${_apiBase}characters/${id}?apikey=${_publicKey}`});
		return _transformCharacter(res.data.results[0]);
	}

	const _transformCharacter = (char) => {
		let description = char.description ? char.description : 'This characters description is missed';
		if (char.description.length > 100) {
			description = description.trim().substr(0, 99) + '...';
		}
		const missedImg = char.thumbnail.path.includes('image_not_available');

		let comics = {
			hasComics: char.comics.items.length,
		}

		comics = comics.hasComics ? {...comics, items: char.comics.items.slice(0, 10),} : {...comics, noComicsMessage: 'This character has not any comics'}

		return {
			name: char.name,
			description,
			id: char.id,
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			missedImg,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics,
		}
	}

	return { loading, error, getCharacter, getAllCharacters, clearError };
}

export default useMarvelService;
