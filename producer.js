const amqp = require("amqplib");
const msg = process.argv.slice(2).join(' ') || "Hello world";


async function producer(){
    const queueName = "task_queue"
    const connection = await amqp.connect("amqp://localhost:5672")
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName,
        {
            durable:true
        }
    )
    channel.sendToQueue(queueName,Buffer.from(msg),{
        persistent: true
    })
    setTimeout(()=>{
        connection.close()
        console.log("[x] Sent '%s'",msg);
    },1000)
}






