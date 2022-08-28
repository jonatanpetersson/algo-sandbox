import { UtilizeState } from '../../../shared/state';

export function CanvasTransformsSettings() {
  const [state, updateState] = UtilizeState();
  const handleClick = () => {
    updateState({ ...state, canvasTransforms: { boolibooli: true } });
  };
  return (
    <>
      <button onClick={handleClick}>Hello!</button>
    </>
  );
}
