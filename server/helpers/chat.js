import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";
import axios from "axios";

const beckyUrl = "http://44.223.52.172:8000/api";

export default {
    newResponse: (prompt, openai , userId) => {
        return new Promise(async (resolve, reject) => {
            let chatId = new ObjectId().toHexString()
            let res = null
            try {
                await db.collection(collections.CHAT).createIndex({ user: 1 }, { unique: true })
                res = await db.collection(collections.CHAT).insertOne({
                    user: userId.toString(),
                    data: [{
                        chatId,
                        chats: [{
                            prompt,
                            content: openai
                        }]
                    }]
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.CHAT).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                chatId,
                                chats: [{
                                    prompt,
                                    content: openai
                                }]
                            }
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            } finally {
                if (res) {
                    res.chatId = chatId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    updateChat: (chatId, prompt, openai , userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).updateOne({
                user: userId.toString(),
                'data.chatId': chatId
            }, {
                $push: {
                    'data.$.chats': {
                        prompt,
                        content: openai
                    }
                }
            }).catch((err) => {
                reject(err)
            })

            if (res) {
                resolve(res)
            } else {
                reject({ text: "DB gets something wrong" })
            }
        })
    },
    getChat: async (chatId, authToken) => {
        const data = JSON.stringify({
            "chat_id": "088308b9-1a2f-4e98-9eb9-69f02d254123",
            "auth_token": "admin_123"
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${beckyUrl}/retrieve_messages`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data : data
        };
        const apiResponse = await axios(config);

        return apiResponse.data;
    },
    getHistory: async (authToken) => {
        const data = JSON.stringify({
            "auth_token": "admin_123"
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${beckyUrl}/history_list`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data : data
        };
        const apiResponse = await axios(config);

        return apiResponse.data.history_list;
    },
    deleteAllChat: (userId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.CHAT).deleteOne({
                user: userId.toString()
            }).then((res) => {
                if (res?.deletedCount > 0) {
                    resolve(res)
                } else {
                    reject({ text: 'DB Getting Some Error' })
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }
}
