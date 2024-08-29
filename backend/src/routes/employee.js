import express from "express";
import multer from "multer";
import Employee from "../models/Employee.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");//null is passed as the first argument to indicate no error
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {            //Multipurpose Internet Mail Extensions type
      cb(null, true);
    } else {
      cb(new Error("Only jpg and png files are allowed"), false);
    }
  },
});

router.post("/create", upload.single("image"), async (req, res, next) => {
  try {
    const newEmployee = new Employee({
      ...req.body,
      image: req.file ? req.file.path : null, // Only set image if provided
      createdate: new Date() // Ensure createdate is set to the current date
    });
    await newEmployee.save();
    res.status(200).send("Employee has been created");
  } catch (err) {
    console.error("Error creating employee:", err);
    next(err);
  }
});

// Get all employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// Get a single employee
router.get("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.status(200).json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// Update employee

router.put('/employees/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, gender, designation, course } = req.body;
  const image = req.file ? req.file.path : null;
  // console.log(id);
  

  try {
    // const parsedCourse = Array.isArray(course) ? course : JSON.parse(course);
    // const parsedCourse = JSON.parse(course);
    const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        {
            name,
            email,
            mobile,
            gender,
            designation,
            course,
            image,
            updatedate: new Date()
        },
        { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Save the changes to the database
    await updatedEmployee.save();

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Delete employee
router.delete("/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
export default router;
