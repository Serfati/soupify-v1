const express = require("express");
const router = express.Router();
const HttpStatus = require('http-status-codes');
const cloudinary = require("cloudinary");
const path = require("path");
const ErrorMessageModel = require("../models/ErrorMessageModel");


cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
});

const multer = require('multer');
const storage = multer.memoryStorage();
const multerUploads = multer({storage}).single('image');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const dataUri = req => parser.format(path.extname(req.files.image.name).toString(), req.files.image.data);
//

router.post("/", multerUploads, uploadImg);

//front-end
async function uploadImg(req, res) {
    try {
        if (req.files.image) {
            const file = dataUri(req).content;

            cloudinary.uploader.upload(file, (result) => {
                if (result.public_id) {
                    let returnedValue = {
                        url: result.secure_url
                    };
                    res.status(HttpStatus.CREATED).json(returnedValue);
                } else
                    return res.status(HttpStatus.BAD_REQUEST).send(new ErrorMessageModel("No files were uploaded."));
            });
        }
    } catch (e) {
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({message: e.message});
    }
}

module.exports = router;
