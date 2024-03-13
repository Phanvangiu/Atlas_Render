var express = require("express");
const customerModel = require("../model/customerModel");
const multer = require("multer");
const bcrypt = require("bcryptjs");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    let customer = await customerModel.find();
    res.render("customer/index", { customers: customer });
  } catch (error) {
    next(error);
  }
});
router.get("/create", (req, res, next) => {
  res.render("customer/create");
});
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Thư mục để lưu trữ hình ảnh đã tải lên
  },
  filename: function (req, file, cb) {
    // Tạo tên tệp duy nhất bằng cách kết hợp tên gốc và thời gian hiện tại
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/create", upload.single("image"), async (req, res, next) => {
  try {
    let { fullname, email, password, phone } = req.body;
    let image = req.file.filename;
    let customer = new customerModel({
      fullname,
      email,
      password,
      image,
      phone,
    });
    await customer.save();
    res.redirect("/customer");
  } catch (error) {
    next(error);
  }
});

router.get("/update/:id", async (req, res, next) => {
  try {
    let customer = await customerModel.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");
    res.render("customer/update", { customer: customer });
  } catch (error) {
    next(error);
  }
});

router.post("/update/:id", upload.single("image"), async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;
    let image;
    // Kiểm tra xem có file hình mới được tải lên không
    if (req.file) {
      image = req.file.filename;
    } else {
      // Nếu không có file hình mới, giữ nguyên hình ảnh cũ của khách hàng
      const customer = await customerModel.findById(req.params.id);
      if (!customer) {
        return res.status(404).send("Customer not found");
      }
      if (password != customer.password) {
        return res.status(401).send("Incorrect password");
      }
      image = customer.image;
    }

    // Cập nhật thông tin khách hàng trong cơ sở dữ liệu
    const updatedCustomer = await customerModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          fullName: fullName,
          email: email,
          image: image,
          password: password,
          phone: phone,
        },
      },
      { new: true }
    );

    res.redirect("/customer");
  } catch (error) {
    next(error);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    const customerID = req.params.id;
    await customerModel.findOneAndDelete({ _id: customerID });
    res.redirect("/customer");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
