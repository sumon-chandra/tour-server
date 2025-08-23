/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import PDFDocument from "pdfkit";
import AppError from "../error-helpers/app-error";

export interface IInvoiceData {
	transactionId: string;
	bookingDate: Date;
	userName: string;
	tourTitle: string;
	guestCount: number;
	totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer> => {
	try {
		return new Promise((resolve, reject) => {
			const doc = new PDFDocument({ size: "A4", margin: 50 });
			const buffer: Uint8Array[] = [];

			doc.on("data", (chunk) => buffer.push(chunk));
			doc.on("end", () => resolve(Buffer.concat(buffer)));
			doc.on("error", (err) => reject(err));

			// ----- HEADER -----
			doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", { align: "center" });
			doc.moveDown(2);

			// Invoice Info
			doc.fontSize(12).font("Helvetica").text(`Transaction ID: ${invoiceData.transactionId}`);
			doc.text(`Booking Date: ${invoiceData.bookingDate.toDateString()}`);
			doc.text(`Customer: ${invoiceData.userName}`);
			doc.moveDown(2);

			// ----- TABLE HEADER -----
			doc.font("Helvetica-Bold");
			doc.text("Tour Title", 50, doc.y, { width: 200 });
			doc.text("Guests", 260, doc.y, { width: 100, align: "center" });
			doc.text("Total Amount", 400, doc.y, { width: 150, align: "right" });
			doc.moveDown(0.5);

			// Separator line
			doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#aaaaaa").stroke();
			doc.moveDown(0.7);

			// ----- TABLE ROW -----
			doc.font("Helvetica");
			doc.text(invoiceData.tourTitle, 50, doc.y, { width: 200 });
			doc.text(invoiceData.guestCount.toString(), 260, doc.y, { width: 100, align: "center" });
			doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, 400, doc.y, { width: 150, align: "right" });
			doc.moveDown(2);

			// ----- TOTAL -----
			doc
				.font("Helvetica-Bold")
				.text("Grand Total:", 300, doc.y, { width: 200, align: "right" })
				.text(`$${invoiceData.totalAmount.toFixed(2)}`, 500, doc.y, { align: "right" });
			doc.moveDown(3);

			// ----- FOOTER -----
			doc.font("Helvetica").fontSize(12).fillColor("#555").text("Thank you for booking with us!", { align: "center" });

			doc.end();
		});
	} catch (error: any) {
		console.error(error);
		throw new AppError(httpStatus.CONFLICT, `PDF creation error: ${error.message}`);
	}
};
