import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/Datastack";

const app = new App();
new DataStack(app, "DataStack");
