import { SegmentInput } from "../interfaces";

const svg = document.querySelector("svg") as SVGElement;
const itemMap = new Map<string, SVGPathElement>();

function createNodeUUID() {
  if ("crypto" in self && "randomUUID" in self.crypto) {
    return self.crypto.randomUUID();
  } else {
    return Date.now().toString();
  }
}

function createSVGPathCommand(segment: SegmentInput) {
  switch(segment.type.toLowerCase()) {
    case 'm':
    case 'l':
      return `${segment.type} ${segment["x-input"]},${segment["y-input"]}`;
    case 'h':
      return `${segment.type} ${segment["x-input"]}`;
    case 'v':
      return `${segment.type} ${segment["y-input"]}`;
    default:
      return '';
  }

}

function draw(pathString: string, id?: string) {
  let elemId = id && id.length > 0 ? id : createNodeUUID();
  let pathElem: SVGPathElement | undefined = itemMap.get(elemId);

  // If there is not an id OR no matching element is found
  // create one
  if (!pathElem) {
    pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElem.id = elemId;
  }

  pathElem.setAttributeNS(null, "d", pathString);

  // If it is a new element, we need to do the initial render
  if (!itemMap.has(elemId)) {
    itemMap.set(elemId, pathElem!);
    requestAnimationFrame(() => {
      svg.appendChild(pathElem!);
    });
  }

  return elemId;
}

function setViewBox(viewBoxStr: string) {
  svg.setAttribute('viewBox', viewBoxStr);
}

function setStrokeColor(color: string) {
  svg.style.stroke = color;
}

function isAbsoluteCommand(type: string) {
  return !!type.match(/[A-Z]/g);
}

export { draw, createSVGPathCommand, setViewBox, setStrokeColor, isAbsoluteCommand };
