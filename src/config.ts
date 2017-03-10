import {Input} from "./interfaces";

export function getInitialInput(): Input {
  const standard: Input = {
    totalLines: 200,
    multiplier: 2,
    animate: false,
    multiplierIncrement: 0.2,
    opacity: 1,
    colorMethod: 'lengthHue',
    noiseStrength: 0.5,
    antialias: false,
    camPosX: 0,
    camPosY: 0,
    camZoom: 1,
    resetCamera: () => {
    }
  };

  const benchmark: Input = {
    ...standard,
    totalLines: 250000,
    multiplier: 100000,
    multiplierIncrement: 1,
    opacity: 0.005,
    colorMethod: 'faded',
  };

  const debug: Input = {
    ...standard,
    totalLines: 10,
    multiplier: 2,
    multiplierIncrement: 0.005,
    colorMethod: 'faded',
  };

  const debugBlending: Input = {
    ...standard,
    totalLines: 10000,
    opacity: 0.05,
  };

  const initialInputs = {
    standard,
    benchmark,
    debug,
    debugBlending
  };

  return initialInputs.standard;
}
