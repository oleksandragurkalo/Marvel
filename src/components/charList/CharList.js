import './charList.scss';
import {useState, useEffect, useRef} from 'react';
import {PropTypes} from "prop-types";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spiner";

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset) => {
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError)
      .finally(() => setLoading(false))
  }

  // const onCharListLoading = () => setNewItemLoading(true);  ??

  const onError = () => setError(true);


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
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error) ? characters : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
			{content}
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

// const Character = ({char, i, onCharSelected}) => {
//
//
//   //char__item_selected
//   return (
//     <li className="char__item"
//         tabIndex={0}
//         ref={el => itemRefs.current[i] = el}
//         key={char.id}
//         onClick={() => {
//           onCharSelected(char.id);
//           focusOnItem(i);
//         }}
//         onKeyPress={(e) => {
//           if (e.key === ' ' || e.key === "Enter") {
//             onCharSelected(char.id);
//             focusOnItem(i);
//           }
//         }}>
//       >
//       <img src={char.thumbnail} alt="abyss" style={char.missedImg ? {objectFit: 'contain'} : {objectFit: 'cover'}}/>
//       <div className="char__name">{char.name}</div>
//     </li>
//   )
// }

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;

