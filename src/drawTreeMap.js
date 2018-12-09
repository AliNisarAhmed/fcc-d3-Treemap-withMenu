import { hierarchy, treemap, select, event } from "d3";

export default function drawTreeMap(selection, props) {
  const {
    innerWidth,
    innerHeight,
    data,
    colorScale,
    textXOffset,
    textYOffset
  } = props;

  // Tooltip
  select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("opacity", 0)
    .style("left", 0)
    .style("top", 0);

  const treeMapDiagram = treemap()
    .size([innerWidth, innerHeight])
    .padding(1);

  let root = hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value); // .sum() is a must for treemap layout

  treeMapDiagram(root);
  const filteredRoots = root.descendants().filter(node => node.depth === 2);

  const g = selection.selectAll("g").data(filteredRoots);
  const gEnter = g.enter().append("g");
  g.merge(gEnter).attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  // g.exit().remove();

  // console.log(textNode);

  const rects = gEnter
    .append("rect")
    .attr("class", "tile")
    .merge(g.select(".tile"))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => +d.data.value)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", "green")
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .attr("fill", d => colorScale(d.data.category))
    .on("mouseenter", showToolTip)
    .on("mouseleave", hideToolTip);

  // rects.exit().remove();

  function showToolTip(d) {
    select("#tooltip")
      .attr("data-value", d.data.value)
      .style("opacity", 0.8)
      .style("left", `${event.x}px`)
      .style("top", `${event.y - 80}px`).html(`
          Name: ${d.data.name}<br />
          Category: ${d.data.category}<br />
          value: ${d.data.value}
        `);
  }

  function hideToolTip(d) {
    select("#tooltip")
      .style("opacity", 0)
      .style("left", 0)
      .style("top", 0);
  }

  let texts = gEnter
    .append("text")
    .attr("class", "label")
    .merge(g.select(".label"))
    .attr("y", textYOffset)
    .attr("x", textXOffset)
    .text(d => d.data.name)
    .attr("width", d => d.x1 - d.x0)
    .call(wrap);

  // texts.exit().remove();

  function wrap(text) {
    // console.log(text);
    text.each(function() {
      let text = select(this);
      let words = text
        .text()
        .split(/[\s-]/)
        .filter(v => v)
        .reverse();
      // console.log(words);
      let width = +text.attr("width");
      let y = text.attr("y");
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("y", y);
      let lineHeight = 11;
      let lineNumber = 0;
      let line = [];

      let word = words.pop();
      while (word) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          lineNumber += 1;
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("y", Number(y) + lineNumber * lineHeight)
            .attr("x", textXOffset)
            .text(word);
        }
        word = words.pop();
      }
    });
  }
}
