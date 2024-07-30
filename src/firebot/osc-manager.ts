import { logger } from "../logger";
import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";

export let udpClient: any;
export let oscParams = {};

let eventManager: ScriptModules["eventManager"];
let messageName: string;
let messageValue: string;

const oscTypes: { [key: string]: string } = {
  "float32": "f",
  "int32": "i",
  "OSC-string": "s",
  "OSC-blob": "b"
};

let sIp: string, sPort: number;

const osc = require('osc');

export async function sendOSC({ name, value, mtype }: { name: string, value: string, mtype: string }) {
  logger.info("Setting " + name + " to " + value + " at " + sIp + ":" + sPort);
  udpClient.send({
    address: name,
    args: [
      {
        type: oscTypes[mtype],
        value: value
      }
    ]
  }, sIp, sPort);
};

export function initOSC({
  receiverIpAddress,
  receiverPort,
  senderIpAddress,
  senderPort,
  em
}: {
  receiverIpAddress: string;
  receiverPort: number;
  senderIpAddress: string;
  senderPort: number;
  em?: ScriptModules["eventManager"];
}) {
  if (em){
    eventManager = em;
  }
  if (udpClient) {
    udpClient.close();
  }

  sIp = senderIpAddress;
  sPort = senderPort;

  try {
    udpClient = new osc.UDPPort({
      localAddress: receiverIpAddress,
      localPort: receiverPort,
      metadata: true
    });
    
    udpClient.on("error", function (err: any) {
      logger.error("Error in UDP port: " + err);
    });

    udpClient.on("ready", function () {
      logger.info("Listening for OSC messages on: " + receiverIpAddress + ":" + receiverPort);
    });

    udpClient.on("message", function (oscMsg:any, timeTag:any, info:any) {
      logger.info("Received OSC message: ", oscMsg, "Rmote info: ", info);
      messageName = oscMsg["address"];
      messageValue = oscMsg["args"][0]["value"];
      logger.info("Message Name: ", messageName, " Message Value: ", messageValue);
      eventManager.triggerEvent("osc", "received-osc", {});
      
    });
  
    udpClient.open();
  
    
  } catch (e) {
    logger.error("Error creating UDP port: " + e);
  }

};

export async function getMessageName(): Promise<string> {
  return messageName??"None";
};

export async function getMessageValue(): Promise<string> {
  return messageValue??"None";
};

export function stopOSC() {
  udpClient.close();
}