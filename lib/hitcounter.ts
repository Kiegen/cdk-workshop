
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";
import { IFunction, Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface HitCounterProps {
    downstream: IFunction;
    // The function for which we want to count requests

    /**
   * The read capacity units for the table
   *
   * Must be greater than 5 and lower than 20
   *
   * @default 5
   */
  readCapacity?: number;
}

export class HitCounter extends Construct {
    public readonly handler: Function;

    public readonly table: Table;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        if(props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
            throw new Error("Read capacity must be between 5 and 20")
        }

        this.table = new Table(this, "Hits", {
            partitionKey: { name: "path", type: AttributeType.STRING },
            encryption: TableEncryption.AWS_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            readCapacity: props.readCapacity ?? 5,
        });

        this.handler = new Function(this, "HitCounterHandler", {
            runtime: Runtime.NODEJS_22_X,
            handler: "hitcounter.handler",
            code: Code.fromAsset("lambda"),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: this.table.tableName,
            }
        });

        this.table.grantReadWriteData(this.handler);

        props.downstream.grantInvoke(this.handler);
    }
}

