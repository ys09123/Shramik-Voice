import User from "../models/User.js"
import generateToken from "../utils/generateToken.js";

/**
 * @name register
 * @description Register a new user
 * @access Public
 */

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({
        message: "Account already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register error: ", err);
    res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
}

/**
 * @name login
 * @description Logging in
 * @access Public
 */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      })
    }

    const user = await User.findOne({ email }).select("+password")
    
    if (user && (await user.matchPassword(password))) {
      
      const token = generateToken(user._id)

      res.json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } else {
      res.status(400).json({
        message: "Invalid email or password",
      })
    }
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({
      message: "Server error during login",
      error: err.message,
    })
  }
}

