import fs from "node:fs";
import path from "node:path";


export const getEmailUpsellingProductsHtml = (data: Record<string, any>) => {
  let returnedHtml = `<h4 style="margin: 0; font-size: 1.25rem; padding: .5em 0 .25em;">You are now eligible for these crossgrade offers:</h4><span style="display: inline-block; font-size: 14px; margin-bottom: 15px;">* Make sure to log in during the checkout for the discounts to be applied</span>`;
  for (let i = 0; i < data.length; i++) {
    returnedHtml += `<table style="padding: 10px; width: 100%; border: 1px solid #4B4F58; margin-bottom: 2em;"><tbody><tr><td rowspan="1"><h4 style="font-size: 14px; margin: 0; color: #444444;">${data[i].offerTitle ? data[i].offerTitle : "Special offer for you!"}</h4></td><td rowspan="1"><span style="font-size: 14px; display: block; margin: 0; text-align: right; color: #3d750e; font-weight: 600;">${data[i].percentSaved}</span></td><td rowspan="3"><img style="display: block; height: 150px; margin-left: auto;" src="https://techivation.com/products/products-images/${data[i].id}-image-mobile.png" alt="${data[i].fullName}" /></td></tr><tr><td rowspan="1"><h3 style="font-size: 18px; font-weight: 700; margin: 0;">${data[i].fullName}</h3></td><td rowspan="1"><span style="display: block; text-align: end; font-weight: 600; font-size: 14px;"><em style="text-decoration: line-through; font-style: normal; color: #444444; margin-right: .25em;">${data[i].originalPrice} USD </em>${data[i].cuttedPrice} USD </span></td></tr><tr><td rowspan="1" colspan="2"><a href="${data[i].link}" target="_blank" rel="noreferrer" style="display: block; cursor: pointer; background-color: #BFA575; color: #252526; text-decoration: none; font-weight: 600; padding: .25em 1em; letter-spacing: 0.02rem; font-size: 16px; text-align: center; transition: 200ms ease-in-out; transition-property: background-color, border-color; border: 1px solid #BFA575; margin: 0 auto; width: 300px;" class="addToCartButton">Add to Cart </a></td></tr></tbody></table>`;
  }

  return returnedHtml;
};

export const getPluginActivationHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/pluginActivation.html"))
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    if (key === "upsellingProducts" && data[key] && data[key].length) {
      emailHtml = emailHtml
        .split("${data." + key + "}")
        .join(getEmailUpsellingProductsHtml(data[key]));
      continue;
    }

    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getResetPasswordEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/passwordReset.html"))
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getConfirmEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/confirmEmail.html"))
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getAccountCreatedEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(
      path.resolve(__dirname, "../public/emails/accountCreated.html")
    )
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getAccountCredentialsEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(
      path.resolve(__dirname, "../public/emails/accountCredentials.html")
    )
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getAccountCreatedWithTrialEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(
      path.resolve(__dirname, "../public/emails/accountCreatedWithTrial.html")
    )
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getThankYouEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/thankYou.html"))
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getSendInvoicePDFHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/sendInvoicePDF.html"))
    .toString();

  if (!data.firstName) {
    data.firstName = "";
  }

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getVerificationCodeEmail = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(
      path.resolve(__dirname, "../public/emails/verificationCodeEmail.html")
    )
    .toString();

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getAccountCreatedWithRedeemCodeEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/accountCreatedWithRedeemCode.html"))
    .toString();

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getLoginWithRedeemCodeEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/loginWithRedeemCode.html"))
    .toString();

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getSupportEmailHtml = (data: Record<string, any>) => {
  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/supportEmail.html"))
    .toString();

  for (const key in data) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(data[key] ? data[key] : "");
  }

  return emailHtml;
};

export const getSupportResponseEmailHtml = () => {
  return fs
    .readFileSync(path.resolve(__dirname, "../public/emails/supportResponseEmail.html"))
    .toString();

};

export const getPurchaseReceiptHtml = (data: Record<string, any>) => {
  let orderItems = "";

  for (let item of data.items) {

    orderItems += `<tr>
      <td style="padding: 8px; border: 1px solid #ddd; font-size: 14px; color: #333;">${item.productName}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-size: 14px; color: #333;">${item.qty}</td>
      <td align="right"
          style="padding: 8px; border: 1px solid #ddd; font-size: 14px; color: #333;">$${Number(item.price).toFixed(2)}</td>
      <td align="right"
          style="padding: 8px; border: 1px solid #ddd; font-size: 14px; color: #333;">$${(Number(item.price) * Number(item.qty)).toFixed(2)}</td>
    </tr>`;
  }

  const attributes: Record<string, any> = {
    ...data,
    totalAmount: Number(data.totalAmount).toFixed(2),
    items: orderItems
  };

  let emailHtml = fs
    .readFileSync(path.resolve(__dirname, "../public/emails/purchaseReceipt.html"))
    .toString();

  for (const key in attributes) {
    emailHtml = emailHtml
      .split("${data." + key + "}")
      .join(attributes[key] ? attributes[key] : "");
  }

  return emailHtml;
};