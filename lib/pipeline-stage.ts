import { CdkWorkshopStack } from "./cdk-workshop-stack";
import { Stage, StageProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export class WorkshopPipelineStage extends Stage {
    public readonly hcViewerUrl: CfnOutput;
    public readonly hcEndpoint: CfnOutput;
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const service = new CdkWorkshopStack(this, "WebService");

        this.hcEndpoint = service.hcEndpoint;
        this.hcViewerUrl = service.hcViewerUrl;
    }
}