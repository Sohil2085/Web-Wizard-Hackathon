import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;
    console.log("email : ", email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError("All fields are required", 400);
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new apiError("User already exists", 409);
    }

    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new apiError("User creation failed", 400);
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError("Invalid credentials", 401);
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new apiError("Invalid credentials", 401);
    }

    // You can generate tokens here if needed
    const userData = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        new apiResponse(200, userData, "Login successful")
    );
});

export { registerUser, loginUser }