const express = require("express");
const router = express.Router();
const passport = require("passport");
const HttpStatus = require('http-status-codes');
const {v4: uuidv4} = require("uuid");
const Formidable = require("formidable");
const cloudinary = require("cloudinary");
const fs = require("fs");
const path = require("path");
const {promisify} = require("util");
const stat = promisify(fs.stat);
const FileModel = require("../models/FileModel");
const url = require("url");
const ErrorMessageModel = require("../models/ErrorMessageModel");
const NotFoundException = require("../models/Exceptions/NotFoundException");
const soupifyRepository = require("../services/SoupifyRepository");

router.post("/", passport.authenticate("jwt", {session: false}), uploadImg);

cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
});


//front-end
async function uploadImg(req, res) {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .send(new ErrorMessageModel("No files were uploaded."));
    }
    try {
        const form = new Formidable();
        form.parse(req, (err, fields, files) => {
            cloudinary.uploader.upload(files.upload.path, (result) => {
                if (result.public_id) {
                    console.log(result.secure_url);
                    let file = req.files.file;
                    let realFileName = file.name;
                    const extension = path.extname(realFileName);
                    let randomFileName = `${uuidv4()}.${extension}`;

                    let fileInfo = new FileModel(
                        undefined,
                        realFileName,
                        extension,
                        randomFileName
                    );
                    let returnedValue = {
                        id: fileInfo.id,
                        name: fileInfo.name,
                        type: fileInfo.type,
                    };
                    res.status(HttpStatus.CREATED).json(result, returnedValue);
                } else
                    return res.status(HttpStatus.BAD_REQUEST).send(new ErrorMessageModel("No files were uploaded." + err.message));
            });
        });
    } catch (e) {
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({message: e.message});
    }
}

function fullUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl,
    });
}

module.exports = router;
