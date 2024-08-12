import axios from 'axios'

class Sdk {
    connections: Map<string, { label: string, url: string }> = new Map()
    messages: any[] = []
    newMessages: any[] = []

    private mediator: { url: string, id: string } | undefined = undefined

    private readMessages = setInterval(async () => {
        if (this.mediator) {
            const response = await axios.get(`${this.mediator.url}/${this.mediator.id}/messages`)
            const newMessages = response.data as any[]
            this.newMessages.push(...newMessages)
        }
    }, 1 * 1000)

    async sendMessage(connectionId: string, content: any) {
        let message = {
            connectionId: connectionId,
            content: content
        }
        let to = this.connections.get(connectionId)!.url
        await axios.post(to, message)
    }

    async connect(label: string, url: string): Promise<string> {
        let from: string = this.mediator?.url + "/" + this.mediator?.id
        let res = await axios.post(url, { from })
        this.connections.set(res.data.id, { label, url: res.data.url })
        return res.data.id
    }

    async setupMediator(url: string) {
        let res = await axios.post(url)
        this.mediator = { url: res.data.url, id: res.data.id }
    }

    async stop() {
        clearInterval(this.readMessages)
    }
}

export const SDK = new Sdk()
