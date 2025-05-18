import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { WorkshopPipelineStage } from './pipeline-stage';


export class WorkshopPipelineStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        
        const pipeline = new CodePipeline(this, "Pipeline", {
            pipelineName: "WorkshopPipeline",
            synth: new ShellStep("Synth", {
                input: CodePipelineSource.gitHub("Kiegen/cdk-workshop", "main", {
                    authentication: SecretValue.secretsManager("github-token-cdk-workshop"),
                }),
                commands: [
                    "npm ci",
                    "npm run build",
                    "npx cdk synth",
                ],
            }),
        })

        const deploy = new WorkshopPipelineStage(this, "Deploy")
        const deployStage = pipeline.addStage(deploy);
        
    }
}