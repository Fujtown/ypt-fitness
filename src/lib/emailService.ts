/**
 * Email Service
 *
 * This is a placeholder implementation for sending emails.
 * In a real application, you would use a service like SendGrid, Mailgun, etc.
 *
 * For demonstration purposes, this just logs the email data to the console.
 */

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface OrderEmailData {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  courseTitle: string;
  courseId: string;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    console.log('Sending email with the following data:');
    console.log(data);

    // In a real implementation, you would use an email service API
    // For example, with SendGrid:
    //
    // const msg = {
    //   to: data.to,
    //   from: 'noreply@example.com',
    //   subject: data.subject,
    //   text: data.text,
    //   html: data.html,
    // };
    // await sendgrid.send(msg);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendOrderConfirmation(orderData: OrderEmailData): Promise<boolean> {
  const { customerEmail, customerName, orderId, orderDate, totalAmount, currency, courseTitle } = orderData;

  // Format the price for display
  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
  }).format(totalAmount / 100); // Stripe amounts are in cents

  // Create the email content
  const subject = `Подтверждение заказа #${orderId}`;
  const text = `
    Здравствуйте${customerName ? `, ${customerName}` : ''}!

    Ваш заказ #${orderId} успешно оформлен.

    Детали заказа:
    - Дата: ${orderDate}
    - Курс: ${courseTitle}
    - Сумма: ${formattedPrice}

    Спасибо за покупку! Ваш курс уже доступен в личном кабинете.

    С уважением,
    Команда IRNBY TRAINING CLUB
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #000; padding: 20px; text-align: center;">
        <img src="https://example.com/logo.png" alt="IRNBY TRAINING CLUB" style="max-width: 200px; height: auto;">
      </div>

      <div style="padding: 20px; background-color: #f8f8f8;">
        <h2 style="color: #333;">Подтверждение заказа</h2>
        <p>Здравствуйте${customerName ? `, ${customerName}` : ''}!</p>
        <p>Ваш заказ <strong>#${orderId}</strong> успешно оформлен.</p>

        <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Детали заказа:</h3>
          <p>Дата: ${orderDate}</p>
          <p>Курс: <strong>${courseTitle}</strong></p>
          <p>Сумма: <strong>${formattedPrice}</strong></p>
        </div>

        <p>Ваш курс уже доступен в <a href="https://example.com/dashboard" style="color: #ffcc00; text-decoration: none; font-weight: bold;">личном кабинете</a>.</p>

        <p>Спасибо за покупку!</p>
      </div>

      <div style="background-color: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
        <p>© IRNBY TRAINING CLUB ${new Date().getFullYear()}</p>
        <p>Если у вас возникли вопросы, напишите нам на <a href="mailto:support@example.com" style="color: #ffcc00;">support@example.com</a></p>
      </div>
    </div>
  `;

  // Send the email
  return await sendEmail({
    to: customerEmail,
    subject,
    text,
    html,
  });
}
