import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
        },

        email : {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password :{
            type: String,
            required: true,
            minlength: 5,
        },

        role :{
            type: String,
            enum: ["sailor","captain","admin","user"],
            default: "sailor",
        },

        vesselName : {
            type: String,
            required: true,
            
        },

        vesselType : {
            type : String,
            enum : ["cargo", "fishing", "pleasure", "tanker", "passenger", "other"],
            default : "other",
            required : true,
        },

        isActive : {
            type: Boolean,
            default: true
        }
    },

        { timestamps: true }

    );


    //password hashing before saving 
    userSchema.pre("save", async function (next) {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    //compare password method
    userSchema.methods.comparePassword = function(plain){
        return bcrypt.compare(plain, this.password);
    };

    // To get clean JSON response without sensitive data
    userSchema.methods.toJSON = function() {
        const user = this.toObject();
        delete user.password;
        delete user.__v;
        return user;
    }


   export default mongoose.model("User", userSchema);
