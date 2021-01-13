const uri = require('../config/mongo-config');
const mongoClient = require('mongodb');

module.exports = {
    createCategory: async (cateName, catelevel, cateParent) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return { status: false, message: 'Connect failed' };
        }
        try {
            const db = client.db('learndemy');
            const collection = db.collection('Categories');

            const checkCategory = await collection.findOne({'name': cateName, 'parent': cateParent });
            if (checkCategory) {
                client.close();
                return { status: false, message: 'Category existed' };
            }
            else {
                //insert new category to database
                const category = {
                    name: cateName,
                    status: true,
                    level: catelevel,
                    parent: cateParent
                };
                const result = await collection.insertOne(category);
                client.close();
                return { status: true, message: 'Category created' };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: error };
        }

    },

    getAllCategories: async () => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return { status: false, message: 'Connect failed' };
        }
        try {
            const db = client.db('learndemy');
            const collection = db.collection('Categories');

            const category = await collection.find({}).toArray();
            if (category) {
                client.close();
                return { status: true, message: 'Get success', datas: category };
            }
            else {
                client.close();
                return { status: false, message: 'Get failed' };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: error };
        }
    },

    getCategory: async (cateName) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return { status: false, message: 'Connect failed' };
        }
        try {
            const db = client.db('learndemy');
            const collection = db.collection('Categories');

            const category = await collection.findOne({'name': cateName});
            console.log(category);
            if (category) {
                client.close();
                return { status: true, message: 'Get success', datas: category };
            }
            else {
                client.close();
                return { status: false, message: 'Get failed' };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: error };
        }
    },

    updateCategory: async (cateName, updateData) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return false;
        }

        try {
            const db = client.db('learndemy');
            const collection = db.collection('Categories');
            const result = await collection.updateOne({ name: cateName },
                {
                    $set: {
                        name: updateData.name,
                        status: updateData.status,
                        level: updateData.level,
                        parent: updateData.parent
                    }
                });
            client.close();
            if (!result) {
                return {status: false, message: 'Update failed'};
            }
            else {
                return {status: true, message: 'Update success'};
            }
        } catch (error) {
            console.log(error);
        }
    },

    deleteCategory: async (cateName) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return false;
        }

        try {
            const db = client.db('learndemy');
            const collection = db.collection('Categories');
            const result = await collection.deleteOne({ name: cateName });
            client.close();
            if (result.deletedCount == 0) {
                return {status: false, message: 'Delete failed'};
            }
            else {
                return {status: true, message: 'Delete success'};
            }
        } catch (error) {
            console.log(error);
        }
    }
}