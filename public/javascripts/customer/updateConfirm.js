const updateConfirm = (id, event) => {
  event.preventDefault();
  const result = confirm("Cập nhật khách có id: " + id);
  if (result) {
    const form = document.querySelector("form");
    form.submit();
  }
};
