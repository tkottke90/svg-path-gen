import { DrawSVG } from '.';

const form = document.getElementById('svg-input-form') as HTMLFormElement;

form.addEventListener('change', () => {
  const formData = new FormData(form);
  
  const viewPort = `${formData.get('x-cord--start')} ${formData.get('y-cord--start')} ${formData.get('x-cord--end')} ${formData.get('y-cord--end')}`;
  const strokeColor = `${formData.get('global-stroke')}` ?? '#222';

  DrawSVG.setStrokeColor(strokeColor);
  DrawSVG.setViewBox(viewPort);
});