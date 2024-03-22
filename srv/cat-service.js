// Import necessary modules
const cds = require("@sap/cds");
const { sendMail } = require('@sap-cloud-sdk/mail-client');

//new branch

class CatalogService extends cds.ApplicationService {
    init() {
        const { Books } = cds.entities("my.bookshop");

        this.on("submitOrder", async (req) => {
            const { book, quantity } = req.data;
            let { stock, title } = await SELECT`stock, title`.from(Books, book);
            const remaining = stock - quantity;
            if (remaining < 0) {
                return req.reject(409, `${quantity} exceeds stock for book #${book}`);
            }
            await UPDATE(Books, book).with({ stock: remaining });

            // Define mail configuration
            const mailConfig = {
                from: 'suraj.mishra@sumodigitech.com',
                to: 'surajmishra4214@gmail.com',
                subject: 'Order Confirmation',
                text: `Thank you for your order of ${quantity} copy/copies of ${title}. Your order has been confirmed.`
            };

            try {
                await sendMail({ destinationName: "maildestination", useCache: true }, [mailConfig]);
                console.log('Email sent successfully.');
            } catch (error) {
                console.error('Error sending email:', error);
            }

            return { ID: book, stock: remaining };
        });

        return super.init();
    }
}

module.exports = { CatalogService };
