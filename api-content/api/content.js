'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getItem = (event, context, callback) => {
var params = {
    TableName: process.env.CONTENT_TABLE,
    ProjectionExpression: "id, title, icon, content, type, page",
    Key: {
      "id": event.pathParameters.id,
      "sort": event.pathParameters.id
    },
};

dynamoDb.get(params).promise()
  .then(result => {
      const response = {
          statusCode: 200,
          headers: {
              "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
          },
          body: JSON.stringify(result.Item),
      };
      callback(null, response);
  })
  .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch Content #' + event.pathParameters.id));
      return;
  });


};

module.exports.getList = (event, context, callback) => {
    var params = {
        TableName: process.env.CONTENT_TABLE,
        ProjectionExpression: "id, title, icon, content"
    };
  
    const onScan = (err, data) => {
  
        if (err) {
            callback(err);
        } else {
            return callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
                },
                body: JSON.stringify({
                    configs: data.Items
                })
            });
        }
  
    };
  
    dynamoDb.scan(params, onScan);
  
  };
