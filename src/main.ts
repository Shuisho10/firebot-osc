import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initLogger } from "./logger";
import { initOSC, stopOSC } from "./firebot/osc-manager";
import { ApplyOscEffect } from "./firebot/effects/apply-osc";
import { ReceivedOscEvent } from "./firebot/events/osc-event-source";
import { OSCNameVariable } from "./firebot/variables/osc-name-variable";
import { OSCValueVariable } from "./firebot/variables/osc-value-variable";

interface Params {
  receiverIpAddress: string;
  receiverPort: number;
  senderIpAddress: string;
  senderPort: number;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot OSC",
      description: "OSC support for Firebot",
      author: "Shuisho",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      receiverIpAddress: {
        type: "string",
        description: "Receiver IP Address",
        default: "localhost"
      },
      receiverPort: {
        type: "number",
        description: "Port",
        default: 9001
      },
      senderIpAddress: {
        type: "string",
        description: "Sender IP Address",
        default: "localhost"
      },
      senderPort: {
        type: "number",
        description: "Port",
        default: 9000
      },
    };
  },
  run: (runRequest) => {
    const {
      logger,
      effectManager,
      eventManager,
      replaceVariableManager
    } = runRequest.modules;

    logger.info("Starting OSC server!");

    initLogger(logger);

    initOSC({
      receiverIpAddress: runRequest.parameters.receiverIpAddress,
      receiverPort: runRequest.parameters.receiverPort,
      senderIpAddress: runRequest.parameters.senderIpAddress,
      senderPort: runRequest.parameters.senderPort,
      em: eventManager
    });
    effectManager.registerEffect(ApplyOscEffect);
    eventManager.registerEventSource(ReceivedOscEvent);
    replaceVariableManager.registerReplaceVariable(OSCNameVariable);
    replaceVariableManager.registerReplaceVariable(OSCValueVariable);
  },
  parametersUpdated: (parameters) => {
    initOSC({
      receiverIpAddress: parameters.receiverIpAddress,
      receiverPort: parameters.receiverPort,
      senderIpAddress: parameters.senderIpAddress,
      senderPort: parameters.senderPort
    });
  },
  stop: () => {
    // Stop the OSC server
    stopOSC();

  }
};

export default script;
