import amqp from "amqplib";

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    
    const routingKey_subscribed_user = "sendmail_subscribed";
    const routingKey_normal_user="sendmai_normal"


    const queue_subscribed = "mail_queue_subscribed";
    const queue_normal= "mail_queue_normal"

    const message_subcribed = {
      to: "test@example.com",
      from: "app@example.com",
      subject: "Subscriber",
      body: "Thanks for subscribing!"
    };

    const message_normal= {
      to: "test@example.com",
      from: "app@example.com",
      subject: "Normal",
      body: "Hello normal user!"
    };

    await channel.assertExchange(exchange, "direct", { durable: true });

    await channel.assertQueue(queue_subscribed, { durable: true });
    await channel.assertQueue(queue_normal, { durable: true });

    await channel.bindQueue(queue_subscribed, exchange, routingKey_subscribed_user);
    await channel.bindQueue(queue_normal, exchange, routingKey_normal_user);


    channel.publish(
      exchange,
      routingKey_subscribed_user,
      Buffer.from(JSON.stringify(message_subcribed)),
      { persistent: true }
    );

    
    channel.publish(
      exchange,
      routingKey_normal_user,
      Buffer.from(JSON.stringify(message_normal)),
      { persistent: true }
    );

    console.log("Messages sent", message_subcribed, message_normal);

    await channel.close();
    await connection.close();

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

sendMail();