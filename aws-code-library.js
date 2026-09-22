/* Referências oficiais da AWS Code Library para o Professor Bot. */
(function(global){
  "use strict";

  const BASE="https://docs.aws.amazon.com/pt_br/code-library/latest/ug/";
  const DATA={
    boto3:{label:"AWS SDK para Python (Boto3)",url:BASE+"python_3_code_examples.html"},
    python:{label:"AWS SDK para Python (Boto3)",url:BASE+"python_3_code_examples.html"},
    s3:{label:"Amazon S3 com Boto3",url:BASE+"python_3_s3_code_examples.html"},
    lambda:{label:"AWS Lambda com Boto3",url:BASE+"python_3_lambda_code_examples.html"},
    dynamodb:{label:"Amazon DynamoDB com Boto3",url:BASE+"python_3_dynamodb_code_examples.html"},
    bedrock:{label:"Amazon Bedrock com Boto3",url:BASE+"python_3_bedrock_code_examples.html"},
    iam:{label:"AWS IAM com Boto3",url:BASE+"python_3_iam_code_examples.html"},
    ec2:{label:"Amazon EC2 com Boto3",url:BASE+"python_3_ec2_code_examples.html"}
  };

  function normalize(value){
    return String(value||"").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  function lookup(text){
    const s=normalize(text);
    const order=["bedrock","dynamodb","lambda","s3","iam","ec2","boto3","python"];
    for(const key of order){
      if(new RegExp("\\b"+key+"\\b").test(s))return DATA[key];
    }
    return null;
  }

  global.PyCodeAWS={
    libraryUrl:BASE+"what-is-code-library.html",
    sdkPythonUrl:DATA.python.url,
    lookup
  };
})(window);