import './scss/styles.scss';

import { Canvas } from './canvas';

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
const arrowPaddingEnd = 40;

function initApplication() {
  const dag = new DAG();

  const pod = new Node("pod", statuses.ok, edges.explicit);

  const replicaSet = new Node("replicaSet", statuses.ok, edges.explicit);
  replicaSet.addChild(pod);

  const deployment = new Node("deployment", statuses.ok, edges.explicit);
  deployment.addChild(replicaSet);

  const service = new Node("service", statuses.degraded, edges.implicit);
  service.addChild(deployment);

  const ingress1 = new Node("ingress 1", statuses.ok, edges.explicit);
  ingress1.addChild(service);

  dag.addRoot(ingress1);

  dag.draw();
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    initApplication();
  }
};

class DAG {
  constructor() {
    this.nodes = [];
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

        canvas.drawCircle(node.name, nodeX, nodeY, nodeWidth, node.status);

        if (rowIndex < rows.length - 1) {
          const arrowBegin = end + arrowPaddingStart;
          const arrowEnd = arrowBegin + arrowLength + arrowPaddingEnd;
          canvas.drawArrow(nodeX, arrowBegin, nodeX, arrowEnd, node.edge);
        }
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
  constructor(name, status, edge) {
    this.name = name;
    this.edge = edge;
    this.status = status;
    this._children = [];
  }

  addChild(childNode) {
    this._children.push(childNode);
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
