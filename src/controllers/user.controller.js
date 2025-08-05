import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { User } from "../models/user.model.js";
import { uploadonCLoudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exists: username, email
  //check for images, check for avatar
  //upload them to cloudinary,avatar
  //create user object- create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  //form ya json se aa rha h direct data toh req.body se hi mil jayega
  const { fullName, email, username, password } = req.body;
  //console.log("email :", email);

  // Validation: Check if any required field is empty or just whitespace
  if (
    [fullName, email, username, password].some((field) => !field || field.trim() === "")
  ) {
    throw new APIError(400, "All fields are required");
  }

  // Check if user already exists by username or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new APIError(409, "User with email or username already exists");
  }

  // Get local paths for avatar and cover image files
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length() > 0){
    coverImageLocalPath = req.files.coverImage[0].path
  }
  // Validate if avatar file is provided
  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is required");
  }

  // Upload avatar and cover image to Cloudinary
  const avatar = await uploadonCLoudinary(avatarLocalPath);
  // Cover image is optional, so handle its absence gracefully
  const coverImage = coverImageLocalPath ? await uploadonCLoudinary(coverImageLocalPath) : null;

  // Check if avatar upload was successful
  if (!avatar) {
    throw new APIError(400, "Failed to upload avatar");
  }

  // Create new user in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // Use empty string if coverImage is not uploaded
    email,
    password,
    username: username.toLowerCase(),
  });

  // Find the newly created user and exclude sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Check if user creation was successful
  if (!createdUser) {
    throw new APIError(500, "Something went wrong while registering the user");
  }

  // Return success response
  return res
    .status(201)
    .json(new APIResponse(200, createdUser, "User created successfully"));
});

export { registerUser };
