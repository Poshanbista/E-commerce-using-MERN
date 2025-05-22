import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: "bistaposhan123@gmail.com",
        pass: "kmtt qwza tmvu minc",
    },
});