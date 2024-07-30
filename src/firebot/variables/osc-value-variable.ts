import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getMessageValue } from "../osc-manager";

export const OSCValueVariable: ReplaceVariable = {
    definition: {
        handle: "oscValue",
        description:
            "Value gotten from OSC",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const message = await getMessageValue();
        return message ?? "Unknown"
    },
}