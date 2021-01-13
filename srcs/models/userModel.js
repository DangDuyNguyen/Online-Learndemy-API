const uri = require('../config/mongo-config');
const mongoClient = require('mongodb');

module.exports = {
    insertUser: async (user) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return { status: false, message: 'Connect failed' };
        }
        try {
            const db = client.db('learndemy');
            const collection = db.collection('Users');

            const checkUser = await collection.findOne({ 'username': user.username })
            if (checkUser) {
                client.close();
                return { status: false, message: 'User existed' };
            }
            else {
                //insert new user to database
                await collection.insertOne(user);
                client.close();
                return { status: true, message: 'User created' };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: error };
        }
    },

    getUser: async (username) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return;
        }
        try {
            const db = client.db('learndemy');
            const collection = db.collection('Users');
            const result = await collection.findOne({ 'username': username });
            client.close();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    getAllUsers: async () => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return;
        }

        try {
            const db = client.db('learndemy');
            const collection = db.collection('Users');
            const result = await collection.find({}).toArray();
            client.close();
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (userData) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return false;
        }

        try {
            const db = client.db('learndemy');
            const collection = db.collection('Users');
            const result = await collection.updateOne({ username: userData.username },
                {
                    $set: {
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        email: userData.email
                    }
                });
            client.close();
            if (!result) {
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    },

    updateUserRole: async (userData) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return false;
        }

        try {
            const db = client.db('learndemy');
            const collection = db.collection('Users');
            const result = await collection.updateOne({ username: userData.username },
                {
                    $set: {
                        role: userData.role
                    }
                });
            client.close();
            if (!result) {
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    },
    
    deleteUser: async (username) => {
        const client = await mongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => {
                console.log(err);
            })

        if (!client) {
            return false;
        }

        try {
            const db = client.db('learndemy');
            const collection = db.collection('Users');
            const result = await collection.deleteOne({ username: username });
            client.close();
            if (result.deletedCount == 0) {
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    }
}