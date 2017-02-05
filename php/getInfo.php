<?php

$data = file_get_contents("php://input");
echo $data.length;
exit;

$dir = $_POST["dir"];
if($_FILES["file"]["tem_name"]){
  list($file_name,$file_type) = explode(".",$_FILES['file']['name']);
  //ファイル名を日付と時刻にしている。
  $name = date("YmdHis").".".$file_type;
  $file = "tmp/".$dir;
  //ディレクトリを作成してその中にアップロードしている。
  if(!file_exists($file)){
    mkdir($file,0755);
  }
  if (move_uploaded_file($_FILES['file']['tmp_name'], $file."/".$name)) {
    chmod($file."/".$name, 0644);
    var_dump($dir."/".$name);
    $filename = $file."/".$name;
    $output = shell_exec("mp4info $filename");
  }
}


echo "<pre>$output</pre>";
?>
