'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getConfigById = (event, context, callback) => {
  var params = {
      TableName: process.env.API_TABLE,
      ProjectionExpression: "id, code, configUrl, configPath",
      Key: {
        "id": event.pathParameters.id
      },
  };

  dynamoDb.get(params).promise()
    .then(result => {
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*" 
            },
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    })
    .catch(error => {
        console.error(error);
        callback(new Error('Couldn\'t fetch config No.' + event.pathParameters.id));
        return;
    });

};

module.exports.getConfigByCode = (event, context, callback) => {
    var params = {
        TableName: process.env.API_TABLE,
        ProjectionExpression: "id, code, configUrl, configPath",
        Key: {
          "code": event.pathParameters.code,
        },
    };
  
    dynamoDb.get(params).promise()
      .then(result => {
          const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*" 
            },
            body: JSON.stringify(result.Item),
          };
          callback(null, response);
      })
      .catch(error => {
          console.error(error);
          callback(new Error('Couldn\'t fetch config No.' + event.pathParameters.id));
          return;
      });
  
  };


  module.exports.getAllConfigs = (event, context, callback) => {
    var params = {
        TableName: process.env.API_TABLE,
        ProjectionExpression: "id, code, configUrl, configPath"
    };
  
    dynamoDb.scan(params).promise()
      .then(result => {
          console.log("Results" + JSON.stringify(result));
          const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
            },
            body: JSON.stringify(result.Items),
          };
          callback(null, response);
      })
      .catch(error => {
          console.error(error);
          callback(new Error('Couldn\'t fetch all the configs.'));
          return;
      });
  
  };
