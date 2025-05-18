import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';
import {TableViewer} from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends Stack {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new Function(this, "Hello Handler", {
      runtime: Runtime.NODEJS_22_X,  // execution environment
      code: Code.fromAsset("lambda"), // code loaded from the "lambda" directory
      handler: "hello.handler" // file is "hello", function is "handler"
    })

    const helloWithCounter = new HitCounter(this, "HelloHitCounter", { downstream: helloLambda });

    const apigateway = new LambdaRestApi(this, "Endpoint",{
      handler: helloWithCounter.handler,
    });
    
    const tv = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits',
      });

      this.hcViewerUrl = new CfnOutput(this, "TableViewerEndpoint", {
        value: tv.endpoint,
      });

      this.hcEndpoint = new CfnOutput(this, "GatewayUrl", {
        value: apigateway.url,
      });

  }
}
