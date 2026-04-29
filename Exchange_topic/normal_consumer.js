import amqp from "amqplib";

async function getMail() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
    const channel = await connection.createChannel();

    const queue_normal= "mail_queue_normal"

    await channel.assertQueue(queue_normal, { durable: true });


    await channel.consume(queue_normal, (message)=>{
        if(message!=null){
            console.log("message recieved", JSON.parse(message.content)) 
            channel.ack(message)
        }
    })
    
    // await channel.close();
    // await connection.close();

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

getMail();