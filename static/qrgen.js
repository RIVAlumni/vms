function submitForm(e) {
  e.preventDefault();
  generateQR();
}

function generateQR() {
  const fullname = document.getElementById("fullname").value;
  const nric = document.getElementById("nric").value;
  const phone = document.getElementById("phone").value;

  let qrcodeContainer = document.getElementById("qrcode");
  let returnText = document.getElementById("return_text");
  qrcodeContainer.innerHTML = "";
  returnText.innerHTML = "";
  if (nric.match(/^\w\d{7}\w$/) === null) {
    console.log('NRIC mismatch');
    return;
  } else if (fullname.match(/^[A-Za-z0-9\s]+$/) === null) { 
    console.log('fullname mismatch');
    return;
  } else if (phone.match(/^\d{8}$/) === null) { 
    console.log('phone mismatch');
    return;
  }

  const text = `|${nric}|${phone}|${fullname}|`
  new QRCode(qrcodeContainer, text);
  document.querySelector('img').style.borderStyle="solid" 
  document.querySelector('img').style.borderWidth="10px" 
  document.querySelector('img').style.borderColor="white" 

  returnText.innerHTML = text;
}