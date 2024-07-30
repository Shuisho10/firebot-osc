import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { sendOSC } from "../osc-manager";

type Params = {
    name: string;
    value: string;
};

export const ApplyOscEffect: Firebot.EffectType<Params> = {
    definition:{
        id: "osc:apply-osc",
        name: "Set value in OSC",
        description: "Set a value on the OSC",
        icon: "fad fa-palette",
        categories: ["common"]
    },
    optionsTemplate: `
        <eos-container header="Model Mode" pad-top="true">
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" ng-model="effect.name">
        </div>
        <div class="form-group">
            <label>Value</label>
            <input type="text" class="form-control" ng-model="effect.value">
        </div>
        </eos-container>
    `,
    optionsValidator: (effect) => {
        const errors = [];
        if (!effect.name) {
            errors.push("Name is required");
        }
        if (!effect.value) {
            errors.push("Value is required");
        }
        return errors;
    },
    onTriggerEvent: async event => {
        await sendOSC(event.effect.name, event.effect.value);
        return true;
    }
};