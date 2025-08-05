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
  console.log("email :", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim === "")
  ) {
    throw new APIError(400, "All fields are required");
  }
});

const existedUser = User.findOne({
  $or: [{ username }, { email }],
});

if (existedUser) {
  throw new APIError(409, "User with email or username already exists");
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
  throw new APIError(400, "Avatar file is required");
}

const avatar = await uploadonCLoudinary(avatarLocalPath);
const coverImage = await uploadonCLoudinary(coverImageLocalPath);

if (!avatar) {
  throw new APIError(400, "Avatar file is required");
}

const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase(),
});

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
);

if (!createdUser) {
  throw new APIError(500, "Something went wrong while registering the user");
}

return res
  .status(201)
  .json(new APIResponse(200, createdUser, "User created successfully"));

  
export { registerUser };
