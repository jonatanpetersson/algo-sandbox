import { SettingsButton } from '../../../shared/components/settings-button/settings-button';
import { UtilizeState } from '../../../shared/state';

export function CanvasTransformsSettings() {
  const { state, updateState } = UtilizeState();
  const handleClick = (method: 'translate' | 'rotate' | 'scale') => () => {
    if (updateState)
      updateState({ ...state, canvasTransforms: { [method]: true } });
  };
  return (
    <>
      <h2 className="settings-title">Canvas tranforms visualizer</h2>
      <div className="canvas-transforms-settings-wrapper">
        <SettingsButton onClick={handleClick('translate')}>
          TRANSLATE
        </SettingsButton>
        <SettingsButton onClick={handleClick('rotate')}>ROTATE</SettingsButton>
        <SettingsButton onClick={handleClick('scale')}>SCALE</SettingsButton>
      </div>
    </>
  );
}
