var Mp4InfoClass = {};

Mp4InfoClass.info = function(data) {
 var oReq = new XMLHttpRequest();
 oReq.open("POST", "../php/getInfo.php", true);
 oReq.onload = function (oEvent) {
   // Uploaded.
 };

 var blob = new Blob(['1234'], {type: 'text/plain'});

 oReq.send(blob);

 oReq.onreadystatechange = function() {
  var result = document.getElementById('result');
  if (oReq.readyState == 4) { // 通信の完了時
    if (oReq.status == 200) { // 通信の成功時
      result.innerHTML = oReq.responseText;
    }
  }else{
    result.innerHTML = "通信中..."
  }
 }

};
