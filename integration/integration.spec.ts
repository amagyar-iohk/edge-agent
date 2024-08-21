import axios from "axios";
import dotenv from "dotenv"
import { SDK } from "@amagyar-iohk/edge-agent"
import assert from "assert";

describe("Edge-agent end-to-end", () => {
    dotenv.config({ path: ".env" })
    const mediatorUrl = process.env.MEDIATOR_URL || "http://localhost:3333"
    const agentUrl = process.env.AGENT_URL || "http://localhost:3000"

    test("Setup mediator", async () => {
        await SDK.setupMediator(`${mediatorUrl}/connections`)
        assert.notEqual(SDK.mediator, undefined)
    })

    test("Connect to issuer", async () => {
        await SDK.connect("issuer", `${agentUrl}/connections`)
        assert.notEqual(SDK.connections.get("issuer"), undefined)
    })

    test("Send message to issuer", async () => {
        await SDK.sendMessage("issuer", {
            myData: "someValue"
        })
    })

    test("SDK should get messages from mediator", async () => {
        let issuerMessageToSdkUrl = SDK.connections.get("issuer").url

        let started = Date.now()
        const promise = new Promise<void>((resolve, reject) => {
            const check = setInterval(() => {
                if (SDK.messages.length == 3) {
                    clearInterval(check)
                    SDK.stop()
                    resolve()
                }
                if (Date.now() - started > 10000) {
                    clearInterval(check)
                    SDK.stop()
                    reject("Unable to retrieve the 3 expected messages")
                }
            }, 500)
        })

        setTimeout(async () => {
            await axios.post(`${issuerMessageToSdkUrl}/send`, { "content": "hello world" })
        }, 1000)

        setTimeout(async () => {
            await axios.post(`${issuerMessageToSdkUrl}/send`, { "content": "hello world" })
        }, 2000)
        
        setTimeout(async () => {
            await axios.post(`${issuerMessageToSdkUrl}/send`, { "content": "hello world" })
        }, 3000)

        await promise
        assert.equal(SDK.messages.length, 3)
    }, 30 * 1000)
})

function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
