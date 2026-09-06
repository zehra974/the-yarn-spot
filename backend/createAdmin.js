const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env"
      );
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingAdmin) {
      console.log("Admin already exists in MongoDB.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    console.log("Admin created successfully!");
    console.log("Admin ID:", admin._id);
    console.log("Admin Email:", admin.email);
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();