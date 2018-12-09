export const dropDownMenu = (selection, props) => {
  const { options, onOptionClick, selectedOption } = props;

  let select = selection.selectAll("select").data([null]);
  select = select
    .enter()
    .append("select")
    .merge(select)
    .on("change", function() {
      onOptionClick(this.value);
    });

  const option = select.selectAll("option").data(options);
  option
    .enter()
    .append("option")
    .merge(option)
    .attr("value", d => d)
    .property("selected", d => d === selectedOption) // to set the property 'selected' on the selected option
    .text(d => d);
};
