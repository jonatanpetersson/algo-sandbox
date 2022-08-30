import { SettingsButton } from '../../../shared/components/settings-button/settings-button';
import { UtilizeState } from '../../../shared/state';
import { Method } from './types';

export function CanvasTransformsSettings() {
  const { state, updateState } = UtilizeState();
  const handleClick = (method: Method) => () => {
    updateState({ ...state, method });
  };
  return (
    <>
      <h2 className="settings-title">Canvas tranforms visualizer</h2>
      <div className="canvas-transforms-settings-wrapper">
        <SettingsButton onClick={handleClick(Method.Translate)}>
          TRANSLATE
        </SettingsButton>
        <SettingsButton onClick={handleClick(Method.Rotate)}>
          ROTATE
        </SettingsButton>
        <SettingsButton onClick={handleClick(Method.Scale)}>
          SCALE
        </SettingsButton>
      </div>
    </>
  );
}
