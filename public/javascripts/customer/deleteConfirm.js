const deleteConfirm = (id) => {
  const result = confirm("Xóa khách có id: " + id);
  if (result) {
    window.location.href = `/customer/delete/${id}`;
    alert("Xóa thành công!!");
  }
};
