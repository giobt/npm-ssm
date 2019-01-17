#!/usr/bin/env node

/*
This script will download parameters from PARAMETER STORE.
This template needs two command line args to work.
  1) A filename where the script will put the variables -- DefaultVariables.txt (could be relative or absolut path)
  2) The BeginsWith parameter, with this we will decide wich parameter pull, -- /DEV/   /STAGING/   /DEFAULT
*/
const fs = require('fs');
var AWS = require('aws-sdk');
var OUTPUT      = "";
var BEGINSWITH  = "";
var REGION      = "";
var ssm;
var params;

function collectParameters(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
      for (var parameter in data.Parameters) {
        setEnvironmentVariables(data.Parameters[parameter].Name)
      }
      if (typeof data.NextToken !== 'undefined') {
        params["NextToken"]=data.NextToken
        ssm.describeParameters(params, collectParameters);
      }
  }
}
function setEnvironmentVariables(parameterName){
    var params = {
      Name: parameterName,
      WithDecryption: true
    };
    ssm.getParameter(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        var myArray = data.Parameter.Name.split("/");
        var myArrayLength = myArray.length;
        fs.appendFile(OUTPUT, 'export ' + myArray[myArrayLength - 1] + '="' + data.Parameter.Value + "\"\n" , function (err) {
          if (err) throw err;
        });
      }
    });
}

exports.getSsmParams = function(output, beginswith, awsregion) {

  OUTPUT = output;
  BEGINSWITH = beginswith;
  REGION = awsregion;

  if (process.env.NODE_ENV == "local") {
    ssm = new AWS.SSM({endpoint:"http://localstack:4583"});
  }
  else {
    ssm = new AWS.SSM({region:REGION});
  }

  params = {
    MaxResults: 50,
    ParameterFilters: [
      {
        Key: 'Name',
        Option: 'BeginsWith',
        Values: [
          BEGINSWITH,
        ]
      }
    ]
  };
  ssm.describeParameters(params, collectParameters);
}
