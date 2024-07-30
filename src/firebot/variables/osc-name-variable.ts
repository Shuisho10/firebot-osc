import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getMessageName} from "../osc-manager";

export const OSCNameVariable: ReplaceVariable = {
    definition: {
        handle: "oscName",
        description:
            "Name of the value gotten from OSC",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const message = await getMessageName();
        return message ?? "Unknown"
    },
}