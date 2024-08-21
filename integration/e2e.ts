import axios from "axios";
import { SDK } from "../index";
import dotenv from "dotenv"

dotenv.config({ path: "integration/.env" })

async function run() {
    const mediatorUrl = process.env.MEDIATOR_URL || "http://localhost:3333"
    const agentUrl = process.env.AGENT_URL || "http://localhost:3000"

    await SDK.setupMediator(`${mediatorUrl}/connections`)

    let commUrl = await SDK.connect("issuer", `${agentUrl}/connections`)

    await SDK.sendMessage("issuer", {
        myData: "someValue"
    })

    const check = setInterval(() => {
        if (SDK.newMessages.length == 3) {
            console.log("Received 3 new messages!")
            clearInterval(check)
            SDK.stop()
        }
    }, 500)

    await axios.post(`${commUrl}/send`, { "content": "hello world" })
    await sleep(3000)
    await axios.post(`${commUrl}/send`, { "content": "hello world" })
    await sleep(3000)
    await axios.post(`${commUrl}/send`, { "content": "hello world" })
}

function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

run()
