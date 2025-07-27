function parseQR(val) {
  console.log(val);

  document.getElementById("status").textContent = "";
  document.getElementById("status").style.display = "None"; 
  
  if (!val.includes("|")) {
    if (val.match(/^\w\d{7}\w$/) !== null) {
      document.getElementById("nric").value = val;
      document.getElementById("phone").value = "";
      document.getElementById("fullname").value = "";
    } else { return; }
  };
  let parts = val.split("|");
  console.log(parts);
  if (parts.length >= 4) {
    document.getElementById("nric").value = parts[1];
    document.getElementById("phone").value = parts[2];
    document.getElementById("fullname").value = parts[3];
  }
}

function submitForm(e) {
  e.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const nric = document.getElementById("nric").value;
  const phone = document.getElementById("phone").value;
  const data = new URLSearchParams({ fullname, nric, phone });
  fetch("/submit", { method: "POST", body: data })
    .then(res => res.json())
    .then(res => {
      console.log(JSON.stringify(res))
      if (res.status === "OK") {
        document.getElementById("status").textContent = `✅ Entry recorded for ${fullname} (${nric}, ${phone})`;
        document.getElementById("status").style = null;
      } else {
        document.getElementById("status").textContent = `⚠️ Duplicate entry: (${nric}), ${res.fullname}, ${res.phone} at ${res.datetime} by ${res.operator}`;
        document.getElementById("status").style = null;
      }
    });
}

let qrScanner = null;

let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
    const minEdgePercentage = 0.96; // 4% for the white/green border
    return {
        width: viewfinderWidth*minEdgePercentage,
        height: viewfinderHeight*minEdgePercentage
    };
}


function toggleQRScanner() {
  const reader = document.getElementById('qr-reader');
  reader.style.display = 'block';

  if (qrScanner === null) {
    qrScanner = new Html5Qrcode("qr-reader");
    qrScanner.start(
      { facingMode: "environment" },
      { 
        fps: 10, 
        qrbox: qrboxFunction,  
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      qrCodeMessage => {
        parseQR(qrCodeMessage);
      },
      errorMessage => {
        // Optional: 
        console.log(`QR Error: ${errorMessage}`);
      }
    ).catch(err => {
      alert("Camera access failed: " + err);
    });
  } else {
    qrScanner.stop();
    qrScanner = null; 
  }
}

toggleQRScanner()