import fs from 'fs';
import path from 'path';

import { env } from '../config/env';

export const logger = (text: any): void => {
  if (env.NODE_ENV === 'test') {
    return;
  }

  const logsDir = path.join(__dirname, '..', '..', 'storage', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  try {
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    }

    const now = new Date();
    console.log(`[${now.toISOString()}]: ${text}`);

    const year = `${now.getFullYear()}`;
    let month = `${now.getMonth() + 1}`;
    if (now.getMonth() + 1 < 10) {
      month = `0${month}`;
    }
    let day = `${now.getDate()}`;
    if (now.getDate() < 10) {
      day = `0${day}`;
    }
    // const path = `storage/logs/${year}-${month}-${day}.log`;
    const logFilePath = path.join(logsDir, `${year}-${month}-${day}.log`);

    let e = new Error();
    let logMsg = `[${now.toISOString()}]: ${text}`;
    if (e.stack) {
      let frame = e.stack.split('\n')[2];
      let arr = frame.split(' ');
      let where = [''];
      if (arr[6]) {
        where = arr[6].split(/[:()]/);
      } else {
        where = arr[5].split(/[:()]/);
      }
      let fileName = where[1];
      let lineNumber = where[2];

      logMsg = `[${now.toISOString()}][${fileName}:${lineNumber}] : ${text}\n`;
    }

    fs.appendFileSync(logFilePath, logMsg);
  } catch (error) {
    console.error(error);
  }
};
