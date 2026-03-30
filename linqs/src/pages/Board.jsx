/**
 * Route shell for the Board feature: delegates rendering to the bulletin-board experience
 * (`TheBoard`) so routing stays thin and the board can be composed or tested independently.
 */
import TheBoard from '../components/TheBoard';

function Board() {
  return <TheBoard />;
}

export default Board;
