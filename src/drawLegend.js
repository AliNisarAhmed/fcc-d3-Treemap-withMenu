export function drawLegend(selection, props) {
  const {
    colorScale,
    data,
    innerHeight,
    innerWidth,
    legendRectHeight,
    legendRectWidth
  } = props;

  let lg = selection.selectAll(".container").data([null]);
  const lgEnter = lg
    .enter()
    .append("g")
    .attr("id", "legend");
  lgEnter.merge(lg).attr("transform", `translate(40, 0)`);

  let legendUpdate = lg
    .merge(lgEnter)
    .selectAll("g")
    .data(data.children);
  let legendEnter = legendUpdate.enter().append("g");
  legendEnter
    .merge(legendUpdate)
    .attr(
      "transform",
      (d, i) => `translate(${i * 100}, ${i * 100 > innerWidth ? 100 : 0})`
    );

  legendEnter
    .append("rect")
    .attr("class", "legend-item")
    .merge(lg.select(".legend-item"))
    .attr("fill", d => colorScale(d.name))
    .attr("width", legendRectWidth)
    .attr("height", legendRectHeight);

  legendEnter
    .append("text")
    .attr("class", "legendText")
    .style("font-size", "12px")
    .merge(lg.select(".legendText"))
    .attr("y", 55)
    .text(d => d.name);
}
