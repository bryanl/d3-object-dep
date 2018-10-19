import * as d3 from 'd3';

export class Canvas {
  constructor(width, height) {
    console.log("canvas: " + width + "," + height);
    this._svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("padding", "10px")
      .style("background-color", "#eee");

    this._svg
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "arrow")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
      .style("fill", "black");
  }

  drawCircle(labelText, cx, cy, width, color) {
    const r = width / 2;

    this._svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r)
      .style("fill", color)
      .style("stroke", "#999999")
      .style("stroke-width", 1);

    this._svg
      .append("text")
      .attr("x", cx)
      .attr("y", cy)
      .attr("text-anchor", "middle")
      .text(function() {
        return labelText;
      });
  }

  drawArrow(x1, y1, x2, y2, arrowType) {
    this._svg
      .append("line")
      .attr("class", arrowType)
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("marker-end", "url(#arrow)");
  }
}
