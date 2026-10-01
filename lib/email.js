import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use app-specific password
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
    console.error('Environment variables present:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD
    });
  } else {
    console.log('SMTP server is ready to send messages');
  }
});

// Email templates
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to ReFili!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ReFili!</h2>
        <p>Hello,</p>
        <p>Thank you for joining ReFili. We're excited to have you on board!</p>
        <p>You can now start shopping and managing your orders.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <br>
        <p>Best regards,</p>
        <p>The ReFili Team</p>
      </div>
    `
  }),
  
  orderConfirmation: (order) => ({
    subject: `Order Placement - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Status</h2>
        <p>Hello ${order.customer.name},</p>
        <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Order Type:</strong> ${order.hasRentalItems ? (order.hasMixedItems ? 'Combined (Purchase & Rental)' : 'Rental') : 'Purchase'}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Items Ordered</h3>
          ${order.items.map(item => `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
              <p style="margin: 0;"><strong>${item.name}</strong></p>
              <p style="margin: 5px 0;">Quantity: ${item.quantity}</p>
              ${item.isRental ? `
                <p style="margin: 5px 0;">Rental Duration: ${item.rentalDetails.duration} ${item.rentalDetails.unit}</p>
                <p style="margin: 5px 0;">Rate: $${item.rentalDetails.rate}/${item.rentalDetails.unit}</p>
              ` : `
                <p style="margin: 5px 0;">Price: $${item.price}</p>
              `}
            </div>
          `).join('')}
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Summary</h3>
          <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
          <p><strong>Tax (8%):</strong> $${order.tax.toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${order.shippingFee.toFixed(2)}</p>
          <p style="font-size: 1.2em; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd;">
            <strong>Total:</strong> $${order.total.toFixed(2)}
          </p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Shipping Information</h3>
          <p>${order.customer.address.street}</p>
          <p>${order.customer.address.city}, ${order.customer.address.state} ${order.customer.address.postalCode}</p>
        </div>

        <p>We'll notify you when your order ships.</p>
        <p>If you have any questions about your order, please contact our support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
          <p>Thank you for choosing ReFili!</p>
          <p>Best regards,<br>The ReFili Team</p>
        </div>
      </div>
    `
  }),
  
  orderStatusUpdate: (order) => ({
    subject: `Order Status Update - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Status Update</h2>
        <p>Hello ${order.customer.name},</p>
        <p>Your order status has been updated.</p>
        <p><strong>Order Number:</strong> ${order._id}</p>
        <p><strong>New Status:</strong> ${order.status}</p>
        <p><strong>Updated Date:</strong> ${new Date(order.updatedAt).toLocaleDateString()}</p>
        <br>
        <p>Best regards,</p>
        <p>The ReFili Team</p>
      </div>
    `
  }),

  orderUpdate: (order, changes) => ({
    subject: `Order Update - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Update Notification</h2>
        <p>Hello ${order.customer.name},</p>
        <p>Your order has been updated with the following changes:</p>
        
        ${changes.status ? `
          <div style="margin: 10px 0;">
            <p><strong>Order Status:</strong> Changed to ${changes.status}</p>
          </div>
        ` : ''}

        ${changes.shippingFee !== undefined ? `
          <div style="margin: 10px 0;">
            <p><strong>Shipping Fee:</strong> Updated to $${changes.shippingFee.toFixed(2)}</p>
          </div>
        ` : ''}

        ${changes.tax !== undefined ? `
          <div style="margin: 10px 0;">
            <p><strong>Tax Amount:</strong> Updated to $${changes.tax.toFixed(2)}</p>
          </div>
        ` : ''}

        ${changes.offer ? `
          <div style="margin: 10px 0;">
            <p><strong>Special Offer:</strong> ${changes.offer.description || 
              (changes.offer.type === 'percentage' ? 
                `${changes.offer.value}% discount applied` : 
                `$${changes.offer.value.toFixed(2)} discount applied`)}</p>
          </div>
        ` : ''}

        ${changes.paymentEnabled !== undefined ? `
          <div style="margin: 10px 0;">
            <p><strong>Payment Status:</strong> ${changes.paymentEnabled ? 'Payment is now enabled' : 'Payment is now disabled'}</p>
          </div>
        ` : ''}

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Updated Order Summary</h3>
          <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${order.shippingFee.toFixed(2)}</p>
          <p style="font-size: 1.2em; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd;">
            <strong>Total:</strong> $${order.total.toFixed(2)}
          </p>
        </div>

        <p>If you have any questions about these changes, please contact our support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
          <p>Thank you for choosing ReFili!</p>
          <p>Best regards,<br>The ReFili Team</p>
        </div>
      </div>
    `
  }),
};

// Send email function
export const sendEmail = async ({ to, template, data }) => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration is missing. Please check EMAIL_USER and EMAIL_PASSWORD in .env file');
    }

    // Validate recipient
    if (!to) {
      throw new Error('Recipient email is required');
    }

    // Validate template exists
    if (!templates[template]) {
      throw new Error(`Email template '${template}' not found`);
    }

    console.log('Attempting to send email:', { 
      to, 
      template,
      fromEmail: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      dataType: typeof data,
      isArray: Array.isArray(data),
      dataKeys: Array.isArray(data) ? ['order', 'changes'] : Object.keys(data)
    });

    let templateResult;
    if (template === 'orderUpdate') {
      // orderUpdate template expects two parameters: order and changes
      const [order, changes] = data;
      templateResult = templates[template](order, changes);
    } else {
      // Other templates expect a single parameter
      templateResult = templates[template](data);
    }
    
    const { subject, html } = templateResult;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    console.log('Mail options prepared:', { ...mailOptions, from: mailOptions.from ? '***@gmail.com' : undefined });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Email validation function
export const validateEmail = (email) => {
  // Basic format validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Additional validation
  const [username, domain] = email.split('@');
  const isValid = 
    username.length >= 1 && // Username part exists
    domain.includes('.') && // Domain has a dot
    domain.split('.').pop().length >= 2; // TLD is at least 2 chars

  if (!isValid) {
    return { valid: false, message: 'Invalid email structure' };
  }

  return { valid: true };
};