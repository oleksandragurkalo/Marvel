import './charList.scss';
import {useState, useEffect, useRef} from 'react';
import {PropTypes} from "prop-types";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spiner";

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { error, loading, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
  }

  const onCharListLoaded = (newChars) => {
    let charEnded = false;
    if (newChars.length < 9) {
      charEnded = true
    }

    setChars((chars) => ([...chars, ...newChars]));
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(charEnded);
  }

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    console.log(itemRefs.current);
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  const getCharactersList = (chars) => {
    if (chars) {
      const char = chars.map((char, i) => {
				return (
					<li className="char__item"
							tabIndex={0}
							ref={el => itemRefs.current[i] = el}
							key={char.id}
							onClick={() => {
								props.onCharSelected(char.id);
								focusOnItem(i);
							}}
							onKeyPress={(e) => {
								if (e.key === ' ' || e.key === "Enter") {
									props.onCharSelected(char.id);
									focusOnItem(i);
								}
							}}>
						>
						<img src={char.thumbnail} alt="abyss" style={char.missedImg ? {objectFit: 'contain'} : {objectFit: 'cover'}}/>
						<div className="char__name">{char.name}</div>
					</li>
				)}
			)
			return (
				<ul className="char__grid">
					{char}
				</ul>
			)
    }
  }

  const characters = getCharactersList(chars);
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
			{characters}
      <button disabled={newItemLoading}
              tabIndex="0"
              style={{'display': charEnded ? 'none' : 'block'}}
              onClick={() => onRequest(offset)}
              className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;

