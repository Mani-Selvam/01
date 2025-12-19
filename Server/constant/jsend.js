"use strict";

function formatJSend(statusCode, message, data) {
  return {
    statusCode: statusCode,
    message: message,
    data: data,
  };
}

module.exports = formatJSend;