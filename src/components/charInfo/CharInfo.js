import './charInfo.scss';
import {useState, useEffect} from "react";
import {PropTypes} from "prop-types";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spiner";
import Skeleton from "../skeleton/Skeleton";

const CharInfo = (props) => {

	const [char, setChar] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		updateChar();
	}, [props.charId]);

	const onCharLoaded = (char) => {
		setChar(char)
	}

	const onCharLoading = () => {
		setLoading( true)
	}

	const onError = () => {
		setError(true)
	}

	const updateChar = () => {
		const {charId} = props;
		if (!charId) {
			return;
		}

		onCharLoading();
		marvelService
			.getCharacter(charId)
			.then(onCharLoaded)
			.catch(onError)
			.finally(() => setLoading(false))
	}

	const skeleton = char || loading || error ? null : <Skeleton/>
	const errorMessage = error ? <ErrorMessage/> : null;
	const spinner = loading ? <Spinner/> : null;
	const content = !(loading || error || !char) ? <View char={char}/> : null;

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	)
}

const View = ({char}) => {
	const {name, description, thumbnail, missedImg, homepage, wiki, comics} = char;
	const comicsItems = () => {
		return comics.items.map((item, i) => {
			return (
				<li key={i} className="char__comics-item">
					{item.name}
				</li>
			)
		})
	}

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt="abyss" style={missedImg ? {objectFit: 'contain'} : {objectFit: 'cover'}}/>
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}
			</div>
			<div className="char__comics">Comics:</div>
			{comics.hasComics ? <ul className="char__comics-list">{comicsItems()}</ul> : comics.noComicsMessage}
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;
