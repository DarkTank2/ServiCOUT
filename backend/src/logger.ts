// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports, version } from 'winston'
const { combine, timestamp, label, printf, colorize } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
})

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: combine(
    label({ label: 'scout-backend' }),
    timestamp(),
    colorize(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'maintenanceBackendError.log', level: 'error' }),
    new transports.File({ filename: 'maintenanceBackend.log' })
  ]
})
