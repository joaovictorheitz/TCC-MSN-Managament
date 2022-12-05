$("input[type='checkbox']").on("change", (e) => {
  let permission = {};

  permission[$(e.target).attr("name")] = e.target.checked;
  fetch(`/admin/workers/${$(e.target).attr("data-id")}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permission),
  });
});
