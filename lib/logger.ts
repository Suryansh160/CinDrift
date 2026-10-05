import winston from 'winston'

const { combine, timestamp, printf, colorize, errors, json } = winston.format

const isProd = process.env.NODE_ENV === 'production'

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const extra = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
    return `${timestamp} ${level}: ${stack || message}${extra}`
  })
)

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProd
      ? combine(timestamp(), errors({ stack: true }), json())
      : devFormat
  })
]

// Vercel/serverless has a read-only filesystem, so skip files there
if (!process.env.VERCEL) {
  const fileFormat = combine(timestamp(), errors({ stack: true }), json())
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat
    })
  )
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  transports
})
