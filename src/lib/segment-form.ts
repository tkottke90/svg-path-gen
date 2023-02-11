import { SegmentInput } from "../interfaces";
import { DrawSVG, SegmentList } from '.';

type Segment = [string, SegmentInput];

const form = document.getElementById('segment-input-form') as HTMLFormElement;
const select = document.getElementById('segment-type') as HTMLSelectElement;

const defaultXY = { 'x-input': true, 'y-input': true, 'x-1-input': false, 'y-1-input': false, 'x-2-input': false, 'y-2-input': false  }
const inputRequirementsMap: Record<string, any> = {
  m: defaultXY,
  M: defaultXY,
  l: defaultXY,
  L: defaultXY,
  h: { ...defaultXY , 'y-input': false },
  H: { ...defaultXY , 'y-input': false },
  v: { ...defaultXY , 'x-input': false },
  V: { ...defaultXY , 'x-input': false }
}

const segments: [ string, SegmentInput ][] = [];

function updateInputs(mode: string) {
  const config = inputRequirementsMap[mode];

  if (!config) {
    return;
  }

  Array.from(form.elements).forEach(elem => {
    const nameAttr = elem.getAttribute('name') ?? '';
    if (nameAttr in config ) {
      config[nameAttr] 
        ? elem.removeAttribute('disabled') 
        : elem.setAttribute('disabled', ''); 
    }
  })

}

function renderSegments() {
  const elemList = createSegments(segments);
  SegmentList.renderSegments(elemList, segments.map(s => s[0]).join(' '));
}

select.addEventListener('change', (e) => {
  updateInputs(select.value);
})

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const rawData = Array.from(new FormData(form));
  const data: SegmentInput = { type: 'm', 'x-input': '0', 'y-input': '0' } 

  rawData.forEach(([key, value]) =>  {
    if (key in data) {
      data[key] = value.toString();
    }
  });

  if (form.dataset.segment_id) {
    const index = Number(form.dataset.segment_id)
    SegmentList.updateSegment(segments, index, data);
  } else {
    SegmentList.storeSegment(segments, data);
  }

  
  renderSegments();
  form.reset();
});

form.addEventListener('reset', (e) => {
  updateInputs('m');
  form.dataset.segment_id = '';
});

form.loadSegment = (input: SegmentInput, id: number) => {  
  Array
      .from(form.elements)
      .filter(elem => elem.hasAttribute('name'))
      .forEach((elem) => {
        form.dataset.segment_id = id.toString();
        const name = elem.getAttribute('name') ?? '';

        (elem as HTMLInputElement).value = input[name] ?? '';
      });
}

// Segment Generation

const template = document.getElementById('segment-item') as HTMLTemplateElement;

function createSegments(seg: Segment[]) {
  return seg.map((segment, index) => {
    const item = template.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
    const label = item.querySelector('.segment--label') as HTMLParagraphElement;

    const editBtn = item.querySelector('.btn-edit') as HTMLButtonElement;
    editBtn.addEventListener('click', () => {
      form.loadSegment(segment[1], index);
    });

    const deleteBtn = item.querySelector('.btn-delete') as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => {
      SegmentList.removeSegment(segments, index);
      renderSegments();
    });

    const convertBtn = item.querySelector('.btn-convert') as HTMLButtonElement;
    convertBtn.addEventListener('click', () => {
      let newSegment: SegmentInput = segment[1];
      if (DrawSVG.isAbsoluteCommand(newSegment.type)) {
        SegmentList.updateSegment(segments, index, calculateRelativePosition(index));
      } else {
        SegmentList.updateSegment(segments, index, calculateAbsolutePosition(index));
      }

      renderSegments();
    });

    label.textContent = segment[0];

    return item;
  });
}

function calculateAbsolutePosition(index: number): SegmentInput {
  const preSegments = segments.slice(0, index + 1);
  const target = segments[index][1];

  const pos = { x: 0, y: 0 };

  preSegments.forEach(([, seg]) => {
    if (DrawSVG.isAbsoluteCommand(seg.type)) {
      pos.x = Number(seg['x-input']);
      pos.y = Number(seg['y-input']);
    } else {
      pos.x += Number(seg['x-input']);
      pos.y += Number(seg['y-input']);
    }
  });

  return { ...target, type: target.type.toUpperCase(), 'x-input': pos.x.toString(), 'y-input': pos.y.toString() }
}

function calculateRelativePosition(index: number): SegmentInput {
  const preSegments = segments.slice(0, index);
  const target = segments[index][1];

  const pos = { x: 0, y: 0 };

  // Calculate Absolute Position Up Until the Target Element
  preSegments.forEach(([, seg]) => {
    if (DrawSVG.isAbsoluteCommand(seg.type)) {
      pos.x = Number(seg['x-input']);
      pos.y = Number(seg['y-input']);
    } else {
      pos.x += Number(seg['x-input']);
      pos.y += Number(seg['y-input']);
    }
  });

  // Calculate the diff between the prev pos and the target
  const diff = { x: Number(target['x-input']) - pos.x, y: Number(target['y-input']) - pos.y};


  return { ...target, type: target.type.toLowerCase(), 'x-input': diff.x.toString(), 'y-input': diff.y.toString() }
}

export {};