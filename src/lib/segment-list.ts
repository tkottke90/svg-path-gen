import { DrawSVG } from ".";
import { SegmentInput } from "../interfaces"
import { createSVGPathCommand } from "./draw-svg"

type Segment = [string, SegmentInput];

const segmentList = document.getElementById('segment-list') as HTMLOListElement;

let designId: string = '';

function renderSegments(segments: HTMLLIElement[], pathString: string) {
  // Clear out old segments
  const oldList = segmentList.querySelectorAll('li');
  oldList.forEach(elem => segmentList.removeChild(elem));

  requestAnimationFrame(() => {
    segments.forEach(elem => segmentList.appendChild(elem));

    designId = DrawSVG.draw(pathString, designId);
  })
}

function storeSegment(segments: Segment[], inputs: SegmentInput) {
  const segmentString = createSVGPathCommand(inputs);

  segments.push([ segmentString, inputs ]);
}

function updateSegment(segments: Segment[], index: number, inputs: SegmentInput) {
  const segmentString = createSVGPathCommand(inputs);

  segments[index] = [ segmentString, inputs ];
}

function removeSegment(segments: Segment[], index: number) {
  segments.splice(index, 1);
}

export { storeSegment, removeSegment, updateSegment, renderSegments }