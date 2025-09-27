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

    // Generate tokens for new user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                201,
                {
                    user: createdUser,
                    accessToken,
                    refreshToken
                },
                "User Registered Successfully"
            )
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

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = await User.findById(user._id).select("-password -refreshToken");

    // Set cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: userData,
                    accessToken,
                    refreshToken
                },
                "Login successful"
            )
        );
});




const logoutUser = asyncHandler(async (req, res) => {
    // Clear refresh token from user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    // Clear cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User logged out successfully")
        );
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -refreshToken");
    
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { users },
                "Users fetched successfully"
            )
        );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError("User not found", 404);
    }
    
    await User.findByIdAndDelete(userId);
    
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "User deleted successfully"
            )
        );
});

export { registerUser, loginUser, logoutUser, getAllUsers, deleteUser }