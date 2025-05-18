import { Stack } from 'aws-cdk-lib';
import { Template, Capture } from 'aws-cdk-lib/assertions';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HitCounter } from '../lib/hitcounter';
import { Variable } from 'aws-cdk-lib/aws-codepipeline';

test("DynamoDB table created", () => {
    const stack = new Stack()

    new HitCounter(stack, "MyTestConstructor", {
        downstream: new Function(stack, "TestFunction", {
            runtime: Runtime.NODEJS_22_X,
            code: Code.fromAsset("lambda"),
            handler: "hello.handler",
        }),
    });

    const template = Template.fromStack(stack);
    const envCapture = new Capture();

    template.hasResourceProperties("AWS::Lambda::Function", {
        Environment: envCapture,
    });

    expect(envCapture.asObject()).toEqual({
        Variables: {
            DOWNSTREAM_FUNCTION_NAME: {
                Ref: "TestFunction22AD90FC",
            },
            HITS_TABLE_NAME: {
                Ref: "MyTestConstructorHits95C95B13",
            },
        }
    });
    template.resourceCountIs("AWS::DynamoDB::Table", 1)
});

test("DynamoDB Table Created With Encryption", () => {
  const stack = new Stack();
  // WHEN
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new Function(stack, "TestFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: "hello.handler",
      code: Code.fromAsset("lambda"),
    }),
  });
  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});

test("DynamoDB Table read capacity minimum test", () => {

    const stack = new Stack();

    expect(() => {
        new HitCounter(stack, "MyTestConstruct", {
            downstream: new Function(stack, "TestFunction", {
                runtime: Runtime.NODEJS_22_X,
                handler: "hello.handler",
                code: Code.fromAsset("lambda"),
                
        }),
            readCapacity: 4,
        });
        
    }).toThrow(/Read capacity must be between 5 and 20/);
});