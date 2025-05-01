import { Router } from "express";
import dotnet from 'dotenv'
import axios from "axios";
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";
import FormData from 'form-data';
import multer from 'multer';
const upload = multer(); // default: in-memory

dotnet.config()

let router = Router()

const CheckUser = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.body.userId = userData._id
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}



// router.get('/', (req, res) => {
//     res.send("Welcome to chatGPT api v1")
// })

router.post('/', CheckUser, upload.none(), async (req, res) => {
    const { message , chatId , auth_token  } = req.body;
    console.log("post chat req ", req.body);
    const chatUrl = 'http://44.223.52.172:8000/api/chatbot';

    try {
        let data = new FormData();
        data.append('message', message);
        data.append('chat_id', chatId);
        data.append('auth_token', auth_token);

        // Proxy the request to external API
        const externalRequest = await axios.post(
            chatUrl,
            data,
            {
                headers: data.getHeaders(),
                responseType: 'stream', // important: tells axios to handle it as stream
            }
        );

        // Set appropriate headers for client
        res.setHeader('Content-Type', externalRequest.headers['content-type'] || 'text/event-stream');

        // Pipe the response from external API to client
        externalRequest.data.pipe(res);


    } catch (error) {
      // Log the error for debugging
      console.error('Error calling external API:', error);
  
      // Send error response
      res.status(500).json({
        status: 500,
        message: error.message || 'An unexpected error occurred.',
      });
    }
  });

router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId } = req.body;
  
    let response = {};
  
    try {

      const apiResponse = await axios.post(
        process.env.CLAUDE_API_URL,
        {
          model: 'claude-3-sonnet-20240229', // Specify the desired Claude model
          max_tokens: 200,
          temperature: 0.7,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
        }
      );
  

      const claudeText = apiResponse?.data?.content[0]?.text?.trim();
  
      if (claudeText) {

        response.openai = claudeText.replace(/^\n+/, '');
  

        response.db = await chat.updateChat(chatId, prompt, response.openai, userId);
  

        res.status(200).json({
          status: 200,
          message: 'Success',
          data: {
            content: response.openai,
          },
        });
      } else {
        throw new Error('Claude API returned an empty response.');
      }
    } catch (err) {

      console.error('Error calling Claude API:', err);
  

      res.status(500).json({
        status: 500,
        message: err.message || 'An unexpected error occurred.',
      });
    }
  });

router.get('/',  async (req, res) => {
    const { chatId, authToken } = req.body

    let response = null

    try {
        response = await chat.getChat(chatId, authToken);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})

router.get('/saved', CheckUser, async (req, res) => {
    const { userId } = req.body
    const { chatId = null } = req.query

    let response = null

    try {
        response = await chat.getChat(userId, chatId)
    } catch (err) {
        if (err?.status === 404) {
            res.status(404).json({
                status: 404,
                message: 'Not found'
            })
        } else {
            res.status(500).json({
                status: 500,
                message: err
            })
        }
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: response
            })
        }
    }
})

router.get('/history',  async (req, res) => {
    const { authToken } = req.body

    let response = null

    try {
        response = await chat.getHistory(authToken)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})

router.delete('/all', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.deleteAllChat(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success'
            })
        }
    }
})

export default router
