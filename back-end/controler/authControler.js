import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { User } from "../model/authModel.js"

export const register = async (req, res) => {
    try {
        const { name, email, password , role} = req.body

        const ExitsUser = await User.findOne({ email });


        if (ExitsUser) {
            return res.status(400).json({
                status: false,
                message: "User already register"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashpassword, role });

        return res.status(201).json({
            status: true,
            message: "Register Succesfully!",
            data: newUser
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Register Failed ${error.message}`
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const ExitsUser = await User.findOne({ email });

        if (!ExitsUser) {
            return res.status(404).json({
                status: false,
                message: "Register First"
            })
        }

        const isMatch = await bcrypt.compare(password, ExitsUser.password);

        if(!isMatch){
            return res.status(400).json({
                status: false,
                message: "password not match"
            })
        }


        const token = jwt.sign({ id: ExitsUser._id, name: ExitsUser.name, email: ExitsUser.email }, process.env.JSON_TOKEN, { expiresIn: "7d" });

        return res.status(200).json({
            status: true,
            message: "Login Successfully!",
            token: token,
            role: ExitsUser.role
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Login Failed : ${error.message}`
        })
    }
}