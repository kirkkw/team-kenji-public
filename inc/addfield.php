<!-- Writing to JSON -->
<?php 
session_start();
$myJSON = $_POST["myJSON"];
$data = json_encode($myJSON, JSON_PRETTY_PRINT);
$myfile = fopen("../json/fieldlist.json", "w") or die("Unable to open file!");
fwrite($myfile, $data);
fclose($myfile);
?>
