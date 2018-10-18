
// import `.scss` files
import './scss/styles.scss';

import * as d3 from 'd3';

const statuses = {
    "ok": "	#7FFF00",
    "degraded": "#FF8C00",
};

function initSVG() {
    var svg = d3.select("body")
        .append("svg")
        .attr("width", 800)
        .attr("height", 600)
        .style("padding", "10px");

    svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
        .style("fill", "black");

    return svg;
}

function drawArrow(svg, x1, y1, x2, y2) {
    svg.append('line')
        .attr("class", "arrow")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("marker-end", "url(#arrow)");
}


function drawCircle(svg, labelText, cx, cy, r, status) {
    svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
        .style("fill", status)
        .style("stroke", "#999999")
        .style("stroke-width", 1);

    svg.append("text")
        .attr("x", cx)
        .attr("y", cy)
        .attr("text-anchor", "middle")
        .text(function (d) { return labelText; });
}

function initApplication() {

    const dag = new DAG();

    const ingress1 = new Node("ingress 1");
    const service = new Node("service");

    ingress1.addChild(service);

    dag.addRoot(ingress1);

    const ingress2 = new Node("ingress 2");
    dag.addRoot(ingress2);
    dag.addRoot(new Node("ingress3"));

    dag.draw();

    // var svg = initSVG();
    // drawCircle(svg, "ingress", 100, 100, 50, statuses.ok);
    // drawArrow(svg, 100, 160, 100, 210);
    // drawCircle(svg, "service", 100, 280, 50, statuses.degraded);
}


document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        initApplication();
    }
};

class DAG {
    constructor(name) {
        this.nodes = [];
    }

    addRoot(node) {
        this.nodes.push(node);
    }

    draw() {

        console.log("drawing dag");

        // drawing nodes:
        // figure out how many nodes there are
        // nodes are 100 pixels wide, so space them out.
        // borders are 100px

        // if there is one, the coords should to draw a circle with 50 pixel radius
        // at 100, 100

        // if there are two nodes, it should draw the first one at 100, 100, and second
        // at 250, 100.


        let y = 100;
        let r = 50;
        let sidePadding = 50;

        // width is 2r + 50 for the trailing space
        let width = r * 2 + sidePadding;

        let docWidth = width * this.nodes.length + sidePadding;
        let svg = this._initSVG(docWidth);

        this.nodes.forEach((node, i) => {
            const x = (i*width + r * 2);
            console.log("drawing " + node.name + " " + x);
            drawCircle(svg, node.name, x, y, r, statuses.ok);
        });
    }

    _initSVG(width) {
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", 200)
            .style("padding", "10px")
            .style("background-color", "#eee");

        svg.append("svg:defs").append("svg:marker")
            .attr("id", "arrow")
            .attr("refX", 6)
            .attr("refY", 6)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
            .style("fill", "black");

        return svg;
    }
}

class Node {
    constructor(name) {
        this.name = name;
        this.children = [];
    }

    addChild(childNode) {
        this.children.push(childNode);
    }
}