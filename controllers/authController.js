import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
        throw new BadRequestError("please provide all values!");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new BadRequestError("email already in use!");
    }

    const user = await User.create({ name, email, password });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
        },
        token,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { 
        throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new UnAuthenticatedError('Invalid Credentials');
    }
    console.log(user);

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('Password incorrect')
    }
    const token = user.createJWT()
    user.password = undefined;
    res.status(StatusCodes.OK).json({ user, token, location: user.location });

    
};

const updateUser = async (req, res) => {
    res.send("update user");
    // user.save();
};

export { register, login, updateUser };
