const Joi = require('joi')
const axios = require('axios')
const fs = require('fs').promises
const path = require('path')
const mime = require('mime-types')
const mongoose = require('mongoose')
const { CustomError } = require('./error')
const { joiValidate, joiError } = require('./joi')

const MAX_RETRIES = 3
const TIMEOUT = 10000

const saveFile = async (file, dir = '') => {
  const schema = Joi.object({
    file: Joi.object({
      data: Joi.binary().required(),
    })
      .unknown()
      .required(),
  })

  const { error } = await joiValidate(schema, { file })
  if (error) {
    throw new CustomError(joiError(error))
  }

  const fileExtension = mime.extension(file.mimetype) || 'bin'
  const fileId = new mongoose.Types.ObjectId()
  const filePath = path.join('storage', dir, `${fileId}.${fileExtension}`)
  const fullFilePath = path.join(global.__basedir, filePath)

  const dirPath = path.dirname(fullFilePath)
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (err) {
    throw new CustomError(`Error creating directory: ${err.message}`)
  }

  await file.mv(fullFilePath)

  return filePath
}

const downloadWithRetries = async (url, retries = MAX_RETRIES) => {
  let attempt = 0

  while (attempt < retries) {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: TIMEOUT,
      })

      return response
    } catch (err) {
      attempt += 1
      if (attempt === retries) {
        throw new CustomError(
          `Error downloading file after ${retries} attempts: ${err.message}`
        )
      }
    }
  }
}

const saveRemoteFile = async (url, dir = '', rootDir = global.__basedir) => {
  const schema = Joi.object({
    url: Joi.string().uri().required(),
  })

  const { error } = await joiValidate(schema, { url })
  if (error) {
    throw new CustomError(joiError(error))
  }

  let fileExtension = mime.extension('application/octet-stream') || 'bin'
  const fileId = new mongoose.Types.ObjectId()

  try {
    const response = await downloadWithRetries(url)

    const contentType = response.headers['content-type']

    fileExtension = mime.extension(contentType) || fileExtension

    const filePath = path.join('storage', dir, `${fileId}.${fileExtension}`)
    const fullFilePath = path.join(rootDir, filePath)

    const dirPath = path.dirname(fullFilePath)
    await fs.mkdir(dirPath, { recursive: true })

    const fileBuffer = Buffer.from(response.data, 'binary')
    await fs.writeFile(fullFilePath, fileBuffer)

    return filePath
  } catch (err) {
    throw new CustomError(
      `Error downloading or saving the remote file: ${err.message}`
    )
  }
}

const removeFile = async (filePath) => {
  const fullFilePath = path.join(global.__basedir, filePath)

  try {
    await fs.unlink(fullFilePath)
    console.log('File deleted successfully')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new CustomError('File not found')
    } else {
      throw new CustomError(`Error deleting file: ${err.message}`)
    }
  }
}

module.exports = {
  saveFile,
  saveRemoteFile,
  removeFile,
}
