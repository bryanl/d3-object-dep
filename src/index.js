import './scss/styles.scss';

import { Canvas } from './canvas';
import { sample } from './data';

const statuses = {
  ok: "#7FFF00",
  degraded: "#FF8C00"
};

const edges = {
  implicit: "arrow-implicit",
  explicit: "arrow-explicit"
};

const nodeWidth = 100;
const nodeHeight = 100;
const padding = 50;
const arrowLength = 30;
const arrowPaddingStart = 20;
const arrowPaddingEnd = 20;

function initApplication() {
  const dag = new DAG(sample);

  dag.draw();
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    initApplication();
  }
};

class DAG {
  constructor(data) {
    let scratchNodes = {};
    let hasParent = {};

    this.nodes = [];

    for (const [key, value] of Object.entries(data.objects)) {
      scratchNodes[key] = new Node(key, value.name, value.status);
    }

    // find roots
    for (const [_, value] of Object.entries(data.dag)) {
      for (const object of value) {
        hasParent[object.node] = true;
      }
    }

    for (const [key, value] of Object.entries(data.objects)) {
      if (hasParent[key] == undefined) {
        this.addRoot(scratchNodes[key]);
      }

      scratchNodes[key].status = statuses[value.status];
    }

    for (const [key, value] of Object.entries(data.dag)) {
      for (const object of value) {
        scratchNodes[key].addChild(scratchNodes[object.node], object.edge);
        scratchNodes[object.node].edge = edges[object.edge];
      }
    }
  }

  addRoot(node) {
    this.nodes.push(node);
  }

  draw() {
    let rows = [];

    let canvasWidth = 0;

    this.nodes.forEach(node => {
      let counter = 0;

      for (let row of node.childrenRows()) {
        if (rows[counter] == undefined) {
          rows[counter] = [];
        }

        rows[counter] = rows[counter].concat(row);
        counter++;

        let curWidth = row.length * (nodeWidth + padding) + padding;
        if (curWidth > canvasWidth) {
          canvasWidth = curWidth;
        }
      }
    });

    let arrowHeight = arrowLength + arrowPaddingEnd + arrowPaddingEnd;

    let canvasHeight = padding * 2;
    canvasHeight += rows.length * nodeHeight;
    canvasHeight += (rows.length - 1) * arrowHeight;

    let positions = {};

    const canvas = new Canvas(canvasWidth, canvasHeight);

    let end = 0;
    for (const rowIndex of rows.keys()) {
      let nodeY;

      if (rowIndex == 0) {
        nodeY = padding + nodeHeight / 2;
      } else {
        nodeY = end + arrowHeight + nodeHeight / 2;
      }



      end = nodeY + nodeHeight / 2;

      for (const colIndex of rows[rowIndex].keys()) {
        let node = rows[rowIndex][colIndex];
        let nodeX =
          padding + padding * colIndex + colIndex * nodeWidth + nodeWidth / 2;

        positions[node.id] = {
          x: nodeX,
          y: nodeY,
          label: node.name,
          status: node.status,
          children: node.edges,
        };
      }
    }

    for (const pos of Object.values(positions)) {
      canvas.drawCircle(pos.label, pos.x, pos.y, nodeWidth, pos.status);

      for (const [key, value] of Object.entries(pos.children)) {
        const child = positions[key];
        const startY = pos.y + nodeHeight / 2 + arrowPaddingStart;
        const endY = child.y - arrowPaddingEnd - nodeHeight / 2;

        canvas.drawArrow(pos.x, startY, child.x, endY, edges[value]);
      }
    }
  }

  depth() {
    let d = 0;
    this.nodes.forEach(node => {
      if (node.depth() > d) {
        d = node.depth();
      }
    });

    return d;
  }
}

class Node {
  constructor(id, name, status, edge) {
    this.id = id;
    this.name = name;
    this.edge = edge;
    this.status = status;
    this._children = [];
    this.edges = {};
  }

  addChild(childNode, edgeType) {
    this._children.push(childNode);
    childNode.parent = this.id;
    this.edges[childNode.id] = edgeType;
  }

  childrenRows() {
    let rows = [];

    // the first row contains this node.
    rows[0] = [this];

    for (let child of this._children) {
      let counter = 1;
      for (let row of child.childrenRows()) {
        if (rows[counter] == undefined) {
          rows[counter] = [];
        }

        rows[counter] = rows[counter].concat(row);
        counter++;
      }
    }

    return rows;
  }

  depth() {
    const len = this._children.length;
    if (len == 0) {
      return 0;
    }

    let maxDepth = 0;
    for (let child of this._children) {
      const childDepth = child.depth();
      if (childDepth > maxDepth) {
        maxDepth = childDepth;
      }
    }

    return 1 + maxDepth;
  }
}
