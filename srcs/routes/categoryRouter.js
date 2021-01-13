const express = require('express');
const categoryModel = require('../models/categoryModel');
const responseMessage = require('../values/responseMessage');

const categoryRouter = express.Router();

//* create Category
categoryRouter.post('/create', async (req, res) => {
    const cateName = req.body['name'];
    const cateLevel = req.body['level'];
    const cateParent = req.body['parent'];


    if (!cateName || cateName == "") {
        res.status(400).json(responseMessage.createFailure);
        return;
    }

    if (cateLevel == null || cateLevel == undefined || typeof cateLevel !== typeof 0 || cateLevel < 0) {
        res.status(400).json(responseMessage.createFailure);
        return;
    }

    if (cateParent == "") {
        res.status(400).json(responseMessage.createFailure);
        return;
    }

    if ((cateLevel != 0 && cateParent == null) || (cateLevel == 0 && cateParent != null)) {
        res.status(400).json(responseMessage.createFailure);
        return;
    }

    if ((await categoryModel.getCategory(cateParent)).status == false && cateParent != null) {
        res.status(400).json(responseMessage.createFailure);
        return;
    }

    const result = await categoryModel.createCategory(cateName, cateLevel, cateParent);

    if (result.status == false) {
        res.status(500).json(responseMessage.createFailure);
    }
    else {
        res.status(201).json(responseMessage.createSucceed);
    }

});

//* get all Categories
categoryRouter.get('/', async (req, res) => {
    const result = await categoryModel.getAllCategories();

    if (result.status == false) {
        res.status(500).json(responseMessage.getFailure);
    }
    else {
        responseMessage.getSucceed.datas = result.datas;
        res.status(200).json(responseMessage.getSucceed);
    }
});

//* get a category by name
categoryRouter.get('/:name', async (req, res) => {
    const cateName = req.params['name'];

    const result = await categoryModel.getCategory(cateName);

    if (result.status == false) {
        res.status(500).json(responseMessage.getFailure);
    }
    else {
        responseMessage.getSucceed.datas = result.datas;
        res.status(200).json(responseMessage.getSucceed);
    }
});

//* update a category by name
categoryRouter.put('/update/:name', async(req, res) => {
    const cateName = req.params['name'];
    const cateNewName = req.body['newName'];
    const cateStatus = req.body['status'];
    const cateLevel = req.body['level'];
    const cateParent = req.body['parent'];

    if (!cateName || cateName == "") {
        console.log(1)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    if (!cateNewName || cateNewName == "") {
        console.log(2)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    if (!cateStatus !== true) {
        console.log(3)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    if (cateLevel == null || cateLevel == undefined || typeof cateLevel !== typeof 0 || cateLevel < 0) {
        console.log(4)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    if (cateParent == "") {
        console.log(5)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    if ((cateLevel != 0 && cateParent == null) || (cateLevel == 0 && cateParent != null)) {
        console.log(6)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    if ((await categoryModel.getCategory(cateParent)).status == false && cateParent != null) {
        console.log(7)
        res.status(400).json(responseMessage.updateFailure);
        return;
    }

    const category = await categoryModel.getCategory(cateName);

    if (category.status == false) {
        res.status(400).json({status: false, message: 'Category not existed'});
    }
    else {
        const updateData = {
            name: cateNewName,
            status: cateStatus,
            level: cateLevel,
            parent: cateParent
        };
    
        const result = await categoryModel.updateCategory(cateName, updateData);
    
        if (result.status == false) {
            res.status(500).json(responseMessage.updateFailure);
        }
        else {
            res.status(200).json(responseMessage.updateSucceed);
        }
    }
});

//* delete a category by name
categoryRouter.delete('/delete/:name', async(req, res) => {
    const cateName = req.params['name'];

    const category = await categoryModel.getCategory(cateName);

    if (category.status == false) {
        res.status(400).json({status: false, message: 'Category not existed'});
    }
    else {
        const result = await categoryModel.deleteCategory(cateName);
    
        if(result.status == false) {
            res.status(500).json(responseMessage.deleteFailure);
        }
        else {
            res.status(200).json(responseMessage.deleteSucceed);
        }
    }
});

module.exports = categoryRouter;