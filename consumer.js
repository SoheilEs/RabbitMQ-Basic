const amqp = require("amqplib");

async function worker() {
  const queueName = "task_queue";
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, {durable: true});
  console.log("i wait for receiving new message");
  let index = 0;
  await channel.consume(
    queueName,
    (msg) => {
      setTimeout(()=>{
        console.log(`${index}`, msg.content.toString());
        index++;
        channel.ack(msg)
      },2000)
    },
    {
      noAck:false
    }
  );
}

async function receiveFromProducer2() {
  const queueName = "hello";
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, {
    durable: false,
  });
  let index = 0;
  await channel.consume(queueName, (msg) => {
    console.log(`${index}`, msg.content.toString());
    index++;
  });
}

worker();
