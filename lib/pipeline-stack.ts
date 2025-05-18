import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Repository} from 'aws-cdk-lib/aws-codecommit';

export class WorkshopPipelineStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const repo = new Repository(this, 'WorkshopRepo', {
            repositoryName: 'WorkshopRepo'
    });
}
}