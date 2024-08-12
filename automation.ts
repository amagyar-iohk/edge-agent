import axios from "axios";
import { SDK } from "./index";

async function run() {
    const mediatorUrl = "http://localhost:3333"
    const issuerUrl = "http://localhost:3000"

    await SDK.setupMediator(`${mediatorUrl}/connections`)
    let connection = await SDK.connect("issuer", `${issuerUrl}/connections`)
    await SDK.sendMessage(connection, {
        myData: "someValue"
    })

    const check = setInterval(() => {
        if (SDK.newMessages.length == 3) {
            console.log("Received 3 new messages!")
            clearInterval(check)
            SDK.stop()
        }
    }, 500)

    await axios.post(`${issuerUrl}/messages/send`, {
        "connectionId": connection,
        "content": "hello world"
    })
    await sleep(3000)
    await axios.post(`${issuerUrl}/messages/send`, {
        "connectionId": connection,
        "content": "hello world"
    })
    await sleep(3000)
    await axios.post(`${issuerUrl}/messages/send`, {
        "connectionId": connection,
        "content": "hello world"
    })
}

function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

run()
