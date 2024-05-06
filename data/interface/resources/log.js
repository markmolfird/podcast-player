config.log = function (txt) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  const table = document.getElementById("log");
  /*  */
  if (table) {
    if (table.children.length > 150) {
      table.textContent = '';
    }
    /*  */
    td.setAttribute("class", "litecolor");
    td.textContent = txt;
    tr.appendChild(td);
    /*  */
    if (table.firstChild) {
      table.insertBefore(tr, table.firstChild);
    } else {
      table.appendChild(tr);
    }
  }
};
