"use client";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

//ill need to generate the fetch params or script tags
export async function conversionStarter(business, from) {
  if (typeof window !== "undefined") {
    //generate id
    const newUUID = uuidv4();
    //use params to get business name
    const urlParams = new URLSearchParams(new URL(window.location.href).search);
    const location = from || urlParams.get("from") || null;
    //converted always equals started here
    const scriptTag = document.getElementById("conversionQRs");
    var pathToTrack = scriptTag.getAttribute("pathToTrack");
    var businessName = business || scriptTag.getAttribute("businessName");
    if (window.location.pathname === pathToTrack && location != null) {
      centexQRsStarter(businessName, location);
    }
  }
}

export async function centexQRsStarter(business, from) {
  const newUUID = uuidv4();
  const response = await fetch(
    `https://b66slqv47rtplrq2n6nxqddmja0jmxqs.lambda-url.us-east-1.on.aws/?scanID=${newUUID}business=${business}&from=${from}&conversion=started`
  );
  window.localStorage.setItem("qrID", newUUID);
}

export async function conversionFinal(specific, businessName) {
  let newConv = specific;
  if (newConv === undefined) {
    newConv = "finished";
  }

  const scriptTag = document.getElementById("conversionQRs");
  var businessName = scriptTag.getAttribute("businessName");
  const qrID = window.localStorage.getItem("qrID");
  const response = await fetch(
    `https://b66slqv47rtplrq2n6nxqddmja0jmxqs.lambda-url.us-east-1.on.aws/?scanID=${qrID}business=${businessName}&conversion=${newConv}`
  );
  window.localStorage.removeItem("qrID");
}

const conversionButton = document.getElementById("QRConverter");

if (conversionButton != null) {
  conversionButton.addEventListener("click", conversionFinal);
  conversionStarter();
}
