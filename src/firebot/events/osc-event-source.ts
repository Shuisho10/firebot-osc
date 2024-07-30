import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";

export const ReceivedOscEvent: EventSource = {
    id: "osc",
    name: "Received OSC",
    events: [
        {
            id: "received-osc",
            name: "Received OSC",
            description: "Received OSC message",
            cached: false,
            manualMetadata: {
            }
        }
    ]
};