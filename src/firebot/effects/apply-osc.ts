import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { sendOSC } from "../osc-manager";

type Params = {
    name: string;
    value: string;
    mtype: string;
};

export const ApplyOscEffect: Firebot.EffectType<Params> = {
    definition: {
        id: "osc:apply-osc",
        name: "Set value in OSC",
        description: "Set a value on the OSC",
        icon: "fad fa-palette",
        categories: ["common"]
    },
    optionsTemplate: `
        <eos-container header="Type" pad-top="true">
            <dropdown-select options="['float32', 'int32', 'OSC-string', 'OSC-blob']" selected="effect.mtype"></dropdown-select>
        </eos-container>
        <eos-container header="message" pad-top="true">
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
        if (effect.mtype=="" || effect.mtype==null) {
            errors.push("Type is required");
        }
        return errors;
    },
    onTriggerEvent: async event => {
        await sendOSC({
            name: event.effect.name,
            value: event.effect.value,
            mtype: event.effect.mtype
        });
        return true;
    }
};