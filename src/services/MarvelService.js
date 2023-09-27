class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = '66a6e147513e3e810914bdc5bf335bfe';
	_baseOffset = 210;

	getResource = async (url, body = {}) => {
		let res = await fetch(`${this._apiBase}${url}?` + new URLSearchParams({...body, apikey: this._apiKey}));

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`)
		}

		return await res.json();
	}

	getAllCharacters = async (offset = this._baseOffset) => {
		const res = await this.getResource(`characters`, {limit: 9, offset});
		return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
		const res = await this.getResource(`characters/${id}`);
		return this._transformCharacter(res.data.results[0]);
	}

	_transformCharacter = (char) => {
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
}

export default MarvelService;
