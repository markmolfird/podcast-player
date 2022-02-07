config.log = function (txt) {
  var table = document.getElementById("log");
  if (table) {
    if (table.children.length > 150) table.textContent = '';
    /*  */
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("class", "litecolor");
    td.textContent = txt;
    tr.appendChild(td);
    /*  */
    if (table.firstChild) {
      table.insertBefore(tr, table.firstChild);
    } else table.appendChild(tr);
  }
};
