import { logger } from "../logger";

export let udpClient: any;
export let oscParams = {};

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
  senderPort
}: {
  receiverIpAddress: string;
  receiverPort: number;
  senderIpAddress: string;
  senderPort: number;
}) {
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
    
    udpClient.on("message", function (oscMsg: any, timeTag: any, info: any) {
      console.log("An OSC message just arrived!", oscMsg);
      console.log("Remote info is: ", info);
    });
  
    udpClient.open();
  
    udpClient.on("ready", function () {
      logger.info("Listening for OSC over UDP.");
      udpClient.send({
        address: "/active",
        args: [
          {
            type: "i",
            value: 1
          }
        ]
      }, sIp, senderPort);
    });
  } catch (e) {
    logger.error("Error creating UDP port: " + e);
  }

};

export function stopOSC() {
  udpClient.close();
}